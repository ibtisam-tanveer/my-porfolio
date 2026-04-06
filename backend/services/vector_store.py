import chromadb
from chromadb.config import Settings as ChromaSettings
from chromadb.utils import embedding_functions
from typing import List, Dict

from config import settings


def _collection_name() -> str:
    """Separate collections per embedding backend so dimensions stay consistent."""
    return f"resume_data_{settings.embedding_provider}"


def _build_embedding_function():
    if settings.embedding_provider == "local":
        return embedding_functions.DefaultEmbeddingFunction()

    if settings.embedding_provider != "openai":
        raise ValueError(
            f"Unknown embedding_provider: {settings.embedding_provider}. Use 'openai' or 'local'."
        )

    if not settings.openai_api_key:
        raise ValueError(
            "OPENAI_API_KEY is required when EMBEDDING_PROVIDER=openai (Render-friendly; no local torch)."
        )

    return embedding_functions.OpenAIEmbeddingFunction(
        api_key=settings.openai_api_key,
        model_name=settings.openai_embedding_model,
    )


class VectorStore:
    def __init__(self):
        ef = _build_embedding_function()

        self.client = chromadb.PersistentClient(
            path=settings.vector_db_path,
            settings=ChromaSettings(anonymized_telemetry=False),
        )
        self.collection = self.client.get_or_create_collection(
            name=_collection_name(),
            embedding_function=ef,
            metadata={"hnsw:space": "cosine"},
        )

    def add_documents(self, documents: List[str], metadatas: List[Dict], ids: List[str]):
        """Add documents to the vector store"""
        self.collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids,
        )

    def query(self, query_text: str, n_results: int = 5) -> List[Dict]:
        """Query the vector store for similar documents"""
        results = self.collection.query(
            query_texts=[query_text],
            n_results=n_results,
        )

        formatted_results = []
        if results["ids"] and len(results["ids"][0]) > 0:
            for i in range(len(results["ids"][0])):
                formatted_results.append(
                    {
                        "id": results["ids"][0][i],
                        "content": results["documents"][0][i],
                        "metadata": results["metadatas"][0][i],
                        "distance": results["distances"][0][i] if "distances" in results else None,
                    }
                )

        return formatted_results

    def delete_all(self):
        """Delete all documents from the collection"""
        all_ids = self.collection.get()["ids"]
        if all_ids:
            self.collection.delete(ids=all_ids)
