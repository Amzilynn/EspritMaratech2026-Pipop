# Omnia ML Microservice

Python-based FastAPI microservice for machine learning-driven vulnerability scoring and predictive analytics.

## Features

### 1. **Vulnerability Scoring**
- Calculates comprehensive vulnerability scores (0-100) based on:
  - **Economic Factors (0-40)**: Income per capita, employment status, family size burden
  - **Health Factors (0-30)**: Medical visits, medications, chronic conditions
  - **Social Factors (0-20)**: Housing conditions, migration status, vulnerable dependents
  - **Urgency Factors (0-10)**: Time since last aid received

- Classifies risk levels: CRITICAL, HIGH, MEDIUM, LOW
- Generates context-specific recommendations

### 2. **Batch Processing**
- Efficiently process multiple beneficiaries
- Error handling and reporting
- Scalable processing

### 3. **Predictive Analytics**
- **Area-based need predictions**: Food, medical, and housing interventions
- **Health pattern detection**: Disease clustering and outbreak risk
- **Migration trend analysis**: Displacement and regional instability indicators

## Installation

### Prerequisites
- Python 3.9+
- pip or poetry

### Setup

1. **Clone and navigate to ml-service**
```bash
cd ml-service
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/Scripts/activate  # Windows
# or
source venv/bin/activate  # macOS/Linux
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your settings
```

## Running the Service

### Development Mode
```bash
python main.py
```

The API will be available at `http://localhost:8001`

### Production with Gunicorn
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8001 main:app
```

## Docker

### Build Image
```bash
docker build -t omnia-ml-service .
```

### Run Container
```bash
docker run -p 8001:8001 \
  -e ML_SERVICE_PORT=8001 \
  -e ENVIRONMENT=production \
  omnia-ml-service
```

## API Endpoints

### Health Check
```
GET /health
```

### Single Beneficiary Scoring
```
POST /score
Content-Type: application/json

{
  "id": "beneficiary-uuid",
  "nbMembres": 5,
  "nbEnfants": 2,
  "nbPersonnesAgees": 1,
  "nbHandicapes": 0,
  "revenuMensuel": 150.0,
  "typeLogement": "Précaire",
  "statutSocial": "Chômage",
  "migrationStatus": "None",
  "healthConditions": "Diabetes, Hypertension",
  "medicalVisitsCount": 8,
  "medicationRecordsCount": 3,
  "lastAidDistributionDate": "2025-12-15T10:30:00Z"
}

Response:
{
  "beneficiary_id": "beneficiary-uuid",
  "vulnerabilityScore": 82.5,
  "economicFactor": 38.0,
  "healthFactor": 28.5,
  "socialFactor": 12.0,
  "urgencyFactor": 4.0,
  "riskLevel": "CRITICAL",
  "recommendations": [
    "URGENT: Prioritize for immediate assistance",
    "Income Support: Provide financial assistance",
    "Healthcare: Schedule medical assessment",
    "Follow-up: Schedule urgent follow-up visit within 2 weeks"
  ],
  "calculated_at": "2026-02-07T14:32:00Z"
}
```

### Batch Scoring
```
POST /score/batch
Content-Type: application/json

{
  "beneficiaries": [
    { /* beneficiary 1 */ },
    { /* beneficiary 2 */ }
  ]
}

Response:
{
  "total_processed": 2,
  "successful": 2,
  "failed": 0,
  "results": [ /* array of VulnerabilityScoreOutput */ ],
  "errors": []
}
```

### Predict Area Needs
```
POST /predict/area-needs
```

### Detect Health Patterns
```
POST /predict/health-patterns
```

### Analyze Migration Trends
```
POST /predict/migration-trends
```

## Integration with NestJS Backend

See [NestJS Intelligence Module](../backend/omnia-backend/src/intelligence/README.md)

The NestJS backend should call these endpoints when:
1. A new beneficiary is created or updated
2. Visit data is recorded
3. Running batch analysis or reporting
4. Scheduled vulnerability score updates

## Scoring Algorithm Details

### Economic Factor Calculation
```
income_per_capita = monthly_income / family_members

if income_per_capita <= (poverty_threshold / 2):
    base_score = 40

else if income_per_capita <= poverty_threshold:
    base_score = 30 + (income / poverty_threshold) * 10

else:
    base_score = reduced based on income increase

Applied multipliers:
- Employment status multiplier
- Family size burden (larger families = higher factor)

Result: 0-40 points
```

### Health Factor Calculation
- Medical visits frequency: 0-15 points
- Medication requirements: 0-10 points
- Chronic conditions: 0-10 points
- Dependent care burden: 0-5 points
- Result: 0-30 points

### Social Factor Calculation
- Housing conditions: 0-10 points
- Migration status: 0-5 points
- Vulnerable dependents: 0-5 points
- Result: 0-20 points

### Urgency Factor Calculation
- Never received aid: 10 points
- > 180 days since aid: 10 points
- > 90 days since aid: 7 points
- > 45 days since aid: 4 points
- Otherwise: 0 points

## Risk Levels

- **CRITICAL** (80-100): Immediate intervention required
- **HIGH** (60-79): Priority for aid allocation
- **MEDIUM** (40-59): Monitor and plan interventions
- **LOW** (0-39): Standard monitoring

## Data Privacy

- No sensitive data is stored; scoring is stateless
- Can be deployed behind authentication/firewall
- Complies with data protection regulations
- Audit logging available

## Performance

- Single score calculation: < 50ms
- Batch of 1000 beneficiaries: < 5 seconds
- Stateless design allows horizontal scaling
- Suitable for real-time and batch processing

## Troubleshooting

### Port Already in Use
```bash
# Change port in .env
ML_SERVICE_PORT=8002
```

### Import Errors
```bash
pip install -r requirements.txt --upgrade
```

### Data Validation Errors
Check that input data matches the schema in `src/schemas.py`

## Future Enhancements

- [x] Basic vulnerability scoring
- [ ] Machine learning model training pipeline
- [ ] Time-series predictions
- [ ] Custom model configuration
- [ ] Model versioning
- [ ] Advanced feature engineering
- [ ] Integration with poverty indices

## License

Proprietary - Omnia Project
