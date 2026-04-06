#!/usr/bin/env python3
"""
Quick start script for the Resume Assistant backend.
On Render, never use reload=True — it spawns a reloader and breaks port health checks.
"""
import os

import uvicorn
from config import settings

if __name__ == "__main__":
    # Render sets RENDER=true; reload is for local dev only.
    use_reload = os.environ.get("RENDER") != "true"
    print(f"Starting Resume Assistant API on {settings.host}:{settings.port}")
    print(f"LLM Provider: {settings.llm_provider}")
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=use_reload,
    )





