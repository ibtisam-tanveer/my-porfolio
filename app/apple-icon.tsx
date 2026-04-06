import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };

export const contentType = 'image/png';

export default function AppleIcon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #007AFF 0%, #34C759 100%)',
                    borderRadius: 40,
                }}
            >
                <span
                    style={{
                        fontSize: 88,
                        fontWeight: 700,
                        color: '#ffffff',
                        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                    }}
                >
                    IT
                </span>
            </div>
        ),
        { ...size }
    );
}
