'use client';

import { useState, useRef, useEffect } from 'react';

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export default function TerminalApp() {
    const [history, setHistory] = useState<string[]>(['Welcome to Terminal. Type "help" for commands or ask me anything about my portfolio!']);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = async (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !isLoading) {
            const cmd = input.trim();
            const cmdLower = cmd.toLowerCase();

            // Handle built-in commands
            if (cmdLower === 'help') {
                const response = 'Available commands: help, clear, about, projects, contact, whoami\nOr ask me anything about my portfolio, experience, skills, or projects!';
                setHistory([...history, `> ${input}`, response]);
                setInput('');
                return;
            }

            if (cmdLower === 'clear') {
                setHistory(['Welcome to Terminal. Type "help" for commands or ask me anything about my portfolio!']);
                setConversationHistory([]);
                setInput('');
                return;
            }

            if (cmdLower === 'about') {
                const response =
                    'Muhammad Ibtisam Tanveer — Frontend software engineer. Next.js, React 19, TypeScript, Tailwind. Banking/fintech UIs, PIM/e-commerce, React Native & Flutter.';
                setHistory([...history, `> ${input}`, response]);
                setInput('');
                return;
            }

            if (cmdLower === 'whoami') {
                const response = 'ibtisam@portfolio';
                setHistory([...history, `> ${input}`, response]);
                setInput('');
                return;
            }

            if (cmdLower === 'projects') {
                const response =
                    'Open the VS Code window for a file-tree view, or Finder → Projects for full write-ups (WAM Studio, PIMdesk, Pushka Hub, …).';
                setHistory([...history, `> ${input}`, response]);
                setInput('');
                return;
            }

            if (cmdLower === 'contact') {
                const response = 'Email: ibtisam.tanveer22@gmail.com | Phone: +49 157 55783296 | LinkedIn: linkedin.com/in/ibtisam-tanveer';
                setHistory([...history, `> ${input}`, response]);
                setInput('');
                return;
            }

            // For non-command inputs, use RAG chat
            const userInput = input;
            setHistory([...history, `> ${input}`]);
            setInput('');
            setIsLoading(true);

            try {
                const res = await fetch('/api/rag/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query: userInput }),
                });
                const data = (await res.json()) as { answer?: string; error?: string };
                if (!res.ok) {
                    throw new Error(data.error || res.statusText);
                }
                if (typeof data.answer !== 'string') {
                    throw new Error('Invalid response');
                }
                const assistantResponse = data.answer;
                setHistory((prev) => [...prev, assistantResponse]);

                const newHistory: ChatMessage[] = [
                    ...conversationHistory,
                    { role: 'user', content: userInput },
                    { role: 'assistant', content: assistantResponse },
                ];
                setConversationHistory(newHistory);
            } catch (error) {
                console.error('Error sending message:', error);
                const errorMessage =
                    'Sorry, I could not reach the assistant. On Vercel, set RAG_API_URL to your Render API URL (e.g. https://my-porfolio-1-2d5n.onrender.com).';
                setHistory((prev) => [...prev, errorMessage]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="h-full w-full bg-[#1e1e1e] p-3 sm:p-4 font-mono text-xs sm:text-sm text-green-400">
            <div className="space-y-1">
                {history.map((line, i) => (
                    <div key={i} className="break-words">{line}</div>
                ))}
                {isLoading && (
                    <div className="text-yellow-400">Thinking...</div>
                )}
            </div>
            <div className="mt-2 flex items-center">
                <span className="mr-1 sm:mr-2 text-blue-400">➜</span>
                <span className="mr-1 sm:mr-2 text-pink-400">~</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleCommand}
                    disabled={isLoading}
                    className="flex-1 bg-transparent outline-none text-white text-xs sm:text-sm disabled:opacity-50"
                    autoFocus
                />
            </div>
            <div ref={bottomRef} />
        </div>
    );
}
