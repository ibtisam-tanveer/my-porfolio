from pydantic_settings import BaseSettings
from typing import List, Union
from pydantic import field_validator, model_validator


class Settings(BaseSettings):
    # LLM Configuration
    llm_provider: str = "openai"  # openai, anthropic, local
    openai_api_key: str = ""
    anthropic_api_key: str = ""

    # Embeddings: "openai" = API-only (fits Render free tier). "local" = sentence-transformers + torch (heavy).
    embedding_provider: str = "openai"
    openai_embedding_model: str = "text-embedding-3-small"

    # Vector Database
    vector_db_path: str = "./chroma_db"
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    cors_origins: Union[str, List[str]] = ["http://localhost:3000", "http://localhost:3001"]
    
    @model_validator(mode='after')
    def parse_cors_origins(self):
        if isinstance(self.cors_origins, str):
            # Handle comma-separated string from .env file
            self.cors_origins = [origin.strip() for origin in self.cors_origins.split(',') if origin.strip()]
        return self
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()




