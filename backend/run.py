#!/usr/bin/env python3
"""
Quick start script for the Resume Assistant backend
"""
import uvicorn
from config import settings

if __name__ == "__main__":
    print(f"Starting Resume Assistant API on {settings.host}:{settings.port}")
    print(f"LLM Provider: {settings.llm_provider}")
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=True
    )





