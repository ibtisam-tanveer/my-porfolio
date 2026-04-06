/**
 * Canonical site URL for metadata (Open Graph, canonical links).
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://yoursite.com).
 */
export function getSiteUrl(): URL {
    const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    if (fromEnv) {
        try {
            return new URL(fromEnv.endsWith('/') ? fromEnv.slice(0, -1) : fromEnv);
        } catch {
            /* fall through */
        }
    }
    if (process.env.VERCEL_URL) {
        return new URL(`https://${process.env.VERCEL_URL}`);
    }
    return new URL('http://localhost:3000');
}

export const siteTitle = 'Muhammad Ibtisam Tanveer | Frontend Software Engineer';

export const siteDescription =
    'Interactive macOS-style portfolio — Next.js, React, TypeScript. Projects, CV, booking, and contact.';
