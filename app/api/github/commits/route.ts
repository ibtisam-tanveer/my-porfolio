import { NextResponse } from 'next/server';
import type { GithubCommitItem } from '@/lib/github-commits';

const USER_RE = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;

type PushCommit = { sha: string; message: string; url: string };

type GhEvent = {
    type: string;
    created_at: string;
    repo: { name: string };
    payload: { commits?: PushCommit[] };
};

function ghHeaders(): HeadersInit {
    const h: HeadersInit = {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'ibtisam-portfolio',
    };
    const token = process.env.GITHUB_TOKEN?.trim();
    if (token) {
        (h as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    return h;
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const user = (searchParams.get('user') ?? '').trim();
    const limitRaw = Number(searchParams.get('limit') ?? '5');
    const limit = Number.isFinite(limitRaw) ? Math.min(15, Math.max(1, Math.floor(limitRaw))) : 5;

    if (!user || !USER_RE.test(user)) {
        return NextResponse.json({ error: 'Invalid user' }, { status: 400 });
    }

    try {
        const res = await fetch(
            `https://api.github.com/users/${encodeURIComponent(user)}/events/public?per_page=30`,
            {
                headers: ghHeaders(),
                next: { revalidate: 180 },
            }
        );

        if (res.status === 404) {
            return NextResponse.json({ commits: [] });
        }

        if (!res.ok) {
            return NextResponse.json(
                { error: 'Could not load GitHub activity', commits: [] },
                { status: 502 }
            );
        }

        const events = (await res.json()) as GhEvent[];
        if (!Array.isArray(events)) {
            return NextResponse.json({ error: 'Unexpected response', commits: [] }, { status: 502 });
        }

        const seen = new Set<string>();
        const commits: GithubCommitItem[] = [];

        for (const ev of events) {
            if (ev.type !== 'PushEvent' || !ev.payload?.commits?.length) continue;
            const repo = ev.repo?.name ?? '';
            const date = ev.created_at;
            for (const c of ev.payload.commits) {
                if (!c?.sha || seen.has(c.sha)) continue;
                seen.add(c.sha);
                const firstLine = (c.message ?? '').split('\n')[0]?.trim() ?? '';
                let webUrl = c.url ?? '';
                if (webUrl.includes('api.github.com/repos/')) {
                    webUrl = webUrl
                        .replace('https://api.github.com/repos/', 'https://github.com/')
                        .replace('/commits/', '/commit/');
                }

                commits.push({
                    sha: c.sha.slice(0, 7),
                    message: firstLine,
                    repo,
                    url: webUrl,
                    date,
                });
                if (commits.length >= limit) break;
            }
            if (commits.length >= limit) break;
        }

        return NextResponse.json({ commits });
    } catch (e) {
        const msg = e instanceof Error ? e.message : 'Fetch failed';
        return NextResponse.json({ error: msg, commits: [] }, { status: 502 });
    }
}
