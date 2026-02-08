from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime


class BeneficiaryInput(BaseModel):
    """Input data for vulnerability scoring"""
    id: str
    nbMembres: int = Field(ge=1, description="Total family members")
    nbEnfants: int = Field(ge=0, description="Number of children")
    nbPersonnesAgees: int = Field(ge=0, description="Number of elderly persons")
    nbHandicapes: int = Field(ge=0, description="Number of disabled persons")
    revenuMensuel: Optional[float] = Field(None, ge=0, description="Monthly income in local currency")
    typeLogement: Optional[str] = Field(None, description="Housing type: Propriétaire, Locataire, Précaire")
    statutSocial: Optional[str] = Field(None, description="Social status: Chômage, Retraité, Ouvrier, etc.")
    migrationStatus: Optional[str] = Field(None, description="Migration status")
    healthConditions: Optional[str] = Field(None, description="Health conditions")
    medicalVisitsCount: int = Field(default=0, ge=0, description="Number of medical visits")
    medicationRecordsCount: int = Field(default=0, ge=0, description="Number of medication records")
    lastAidDistributionDate: Optional[datetime] = Field(None, description="Last aid distribution date")


class VulnerabilityScoreOutput(BaseModel):
    """Output data for vulnerability scoring"""
    beneficiary_id: str
    vulnerabilityScore: float = Field(ge=0, le=100, description="Overall vulnerability score (0-100)")
    economicFactor: float = Field(ge=0, le=40, description="Economic vulnerability factor")
    healthFactor: float = Field(ge=0, le=30, description="Health vulnerability factor")
    socialFactor: float = Field(ge=0, le=20, description="Social vulnerability factor")
    urgencyFactor: float = Field(ge=0, le=10, description="Urgency factor")
    riskLevel: str = Field(description="Risk level: CRITICAL, HIGH, MEDIUM, LOW")
    recommendations: List[str] = Field(description="Recommendations for aid")
    confidenceScore: float = Field(default=1.0, ge=0, le=1, description="Model confidence in this prediction")
    featureContributions: List[Dict] = Field(default=[], description="Top features contributing to the score")
    calculated_at: datetime = Field(default_factory=datetime.utcnow)


class BatchScoringRequest(BaseModel):
    """Request for batch vulnerability scoring"""
    beneficiaries: List[BeneficiaryInput]


class BatchScoringResponse(BaseModel):
    """Response for batch scoring"""
    total_processed: int
    successful: int
    failed: int
    results: List[VulnerabilityScoreOutput]
    errors: List[Dict] = []


class HealthOutbreakPrediction(BaseModel):
    """Prediction for health outbreaks"""
    area: str
    disease_risk: float = Field(ge=0, le=1, description="Risk probability 0-1")
    affected_families: List[str]
    recommendations: List[str]


class NeedsPrediction(BaseModel):
    """Prediction for resource needs"""
    area: str
    food_aid_needed: float = Field(description="Estimated number of families needing food aid")
    medical_aid_needed: float = Field(description="Estimated families needing medical aid")
    housing_interventions_needed: float = Field(description="Estimated families needing housing intervention")
    predictions_based_on: str = Field(description="Data/patterns used for prediction")
