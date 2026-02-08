import logging
import numpy as np
import cv2
from deepface import DeepFace
from typing import List, Dict, Optional, Tuple

logger = logging.getLogger(__name__)

class FaceRecognitionService:
    """Service for Face Recognition using DeepFace"""
    
    def __init__(self, model_name: str = "VGG-Face", distance_metric: str = "cosine"):
        """
        Initialize Face Recognition Service.
        
        Args:
            model_name: Model to use (VGG-Face, Facenet, OpenFace, DeepFace, DeepID, ArcFace, Dlib)
            distance_metric: Metric for comparison (cosine, euclidean, euclidean_l2)
        """
        self.model_name = model_name
        self.distance_metric = distance_metric
        # Pre-load model on startup to avoid delay on first request
        try:
            logger.info(f"Loading Face Recognition model: {model_name}")
            # DeepFace.build_model(model_name) # Optional: pre-build
            logger.info("Face Recognition model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load Face Recognition model: {e}")

    def get_embedding(self, image_bytes: bytes) -> List[float]:
        """
        Extract face embedding vector from image bytes.
        
        Args:
            image_bytes: Raw image bytes
            
        Returns:
            List of floats representing the face embedding
        """
        try:
            # Convert bytes to numpy array
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                raise ValueError("Could not decode image bytes")

            logger.info("Attempting face representation with opencv detector...")
            try:
                embedding_objs = DeepFace.represent(
                    img_path=img,
                    model_name=self.model_name,
                    enforce_detection=True, 
                    detector_backend="opencv"
                )
            except Exception as e:
                logger.warning(f"Detection failed with opencv, falling back to skip: {e}")
                embedding_objs = DeepFace.represent(
                    img_path=img,
                    model_name=self.model_name,
                    enforce_detection=False, 
                    detector_backend="skip"
                )
            
            if not embedding_objs:
                raise ValueError("No face detected even with fallback")
            
            logger.info(f"Face represent successful. Embedding size: {len(embedding_objs[0]['embedding'])}")
            return embedding_objs[0]["embedding"]
            
        except Exception as e:
            logger.error(f"Face embedding extraction failed: {str(e)}")
            raise e

    def find_best_match(self, target_embedding: List[float], candidates: List[Dict]) -> Optional[Dict]:
        """
        Find best match for target embedding among candidates.
        
        Args:
            target_embedding: The embedding vector of the face to identify
            candidates: List of dicts {'id': str, 'embedding': List[float]}
            
        Returns:
            Best match dict {'id': str, 'score': float} or None if no match > threshold
        """
        best_match = None
        min_distance = float('inf')
        
        # Thresholds depend on model and metric
        # VGG-Face + Consine: 0.40 is strict, 0.60 is loose. 
        # Using 0.55 to be more forgiving for webcam captures.
        threshold = 0.55 
        
        target_vector = np.array(target_embedding)
        target_norm = np.linalg.norm(target_vector)
        if target_norm > 0:
            target_vector = target_vector / target_norm
        
        for candidate in candidates:
            candidate_vector = np.array(candidate['embedding'])
            candidate_norm = np.linalg.norm(candidate_vector)
            if candidate_norm > 0:
                candidate_vector = candidate_vector / candidate_norm
            
            if self.distance_metric == 'cosine':
                # Since both are normalized, cosine distance = 1 - dot_product
                similarity = np.dot(target_vector, candidate_vector)
                distance = 1 - similarity
            else:
                # Euclidean
                distance = np.linalg.norm(target_vector - candidate_vector)
                
            logger.info(f"Comparing with candidate {candidate['id']}: distance = {distance:.4f}")

            if distance < min_distance and distance < threshold:
                min_distance = distance
                best_match = {
                    'id': candidate['id'],
                    'score': float(1 - distance), # convert distance to similarity score
                    'distance': float(distance)
                }
                
        return best_match
