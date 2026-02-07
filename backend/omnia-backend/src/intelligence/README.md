# Intelligence Module - ML Integration

This module provides machine learning-driven vulnerability scoring and predictive analytics for beneficiaries.

## Architecture

```
NestJS Backend (Intelligence Module)
    ↓ HTTP Calls
Python ML Microservice (FastAPI)
    ↓ Data Processing
Vulnerability Scorer (ML Model)
    ↓ Database Storage
PostgreSQL (VulnerabilityScore Table)
```

## Features

### 1. Vulnerability Scoring
- Single beneficiary scoring with real-time calculation
- Batch processing for bulk updates
- Storage in PostgreSQL for historical tracking
- Caching and fast retrieval

### 2. Predictive Analytics
- Area-based resource need predictions
- Health pattern detection and outbreak risk assessment
- Migration trend analysis

### 3. Data Management
- Persistent score storage
- Historical tracking
- Filtering and querying capabilities

## API Endpoints

### Scoring

**Single Score:**
```typescript
POST /intelligence/score
Body: {
  id: "beneficiary-uuid",
  nbMembres: 5,
  nbEnfants: 2,
  // ... other beneficiary data
}

Response: VulnerabilityScoreResponseDto
```

**Batch Scoring:**
```typescript
POST /intelligence/score/batch
Body: {
  beneficiaryIds: ["id1", "id2", "id3"]
}
```

**Get Score:**
```typescript
GET /intelligence/score/:beneficiaryId
```

**List Scores:**
```typescript
GET /intelligence/scores?riskLevel=CRITICAL&limit=10&offset=0
```

### Predictions

**Area Needs:**
```typescript
POST /intelligence/predict/area-needs
Body: {
  beneficiariesByArea: {
    "Area A": [beneficiaries],
    "Area B": [beneficiaries]
  }
}
```

**Health Patterns:**
```typescript
POST /intelligence/predict/health-patterns
Body: {
  beneficiaries: [beneficiaries]
}
```

**Migration Trends:**
```typescript
POST /intelligence/predict/migration-trends
Body: {
  beneficiaries: [beneficiaries]
}
```

## Integration with Other Modules

### With Beneficiaires Module

When a new beneficiary is created or updated, trigger scoring:

```typescript
// In beneficiaires.service.ts

constructor(
  private intelligenceService: IntelligenceService
) {}

async createBeneficiaire(dto: CreateBeneficiaryDto) {
  const beneficiary = await this.beneficiairesRepository.save(dto);
  
  // Calculate vulnerability score
  await this.intelligenceService.calculateVulnerabilityScore(beneficiary);
  
  return beneficiary;
}
```

### With Visits Module

Update scores when visits are recorded:

```typescript
// In visits.service.ts

async recordVisit(dto: CreateVisitDto) {
  const visit = await this.visitRepository.save(dto);
  
  // Recalculate vulnerability score for beneficiary
  const beneficiary = await this.getBeneficiary(dto.beneficiaryId);
  await this.intelligenceService.calculateVulnerabilityScore(beneficiary);
  
  return visit;
}
```

### With Resources Module

Use predictions for resource allocation:

```typescript
// In resources.service.ts

async allocateResources(type: string, quantity: number) {
  // Get critical beneficiaries
  const critical = await this.intelligenceService.getVulnerabilityScores({
    riskLevel: 'CRITICAL'
  });
  
  // Allocate to high-risk families first
  for (const score of critical.data) {
    // ... allocation logic
  }
}
```

## Configuration

Set the ML service URL in your `.env`:

```
ML_SERVICE_URL=http://localhost:8001
# or for Docker deployment:
# ML_SERVICE_URL=http://ml-service:8001
```

## Database Schema

**VulnerabilityScore Table:**

```sql
CREATE TABLE vulnerability_scores (
  id UUID PRIMARY KEY,
  beneficiary_id VARCHAR UNIQUE NOT NULL,
  vulnerability_score DECIMAL(5,2),
  economic_factor DECIMAL(5,2),
  health_factor DECIMAL(5,2),
  social_factor DECIMAL(5,2),
  urgency_factor DECIMAL(5,2),
  risk_level VARCHAR,
  recommendations JSON,
  calculated_at TIMESTAMP,
  updated_at TIMESTAMP,
  INDEX ON beneficiary_id,
  INDEX ON risk_level,
  INDEX ON vulnerability_score
);
```

## Performance Considerations

- Single score calculation: < 100ms (mostly network latency)
- Batch of 1000: < 5 seconds
- Query with filters: < 50ms (cached after first calculation)
- Database queries use indexes for fast filtering

## Error Handling

- ML service unavailable: Returns 503 Service Unavailable
- Invalid beneficiary data: Returns 400 Bad Request
- Database errors: Returns 500 Internal Server Error
- All errors are logged with context

## Testing

See `intelligence.controller.spec.ts` for test examples

## Future Enhancements

- [ ] Automated scheduled scoring updates
- [ ] Real-time alerts for critical cases
- [ ] Custom weighting by organization
- [ ] Advanced ML models with training pipeline
- [ ] Performance optimization with caching layer
- [ ] Mobile app notifications for critical cases

## Troubleshooting

**ML Service Unavailable:**
- Check if ml-service container is running
- Verify ML_SERVICE_URL in .env
- Check network connectivity between containers

**Scoring Takes Too Long:**
- May indicate ML service is overloaded
- Check ML service logs for errors
- Consider implementing caching

**Incorrect Scores:**
- Verify input data format matches schema
- Check beneficiary data quality
- Review scoring algorithm in ml-service/models/vulnerability_scorer.py
