import { NextResponse } from 'next/server';

const TIMEOUT_MS = 90_000;

export async function POST(req: Request) {
    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const query =
        typeof body === 'object' && body !== null && 'query' in body
            ? String((body as { query: unknown }).query ?? '').trim()
            : '';

    if (!query) {
        return NextResponse.json({ error: 'Missing query' }, { status: 400 });
    }

    const base = process.env.RAG_API_URL?.replace(/\/$/, '') || 'http://127.0.0.1:8000';

    try {
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
        const res = await fetch(`${base}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
            signal: controller.signal,
        });
        clearTimeout(t);

        const text = await res.text();
        let data: { answer?: string; detail?: string | unknown };
        try {
            data = JSON.parse(text) as { answer?: string; detail?: string | unknown };
        } catch {
            return NextResponse.json(
                { error: text || res.statusText || 'RAG error' },
                { status: res.status }
            );
        }

        if (!res.ok) {
            const msg =
                typeof data.detail === 'string'
                    ? data.detail
                    : typeof data.detail === 'object' && data.detail !== null
                      ? JSON.stringify(data.detail)
                      : text || res.statusText;
            return NextResponse.json({ error: msg }, { status: res.status });
        }

        if (typeof data.answer !== 'string') {
            return NextResponse.json({ error: 'Invalid RAG response' }, { status: 502 });
        }

        return NextResponse.json({ answer: data.answer });
    } catch (e) {
        const message = e instanceof Error ? e.message : 'Unknown error';
        const isAbort = e instanceof Error && e.name === 'AbortError';
        return NextResponse.json(
            {
                error: isAbort
                    ? 'Request timed out. The model may be slow or the backend is overloaded.'
                    : `Cannot reach RAG backend at ${base}. Start it with: cd backend && uvicorn main:app --reload`,
            },
            { status: 503 }
        );
    }
}
