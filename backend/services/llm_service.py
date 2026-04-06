from typing import List, Dict, Optional
from langchain_openai import ChatOpenAI
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from config import settings
import openai


class LLMService:
    def __init__(self):
        self._llm = None
    
    @property
    def llm(self):
        """Lazy initialization of LLM"""
        if self._llm is None:
            self._llm = self._initialize_llm()
        return self._llm
    
    def _initialize_llm(self):
        """Initialize the LLM based on provider"""
        if settings.llm_provider == "openai":
            if not settings.openai_api_key:
                raise ValueError("OPENAI_API_KEY is required when using OpenAI. Please set it in your .env file or environment variables.")
            # Try gpt-3.5-turbo first (widely available and cheaper)
            # You can change this to "gpt-4o" or "gpt-4-turbo" if you have access
            return ChatOpenAI(
                model="gpt-3.5-turbo",  # Widely available and cost-effective
                temperature=0.7,
                api_key=settings.openai_api_key
            )
        elif settings.llm_provider == "anthropic":
            if not settings.anthropic_api_key:
                raise ValueError("ANTHROPIC_API_KEY is required when using Anthropic. Please set it in your .env file or environment variables.")
            return ChatAnthropic(
                model="claude-3-opus-20240229",
                temperature=0.7,
                api_key=settings.anthropic_api_key
            )
        else:
            raise ValueError(f"Unsupported LLM provider: {settings.llm_provider}")
    
    def generate_response(
        self,
        user_query: str,
        context: List[Dict],
        conversation_history: Optional[List[Dict]] = None
    ) -> str:
        """Generate a response using RAG"""
        
        # Build context from retrieved documents
        context_text = "\n\n".join([
            f"[{doc['metadata'].get('source', 'Unknown')}]\n{doc['content']}"
            for doc in context
        ])
        
        # System prompt
        system_prompt = """You are a helpful resume assistant. Your role is to answer questions about the candidate's portfolio, experience, projects, and skills based on the provided context.

Guidelines:
- Answer questions accurately based only on the provided context
- If the context doesn't contain relevant information, politely say so
- Be concise but informative
- Focus on the candidate's professional experience, projects, and skills
- Use a friendly and professional tone"""
        
        # Build messages
        messages = [SystemMessage(content=system_prompt)]
        
        # Add conversation history if provided
        if conversation_history:
            for msg in conversation_history:
                if msg['role'] == 'user':
                    messages.append(HumanMessage(content=msg['content']))
                elif msg['role'] == 'assistant':
                    messages.append(AIMessage(content=msg['content']))
        
        # Add context and current query
        context_prompt = f"""Based on the following context about the candidate, answer the user's question.

Context:
{context_text}

User Question: {user_query}

Answer:"""
        
        messages.append(HumanMessage(content=context_prompt))
        
        # Generate response
        try:
            response = self.llm.invoke(messages)
            # Handle different response formats
            if hasattr(response, 'content'):
                return response.content
            elif isinstance(response, str):
                return response
            else:
                return str(response)
        except openai.RateLimitError as e:
            error_msg = str(e)
            if 'insufficient_quota' in error_msg.lower() or 'quota' in error_msg.lower():
                raise ValueError(
                    "OpenAI API quota exceeded. Please:\n"
                    "1. Check your OpenAI account billing: https://platform.openai.com/account/billing\n"
                    "2. Add payment method if needed\n"
                    "3. Or switch to Anthropic by setting LLM_PROVIDER=anthropic in your .env file"
                )
            else:
                raise ValueError(f"OpenAI API rate limit error: {error_msg}")
        except openai.AuthenticationError as e:
            raise ValueError(f"OpenAI API authentication failed. Please check your API key: {str(e)}")
        except Exception as e:
            # Re-raise other exceptions as-is
            raise




