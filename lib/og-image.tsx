/** Shared JSX for Open Graph / Twitter images (ImageResponse). */
export function OgImageContent() {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(145deg, #0c1624 0%, #152a42 45%, #0c1624 100%)',
                padding: 56,
                fontFamily: 'ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div
                    style={{
                        width: 72,
                        height: 72,
                        borderRadius: 18,
                        background: 'linear-gradient(135deg, #007AFF 0%, #34C759 100%)',
                        boxShadow: '0 8px 32px rgba(0,122,255,0.35)',
                    }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <span
                        style={{
                            fontSize: 48,
                            fontWeight: 700,
                            color: '#ffffff',
                            letterSpacing: '-0.02em',
                            lineHeight: 1.1,
                        }}
                    >
                        Muhammad Ibtisam Tanveer
                    </span>
                    <span style={{ fontSize: 28, color: 'rgba(255,255,255,0.82)', fontWeight: 500 }}>
                        Frontend Software Engineer
                    </span>
                </div>
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    borderTop: '1px solid rgba(255,255,255,0.12)',
                    paddingTop: 32,
                }}
            >
                <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.65)' }}>
                    Next.js · React · TypeScript · Portfolio
                </span>
                <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.45)' }}>ibtisam.tanveer22@gmail.com</span>
            </div>
        </div>
    );
}
