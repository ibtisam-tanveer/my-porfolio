'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mic, X, Loader2, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import type { Language } from '@/lib/i18n';
import SiriOrbIcon from '@/components/os/SiriOrbIcon';

export const OPEN_VOICE_ASSISTANT_EVENT = 'portfolio:open-voice-assistant';

const speechLocale: Record<Language, string> = {
    en: 'en-US',
    de: 'de-DE',
    ur: 'ur-PK',
};

function getSpeechRecognitionCtor(): (new () => SpeechRecognition) | null {
    if (typeof window === 'undefined') return null;
    return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

type Phase = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

export default function VoiceAssistant() {
    const { t, language } = useLanguage();
    const [open, setOpen] = useState(false);
    const [phase, setPhase] = useState<Phase>('idle');
    const [transcript, setTranscript] = useState('');
    const [answer, setAnswer] = useState('');
    const [typed, setTyped] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [voiceOn, setVoiceOn] = useState(true);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const finalBuffer = useRef('');
    const inputRef = useRef<HTMLInputElement>(null);

    const stopRecognition = useCallback(() => {
        try {
            recognitionRef.current?.stop();
        } catch {
            /* ignore */
        }
        recognitionRef.current = null;
    }, []);

    const stopSpeaking = useCallback(() => {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        setPhase((p) => (p === 'speaking' ? 'idle' : p));
    }, []);

    const speak = useCallback(
        (text: string) => {
            if (typeof window === 'undefined' || !window.speechSynthesis || !voiceOn) {
                setPhase('idle');
                return;
            }
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = speechLocale[language];
            u.rate = 1;
            u.onend = () => setPhase('idle');
            u.onerror = () => setPhase('idle');
            setPhase('speaking');
            window.speechSynthesis.speak(u);
        },
        [language, voiceOn]
    );

    const askRag = useCallback(
        async (q: string) => {
            const query = q.trim();
            if (!query) return;
            setErrorMsg('');
            setTranscript(query);
            setPhase('thinking');
            setAnswer('');
            try {
                const res = await fetch('/api/rag/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query }),
                });
                const data = (await res.json()) as { answer?: string; error?: string };
                if (!res.ok) {
                    throw new Error(data.error || res.statusText);
                }
                if (typeof data.answer !== 'string') {
                    throw new Error('Invalid response');
                }
                setAnswer(data.answer);
                if (voiceOn) {
                    speak(data.answer);
                } else {
                    setPhase('idle');
                }
            } catch (e) {
                const msg = e instanceof Error ? e.message : String(e);
                setErrorMsg(msg);
                setPhase('error');
            }
        },
        [speak, voiceOn]
    );

    const startListening = useCallback(() => {
        const Ctor = getSpeechRecognitionCtor();
        if (!Ctor) {
            setErrorMsg(t.assistant.notSupported);
            setPhase('error');
            return;
        }
        stopSpeaking();
        stopRecognition();
        finalBuffer.current = '';
        setTranscript('');
        setErrorMsg('');

        const r = new Ctor();
        recognitionRef.current = r;
        r.lang = speechLocale[language];
        r.interimResults = true;
        r.maxAlternatives = 1;
        r.continuous = false;

        r.onresult = (event: SpeechRecognitionEvent) => {
            let interim = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const piece = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalBuffer.current += piece;
                } else {
                    interim += piece;
                }
            }
            setTranscript(`${finalBuffer.current}${interim}`.trim());
        };

        r.onerror = (ev: SpeechRecognitionErrorEvent) => {
            if (ev.error === 'aborted' || ev.error === 'no-speech') {
                setPhase('idle');
                return;
            }
            setErrorMsg(ev.message || ev.error);
            setPhase('error');
        };

        r.onend = () => {
            recognitionRef.current = null;
            const q = finalBuffer.current.trim();
            finalBuffer.current = '';
            if (q) {
                void askRag(q);
            } else {
                setPhase('idle');
            }
        };

        try {
            setPhase('listening');
            r.start();
        } catch {
            setPhase('error');
            setErrorMsg(t.assistant.notSupported);
        }
    }, [askRag, language, stopRecognition, stopSpeaking, t.assistant]);

    useEffect(() => {
        const onOpen = () => setOpen(true);
        window.addEventListener(OPEN_VOICE_ASSISTANT_EVENT, onOpen);
        return () => window.removeEventListener(OPEN_VOICE_ASSISTANT_EVENT, onOpen);
    }, []);

    useEffect(() => {
        if (!open) return;
        const id = requestAnimationFrame(() => inputRef.current?.focus());
        return () => cancelAnimationFrame(id);
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    useEffect(() => {
        if (!open) {
            stopRecognition();
            stopSpeaking();
            setPhase('idle');
            setTranscript('');
            setAnswer('');
            setTyped('');
            setErrorMsg('');
        }
    }, [open, stopRecognition, stopSpeaking]);

    const close = () => {
        setOpen(false);
    };

    const submitTyped = () => {
        const q = typed.trim();
        if (!q) return;
        void askRag(q);
        setTyped('');
    };

    const voiceSupported = typeof window !== 'undefined' && !!getSpeechRecognitionCtor();

    const inputLocked =
        phase === 'listening' || phase === 'thinking' || phase === 'speaking';
    const inputDisplay =
        phase === 'thinking'
            ? t.assistant.thinking
            : phase === 'listening'
              ? transcript || t.assistant.listening
              : phase === 'speaking'
                ? t.assistant.speaking
                : typed;

    const showResultsPanel = Boolean(transcript || answer || errorMsg);

    return (
        <>
            <AnimatePresence>
                {open ? (
                    <motion.div
                        key="voice-assistant-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="fixed inset-0 z-[195]"
                    >
                        <button
                            type="button"
                            aria-label={t.assistant.close}
                            className="absolute inset-0 bg-black/35 backdrop-blur-[3px]"
                            onClick={close}
                        />
                        <div className="pointer-events-none relative z-10 flex flex-col items-center px-4 pt-12 sm:pt-14">
                            <motion.div
                                role="dialog"
                                aria-modal="true"
                                aria-label={t.assistant.title}
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                                className="pointer-events-auto flex w-full max-w-xl flex-col gap-3"
                            >
                                <div className="flex items-center gap-2 rounded-full border border-white/[0.14] bg-black/50 py-1.5 pl-2 pr-1 shadow-[0_12px_48px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                                    <motion.div
                                        className="flex shrink-0 items-center justify-center rounded-full p-0.5 ring-1 ring-white/20"
                                        animate={
                                            phase === 'listening' || phase === 'thinking'
                                                ? { scale: [1, 1.06, 1] }
                                                : { scale: 1 }
                                        }
                                        transition={
                                            phase === 'listening' || phase === 'thinking'
                                                ? { repeat: Infinity, duration: 1.15, ease: 'easeInOut' }
                                                : {}
                                        }
                                    >
                                        {phase === 'thinking' ? (
                                            <Loader2
                                                className="h-[26px] w-[26px] animate-spin text-white/90"
                                                strokeWidth={1.75}
                                            />
                                        ) : (
                                            <SiriOrbIcon size={26} emphasis={phase === 'listening'} />
                                        )}
                                    </motion.div>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={inputDisplay}
                                        readOnly={inputLocked}
                                        onChange={(e) => {
                                            if (!inputLocked) setTyped(e.target.value);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && phase === 'idle') submitTyped();
                                        }}
                                        placeholder={t.assistant.pillPlaceholder}
                                        className="min-h-[40px] min-w-0 flex-1 bg-transparent text-[15px] text-white/95 outline-none placeholder:text-white/45 read-only:cursor-default"
                                        aria-label={t.assistant.pillPlaceholder}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setVoiceOn((v) => {
                                                if (v) stopSpeaking();
                                                return !v;
                                            });
                                        }}
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/85 hover:bg-white/10"
                                        title={voiceOn ? t.assistant.voiceOff : t.assistant.voiceOn}
                                    >
                                        {voiceOn ? (
                                            <Volume2 size={18} strokeWidth={1.5} />
                                        ) : (
                                            <VolumeX size={18} strokeWidth={1.5} />
                                        )}
                                    </button>
                                    <motion.button
                                        type="button"
                                        onClick={startListening}
                                        disabled={!voiceSupported || phase === 'listening' || phase === 'thinking'}
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/90 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                                        title={t.assistant.tapMic}
                                        animate={
                                            phase === 'listening'
                                                ? { scale: [1, 1.08, 1] }
                                                : { scale: 1 }
                                        }
                                        transition={
                                            phase === 'listening'
                                                ? { repeat: Infinity, duration: 1.1, ease: 'easeInOut' }
                                                : {}
                                        }
                                    >
                                        <Mic size={19} strokeWidth={1.5} />
                                    </motion.button>
                                    <button
                                        type="button"
                                        onClick={close}
                                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/80 hover:bg-white/10"
                                        aria-label={t.assistant.close}
                                    >
                                        <X size={18} strokeWidth={1.5} />
                                    </button>
                                </div>

                                {!voiceSupported ? (
                                    <p className="text-center text-[12px] text-amber-200/90 [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">
                                        {t.assistant.notSupported}
                                    </p>
                                ) : null}

                                {showResultsPanel ? (
                                    <div className="rounded-[20px] border border-white/12 bg-black/45 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                                        <div className="space-y-3 text-[13px] leading-relaxed text-white/92 [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
                                            {transcript ? (
                                                <div>
                                                    <span className="text-[11px] font-medium uppercase tracking-wide text-white/50">
                                                        {t.assistant.yourQuestion}
                                                    </span>
                                                    <p className="mt-1">{transcript}</p>
                                                </div>
                                            ) : null}
                                            {answer ? (
                                                <div className="border-t border-white/10 pt-3">
                                                    <span className="text-[11px] font-medium uppercase tracking-wide text-white/50">
                                                        {t.assistant.answer}
                                                    </span>
                                                    <div className="mt-1 max-h-[min(46vh,240px)] overflow-y-auto [scrollbar-width:thin]">
                                                        {answer}
                                                    </div>
                                                </div>
                                            ) : null}
                                            {errorMsg ? (
                                                <div
                                                    role="alert"
                                                    className="rounded-xl border border-red-400/35 bg-red-950/40 px-3 py-2.5 text-red-100"
                                                >
                                                    {errorMsg}
                                                </div>
                                            ) : null}
                                        </div>
                                        <div className="mt-4 flex flex-wrap justify-center gap-2 border-t border-white/10 pt-3">
                                            {phase === 'speaking' ? (
                                                <button
                                                    type="button"
                                                    onClick={stopSpeaking}
                                                    className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[12px] font-medium text-white/95 hover:bg-white/15"
                                                >
                                                    {t.assistant.stopSpeaking}
                                                </button>
                                            ) : null}
                                            {answer ? (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setAnswer('');
                                                        setTranscript('');
                                                        setErrorMsg('');
                                                        setPhase('idle');
                                                        requestAnimationFrame(() => inputRef.current?.focus());
                                                    }}
                                                    className="rounded-full bg-white/15 px-4 py-1.5 text-[12px] font-medium text-white/95 hover:bg-white/22"
                                                >
                                                    {t.assistant.askAgain}
                                                </button>
                                            ) : null}
                                        </div>
                                    </div>
                                ) : null}
                            </motion.div>
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </>
    );
}
