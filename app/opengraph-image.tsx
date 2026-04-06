import { ImageResponse } from 'next/og';
import { OgImageContent } from '@/lib/og-image';

export const runtime = 'edge';

export const alt = 'Muhammad Ibtisam Tanveer — Frontend Software Engineer';

export const size = { width: 1200, height: 630 };

export const contentType = 'image/png';

export default function OpenGraphImage() {
    return new ImageResponse(<OgImageContent />, {
        ...size,
    });
}
