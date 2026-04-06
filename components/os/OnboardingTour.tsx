'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type Step = {
    id: string;
    selector: string;
    title: string;
    body: string;
};

const STORAGE_KEY = 'portfolio:onboarding_done_v1';

/** Flip to `true` when you want the first-visit tutorial back. */
const ONBOARDING_ENABLED = false;

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

function intersects(a: { left: number; top: number; width: number; height: number }, b: { left: number; top: number; width: number; height: number }) {
    return !(
        a.left + a.width <= b.left ||
        b.left + b.width <= a.left ||
        a.top + a.height <= b.top ||
        b.top + b.height <= a.top
    );
}

function getRect(el: Element): DOMRect | null {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    // If element is display:none or not laid out
    if (!Number.isFinite(r.width) || !Number.isFinite(r.height) || (r.width === 0 && r.height === 0)) return null;
    return r;
}

export default function OnboardingTour() {
    const steps: Step[] = useMemo(
        () => [
            {
                id: 'menubar',
                selector: '[data-tour="menubar"]',
                title: 'Menu bar',
                body: 'Change language, brightness, and open quick tools from the top bar.',
            },
            {
                id: 'widgets',
                selector: '[data-tour="widgets"]',
                title: 'Widgets',
                body: 'Quick actions: book a call, music, and recent GitHub commits.',
            },
            {
                id: 'dock',
                selector: '[data-tour="dock"]',
                title: 'Dock',
                body: 'Open apps like Finder, Projects, Terminal, and the new Streaming view.',
            },
            {
                id: 'assistant',
                selector: '[data-tour="assistant-button"]',
                title: 'Voice assistant',
                body: 'Ask questions about the portfolio (RAG) using the mic or text input.',
            },
            {
                id: 'spotlight',
                selector: '[data-tour="spotlight-button"]',
                title: 'Spotlight search',
                body: 'Press the search icon to instantly jump to apps and links.',
            },
        ],
        []
    );

    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const [rect, setRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        if (!ONBOARDING_ENABLED) return;
        try {
            const done = localStorage.getItem(STORAGE_KEY) === '1';
            if (!done) setOpen(true);
        } catch {
            // ignore
        }
    }, []);

    const close = useCallback((markDone: boolean) => {
        if (markDone) {
            try {
                localStorage.setItem(STORAGE_KEY, '1');
            } catch {
                // ignore
            }
        }
        setOpen(false);
    }, []);

    const step = open ? steps[index] : null;

    const recompute = useCallback(() => {
        if (!step) return;
        const el = document.querySelector(step.selector);
        const r = el ? getRect(el) : null;
        setRect(r);
    }, [step]);

    // Keep highlight aligned on resize/scroll and while layout settles.
    useEffect(() => {
        if (!open) return;
        recompute();
        const onResize = () => recompute();
        window.addEventListener('resize', onResize);
        window.addEventListener('scroll', onResize, { passive: true });
        const raf = window.requestAnimationFrame(() => recompute());
        return () => {
            window.removeEventListener('resize', onResize);
            window.removeEventListener('scroll', onResize);
            window.cancelAnimationFrame(raf);
        };
    }, [open, recompute]);

    // If a selector isn't found, skip forward automatically.
    useEffect(() => {
        if (!open || !step) return;
        const el = document.querySelector(step.selector);
        if (!el) {
            setIndex((i) => (i + 1 < steps.length ? i + 1 : i));
        }
    }, [open, step, steps.length]);

    if (!open || !step) return null;

    const pad = 10;
    const r = rect;
    const highlight = r
        ? {
              left: Math.max(8, r.left - pad),
              top: Math.max(8, r.top - pad),
              width: Math.max(24, r.width + pad * 2),
              height: Math.max(24, r.height + pad * 2),
          }
        : null;

    const tooltipW = 320;
    const tooltipH = 170;
    const gutter = 14;

    // Prefer positions that don't cover the highlighted element.
    const candidates = highlight
        ? ([
              // Right
              {
                  left: clamp(highlight.left + highlight.width + gutter, 12, window.innerWidth - tooltipW - 12),
                  top: clamp(highlight.top, 12, window.innerHeight - tooltipH - 12),
              },
              // Left
              {
                  left: clamp(highlight.left - tooltipW - gutter, 12, window.innerWidth - tooltipW - 12),
                  top: clamp(highlight.top, 12, window.innerHeight - tooltipH - 12),
              },
              // Below
              {
                  left: clamp(highlight.left, 12, window.innerWidth - tooltipW - 12),
                  top: clamp(highlight.top + highlight.height + gutter, 12, window.innerHeight - tooltipH - 12),
              },
              // Above
              {
                  left: clamp(highlight.left, 12, window.innerWidth - tooltipW - 12),
                  top: clamp(highlight.top - tooltipH - gutter, 12, window.innerHeight - tooltipH - 12),
              },
          ] as const)
        : null;

    const tooltipPos = (() => {
        if (!highlight || !candidates) return { left: 12, top: 12 };
        const tooltipBox = (p: { left: number; top: number }) => ({
            left: p.left,
            top: p.top,
            width: tooltipW,
            height: tooltipH,
        });
        const hit = candidates.find((p) => !intersects(highlight, tooltipBox(p)));
        return hit ?? candidates[2]; // default to "below"
    })();

    return (
        <div className="fixed inset-0 z-[999]">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />

            {/* Highlight ring */}
            {highlight ? (
                <div
                    className="absolute rounded-2xl ring-2 ring-white/80 shadow-[0_0_0_6px_rgba(0,0,0,0.35)]"
                    style={{
                        left: highlight.left,
                        top: highlight.top,
                        width: highlight.width,
                        height: highlight.height,
                        pointerEvents: 'none',
                    }}
                />
            ) : null}

            {/* Tooltip */}
            <div
                className="absolute w-[320px] rounded-2xl border border-white/15 bg-black/80 p-4 text-white shadow-2xl backdrop-blur-xl"
                style={{ left: tooltipPos.left, top: tooltipPos.top }}
                role="dialog"
                aria-label="Onboarding"
            >
                <div className="text-xs font-semibold text-white/70">
                    Step {index + 1} of {steps.length}
                </div>
                <div className="mt-1 text-base font-bold">{step.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{step.body}</p>

                <div className="mt-4 flex items-center justify-between gap-2">
                    <button
                        type="button"
                        onClick={() => close(true)}
                        className="text-xs font-semibold text-white/70 hover:text-white"
                    >
                        Skip
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setIndex((i) => Math.max(0, i - 1))}
                            disabled={index === 0}
                            className="rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Back
                        </button>
                        <button
                            type="button"
                            onClick={() => (index + 1 >= steps.length ? close(true) : setIndex((i) => i + 1))}
                            className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-black transition hover:bg-white/90"
                        >
                            {index + 1 >= steps.length ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

