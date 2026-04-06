from sentence_transformers import SentenceTransformer
from typing import List
import os


class EmbeddingService:
    def __init__(self):
        # Using a lightweight model for embeddings
        # ChromaDB will use this for generating embeddings
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
    
    def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for a list of texts"""
        embeddings = self.model.encode(texts, show_progress_bar=False)
        return embeddings.tolist()
    
    def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for a single text"""
        return self.generate_embeddings([text])[0]





