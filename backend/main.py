"""FastAPI entrypoint for portfolio RAG — used by the Next.js voice assistant."""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from starlette.responses import Response

from config import settings

# Do not import VectorStore / LLMService at module level — they pull in Chroma + embeddings
# (torch/sentence-transformers) and block process startup for minutes. Render's port health
# check times out before any port appears. Lazy-init on first /chat instead.

app = FastAPI(title="Portfolio RAG API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.cors_origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatBody(BaseModel):
    query: str = Field(..., min_length=1, max_length=4000)


def _ensure_rag_services(request: Request):
    """Load heavy ML stack on first chat request so /health can respond immediately."""
    state = request.app.state
    if getattr(state, "_rag_loaded", False):
        return state.vector_store, state.llm_service
    from services.llm_service import LLMService
    from services.vector_store import VectorStore

    state.vector_store = VectorStore()
    state.llm_service = LLMService()
    state._rag_loaded = True
    return state.vector_store, state.llm_service


@app.get("/")
def root():
    """Fast response so browsers and uptime checks don’t hang on an empty path."""
    return {
        "service": "portfolio-rag",
        "docs": "POST /chat with JSON {\"query\": \"...\"}",
        "health": "/health",
    }


@app.head("/")
def root_head():
    """Render and browsers often probe with HEAD; without this, HEAD / was 404."""
    return Response(status_code=200)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/chat")
def chat_get_help():
    """Browsers only send GET when you open a URL in a tab — chat is POST-only."""
    return {
        "error": "Use POST, not GET.",
        "hint": "Send POST /chat with Content-Type: application/json and body {\"query\": \"your question\"}.",
        "example_curl": 'curl -X POST https://YOUR_HOST/chat -H "Content-Type: application/json" -d \'{"query":"hello"}\'',
    }


@app.post("/chat")
def chat(body: ChatBody, request: Request):
    vs, llm = _ensure_rag_services(request)
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
