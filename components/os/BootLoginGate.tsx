'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Lock, ShieldCheck, Terminal } from 'lucide-react';

type Phase = 'boot' | 'lock' | 'login' | 'unlocked';

/** Session-only: new tab/session shows boot/lock until login again. */
const SESSION_KEY = 'portfolio:session-unlocked';
/** Legacy key from older builds — cleared on mount so lock screen is visible again. */
const LEGACY_STORAGE_KEY = 'portfolio:unlocked';

export const LOCK_SCREEN_EVENT = 'portfolio:lock-screen';

// Special password is checked via hash (client-side obfuscation).
// SHA-256("klea") in hex:
const SECRET_PASSWORD_SHA256 = '1e4a8e22b2e2c67d195e9b94820144a7980a23559e815cd26da1321620380052';

const SECRET_TERMINAL_LINES = [
    '╔════════════════════════════════════════════╗',
    '║            VIP ACCESS · KLEA               ║',
    '╚════════════════════════════════════════════╝',
    '             /\\_/\\    🌸',
    '            ( o.o )  for KLEA',
    '             > ^ <',
    '',
    '[sys] host: portfolio.local',
    '[sys] kernel: friendship-1.0.0-stable',
    '[sys] uptime: good vibes only',
    '[secure] establishing session…',
    '[secure] verifying keychain…',
    '[secure] decrypting profile…',
    '[hash] 0x7f3a…c9e1 ✓',
    '[ok] identity confirmed: klea',
    '[note] you’re doing great today.',
    '[note] you are amazing.',
    '[note] proud of you — keep going.',
    '[note] you’re stronger than you think.',
    '[note] keep shining.',
    '[net] ping friendship.local → 1ms (ok)',
    '[tip] you are smart — thanks for showing up.',
    '[ok] access granted',
] as const;

const SECRET_CHAR_MS = 11;

function terminalLineClass(line: string) {
    if (line.startsWith('[ok]')) return 'text-emerald-300/95';
    if (line.startsWith('[tip]')) return 'text-sky-200/90';
    if (line.startsWith('[note]')) return 'text-amber-200/90';
    if (line.startsWith('[secure]')) return 'text-cyan-200/85';
    if (line.startsWith('[sys]')) return 'text-white/70';
    if (line.startsWith('[hash]')) return 'text-emerald-400/60';
    if (line.startsWith('[net]')) return 'text-emerald-200/80';
    if (line.startsWith('╔') || line.startsWith('║') || line.startsWith('╚')) return 'text-emerald-300/90';
    return 'text-emerald-200/90';
}

async function sha256Hex(input: string) {
    const data = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
}

function formatTime(d: Date) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(d: Date) {
    return d.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function BootLoginGate({ children }: { children: React.ReactNode }) {
    const [phase, setPhase] = useState<Phase>('boot');
    const [now, setNow] = useState(() => new Date());
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [secretMode, setSecretMode] = useState(false);
    const [typedLines, setTypedLines] = useState<string[]>([]);
    const [typingLine, setTypingLine] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const unlockTimerRef = useRef<number | null>(null);
    const typingIntervalRef = useRef<number | null>(null);
    const finishOnceRef = useRef(false);

    useLayoutEffect(() => {
        try {
            localStorage.removeItem(LEGACY_STORAGE_KEY);
        } catch {
            // ignore
        }
        try {
            if (sessionStorage.getItem(SESSION_KEY) === '1') {
                setPhase('unlocked');
                return;
            }
        } catch {
            // ignore
        }
        const t = window.setTimeout(() => setPhase('lock'), 850);
        return () => window.clearTimeout(t);
    }, []);

    useEffect(() => {
        const onLock = () => {
            try {
                sessionStorage.removeItem(SESSION_KEY);
            } catch {
                // ignore
            }
            if (unlockTimerRef.current) {
                clearTimeout(unlockTimerRef.current);
                unlockTimerRef.current = null;
            }
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
                typingIntervalRef.current = null;
            }
            setSecretMode(false);
            setTypedLines([]);
            setTypingLine('');
            setPassword('');
            setError(null);
            setPhase('lock');
        };
        window.addEventListener(LOCK_SCREEN_EVENT, onLock);
        return () => window.removeEventListener(LOCK_SCREEN_EVENT, onLock);
    }, []);

    useEffect(() => {
        return () => {
            if (unlockTimerRef.current) clearTimeout(unlockTimerRef.current);
            if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
        };
    }, []);

    useEffect(() => {
        if (!secretMode) {
            setTypedLines([]);
            setTypingLine('');
            finishOnceRef.current = false;
            return;
        }

        finishOnceRef.current = false;

        const lines = [...SECRET_TERMINAL_LINES];
        let lineIdx = 0;
        let charIdx = 0;
        const acc: string[] = [];

        const finish = () => {
            if (finishOnceRef.current) return;
            finishOnceRef.current = true;
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
                typingIntervalRef.current = null;
            }
            unlockTimerRef.current = window.setTimeout(() => {
                setSecretMode(false);
                setPhase('unlocked');
                unlockTimerRef.current = null;
            }, 950);
        };

        const tick = () => {
            if (lineIdx >= lines.length) {
                finish();
                return;
            }
            const line = lines[lineIdx];
            if (line === '') {
                acc.push('');
                lineIdx += 1;
                charIdx = 0;
                setTypedLines([...acc]);
                setTypingLine('');
                return;
            }
            if (charIdx < line.length) {
                charIdx += 1;
                setTypingLine(line.slice(0, charIdx));
                return;
            }
            acc.push(line);
            lineIdx += 1;
            charIdx = 0;
            setTypedLines([...acc]);
            setTypingLine('');
        };

        setTypedLines([]);
        setTypingLine('');
        typingIntervalRef.current = window.setInterval(tick, SECRET_CHAR_MS);

        return () => {
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
                typingIntervalRef.current = null;
            }
        };
    }, [secretMode]);

    useEffect(() => {
        const id = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(id);
    }, []);

    useEffect(() => {
        if (phase !== 'login') return;
        const t = window.setTimeout(() => inputRef.current?.focus(), 50);
        return () => window.clearTimeout(t);
    }, [phase]);

    const unlock = async () => {
        const entered = password.trim();
        if (!entered) {
            setError('Enter password');
            return;
        }
        setError(null);
        try {
            sessionStorage.setItem(SESSION_KEY, '1');
        } catch {
            // ignore
        }

        try {
            const hash = await sha256Hex(entered.toLowerCase());
            if (hash === SECRET_PASSWORD_SHA256) {
                setSecretMode(true);
                setPassword('');
                return;
            }
        } catch {
            // if crypto is unavailable, just skip secret mode
        }

        setPhase('unlocked');
    };

    return (
        <div className="relative h-screen w-screen overflow-hidden">
            {children}

            <AnimatePresence>
                {phase !== 'unlocked' ? (
                    <motion.div
                        key="gate"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="fixed inset-0 z-[600] bg-black"
                        onClick={() => {
                            if (phase === 'lock') setPhase('login');
                        }}
                    >
                        <div
                            className="absolute inset-0"
                            style={{
                                backgroundImage:
                                    'url(https://4kwallpapers.com/images/wallpapers/macos-monterey-stock-blue-dark-mode-layers-5k-4480x2520-5895.jpg)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />
                        <div className="absolute inset-0 bg-black/45" />

                        {phase === 'boot' ? (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className="relative z-10 grid h-full w-full place-items-center"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-400" />
                                    <div className="mt-4 h-1.5 w-44 overflow-hidden rounded-full bg-white/10">
                                        <motion.div
                                            className="h-full w-1/2 rounded-full bg-white/60"
                                            initial={{ x: '-100%' }}
                                            animate={{ x: '200%' }}
                                            transition={{ duration: 0.85, ease: 'easeInOut' }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ) : null}

                        {phase === 'lock' ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                                className="relative z-10 flex h-full w-full flex-col items-center justify-center text-center text-white"
                            >
                                <div className="text-6xl font-semibold tracking-tight">{formatTime(now)}</div>
                                <div className="mt-2 text-base text-white/75">{formatDate(now)}</div>
                                <div className="mt-8 text-xs text-white/70">Click to log in</div>
                            </motion.div>
                        ) : null}

                        {phase === 'login' ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    scale: 1,
                                    x: error ? [0, -8, 8, -6, 6, 0] : 0,
                                }}
                                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                                className="relative z-10 grid h-full w-full place-items-center px-6"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-2xl shadow-2xl shadow-black/40">
                                    <div className="flex flex-col items-center">
                                        <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-400" />
                                        <div className="mt-3 text-sm font-semibold text-white">Muhammad Ibtisam Tanveer</div>
                                        <div className="mt-5 flex w-full items-center gap-2">
                                            <div className="flex-1 rounded-2xl border border-white/15 bg-black/25 px-4 py-2.5">
                                                <input
                                                    ref={inputRef}
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => {
                                                        setPassword(e.target.value);
                                                        setError(null);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') void unlock();
                                                        if (e.key === 'Escape') setPhase('lock');
                                                    }}
                                                    placeholder="Password"
                                                    className="w-full bg-transparent text-sm text-white placeholder:text-white/55 outline-none"
                                                    autoComplete="current-password"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => void unlock()}
                                                className="grid h-10 w-10 place-items-center rounded-2xl border border-white/15 bg-white/10 text-white hover:bg-white/15 transition"
                                                aria-label="Log in"
                                            >
                                                <ArrowRight className="h-4 w-4" aria-hidden />
                                            </button>
                                        </div>
                                        {error ? (
                                            <div className="mt-3 text-xs text-rose-200/95">{error}</div>
                                        ) : (
                                            <div className="mt-3 inline-flex items-center gap-2 text-[11px] text-white/60">
                                                <Lock className="h-3.5 w-3.5" aria-hidden />
                                                Demo login: type anything and press Enter
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ) : null}
                    </motion.div>
                ) : null}
            </AnimatePresence>

            <AnimatePresence>
                {secretMode ? (
                    <motion.div
                        key="klea-celebration"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[700]"
                    >
                        <div className="absolute inset-0 bg-black/50" />

                        {/* subtle scanlines */}
                        <div
                            className="pointer-events-none absolute inset-0 opacity-[0.18]"
                            style={{
                                backgroundImage:
                                    'repeating-linear-gradient(to bottom, rgba(255,255,255,0.18), rgba(255,255,255,0.18) 1px, rgba(0,0,0,0) 3px, rgba(0,0,0,0) 6px)',
                            }}
                            aria-hidden
                        />

                        <div className="absolute inset-0 flex items-center justify-center p-6" role="dialog" aria-label="Secret unlock">
                            <motion.div
                                initial={{ scale: 0.96, opacity: 0, y: 10 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                                className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-emerald-300/25 bg-black/65 shadow-2xl shadow-emerald-900/20 backdrop-blur-xl"
                            >
                                <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
                                    <div className="flex items-center gap-2 text-xs text-white/70">
                                        <Terminal className="h-4 w-4 text-emerald-300/90" aria-hidden />
                                        <span className="font-mono">secure-login</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-white/60">
                                        <ShieldCheck className="h-4 w-4 text-emerald-300/80" aria-hidden />
                                        <span className="font-mono">TLS</span>
                                    </div>
                                </div>

                                <div className="max-h-[min(52vh,420px)] overflow-y-auto px-5 py-4 font-mono text-[12px] leading-relaxed sm:text-[13px]">
                                    {typedLines.map((line, i) => (
                                        <div key={i} className={`whitespace-pre ${terminalLineClass(line)}`}>
                                            {line.length ? line : '\u00a0'}
                                        </div>
                                    ))}
                                    {typingLine ? (
                                        <div className={`whitespace-pre ${terminalLineClass(typingLine)}`}>
                                            {typingLine}
                                            <motion.span
                                                className="ml-0.5 inline-block h-[1.1em] w-[7px] translate-y-[2px] bg-emerald-200/90 align-middle"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: [0, 1, 0] }}
                                                transition={{ duration: 0.75, repeat: Infinity, ease: 'easeInOut' }}
                                                aria-hidden
                                            />
                                        </div>
                                    ) : null}
                                    {typedLines.length === SECRET_TERMINAL_LINES.length && !typingLine ? (
                                        <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3 text-emerald-200/90">
                                            <span className="text-white/50">$</span>
                                            <span className="text-white/80">welcome</span>
                                            <span className="text-emerald-200/95">klea</span>
                                            <motion.span
                                                className="ml-1 inline-block h-4 w-[8px] bg-emerald-200/85"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: [0, 1, 0] }}
                                                transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
                                                aria-hidden
                                            />
                                        </div>
                                    ) : null}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}
