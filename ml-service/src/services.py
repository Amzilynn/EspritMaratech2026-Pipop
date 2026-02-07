"""
Business logic services for vulnerability scoring and predictions
"""

from typing import List, Dict, Tuple
from datetime import datetime, timedelta
import numpy as np
from collections import defaultdict
import statistics

from src.schemas import BeneficiaryInput, VulnerabilityScoreOutput
from models.vulnerability_scorer import VulnerabilityScorer


class ScoringService:
    """Service for calculating vulnerability scores"""
    
    def __init__(self, poverty_threshold: float = 200.0):
        self.scorer = VulnerabilityScorer(poverty_threshold)
    
    def score_beneficiary(self, beneficiary: BeneficiaryInput) -> VulnerabilityScoreOutput:
        """Calculate vulnerability score for a single beneficiary"""
        
        # Convert pydantic model to dict
        data = beneficiary.model_dump(exclude_none=False)
        
        # Calculate scores using ML model
        scores = self.scorer.calculate_score(data)
        
        return VulnerabilityScoreOutput(
            beneficiary_id=beneficiary.id,
            vulnerabilityScore=scores['vulnerabilityScore'],
            economicFactor=scores['economicFactor'],
            healthFactor=scores['healthFactor'],
            socialFactor=scores['socialFactor'],
            urgencyFactor=scores['urgencyFactor'],
            riskLevel=scores['riskLevel'],
            recommendations=scores['recommendations']
        )
    
    def score_batch(self, beneficiaries: List[BeneficiaryInput]) -> Tuple[List[VulnerabilityScoreOutput], List[Dict]]:
        """Batch score multiple beneficiaries"""
        
        results = []
        errors = []
        
        for idx, beneficiary in enumerate(beneficiaries):
            try:
                score = self.score_beneficiary(beneficiary)
                results.append(score)
            except Exception as e:
                errors.append({
                    'index': idx,
                    'beneficiary_id': beneficiary.id if beneficiary else 'unknown',
                    'error': str(e)
                })
        
        return results, errors


class PredictionService:
    """Service for making predictions about needs and outbreaks"""
    
    def __init__(self, scoring_service: ScoringService):
        self.scoring_service = scoring_service
    
    def predict_area_needs(
        self,
        beneficiaries_by_area: Dict[str, List[BeneficiaryInput]],
        scores_by_id: Dict[str, VulnerabilityScoreOutput]
    ) -> List[Dict]:
        """
        Predict resource needs by geographic area
        
        Args:
            beneficiaries_by_area: Dict mapping area identifier to list of beneficiaries
            scores_by_id: Dict mapping beneficiary ID to their vulnerability scores
        
        Returns:
            List of area predictions with resource needs
        """
        predictions = []
        
        for area, beneficiaries in beneficiaries_by_area.items():
            if not beneficiaries:
                continue
            
            # Get scores for this area
            area_scores = [scores_by_id.get(b.id) for b in beneficiaries if b.id in scores_by_id]
            
            if not area_scores:
                continue
            
            # Calculate statistics
            vuln_scores = [s.vulnerabilityScore for s in area_scores]
            economic_scores = [s.economicFactor for s in area_scores]
            health_scores = [s.healthFactor for s in area_scores]
            
            # Count families needing different types of aid
            high_risk = sum(1 for s in area_scores if s.vulnerabilityScore >= 60)
            critical_risk = sum(1 for s in area_scores if s.vulnerabilityScore >= 80)
            health_concerns = sum(1 for s in area_scores if s.healthFactor >= 20)
            economic_concerns = sum(1 for s in area_scores if s.economicFactor >= 30)
            
            # Calculate needs
            total_families = len(beneficiaries)
            food_aid_needed = critical_risk + (high_risk * 0.5)
            medical_aid_needed = health_concerns
            housing_needed = sum(1 for b in beneficiaries if b.typeLogement == 'Précaire')
            
            prediction = {
                'area': area,
                'total_families': total_families,
                'avg_vulnerability_score': round(statistics.mean(vuln_scores), 2),
                'critical_risk_families': critical_risk,
                'high_risk_families': high_risk,
                'food_aid_needed': round(float(food_aid_needed), 1),
                'medical_aid_needed': round(float(medical_aid_needed), 1),
                'housing_interventions_needed': round(float(housing_needed), 1),
                'economic_avg_score': round(statistics.mean(economic_scores), 2),
                'health_avg_score': round(statistics.mean(health_scores), 2),
                'predictions_based_on': f'{total_families} beneficiary records'
            }
            
            predictions.append(prediction)
        
        return sorted(predictions, key=lambda x: x['avg_vulnerability_score'], reverse=True)
    
    def detect_health_patterns(
        self,
        beneficiaries: List[BeneficiaryInput],
        scores: List[VulnerabilityScoreOutput]
    ) -> List[Dict]:
        """
        Detect health patterns and potential outbreaks
        
        Args:
            beneficiaries: List of beneficiaries
            scores: Their corresponding vulnerability scores
        
        Returns:
            List of health alerts and patterns
        """
        alerts = []
        
        # Group health conditions
        health_conditions = defaultdict(list)
        for beneficiary, score in zip(beneficiaries, scores):
            if beneficiary.healthConditions:
                conditions = beneficiary.healthConditions.lower().split(',')
                for condition in conditions:
                    condition = condition.strip()
                    health_conditions[condition].append(beneficiary.id)
        
        # Identify concerning patterns
        for condition, affected_ids in health_conditions.items():
            if len(affected_ids) >= 3:  # Threshold for pattern detection
                # Calculate risk
                risk_score = min(1.0, len(affected_ids) / 10)
                
                alert = {
                    'type': 'health_pattern',
                    'condition': condition,
                    'affected_families': len(affected_ids),
                    'family_ids': affected_ids[:5],  # First 5 as sample
                    'risk_probability': round(float(risk_score), 2),
                    'recommendation': f'Monitor {condition} cases, provide preventive education',
                    'detected_at': datetime.utcnow().isoformat()
                }
                
                alerts.append(alert)
        
        return sorted(alerts, key=lambda x: x['risk_probability'], reverse=True)
    
    def predict_migration_trends(
        self,
        beneficiaries: List[BeneficiaryInput]
    ) -> Dict:
        """
        Predict migration and displacement trends
        
        Args:
            beneficiaries: List of beneficiaries
        
        Returns:
            Migration trend analysis
        """
        migration_status_count = defaultdict(int)
        
        for b in beneficiaries:
            status = b.migrationStatus or 'None'
            migration_status_count[status] += 1
        
        total = len(beneficiaries)
        
        trends = {
            'total_analyzed': total,
            'migration_breakdown': {
                status: {
                    'count': count,
                    'percentage': round((count / total) * 100, 1)
                }
                for status, count in migration_status_count.items()
            },
            'internal_displacement': migration_status_count.get('Internal', 0),
            'external_migrants': migration_status_count.get('External', 0),
            'returnees': migration_status_count.get('Returnee', 0),
            'trend_analysis': _analyze_migration_risk(migration_status_count, total)
        }
        
        return trends


def _analyze_migration_risk(status_count: Dict[str, int], total: int) -> str:
    """Analyze migration risk based on patterns"""
    
    external_ratio = status_count.get('External', 0) / total if total > 0 else 0
    internal_ratio = status_count.get('Internal', 0) / total if total > 0 else 0
    
    if external_ratio > 0.2:
        return "HIGH: Significant external migration detected, may indicate regional instability"
    elif internal_ratio > 0.15:
        return "MEDIUM: Internal displacement detected, possible regional crisis"
    elif external_ratio + internal_ratio > 0.2:
        return "MEDIUM-HIGH: Combined displacement concern"
    else:
        return "LOW: Minimal migration trends detected"
