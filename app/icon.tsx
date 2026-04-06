import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };

export const contentType = 'image/png';

export default function Icon() {
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
                    borderRadius: 8,
                }}
            >
                <span
                    style={{
                        fontSize: 18,
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
