# Portfolio Site

A modern portfolio website built with Next.js, featuring a macOS-inspired interface and RAG (Retrieval-Augmented Generation) chat functionality powered by FastAPI.

## 🚀 Quick Start

For detailed setup instructions, see **[SETUP.md](./SETUP.md)**.

### Quick Setup Summary

1. **Backend Setup:**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp env.example .env
   # Edit .env and add your API keys (OpenAI or Anthropic)
   python data_ingestion.py
   python run.py
   ```

2. **Frontend Setup:**
   ```bash
   npm install --legacy-peer-deps
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

**📖 For complete setup instructions, troubleshooting, and more details, see [SETUP.md](./SETUP.md)**

## Features

### 🖥️ macOS-Inspired Interface
- Desktop environment with dock and menu bar
- Window management system
- Multiple apps: About, Projects, Contact, Terminal, Notes, Safari, Streaming, Snake, InstaBlog (Blog as Reels/Stories)

### 💬 Terminal App with RAG Chat
- **Built-in commands**: `help`, `clear`, `about`, `whoami`, `projects`, `contact`
- **RAG Chat**: Ask any question about the portfolio, experience, skills, or projects
- Conversation history maintained for context-aware responses
- Powered by OpenAI or Anthropic LLMs

### 🎨 Modern Tech Stack
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: FastAPI, ChromaDB (vector database), LangChain
- **3D Graphics**: Three.js, React Three Fiber
- **Animations**: Framer Motion

## 📋 Prerequisites

- Node.js (v18+)
- Python (v3.8+)
- OpenAI or Anthropic API key

## 🛠️ Common Commands

### Development
```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Backend
cd backend
source venv/bin/activate
python run.py                    # Start backend server
python data_ingestion.py         # Re-ingest portfolio data
```

### Updating Portfolio Data
1. Edit JSON files in `backend/data/`
2. Run `python data_ingestion.py` to update the vector database

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
