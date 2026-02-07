"""
FastAPI Microservice for Machine Learning-based Vulnerability Scoring
Integrates with Omnia NestJS Backend
"""

from fastapi import FastAPI, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from typing import List

from src.schemas import (
    BeneficiaryInput,
    VulnerabilityScoreOutput,
    BatchScoringRequest,
    BatchScoringResponse
)
from src.services import ScoringService, PredictionService
from src.ocr import OcrService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global services
scoring_service: ScoringService = None
prediction_service: PredictionService = None
ocr_service: OcrService = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize services on startup"""
    global scoring_service, prediction_service, ocr_service
    
    logger.info("Starting ML Microservice...")
    scoring_service = ScoringService(poverty_threshold=200.0)
    prediction_service = PredictionService(scoring_service)
    
    try:
        # Initialize EasyOCR with French and Arabic support relevant for Tunisia context
        # defaulting to CPU for broad compatibility unless GPU is requested
        ocr_service = OcrService(languages=['fr', 'en']) 
        logger.info("OCR Service initialized successfully")
    except Exception as e:
        logger.error(f"Failed to initialize OCR Service: {e}")
        # Don't crash the whole service if OCR fails
    
    logger.info("Services initialized successfully")
    
    yield
    
    logger.info("Shutting down ML Microservice...")


# Create FastAPI application
app = FastAPI(
    title="Omnia ML Service",
    description="Machine Learning microservice for vulnerability scoring and predictions",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Restrict to NestJS backend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============ Health Check ============
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Omnia ML Service",
        "version": "1.0.0",
        "ocr_available": ocr_service is not None
    }


# ============ OCR ============
@app.post(
    "/ocr/extract",
    tags=["OCR"],
    summary="Extract text from image using EasyOCR",
    description="Upload an image file to extract text using EasyOCR (French/English)",
    status_code=status.HTTP_200_OK
)
async def extract_text_from_image(file: UploadFile = File(...)):
    """
    Extract text from uploaded image file.
    """
    if not ocr_service:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="OCR Service is not initialized"
        )
        
    try:
        logger.info(f"Processing OCR request for file: {file.filename}")
        contents = await file.read()
        
        extracted_text = ocr_service.extract_text_from_bytes(contents)
        
        return {
            "filename": file.filename,
            "text": extracted_text,
            "status": "success"
        }
    except Exception as e:
        logger.error(f"Error processing OCR request: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"OCR processing failed: {str(e)}"
        )


# ============ Single Scoring ============
@app.post(
    "/score",
    response_model=VulnerabilityScoreOutput,
    status_code=status.HTTP_200_OK,
    tags=["Scoring"],
    summary="Calculate vulnerability score for single beneficiary",
    description="Analyzes family data and returns a comprehensive vulnerability score"
)
async def calculate_score(beneficiary: BeneficiaryInput):
    """
    Calculate vulnerability score for a single beneficiary
    
    The score considers:
    - Economic factors (family income, employment, family size)
    - Health factors (medical needs, medication, chronic conditions)
    - Social factors (housing, migration status, vulnerable dependents)
    - Urgency factors (time since last aid)
    """
    try:
        logger.info(f"Scoring beneficiary {beneficiary.id}")
        result = scoring_service.score_beneficiary(beneficiary)
        return result
    except Exception as e:
        logger.error(f"Error scoring beneficiary: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Scoring failed: {str(e)}"
        )


# ============ Batch Scoring ============
@app.post(
    "/score/batch",
    response_model=BatchScoringResponse,
    status_code=status.HTTP_200_OK,
    tags=["Scoring"],
    summary="Calculate scores for multiple beneficiaries",
    description="Process multiple beneficiaries and return scores for all"
)
async def batch_score(request: BatchScoringRequest):
    """
    Calculate vulnerability scores for a batch of beneficiaries
    
    Efficiently processes multiple records and returns comprehensive scoring results
    """
    try:
        logger.info(f"Batch scoring {len(request.beneficiaries)} beneficiaries")
        results, errors = scoring_service.score_batch(request.beneficiaries)
        
        return BatchScoringResponse(
            total_processed=len(request.beneficiaries),
            successful=len(results),
            failed=len(errors),
            results=results,
            errors=errors
        )
    except Exception as e:
        logger.error(f"Error in batch scoring: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Batch scoring failed: {str(e)}"
        )


# ============ Predictions ============
@app.post(
    "/predict/area-needs",
    status_code=status.HTTP_200_OK,
    tags=["Predictions"],
    summary="Predict resource needs by area",
    description="Analyzes area-based vulnerability patterns to predict food, medical, and housing needs"
)
async def predict_area_needs(
    beneficiaries_by_area: dict,
    scores_by_id: dict
):
    """
    Predict resource needs for specific geographic areas
    
    Returns predictions for:
    - Food aid requirements
    - Medical intervention needs
    - Housing interventions
    - Critical cases needing immediate attention
    """
    try:
        logger.info(f"Predicting needs for {len(beneficiaries_by_area)} areas")
        
        # Convert dictionaries to proper format
        area_data = {}
        for area, beneficiary_list in beneficiaries_by_area.items():
            area_data[area] = [BeneficiaryInput(**b) for b in beneficiary_list]
        
        score_data = {}
        for bid, score_dict in scores_by_id.items():
            score_data[bid] = VulnerabilityScoreOutput(**score_dict)
        
        predictions = prediction_service.predict_area_needs(area_data, score_data)
        
        return {
            "status": "success",
            "predictions": predictions
        }
    except Exception as e:
        logger.error(f"Error predicting area needs: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Area prediction failed: {str(e)}"
        )


@app.post(
    "/predict/health-patterns",
    status_code=status.HTTP_200_OK,
    tags=["Predictions"],
    summary="Detect health patterns and outbreak risks",
    description="Analyzes health data to detect disease patterns and predict outbreak risks"
)
async def detect_health_patterns(
    beneficiaries: List[BeneficiaryInput],
    scores: List[VulnerabilityScoreOutput]
):
    """
    Detect health patterns and potential disease outbreaks
    
    Analyzes:
    - Disease clustering
    - Outbreak risk assessment
    - High-risk population identification
    - Prevention recommendations
    """
    try:
        if len(beneficiaries) != len(scores):
            raise ValueError("Beneficiaries and scores lists must have same length")
        
        logger.info(f"Detecting health patterns for {len(beneficiaries)} beneficiaries")
        alerts = prediction_service.detect_health_patterns(beneficiaries, scores)
        
        return {
            "status": "success",
            "total_analyzed": len(beneficiaries),
            "alerts": alerts
        }
    except Exception as e:
        logger.error(f"Error detecting health patterns: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Health pattern detection failed: {str(e)}"
        )


@app.post(
    "/predict/migration-trends",
    status_code=status.HTTP_200_OK,
    tags=["Predictions"],
    summary="Analyze migration and displacement trends",
    description="Identifies migration patterns that may indicate regional crises"
)
async def analyze_migration_trends(beneficiaries: List[BeneficiaryInput]):
    """
    Analyze migration and displacement trends
    
    Provides:
    - Migration breakdown by status
    - Trend analysis and risk assessment
    - Regional instability indicators
    """
    try:
        logger.info(f"Analyzing migration trends for {len(beneficiaries)} beneficiaries")
        trends = prediction_service.predict_migration_trends(beneficiaries)
        
        return {
            "status": "success",
            "trends": trends
        }
    except Exception as e:
        logger.error(f"Error analyzing migration trends: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Migration trend analysis failed: {str(e)}"
        )


# ============ Model Info ============
@app.get(
    "/info",
    tags=["Info"],
    summary="Get model and service information",
    description="Returns information about the ML models and service configuration"
)
async def service_info():
    """Get information about available models and service config"""
    return {
        "service": "Omnia ML Microservice",
        "version": "1.0.0",
        "models": [
            {
                "name": "Vulnerability Scorer",
                "version": "1.0",
                "factors": [
                    {"name": "Economic", "max_weight": 40},
                    {"name": "Health", "max_weight": 30},
                    {"name": "Social", "max_weight": 20},
                    {"name": "Urgency", "max_weight": 10}
                ]
            },
            {
                "name": "EasyOCR",
                "version": "1.7.1",
                "status": "active" if ocr_service else "inactive"
            }
        ],
        "endpoints": {
            "scoring": "/score (POST)",
            "batch_scoring": "/score/batch (POST)",
            "ocr": "/ocr/extract (POST)",
            "predictions": [
                "/predict/area-needs (POST)",
                "/predict/health-patterns (POST)",
                "/predict/migration-trends (POST)"
            ]
        }
    }


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """API root endpoint"""
    return {
        "message": "Omnia ML Microservice API",
        "docs": "/docs",
        "health": "/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,  # Different port from NestJS (3000)
        reload=True
    )
