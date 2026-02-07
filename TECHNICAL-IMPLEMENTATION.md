# Technical Implementation - ML-Based Vulnerability Scoring

## Overview

This document provides comprehensive technical details about the Machine Learning vulnerability scoring system integrated into Omnia.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Omnia Platform Frontend                  │
│                 (Vue Backoffice + Next.js)                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                    HTTP/REST API
                         │
        ┌────────────────▼────────────────┐
        │   NestJS Backend (Port 3000)    │
        │                                 │
        │  ┌──────────────────────────┐  │
        │  │ Intelligence Module       │  │
        │  │                          │  │
        │  │ - Controllers            │  │
        │  │ - Services              │  │
        │  │ - Entity (VulnScore)    │  │
        │  │ - DTO Mappers           │  │
        │  └──────┬───────────────────┘  │
        │         │                      │
        │  ┌──────▼───────────────────┐  │
        │  │ TypeORM + PostgreSQL     │  │
        │  │ vulnerability_scores tbl │  │
        │  └──────────────────────────┘  │
        └────────────┬────────────────────┘
                     │
        ┌────────────▼────────────────┐
        │  HTTP Client (HttpModule)   │
        └────────────┬────────────────┘
                     │
        ┌────────────▼────────────────────────┐
        │  Python FastAPI (Port 8001)         │
        │  ML Microservice                    │
        │                                    │
        │  ┌──────────────────────────────┐ │
        │  │ /score (Single)              │ │
        │  │ /score/batch (Batch)        │ │
        │  │ /predict/area-needs         │ │
        │  │ /predict/health-patterns    │ │
        │  │ /predict/migration-trends   │ │
        │  └──────────┬───────────────────┘ │
        │             │                     │
        │  ┌──────────▼───────────────────┐ │
        │  │ VulnerabilityScorer         │ │
        │  │                             │ │
        │  │ calc_economic_factor()      │ │
        │  │ calc_health_factor()        │ │
        │  │ calc_social_factor()        │ │
        │  │ calc_urgency_factor()       │ │
        │  │ calculate_score()           │ │
        │  └──────────────────────────────┘ │
        └────────────────────────────────────┘
```

## Data Flow

### Request Flow: Single Beneficiary Scoring

```
Frontend (Create/Update Beneficiary)
    ↓
POST /beneficiaires (NestJS)
    ↓
Create Beneficiary Entity
    ↓
POST /intelligence/score
    ↓
IntelligenceService.calculateVulnerabilityScore()
    ↓
Call POST http://localhost:8001/score (Python ML)
    ↓
VulnerabilityScorer.calculate_score()
    ↓
│
├─ Economic Factor = f(income, family_size, employment)
├─ Health Factor   = f(visits, meds, conditions, dependents)
├─ Social Factor   = f(housing, migration, vulnerable_count)
└─ Urgency Factor  = f(time_since_last_aid)
     ↓
Total Score = Ec + He + So + Ur
     ↓
Determine Risk Level (CRITICAL|HIGH|MEDIUM|LOW)
     ↓
Generate Recommendations
     ↓
Return VulnerabilityScoreOutput
     ↓
Save to PostgreSQL
     ↓
Return HTTP 200 with Score
     ↓
Response to Frontend/API
```

## Scoring Algorithm Technical Details

### 1. Economic Factor Calculation

```python
def calculate_economic_factor(
    monthly_income: float,
    family_members: int,
    social_status: str
) -> float:
    """
    Assessment of economic vulnerability
    Maximum: 40 points
    """
    # Step 1: Calculate per capita income
    income_per_capita = monthly_income / family_members if family_members > 0 else 0
    
    # Step 2: Apply income brackets (based on poverty threshold = 200)
    if income_per_capita <= 100:
        income_score = 40.0  # Below 50% poverty threshold
    elif income_per_capita <= 200:
        income_score = 30.0 + (monthly_income / 200) * 10  # Scaled between 30-40
    elif income_per_capita <= 300:
        income_score = 20.0  # Approaching middle class
    else:
        income_score = max(0, 10.0 - (income_per_capita - 300) / 50)  # Minimal score for wealthy
    
    # Step 3: Apply social status multiplier
    status_multiplier = {
        'Employé': 0.1,
        'Ouvrier': 0.2,
        'Indépendant': 0.3,
        'Retraité': 0.2,
        'Chômage': 1.0,  # Most vulnerable
        'Autre': 0.5,
        None: 0.5  # Unknown = medium risk
    }.get(social_status, 0.5)
    
    # Step 4: Family size burden (larger families need more)
    size_factor = 1.0 + (max(0, family_members - 2) * 0.1)
    # Family of 2: 1.0x
    # Family of 3: 1.1x
    # Family of 5: 1.3x
    # Family of 10: 1.8x
    
    # Step 5: Combine factors with bounds
    economic_factor = min(40, income_score * status_multiplier * size_factor)
    
    return round(float(economic_factor), 2)

# Example calculations:
# Case 1: Family of 5, $150/month, unemployed
#   income_per_capita = 150 / 5 = 30
#   income_score = 40.0 (below threshold)
#   status_multiplier = 1.0 (Chômage)
#   size_factor = 1.0 + (5-2)*0.1 = 1.3
#   Result: 40.0 * 1.0 * 1.3 = 52 → 40 (capped) ✓

# Case 2: Family of 2, $500/month, employed
#   income_per_capita = 500 / 2 = 250
#   income_score = 20.0
#   status_multiplier = 0.1 (Employé)
#   size_factor = 1.0
#   Result: 20.0 * 0.1 * 1.0 = 2.0 ✓
```

### 2. Health Factor Calculation

```python
def calculate_health_factor(
    medical_visits_count: int,
    medication_records_count: int,
    health_conditions: str,
    dependents_with_needs: int  # elderly + disabled + children
) -> float:
    """
    Assessment of health vulnerability
    Maximum: 30 points
    """
    health_factor = 0.0
    
    # Component 1: Medical visits frequency (0-15 points)
    # Indicates acute/chronic conditions and healthcare burden
    if medical_visits_count > 10:
        visit_score = 15.0  # Chronic condition or frequent illness
    elif medical_visits_count > 5:
        visit_score = 10.0  # Regular health issues
    elif medical_visits_count > 2:
        visit_score = 5.0   # Occasional health issues
    else:
        visit_score = 0.0   # No recent visits
    
    # Component 2: Medication requirements (0-10 points)
    # Indicates ongoing treatment needs
    if medication_records_count > 5:
        medication_score = 10.0  # Heavy medication user
    elif medication_records_count > 2:
        medication_score = 5.0   # Regular medication
    else:
        medication_score = 0.0   # Minimal/no medication
    
    # Component 3: Health conditions presence (0-10 points)
    # Specific conditions carry different risks
    condition_score = 0.0
    if health_conditions:
        conditions_list = health_conditions.lower()
        
        # High-risk conditions (full points)
        high_risk = ['cancer', 'diabète', 'hypertension', 'tuberculose', 'vih', 'hiv']
        if any(cond in conditions_list for cond in high_risk):
            condition_score = 10.0
        else:
            condition_score = 5.0  # Lower risk condition
    
    # Component 4: Dependent care burden (0-5 points)
    # Families with elderly/disabled/many children have higher healthcare needs
    dependent_score = min(5.0, dependents_with_needs * 2)
    # 1 dependent: 2 points
    # 2 dependents: 4 points
    # 3+ dependents: 5 points (max)
    
    # Sum all components with cap at 30
    health_factor = min(
        30,
        visit_score + medication_score + condition_score + dependent_score
    )
    
    return round(float(health_factor), 2)

# Example:
# Family with parent (elderly) requiring:
# - 8 medical visits/year
# - 3 medications
# - Diabetes
# Components:
#   visit_score = 10.0
#   medication_score = 5.0
#   condition_score = 10.0
#   dependent_score = 2.0 (1 elderly)
# Total: 27.0 points ✓
```

### 3. Social Factor Calculation

```python
def calculate_social_factor(
    housing_type: str,        # Propriétaire, Locataire, Précaire
    migration_status: str,    # External, Internal, Returnee, None
    elderly_count: int,       # Number of elderly persons
    disabled_count: int,      # Number of disabled persons
    children_count: int       # Number of children
) -> float:
    """
    Assessment of social vulnerability
    Maximum: 20 points
    """
    
    # Component 1: Housing conditions (0-10 points)
    # Secure housing vs insecure/precarious housing
    housing_risk = {
        'Propriétaire': 0.1,  # Owner - secure, low risk
        'Locataire': 0.5,     # Renter - medium risk (payment uncertainty)
        'Précaire': 1.0,      # Precarious - homeless/squatter, high risk
        None: 0.3              # Unknown - assume medium-low
    }
    housing_score = housing_risk.get(housing_type, 0.3) * 10
    
    # Component 2: Migration status (0-5 points)
    # Displacement = vulnerability & instability
    migration_factor = {
        'External': 5.0,      # Refugee/international migrant - very vulnerable
        'Internal': 3.0,      # Internal displacement - moderate vulnerability
        'Returnee': 2.0,      # Recently returned - some vulnerability
        'None': 0.0,          # No known displacement
        None: 0.0
    }
    migration_score = migration_factor.get(migration_status, 0.0)
    
    # Component 3: Vulnerable dependents (0-5 points)
    # Elderly and disabled need special care
    elderly_disabled_count = elderly_count + disabled_count
    dependent_score_vulnerable = min(5.0, elderly_disabled_count * 1.5)
    
    # Add children (they increase household burden)
    children_factor = min(2.0, children_count * 0.5)
    dependent_score_full = dependent_score_vulnerable + children_factor
    dependent_score = min(5.0, dependent_score_full)
    
    # Combine all components
    social_factor = min(
        20,
        housing_score + migration_score + dependent_score
    )
    
    return round(float(social_factor), 2)

# Example: Family in precarious housing with elderly parent
#   housing_score = 1.0 * 10 = 10.0
#   migration_score = 0.0 (none)
#   elderly: 1, disabled: 0, children: 3
#   elderly_disabled_count = 1
#   dependent_score_vulnerable = 1 * 1.5 = 1.5
#   children_factor = min(2.0, 3 * 0.5) = 1.5
#   dependent_score = 1.5 + 1.5 = 3.0
# Total: 10.0 + 0.0 + 3.0 = 13.0 points ✓
```

### 4. Urgency Factor Calculation

```python
def calculate_urgency_factor(
    last_aid_date: datetime = None,
    days_threshold: int = 90  # Recalculated every 3 months
) -> float:
    """
    Assessment of time-based urgency
    Maximum: 10 points
    Families not receiving aid for long periods are more urgent
    """
    
    if last_aid_date is None:
        # Never received aid - HIGHEST urgency
        return 10.0
    
    # Calculate days since last aid
    days_since_aid = (datetime.utcnow() - last_aid_date).days
    
    # Bracket the urgency
    if days_since_aid > (days_threshold * 2):  # 180+ days
        urgency_factor = 10.0  # CRITICAL - 6+ months without aid
    elif days_since_aid > days_threshold:      # 90-180 days
        urgency_factor = 7.0   # HIGH - 3-6 months without aid
    elif days_since_aid > (days_threshold / 2): # 45-90 days
        urgency_factor = 4.0   # MEDIUM - 1.5-3 months without aid
    else:                                       # < 45 days
        urgency_factor = 0.0   # LOW - Recently received aid
    
    return float(urgency_factor)

# Timeline:
# 0-45 days since aid: 0 points (recently helped)
# 45-90 days: 4 points
# 90-180 days: 7 points
# 180+ days: 10 points (urgent follow-up)
```

### 5. Final Score Calculation

```python
def calculate_final_score(
    economic: float,  # 0-40
    health: float,    # 0-30
    social: float,    # 0-20
    urgency: float    # 0-10
) -> Tuple[float, str, List[str]]:
    """
    Combine all factors into final vulnerability score
    """
    
    # Sum all factors
    total_score = economic + health + social + urgency
    # Range: 0-100
    
    # Determine risk level
    if total_score >= 80:
        risk_level = "CRITICAL"
    elif total_score >= 60:
        risk_level = "HIGH"
    elif total_score >= 40:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"
    
    # Generate recommendations based on risk factors
    recommendations = []
    
    if risk_level == "CRITICAL":
        recommendations.append("URGENT: Prioritize for immediate assistance")
    
    if economic >= 30:
        recommendations.append("Income Support: Provide financial assistance or employment support")
    
    if health >= 20:
        recommendations.append("Healthcare: Schedule medical assessment and medication support")
    elif health >= 10:
        recommendations.append("Healthcare: Provide preventive health services")
    
    if social >= 15:
        recommendations.append("Housing: Assess and support housing needs")
    
    if urgency >= 7:
        recommendations.append("Follow-up: Schedule urgent follow-up visit within 2 weeks")
    
    # Ensure at least one recommendation
    if not recommendations:
        recommendations = ["Standard monitoring and annual review"]
    
    return total_score, risk_level, recommendations

# Example final calculation:
# Economic: 38.0
# Health: 28.5
# Social: 12.0
# Urgency: 4.0
# Total: 82.5
# Risk Level: CRITICAL ✓
# Recommendations: [all critical-specific ones] ✓
```

## Database Schema

### VulnerabilityScore Entity

```sql
CREATE TABLE vulnerability_scores (
    -- Primary identifier
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Foreign key reference
    beneficiary_id VARCHAR(255) UNIQUE NOT NULL,
    -- FOREIGN KEY (beneficiary_id) REFERENCES beneficiaires(id)
    
    -- Score components (decimal precision: 5 total, 2 after point)
    -- This allows scores 0.00 to 999.99
    vulnerability_score DECIMAL(5,2) NOT NULL,
    economic_factor DECIMAL(5,2) NOT NULL,
    health_factor DECIMAL(5,2) NOT NULL,
    social_factor DECIMAL(5,2) NOT NULL,
    urgency_factor DECIMAL(5,2) NOT NULL,
    
    -- Risk classification
    risk_level VARCHAR(10) NOT NULL 
        CHECK (risk_level IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
    
    -- Actionable recommendations (JSON array)
    -- Example: ["URGENT: Prioritize", "Healthcare: Schedule appointment"]
    recommendations JSON DEFAULT '[]'::json,
    
    -- Timestamp tracking
    calculated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    
    -- Indexes for common queries
    INDEX idx_beneficiary_id (beneficiary_id),
    INDEX idx_risk_level (risk_level),         -- For filtering CRITICAL cases
    INDEX idx_vulnerability_score (vulnerability_score),  -- For sorting/range
    INDEX idx_calculated_at (calculated_at)    -- For time-based queries
);

-- Sample data:
INSERT INTO vulnerability_scores VALUES(
    'uuid-123',
    'ben-456',
    82.50,
    38.00,
    28.50,
    12.00,
    4.00,
    'CRITICAL',
    '["URGENT: Prioritize for immediate assistance", ...]'::json,
    NOW(),
    NOW()
);
```

## Integration Code Examples

### Example 1: Trigger Scoring When Creating Beneficiary

```typescript
// In beneficiaires/beneficiaires.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Beneficiaire } from './entities/beneficiaire.entity';
import { IntelligenceService } from '../intelligence/intelligence.service';

@Injectable()
export class BenefficiairesService {
  constructor(
    @InjectRepository(Beneficiaire)
    private beneficiairesRepository: Repository<Beneficiaire>,
    private intelligenceService: IntelligenceService,
  ) {}

  async createBeneficiaire(dto: CreateBeneficiaryDto) {
    // 1. Create beneficiary in database
    const beneficiary = await this.beneficiairesRepository.save(dto);

    // 2. Calculate vulnerability score (async, non-blocking)
    try {
      const score = await this.intelligenceService.calculateVulnerabilityScore(
        beneficiary,
      );
      this.logger.log(
        `Created beneficiary ${beneficiary.id} with score: ${score.vulnerabilityScore}`,
      );
    } catch (error) {
      // Log error but don't fail the operation
      this.logger.error(
        `Failed to calculate vulnerability score: ${error.message}`,
      );
      // Could queue for later processing
    }

    return beneficiary;
  }

  async updateBeneficiaire(id: string, dto: UpdateBeneficiaryDto) {
    // Update beneficiary
    const beneficiary = await this.beneficiairesRepository.save({
      id,
      ...dto,
    });

    // Recalculate score (relevant data may have changed)
    try {
      await this.intelligenceService.calculateVulnerabilityScore(beneficiary);
    } catch (error) {
      this.logger.warn(
        `Failed to recalculate score for ${id}: ${error.message}`,
      );
    }

    return beneficiary;
  }
}
```

### Example 2: Bulk Scoring Operation

```typescript
// In intelligence/intelligence.service.ts

async recalculateAllScores() {
  const logger = new Logger();
  
  try {
    // 1. Fetch all beneficiaries
    const beneficiaries = await this.beneficiairesRepository.find();
    logger.log(`Starting to score ${beneficiaries.length} beneficiaries...`);

    // 2. Process in chunks to avoid memory issues
    const chunkSize = 100;
    let processed = 0;

    for (let i = 0; i < beneficiaries.length; i += chunkSize) {
      const chunk = beneficiaries.slice(i, i + chunkSize);

      // 3. Batch score the chunk
      const { successful, failed } =
        await this.batchCalculateVulnerabilityScores(chunk);

      processed += successful.length;
      logger.log(
        `Progress: ${processed}/${beneficiaries.length} (${failed.length} errors)`,
      );

      // Log errors
      if (failed.length > 0) {
        logger.warn(`${failed.length} beneficiaries failed to score`);
      }
    }

    logger.log(
      `Completed! Scored ${processed}/${beneficiaries.length} beneficiaries`,
    );
    return { processed, total: beneficiaries.length };
  } catch (error) {
    logger.error(`Bulk scoring failed: ${error.message}`, error.stack);
    throw error;
  }
}
```

### Example 3: Filtering by Risk Level

```typescript
// In beneficiaires/beneficiaires.controller.ts

@Get('critical')
async getCriticalCases() {
  // Get all CRITICAL vulnerability scores
  const { data: critical } = await this.intelligenceService.getVulnerabilityScores({
    riskLevel: 'CRITICAL',
    limit: 100,
  });

  // Get corresponding beneficiary details
  const beneficiaryIds = critical.map((score) => score.beneficiaryId);
  const beneficiaries = await this.beneficiairesRepository.findByIds(
    beneficiaryIds,
  );

  return {
    totalCritical: critical.length,
    beneficiaries: beneficiaries.map((b) => ({
      ...b,
      score: critical.find((s) => s.beneficiaryId === b.id),
    })),
  };
}
```

## Testing Strategy

### Unit Tests (ML Service)

```python
# ml-service/tests/test_vulnerability_scorer.py

import pytest
from models.vulnerability_scorer import VulnerabilityScorer

class TestVulnerabilityScorer:
    @pytest.fixture
    def scorer(self):
        return VulnerabilityScorer(poverty_threshold=200.0)
    
    def test_economic_factor_high_income(self, scorer):
        # Family with good income should have low economic risk
        score = scorer.calculate_economic_factor(
            monthly_income=500,
            family_members=3,
            social_status='Employé'
        )
        assert score < 10, f"Expected < 10, got {score}"
    
    def test_economic_factor_poverty(self, scorer):
        # Unemployed family with minimal income should have high economic risk
        score = scorer.calculate_economic_factor(
            monthly_income=100,
            family_members=5,
            social_status='Chômage'
        )
        assert score >= 35, f"Expected >= 35, got {score}"
    
    def test_health_factor_chronic_disease(self, scorer):
        # Someone with chronic disease and frequent visits
        score = scorer.calculate_health_factor(
            medical_visits_count=15,
            medication_records_count=8,
            health_conditions="Diabetes, Hypertension",
            dependents_with_needs=1
        )
        assert score >= 25, f"Expected >= 25, got {score}"
    
    def test_full_vulnerability_score(self, scorer):
        # Comprehensive integration test
        data = {
            'nbMembres': 5,
            'nbEnfants': 2,
            'nbPersonnesAgees': 1,
            'revenuMensuel': 150,
            'typeLogement': 'Précaire',
            'statutSocial': 'Chômage',
            'migrationStatus': None,
            'healthConditions': 'Diabetes',
            'medicalVisitsCount': 10,
            'medicationRecordsCount': 5,
            'lastAidDistributionDate': None
        }
        
        result = scorer.calculate_score(data)
        
        assert 'vulnerabilityScore' in result
        assert 70 <= result['vulnerabilityScore'] <= 100
        assert result['riskLevel'] == 'CRITICAL'
        assert len(result['recommendations']) > 0
```

### Integration Tests (NestJS)

```typescript
// backend/omnia-backend/src/intelligence/intelligence.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule, HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IntelligenceService } from './intelligence.service';
import { VulnerabilityScore } from './entities/vulnerability-score.entity';
import { of } from 'rxjs';

describe('IntelligenceService Integration', () => {
  let service: IntelligenceService;
  let mockRepository: any;
  let mockHttpService: any;

  beforeEach(async () => {
    // Mock the HTTP service to call the real ML service
    mockHttpService = {
      post: jest.fn((url, data) => {
        // In real tests, this would hit the actual ML service
        return of({
          data: {
            beneficiary_id: 'ben-123',
            vulnerabilityScore: 82.5,
            economicFactor: 38.0,
            healthFactor: 28.5,
            socialFactor: 12.0,
            urgencyFactor: 4.0,
            riskLevel: 'CRITICAL',
            recommendations: ['URGENT recommendation'],
          },
        });
      }),
    };

    mockRepository = {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockImplementation((entity) => ({
        ...entity,
        id: 'score-uuid',
        calculatedAt: new Date(),
        updatedAt: new Date(),
      })),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IntelligenceService,
        {
          provide: getRepositoryToken(VulnerabilityScore),
          useValue: mockRepository,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<IntelligenceService>(IntelligenceService);
  });

  it('should calculate vulnerability score', async () => {
    const beneficiary = {
      id: 'ben-123',
      nbMembres: 5,
      nbEnfants: 2,
      revenuMensuel: 150,
      typeLogement: 'Précaire',
    };

    const result = await service.calculateVulnerabilityScore(beneficiary);

    expect(result).toBeDefined();
    expect(result.vulnerabilityScore).toBe(82.5);
    expect(result.riskLevel).toBe('CRITICAL');
    expect(mockHttpService.post).toHaveBeenCalledWith(
      expect.stringContaining('/score'),
      beneficiary,
    );
  });
});
```

## Performance Optimization

### Database Indexes

```sql
-- Create indexes for common queries
CREATE INDEX idx_vulnerability_risk_level 
  ON vulnerability_scores(risk_level);

CREATE INDEX idx_vulnerability_score_value 
  ON vulnerability_scores(vulnerability_score DESC);

CREATE INDEX idx_vulnerability_beneficiary_id 
  ON vulnerability_scores(beneficiary_id);

CREATE INDEX idx_vulnerability_calculated_at 
  ON vulnerability_scores(calculated_at DESC);

-- Composite index for common filter combinations
CREATE INDEX idx_vulnerability_risk_and_score 
  ON vulnerability_scores(risk_level, vulnerability_score DESC);
```

### Query Optimization Examples

```typescript
// ❌ SLOW: N+1 queries
const beneficiaries = await beneficiairesRepository.find();
for (const b of beneficiaries) {
  const score = await intelligenceService.getVulnerabilityScore(b.id);
  // This does a database query for each beneficiary
}

// ✅ FAST: Single batch query
const { data: scores } = await intelligenceService.getVulnerabilityScores({
  limit: 1000,
});
// Single query gets all scores

// ✅ FAST: Join query
const beneficiariesWithScores = await this.beneficiairesRepository
  .createQueryBuilder('beneficiaire')
  .leftJoinAndSelect(
    'vulnerability_scores',
    'score',
    'score.beneficiary_id = beneficiaire.id'
  )
  .orderBy('score.vulnerability_score', 'DESC')
  .take(100)
  .getMany();
```

## Deployment Checklist

- [ ] Python dependencies installed in ML service
- [ ] PostgreSQL database initialized
- [ ] Database migrations run for VulnerabilityScore table
- [ ] ML_SERVICE_URL configured in backend .env
- [ ] JWT_SECRET configured for production
- [ ] CORS configured for frontend origin
- [ ] Logging configured and monitored
- [ ] Backup strategy in place
- [ ] Load testing completed
- [ ] Error handling tested
- [ ] Security review passed

## Monitoring and Maintenance

### Key Metrics to Monitor

1. **ML Service Health**
   - Response time (should be < 100ms per request)
   - Error rate (should be < 0.1%)
   - Uptime (target 99.9%)

2. **Scoring Performance**
   - Batch processing latency
   - Database query times
   - Score accuracy (validation against known cases)

3. **Data Quality**
   - Missing values in vulnerability factors
   - Outlier detection
   - Score distribution analysis

### Maintenance Tasks

```bash
# Monthly: Recalculate all scores
curl -X POST http://localhost:3000/intelligence/bulk-recalculate

# Weekly: Health check
curl http://localhost:3000/intelligence/health

# Daily: Backup database
pg_dump omnia_db > backup_$(date +%Y%m%d).sql

# As needed: Clear old scores and recalculate
DELETE FROM vulnerability_scores WHERE calculated_at < NOW() - INTERVAL '1 year';
```

## Glossary

- **Economic Factor**: Income-based vulnerability (max 40 points)
- **Health Factor**: Health-based vulnerability (max 30 points)
- **Social Factor**: Housing/migration-based vulnerability (max 20 points)
- **Urgency Factor**: Time-based vulnerability (max 10 points)
- **Vulnerability Score**: Total score 0-100
- **Risk Level**: Classification (CRITICAL/HIGH/MEDIUM/LOW)
- **Poverty Threshold**: Income level used as baseline for economic calculations

## References

- [NestJS TypeORM Documentation](https://docs.nestjs.com/techniques/database)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

