"""FastAPI entrypoint for portfolio RAG — used by the Next.js voice assistant."""

from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from config import settings
from services.llm_service import LLMService
from services.vector_store import VectorStore


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.vector_store = VectorStore()
    app.state.llm_service = LLMService()
    yield


app = FastAPI(title="Portfolio RAG API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.cors_origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatBody(BaseModel):
    query: str = Field(..., min_length=1, max_length=4000)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/chat")
def chat(body: ChatBody, request: Request):
    vs: VectorStore = request.app.state.vector_store
    llm: LLMService = request.app.state.llm_service
    try:
        context = vs.query(body.query.strip(), n_results=6)
        if not context:
            return {
                "answer": (
                    "No portfolio data was found in the vector database. "
                    "From the `backend` folder, run `python data_ingestion.py` to ingest `data/*.json`, then try again."
                )
            }
        answer = llm.generate_response(body.query.strip(), context)
        return {"answer": answer}
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
