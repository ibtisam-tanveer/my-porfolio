'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/providers/LanguageProvider';

const COLS = 16;
const ROWS = 16;
const CELL = 20;
const CANVAS_W = COLS * CELL;
const CANVAS_H = ROWS * CELL;

type Pt = { x: number; y: number };

function randomFood(snake: Pt[]): Pt {
    const taken = new Set(snake.map((p) => `${p.x},${p.y}`));
    let p: Pt;
    let guard = 0;
    do {
        p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
        guard++;
    } while (taken.has(`${p.x},${p.y}`) && guard < 500);
    return p;
}

const KEY_TO_DIR: Partial<Record<string, Pt>> = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 },
    KeyW: { x: 0, y: -1 },
    KeyS: { x: 0, y: 1 },
    KeyA: { x: -1, y: 0 },
    KeyD: { x: 1, y: 0 },
};

export default function SnakeApp() {
    const { t } = useLanguage();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [overlay, setOverlay] = useState<'start' | 'paused' | 'dead' | null>('start');
    const overlayRef = useRef(overlay);
    overlayRef.current = overlay;

    const scoreRef = useRef(0);
    const gameRef = useRef({
        snake: [] as Pt[],
        dir: { x: 1, y: 0 } as Pt,
        pendingDir: { x: 1, y: 0 } as Pt,
        food: { x: 8, y: 8 } as Pt,
        status: 'idle' as 'idle' | 'playing' | 'paused' | 'dead',
    });
    const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const touchStart = useRef<{ x: number; y: number } | null>(null);

    useEffect(() => {
        try {
            const h = localStorage.getItem('portfolio-snake-hi');
            if (h) setHighScore(parseInt(h, 10) || 0);
        } catch {
            /* ignore */
        }
    }, []);

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const g = gameRef.current;

        ctx.fillStyle = '#f5f5f7';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        ctx.strokeStyle = '#e8e8ed';
        ctx.lineWidth = 1;
        for (let i = 0; i <= COLS; i++) {
            ctx.beginPath();
            ctx.moveTo(i * CELL, 0);
            ctx.lineTo(i * CELL, CANVAS_H);
            ctx.stroke();
        }
        for (let j = 0; j <= ROWS; j++) {
            ctx.beginPath();
            ctx.moveTo(0, j * CELL);
            ctx.lineTo(CANVAS_W, j * CELL);
            ctx.stroke();
        }

        const fx = g.food.x * CELL + CELL / 2;
        const fy = g.food.y * CELL + CELL / 2;
        ctx.fillStyle = '#FF3B30';
        ctx.beginPath();
        ctx.arc(fx, fy, CELL * 0.35, 0, Math.PI * 2);
        ctx.fill();

        g.snake.forEach((seg, i) => {
            const pad = i === 0 ? 2 : 3;
            ctx.fillStyle = i === 0 ? '#1f7a34' : '#34C759';
            ctx.fillRect(seg.x * CELL + pad, seg.y * CELL + pad, CELL - pad * 2, CELL - pad * 2);
        });
    }, []);

    const stopTicking = useCallback(() => {
        if (tickRef.current) clearInterval(tickRef.current);
        tickRef.current = null;
    }, []);

    const endGame = useCallback(() => {
        const g = gameRef.current;
        g.status = 'dead';
        stopTicking();
        setOverlay('dead');
        const s = scoreRef.current;
        setHighScore((h) => {
            const nh = Math.max(h, s);
            try {
                localStorage.setItem('portfolio-snake-hi', String(nh));
            } catch {
                /* ignore */
            }
            return nh;
        });
    }, [stopTicking]);

    const tick = useCallback(() => {
        const g = gameRef.current;
        if (g.status !== 'playing') return;

        const pd = g.pendingDir;
        if (!(pd.x === -g.dir.x && pd.y === -g.dir.y)) {
            g.dir = { ...pd };
        }

        const head = g.snake[0];
        const nx = head.x + g.dir.x;
        const ny = head.y + g.dir.y;

        if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) {
            endGame();
            return;
        }

        const ate = nx === g.food.x && ny === g.food.y;
        const bodyCheck = g.snake.slice(0, ate ? undefined : -1);
        if (bodyCheck.some((s) => s.x === nx && s.y === ny)) {
            endGame();
            return;
        }

        g.snake.unshift({ x: nx, y: ny });
        if (!ate) {
            g.snake.pop();
        } else {
            scoreRef.current += 10;
            setScore(scoreRef.current);
            g.food = randomFood(g.snake);
        }

        draw();
    }, [draw, endGame]);

    const startTicking = useCallback(() => {
        stopTicking();
        const reduced =
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const ms = reduced ? 220 : 115;
        tickRef.current = setInterval(tick, ms);
    }, [stopTicking, tick]);

    const resetAndRun = useCallback(
        (initialDir: Pt) => {
            const g = gameRef.current;
            stopTicking();
            const mid = Math.floor(ROWS / 2);
            g.snake = [
                { x: 5, y: mid },
                { x: 4, y: mid },
                { x: 3, y: mid },
            ];
            g.dir = { ...initialDir };
            g.pendingDir = { ...initialDir };
            g.food = randomFood(g.snake);
            g.status = 'playing';
            scoreRef.current = 0;
            setScore(0);
            setOverlay(null);
            draw();
            startTicking();
        },
        [draw, startTicking, stopTicking]
    );

    const applyDir = useCallback(
        (nd: Pt) => {
            const g = gameRef.current;
            if (g.status === 'dead') return;

            if (overlayRef.current === 'start' || g.status === 'idle') {
                resetAndRun(nd);
                return;
            }

            if (g.status === 'paused') return;

            if (g.status === 'playing') {
                g.pendingDir = nd;
            }
        },
        [resetAndRun]
    );

    const togglePause = useCallback(() => {
        const g = gameRef.current;
        if (g.status === 'playing') {
            g.status = 'paused';
            setOverlay('paused');
            return;
        }
        if (g.status === 'paused') {
            g.status = 'playing';
            setOverlay(null);
        }
    }, []);

    const onKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.code === 'Space') {
                e.preventDefault();
                const g = gameRef.current;
                if (overlayRef.current === 'start' || g.status === 'idle') {
                    resetAndRun({ x: 1, y: 0 });
                    return;
                }
                if (g.status === 'playing' || g.status === 'paused') {
                    togglePause();
                }
                return;
            }

            const nd = KEY_TO_DIR[e.code];
            if (!nd) return;
            e.preventDefault();
            applyDir(nd);
        },
        [applyDir, resetAndRun, togglePause]
    );

    useEffect(() => {
        draw();
    }, [draw]);

    useEffect(() => {
        return () => stopTicking();
    }, [stopTicking]);

    const onTouchStart = (e: React.TouchEvent) => {
        const x = e.touches[0]?.clientX;
        const y = e.touches[0]?.clientY;
        if (x === undefined || y === undefined) return;
        touchStart.current = { x, y };
    };

    const onTouchEnd = (e: React.TouchEvent) => {
        if (!touchStart.current) return;
        const t = e.changedTouches[0];
        if (!t) return;
        const dx = t.clientX - touchStart.current.x;
        const dy = t.clientY - touchStart.current.y;
        touchStart.current = null;

        if (Math.abs(dx) < 28 && Math.abs(dy) < 28) {
            if (overlayRef.current === 'start') {
                resetAndRun({ x: 1, y: 0 });
            }
            return;
        }

        if (Math.abs(dx) > Math.abs(dy)) {
            applyDir(dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 });
        } else {
            applyDir(dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 });
        }
    };

    return (
        <div
            role="application"
            aria-label={t.dock.snake}
            tabIndex={0}
            className="relative flex h-full min-h-0 flex-col bg-[#fafafa] outline-none"
            onMouseDown={(e) => {
                if (e.button === 0) (e.currentTarget as HTMLElement).focus();
            }}
            onKeyDown={onKeyDown}
        >
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-3 py-2">
                <div className="flex gap-3 text-xs text-gray-600 sm:text-sm">
                    <span>
                        <span className="font-medium text-gray-500">{t.snakeGame.score}</span>{' '}
                        <span className="tabular-nums font-semibold text-gray-900">{score}</span>
                    </span>
                    <span>
                        <span className="font-medium text-gray-500">{t.snakeGame.best}</span>{' '}
                        <span className="tabular-nums font-semibold text-gray-900">{highScore}</span>
                    </span>
                </div>
                <button
                    type="button"
                    onClick={() => {
                        stopTicking();
                        gameRef.current.status = 'idle';
                        setOverlay('start');
                        scoreRef.current = 0;
                        setScore(0);
                        gameRef.current.snake = [];
                        draw();
                    }}
                    className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 sm:text-sm"
                >
                    {t.snakeGame.newGame}
                </button>
            </div>

            <div className="flex flex-1 items-center justify-center overflow-hidden p-3 sm:p-4">
                <div
                    className="relative rounded-lg shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]"
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                >
                    <canvas
                        ref={canvasRef}
                        width={CANVAS_W}
                        height={CANVAS_H}
                        className="block rounded-lg bg-[#f5f5f7]"
                        aria-hidden
                    />
                    {overlay ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-black/45 px-4 text-center backdrop-blur-[2px]">
                            {overlay === 'start' ? (
                                <>
                                    <p className="text-sm font-semibold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
                                        {t.snakeGame.tapOrKeys}
                                    </p>
                                    <p className="max-w-[240px] text-xs text-white/90 [text-shadow:0_1px_2px_rgba(0,0,0,0.7)]">
                                        {t.snakeGame.hint}
                                    </p>
                                </>
                            ) : null}
                            {overlay === 'paused' ? (
                                <p className="text-sm font-semibold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
                                    {t.snakeGame.paused}
                                </p>
                            ) : null}
                            {overlay === 'dead' ? (
                                <>
                                    <p className="text-sm font-semibold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.8)]">
                                        {t.snakeGame.gameOver}
                                    </p>
                                    <p className="text-xs text-white/90">
                                        {t.snakeGame.score}: {score}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => resetAndRun({ x: 1, y: 0 })}
                                        className="rounded-lg bg-[#007AFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0066d6]"
                                    >
                                        {t.snakeGame.playAgain}
                                    </button>
                                </>
                            ) : null}
                            {overlay === 'paused' ? (
                                <button
                                    type="button"
                                    onClick={togglePause}
                                    className="rounded-lg bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-white"
                                >
                                    {t.snakeGame.resume}
                                </button>
                            ) : null}
                        </div>
                    ) : null}
                </div>
            </div>

            <p className="shrink-0 border-t border-gray-200 bg-white px-3 py-2 text-center text-[10px] text-gray-500 sm:text-xs">
                {t.snakeGame.footer}
            </p>
        </div>
    );
}
