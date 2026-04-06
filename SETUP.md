# Portfolio Site - Setup & Running Guide

This guide will help you set up and run the portfolio site project, which includes a Next.js frontend and a FastAPI backend with RAG (Retrieval-Augmented Generation) chat functionality.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/downloads/)
- **npm** or **yarn** or **pnpm** (comes with Node.js)
- **pip** (comes with Python)
- **API Keys** (choose one):
  - OpenAI API key - [Get one here](https://platform.openai.com/api-keys)
  - Anthropic API key - [Get one here](https://console.anthropic.com/)

## Project Structure

```
portfolio/
├── app/                    # Next.js frontend application
├── components/             # React components
├── backend/                # FastAPI backend
│   ├── data/              # Portfolio data (JSON files)
│   ├── services/          # Backend services
│   └── main.py            # FastAPI application
└── public/                # Static assets
```

## Setup Instructions

### Step 1: Clone and Navigate to Project

```bash
cd portfolio
```

### Step 2: Backend Setup

The backend provides RAG chat functionality for the Terminal app. Follow these steps:

#### 2.1 Create Python Virtual Environment

```bash
cd backend
python3 -m venv venv
```

**Activate the virtual environment:**

- **macOS/Linux:**
  ```bash
  source venv/bin/activate
  ```

- **Windows:**
  ```bash
  venv\Scripts\activate
  ```

You should see `(venv)` in your terminal prompt when activated.

#### 2.2 Install Python Dependencies

```bash
pip install -r requirements.txt
```

#### 2.3 Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Edit the `.env` file and add your API keys:
   ```env
   # Choose your LLM provider (openai or anthropic)
   LLM_PROVIDER=openai
   
   # Add your API key (only the one matching LLM_PROVIDER is required)
   OPENAI_API_KEY=your_openai_api_key_here
   ANTHROPIC_API_KEY=your_anthropic_api_key_here
   
   # Vector Database (default is fine)
   VECTOR_DB_PATH=./chroma_db
   
   # Server Configuration (defaults are fine)
   HOST=0.0.0.0
   PORT=8000
   CORS_ORIGINS=http://localhost:3000,http://localhost:3001
   ```

   **Important:** Replace `your_openai_api_key_here` or `your_anthropic_api_key_here` with your actual API key.

#### 2.4 Ingest Portfolio Data

Before starting the server, you need to ingest your portfolio data into the vector database:

```bash
python data_ingestion.py
```

This will:
- Load data from `data/` directory (experience.json, projects.json, skills.json, education.json)
- Process and chunk the data
- Generate embeddings and store them in ChromaDB

You should see output indicating successful ingestion.

#### 2.5 Start the Backend Server

```bash
python run.py
```

Or using uvicorn directly:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will start on `http://localhost:8000`. You should see:
```
Starting Resume Assistant API on 0.0.0.0:8000
LLM Provider: openai
```

**Keep this terminal window open** - the backend needs to keep running.

### Step 3: Frontend Setup

Open a **new terminal window** (keep the backend running) and navigate to the portfolio directory:

```bash
cd portfolio  # If not already there
```

#### 3.1 Install Node.js Dependencies

```bash
npm install --legacy-peer-deps
```

**Note:** The `--legacy-peer-deps` flag is used to handle peer dependency conflicts. If you prefer, you can also use:
- `yarn install`
- `pnpm install`

#### 3.2 (Optional) Configure Backend URL

If your backend is running on a different URL or port, create a `.env.local` file:

```bash
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

By default, the frontend expects the backend at `http://localhost:8000`.

#### 3.3 Start the Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:3000`. Open your browser and navigate to:
```
http://localhost:3000
```

## Running the Project

### Development Mode

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   python run.py
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd portfolio
   npm run dev
   ```

3. Open your browser to `http://localhost:3000`

### Production Build

#### Build Frontend

```bash
cd portfolio
npm run build
npm start
```

#### Run Backend (Production)

```bash
cd backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Features

### Terminal App with RAG Chat

The Terminal app includes:
- **Built-in commands**: `help`, `clear`, `about`, `whoami`, `projects`, `contact`
- **RAG Chat**: Ask questions about your portfolio, experience, skills, or projects
- Conversation history is maintained for context-aware responses

### Other Apps

- **About App**: Portfolio information
- **Projects App**: Showcase your projects
- **Contact App**: Contact information
- **Notes App**: Notes functionality
- **Safari App**: Browser functionality

## Updating Portfolio Data

To update your portfolio information:

1. Edit the JSON files in `backend/data/`:
   - `experience.json`
   - `projects.json`
   - `skills.json`
   - `education.json`

2. Re-ingest the data:
   ```bash
   cd backend
   source venv/bin/activate
   python data_ingestion.py
   ```

3. The new data will be available in the chat immediately (no need to restart the server)

## API Endpoints

The backend provides the following endpoints:

### Health Check
```
GET http://localhost:8000/
```

### Chat with RAG
```
POST http://localhost:8000/api/chat
Content-Type: application/json

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
POST http://localhost:8000/api/ingest
```

## Troubleshooting

### Backend Issues

#### API Key Errors
- **Problem:** "API key not found" or authentication errors
- **Solution:** 
  - Check that your `.env` file exists in the `backend/` directory
  - Verify the API key is correct (no extra spaces)
  - Ensure `LLM_PROVIDER` matches the API key you're using (e.g., if using OpenAI, set `LLM_PROVIDER=openai`)

#### Vector Database Issues
- **Problem:** "No documents found" or empty results
- **Solution:**
  - Delete the `chroma_db/` directory: `rm -rf chroma_db`
  - Run `python data_ingestion.py` again
  - Verify the JSON files in `data/` are valid JSON

#### Port Already in Use
- **Problem:** "Address already in use" on port 8000
- **Solution:**
  - Change the port in `backend/.env`: `PORT=8001`
  - Update frontend `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:8001`
  - Or kill the process using port 8000

#### CORS Issues
- **Problem:** Frontend can't connect to backend
- **Solution:**
  - Update `CORS_ORIGINS` in `backend/.env` to include your frontend URL
  - Default includes `http://localhost:3000` and `http://localhost:3001`
  - Make sure backend is running before starting frontend

### Frontend Issues

#### Dependencies Installation Fails
- **Problem:** `npm install` fails with peer dependency errors
- **Solution:** Use `npm install --legacy-peer-deps` as shown in the setup

#### Backend Connection Errors
- **Problem:** Terminal chat doesn't work or shows connection errors
- **Solution:**
  - Verify backend is running on `http://localhost:8000`
  - Check browser console for CORS errors
  - Verify `NEXT_PUBLIC_API_URL` in `.env.local` matches backend URL

#### Build Errors
- **Problem:** `npm run build` fails
- **Solution:**
  - Check for TypeScript errors: `npm run lint`
  - Ensure all dependencies are installed
  - Check Node.js version (should be v18+)

### General Issues

#### Virtual Environment Not Activating
- **macOS/Linux:** Make sure you're using `source venv/bin/activate`
- **Windows:** Use `venv\Scripts\activate` (backslashes, not forward slashes)

#### Python Version Issues
- Ensure Python 3.8+ is installed: `python3 --version`
- Some packages may require Python 3.9+

## Development Tips

1. **Hot Reload:** Both frontend and backend support hot reload in development mode
2. **Logs:** Check terminal output for backend logs and browser console for frontend logs
3. **Data Updates:** After editing JSON files, re-run `data_ingestion.py` to update the vector database
4. **API Testing:** Use tools like Postman or curl to test backend endpoints directly

## Next Steps

- Customize the portfolio data in `backend/data/` JSON files
- Modify components in `components/` to match your design
- Update styling in `app/globals.css`
- Add more features to the Terminal app

## Support

If you encounter issues not covered here:
1. Check the error messages in terminal/browser console
2. Verify all prerequisites are installed correctly
3. Ensure environment variables are set correctly
4. Try deleting `node_modules` and `venv`, then reinstalling

---

Happy coding! 🚀


