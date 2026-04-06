# RAG Chat Backend

This backend provides RAG (Retrieval-Augmented Generation) chat functionality for the portfolio terminal. It uses FastAPI, ChromaDB for vector storage, and supports OpenAI or Anthropic LLMs.

## Setup

### 1. Create Python Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy the example environment file and add your API keys:

```bash
cp env.example .env
```

Edit `.env` and add your API keys:

```env
LLM_PROVIDER=openai  # or "anthropic"
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

VECTOR_DB_PATH=./chroma_db
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### 4. Ingest Portfolio Data

Before using the chat, you need to ingest your portfolio data into the vector database:

```bash
python data_ingestion.py
```

This will:
- Load data from `data/` directory (experience.json, projects.json, skills.json, education.json)
- Process and chunk the data
- Generate embeddings and store them in ChromaDB

### 5. Start the Backend Server

```bash
python run.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

### Health Check
```
GET /
```

### Chat with RAG
```
POST /api/chat
Body:
{
  "message": "What are your skills?",
  "conversation_history": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi! How can I help?"}
  ]
}
```

### Re-ingest Data
```
POST /api/ingest
```

## Project Structure

```
backend/
├── main.py              # FastAPI application
├── config.py            # Configuration settings
├── run.py               # Server startup script
├── data_ingestion.py    # Data ingestion script
├── requirements.txt     # Python dependencies
├── env.example          # Environment variables template
├── services/
│   ├── vector_store.py      # ChromaDB vector store wrapper
│   ├── llm_service.py       # LLM service (OpenAI/Anthropic)
│   └── embedding_service.py # Embedding generation
└── data/
    ├── experience.json
    ├── projects.json
    ├── skills.json
    └── education.json
```

## Updating Portfolio Data

To update the portfolio data:

1. Edit the JSON files in `data/` directory
2. Run `python data_ingestion.py` to re-ingest the data
3. The new data will be available in the chat immediately

## Troubleshooting

### API Key Errors
- Make sure your `.env` file has the correct API keys
- Check that `LLM_PROVIDER` matches the API key you're using

### Vector Database Issues
- Delete `chroma_db/` directory and run `data_ingestion.py` again
- Make sure the data files in `data/` are valid JSON

### CORS Issues
- Update `CORS_ORIGINS` in `.env` to include your frontend URL
- Default includes `http://localhost:3000` and `http://localhost:3001`


