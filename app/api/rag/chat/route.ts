import { NextResponse } from 'next/server';

/** Vercel: allow long Render cold starts + first /chat (loads embeddings). Hobby may cap lower — see Vercel dashboard. */
export const maxDuration = 300;

function getTimeoutMs(): number {
    const raw = process.env.RAG_API_TIMEOUT_MS;
    if (raw && /^\d+$/.test(raw)) {
        const n = parseInt(raw, 10);
        if (n >= 30_000 && n <= 600_000) return n;
    }
    return 240_000;
}

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

    const timeoutMs = getTimeoutMs();

    try {
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), timeoutMs);
        let res: Response;
        try {
            res = await fetch(`${base}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
                signal: controller.signal,
            });
        } finally {
            clearTimeout(t);
        }

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
        const isAbort =
            (e instanceof Error && e.name === 'AbortError') ||
            (typeof e === 'object' && e !== null && (e as { name?: string }).name === 'AbortError');
        return NextResponse.json(
            {
                error: isAbort
                    ? `Timed out after ${Math.round(timeoutMs / 1000)}s. Render’s first request often loads ML for minutes — open ${base}/health once to warm the service, then retry. Optional: set RAG_API_TIMEOUT_MS (ms) on Vercel.`
                    : `Cannot reach RAG backend at ${base}. Start it with: cd backend && uvicorn main:app --reload`,
            },
            { status: 503 }
        );
    }
}
