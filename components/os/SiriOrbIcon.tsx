"use client";

/**
 * Original gradient orb inspired by voice-assistant aesthetics (not Apple assets).
 * S-curve / figure-8 accent reads as a soft “infinity” swirl at larger sizes.
 */
export default function SiriOrbIcon({
    size = 14,
    className = "",
    emphasis = false,
}: {
    size?: number;
    className?: string;
    emphasis?: boolean;
}) {
    const s = size;
    const id = `siri-orb-${s}-${emphasis ? "e" : "n"}`;
    return (
        <svg
            width={s}
            height={s}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-hidden
        >
            <defs>
                <linearGradient id={`${id}-g`} x1="4" y1="4" x2="20" y2="20">
                    <stop offset="0%" stopColor="#ff6b9d" />
                    <stop offset="35%" stopColor="#ff8c42" />
                    <stop offset="70%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
                <radialGradient id={`${id}-r`} cx="40%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                    <stop offset="45%" stopColor="#fda4af" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.15" />
                </radialGradient>
                <filter id={`${id}-blur`} x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="1.2" result="b" />
                    <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <circle cx="12" cy="12" r="10" fill={`url(#${id}-g)`} opacity={emphasis ? 1 : 0.92} />
            <circle cx="12" cy="12" r="8.5" fill={`url(#${id}-r)`} />
            {/* Soft infinity / S swirl */}
            <path
                d="M8.5 12c0-1.8 1.2-3.2 2.8-3.2 1.1 0 1.9.7 2.2 1.6.3-.9 1.1-1.6 2.2-1.6 1.6 0 2.8 1.4 2.8 3.2s-1.2 3.2-2.8 3.2c-1.1 0-1.9-.7-2.2-1.6-.3.9-1.1 1.6-2.2 1.6-1.6 0-2.8-1.4-2.8-3.2z"
                fill="none"
                stroke="rgba(255,255,255,0.55)"
                strokeWidth="1.15"
                strokeLinecap="round"
                filter={emphasis ? `url(#${id}-blur)` : undefined}
            />
            <path
                d="M9.2 10.2c.6-.5 1.3-.8 2.1-.8 1.2 0 2.2.6 2.7 1.5M12 12.2c.5.9 1.5 1.5 2.7 1.5.8 0 1.5-.3 2.1-.8"
                fill="none"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="0.85"
                strokeLinecap="round"
            />
        </svg>
    );
}
