import easyocr
import numpy as np
import cv2
import logging
from typing import List, Union

logger = logging.getLogger(__name__)

class OcrService:
    """Service for Optical Character Recognition using EasyOCR"""
    
    def __init__(self, languages: List[str] = ['fr', 'en'], gpu: bool = False):
        """
        Initialize EasyOCR reader.
        
        Args:
            languages: List of language codes (default: French, English)
            gpu:Whether to use GPU (default: False for compatibility)
        """
        logger.info(f"Initializing EasyOCR with languages={languages}, gpu={gpu}")
        self.reader = easyocr.Reader(languages, gpu=gpu)
        logger.info("EasyOCR initialized successfully")

    def extract_text_from_bytes(self, image_bytes: bytes) -> str:
        """
        Extract text from image bytes.
        
        Args:
            image_bytes: Raw image file bytes
            
        Returns:
            Extracted text combined into a single string
        """
        try:
            # Convert bytes to numpy array
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                raise ValueError("Could not decode image bytes")

            # Perform OCR
            # detail=0 returns simple list of strings
            result = self.reader.readtext(img, detail=0)
            
            return " ".join(result)
            
        except Exception as e:
            logger.error(f"OCR extraction failed: {str(e)}")
            raise e

    def extract_text_from_path(self, image_path: str) -> str:
        """Extract text from a file path"""
        try:
            result = self.reader.readtext(image_path, detail=0)
            return " ".join(result)
        except Exception as e:
            logger.error(f"OCR from path failed: {str(e)}")
            raise e
