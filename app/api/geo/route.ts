import { NextResponse } from 'next/server';

function header(req: Request, name: string): string {
    return (req.headers.get(name) ?? '').trim();
}

/**
 * Returns best-effort geo hints for personalizing UI.
 *
 * - On Vercel, `x-vercel-ip-country` is commonly present for production traffic.
 * - On localhost/dev, these are usually missing → returns empty strings.
 */
export async function GET(req: Request) {
    const countryCode =
        header(req, 'x-vercel-ip-country') ||
        header(req, 'cf-ipcountry') ||
        header(req, 'x-country-code');

    const region =
        header(req, 'x-vercel-ip-country-region') ||
        header(req, 'x-vercel-ip-region') ||
        header(req, 'x-region');

    const city =
        header(req, 'x-vercel-ip-city') ||
        header(req, 'x-vercel-ip-city-name') ||
        header(req, 'x-city');

    return NextResponse.json(
        {
            countryCode: countryCode.toUpperCase(),
            region,
            city,
        },
        {
            headers: {
                // Safe to cache briefly; geo can change with IP/VPN.
                'Cache-Control': 'public, max-age=0, s-maxage=300',
            },
        }
    );
}

