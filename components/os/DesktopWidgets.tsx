'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, ExternalLink, Github, Music2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/providers/LanguageProvider';
import { portfolioConfig } from '@/lib/portfolio-config';
import type { Language } from '@/lib/i18n';
import type { GithubCommitItem } from '@/lib/github-commits';

/** Keeps white/light text readable on the wallpaper and over white app windows (inherited by children). */
const glassLegibleText =
    '[text-shadow:0_1px_3px_rgba(0,0,0,0.92),0_0_20px_rgba(0,0,0,0.45)]';

const glassPanel =
    `rounded-2xl border border-white/25 bg-white/20 p-3 shadow-lg backdrop-blur-xl ring-1 ring-white/20 sm:p-4 ${glassLegibleText}`;

const iconOnGlass = 'shrink-0 text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.85)]';

type WidgetId = 'availability' | 'music' | 'commits';
type WidgetPos = { x: number; y: number };
type WidgetLayout = Record<WidgetId, WidgetPos>;
type WidgetVisibility = Record<WidgetId, boolean>;

const WIDGETS_STORAGE_KEY = 'portfolio:widgets:v2';
const WIDGETS_CHANGED_EVENT = 'portfolio:widgets-changed';
const WIDGETS_RESET_EVENT = 'portfolio:widgets-reset';

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

function getDefaultLayout(): WidgetLayout {
    const right = typeof window !== 'undefined' ? Math.max(12, window.innerWidth - 320) : 980;
    const top = 56;
    const gap = 14;
    return {
        availability: { x: right, y: top },
        music: { x: right, y: top + 162 + gap },
        commits: { x: right, y: top + 162 + gap + 150 + gap },
    };
}

function getDefaultVisibility(): WidgetVisibility {
    return { availability: true, music: true, commits: true };
}

function relativeCommitTime(iso: string, language: Language): string {
    const locale = language === 'de' ? 'de-DE' : language === 'ur' ? 'ur-PK' : 'en-US';
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    const deltaSec = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
    const ad = Math.abs(deltaSec);
    if (ad < 45) return rtf.format(0, 'second');
    if (ad < 3600) return rtf.format(Math.round(deltaSec / 60), 'minute');
    if (ad < 86400) return rtf.format(Math.round(deltaSec / 3600), 'hour');
    if (ad < 604800) return rtf.format(Math.round(deltaSec / 86400), 'day');
    if (ad < 2_592_000) return rtf.format(Math.round(deltaSec / 604800), 'week');
    return new Date(iso).toLocaleDateString(locale, { month: 'short', day: 'numeric' });
}

function truncateCommitMessage(s: string, max = 56): string {
    const t = s.trim();
    if (t.length <= max) return t;
    return `${t.slice(0, max - 1)}…`;
}

export default function DesktopWidgets() {
    const { t } = useLanguage();
    const [layout, setLayout] = useState<WidgetLayout>(() => getDefaultLayout());
    const [visible, setVisible] = useState<WidgetVisibility>(() => getDefaultVisibility());
    const widgetEls = useState<Record<WidgetId, HTMLDivElement | null>>({
        availability: null,
        music: null,
        commits: null,
    })[0];

    const commitsEnabled = Boolean(portfolioConfig.github.username);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(WIDGETS_STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw) as {
                layout?: Partial<WidgetLayout>;
                visible?: Partial<WidgetVisibility>;
            };
            if (parsed.layout) {
                setLayout((prev) => ({
                    availability: parsed.layout?.availability ?? prev.availability,
                    music: parsed.layout?.music ?? prev.music,
                    commits: parsed.layout?.commits ?? prev.commits,
                }));
            }
            if (parsed.visible) {
                setVisible((prev) => ({
                    availability: parsed.visible?.availability ?? prev.availability,
                    music: parsed.visible?.music ?? prev.music,
                    commits: parsed.visible?.commits ?? prev.commits,
                }));
            }
        } catch {
            // ignore
        }
    }, []);

    useEffect(() => {
        const onChanged = () => {
            try {
                const raw = localStorage.getItem(WIDGETS_STORAGE_KEY);
                if (!raw) return;
                const parsed = JSON.parse(raw) as {
                    visible?: Partial<WidgetVisibility>;
                    layout?: Partial<WidgetLayout>;
                };
                if (parsed.visible) {
                    setVisible((prev) => ({
                        availability: parsed.visible?.availability ?? prev.availability,
                        music: parsed.visible?.music ?? prev.music,
                        commits: parsed.visible?.commits ?? prev.commits,
                    }));
                }
                if (parsed.layout) {
                    setLayout((prev) => ({
                        availability: parsed.layout?.availability ?? prev.availability,
                        music: parsed.layout?.music ?? prev.music,
                        commits: parsed.layout?.commits ?? prev.commits,
                    }));
                }
            } catch {
                // ignore
            }
        };
        window.addEventListener(WIDGETS_CHANGED_EVENT, onChanged);
        return () => window.removeEventListener(WIDGETS_CHANGED_EVENT, onChanged);
    }, []);

    useEffect(() => {
        const onReset = () => {
            // Restore visibility defaults and compute a neat right-side stack based on real rendered sizes.
            const nextVisible: WidgetVisibility = {
                availability: true,
                music: true,
                commits: commitsEnabled,
            };
            setVisible(nextVisible);

            const compute = () => {
                const vw = window.innerWidth;
                let y = 56;
                const gap = 14;
                const nextLayout: WidgetLayout = { ...layout };

                (['availability', 'music', 'commits'] as WidgetId[]).forEach((id) => {
                    if (!nextVisible[id]) return;
                    const el = widgetEls[id];
                    const rect = el?.getBoundingClientRect();
                    const w = rect?.width ?? 288; // ~18rem
                    const h = rect?.height ?? 150;
                    const x = Math.max(12, vw - w - 16);
                    nextLayout[id] = { x, y };
                    y += h + gap;
                });

                setLayout(nextLayout);
                try {
                    localStorage.setItem(WIDGETS_STORAGE_KEY, JSON.stringify({ layout: nextLayout, visible: nextVisible }));
                } catch {
                    // ignore
                }
                window.dispatchEvent(new CustomEvent(WIDGETS_CHANGED_EVENT));
            };

            // Wait for the DOM to reflect visibility changes, then measure.
            requestAnimationFrame(() => requestAnimationFrame(compute));
        };

        window.addEventListener(WIDGETS_RESET_EVENT, onReset);
        return () => window.removeEventListener(WIDGETS_RESET_EVENT, onReset);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [commitsEnabled]);

    useEffect(() => {
        try {
            localStorage.setItem(WIDGETS_STORAGE_KEY, JSON.stringify({ layout, visible }));
        } catch {
            // ignore
        }
    }, [layout, visible]);

    return (
        <div data-tour="widgets" className="pointer-events-none absolute inset-0 z-20" aria-label={t.widgets.desktopWidgets}>
            {visible.availability ? (
                <DraggableWidget
                    id="availability"
                    title={t.widgets.availability}
                    pos={layout.availability}
                    onPosChange={(pos) => setLayout((prev) => ({ ...prev, availability: pos }))}
                    onRemove={() => setVisible((prev) => ({ ...prev, availability: false }))}
                    setEl={(el) => {
                        widgetEls.availability = el;
                    }}
                >
                    <AvailabilityCard />
                </DraggableWidget>
            ) : null}

            {visible.music ? (
                <DraggableWidget
                    id="music"
                    title={t.widgets.nowPlaying}
                    pos={layout.music}
                    onPosChange={(pos) => setLayout((prev) => ({ ...prev, music: pos }))}
                    onRemove={() => setVisible((prev) => ({ ...prev, music: false }))}
                    setEl={(el) => {
                        widgetEls.music = el;
                    }}
                >
                    <MusicCard t={t} />
                </DraggableWidget>
            ) : null}

            {commitsEnabled && visible.commits ? (
                <DraggableWidget
                    id="commits"
                    title={t.widgets.recentCommits}
                    pos={layout.commits}
                    onPosChange={(pos) => setLayout((prev) => ({ ...prev, commits: pos }))}
                    onRemove={() => setVisible((prev) => ({ ...prev, commits: false }))}
                    setEl={(el) => {
                        widgetEls.commits = el;
                    }}
                >
                    <GitCommitsCard />
                </DraggableWidget>
            ) : null}
        </div>
    );
}

function DraggableWidget({
    id,
    title,
    pos,
    onPosChange,
    onRemove,
    setEl,
    children,
}: {
    id: WidgetId;
    title: string;
    pos: WidgetPos;
    onPosChange: (pos: WidgetPos) => void;
    onRemove: () => void;
    setEl: (el: HTMLDivElement | null) => void;
    children: React.ReactNode;
}) {
    const [showControls, setShowControls] = useState(false);
    const holdTimerRef = useState<{ t: number | null }>({ t: null })[0];

    return (
        <motion.div
            data-widget-id={id}
            className="pointer-events-auto absolute w-[min(18rem,calc(100vw-1rem))] group"
            style={{ x: pos.x, y: pos.y }}
            ref={(el) => setEl(el)}
            drag
            dragMomentum={false}
            dragElastic={0.06}
            onDragEnd={(_, info) => {
                const vw = window.innerWidth;
                const vh = window.innerHeight;
                const nextX = clamp(pos.x + info.offset.x, 8, vw - 280);
                const nextY = clamp(pos.y + info.offset.y, 40, vh - 140);
                onPosChange({ x: nextX, y: nextY });
            }}
            onPointerDown={() => {
                // Mobile: press-and-hold to show controls.
                if (holdTimerRef.t) window.clearTimeout(holdTimerRef.t);
                holdTimerRef.t = window.setTimeout(() => setShowControls(true), 420);
            }}
            onPointerUp={() => {
                if (holdTimerRef.t) window.clearTimeout(holdTimerRef.t);
                holdTimerRef.t = null;
            }}
            onPointerCancel={() => {
                if (holdTimerRef.t) window.clearTimeout(holdTimerRef.t);
                holdTimerRef.t = null;
            }}
            onPointerMove={() => {
                // If user starts dragging, don't treat it as a long-press.
                if (holdTimerRef.t) {
                    window.clearTimeout(holdTimerRef.t);
                    holdTimerRef.t = null;
                }
            }}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
        >
            <div className="relative">
                <button
                    type="button"
                    onClick={onRemove}
                    aria-label={`Remove ${title} widget`}
                    className={`absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-xl border border-white/15 bg-black/25 text-white/85 backdrop-blur-md hover:bg-black/35 hover:text-white transition-opacity ${
                        showControls ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                >
                    <X className="h-4 w-4" aria-hidden />
                </button>
                {children}
            </div>
        </motion.div>
    );
}

function AvailabilityCard() {
    const { t, language } = useLanguage();
    const { timezone, status, bookingUrl } = portfolioConfig.availability;
    const [timeStr, setTimeStr] = useState('');

    useEffect(() => {
        const fmt = () => {
            const locale =
                language === 'de' ? 'de-DE' : language === 'ur' ? 'ur-PK' : 'en-US';
            setTimeStr(
                new Date().toLocaleTimeString(locale, {
                    timeZone: timezone,
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                })
            );
        };
        fmt();
        const id = setInterval(fmt, 30_000);
        return () => clearInterval(id);
    }, [language, timezone]);

    const tzLabel = timezone.replace(/_/g, ' ');

    return (
        <div className={glassPanel}>
            <div className="mb-2 flex items-center gap-2 text-white">
                <Calendar size={16} className={iconOnGlass} aria-hidden />
                <span className="text-xs font-semibold tracking-wide">{t.widgets.availability}</span>
            </div>
            <div className="flex items-baseline gap-2 text-white">
                <Clock size={14} className={iconOnGlass} aria-hidden />
                <span className="font-mono text-lg font-semibold tabular-nums">{timeStr}</span>
            </div>
            <p className="mt-1 text-[10px] text-white/75 sm:text-xs">{tzLabel}</p>
            <p className="mt-2 text-xs leading-snug text-white/95 sm:text-sm">{status}</p>
            {bookingUrl ? (
                <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white/25 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/35 transition-colors hover:bg-white/35 sm:text-sm"
                >
                    {t.widgets.bookCall}
                    <ExternalLink size={14} className="opacity-90 drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.85)]" />
                </a>
            ) : null}
        </div>
    );
}

function GitCommitsCard() {
    const { t, language } = useLanguage();
    const { username, maxCommits } = portfolioConfig.github;
    const profileUrl = portfolioConfig.links.github;
    const [commits, setCommits] = useState<GithubCommitItem[] | null>(null);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        if (!username) return;
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch(
                    `/api/github/commits?user=${encodeURIComponent(username)}&limit=${maxCommits}`
                );
                const data = (await res.json()) as { commits?: GithubCommitItem[]; error?: string };
                if (cancelled) return;
                if (!res.ok) {
                    setLoadError(true);
                    setCommits([]);
                    return;
                }
                setLoadError(false);
                setCommits(Array.isArray(data.commits) ? data.commits : []);
            } catch {
                if (!cancelled) {
                    setLoadError(true);
                    setCommits([]);
                }
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [username, maxCommits]);

    return (
        <div className={glassPanel} aria-busy={commits === null}>
            <div className="mb-2 flex items-center gap-2 text-white">
                <Github size={16} className={iconOnGlass} aria-hidden />
                <span className="text-xs font-semibold tracking-wide">{t.widgets.recentCommits}</span>
            </div>
            {commits === null ? (
                <ul className="space-y-2" aria-hidden>
                    {[1, 2, 3].map((i) => (
                        <li
                            key={i}
                            className="h-10 animate-pulse rounded-lg bg-white/10"
                        />
                    ))}
                </ul>
            ) : loadError ? (
                <p className="text-xs leading-snug text-amber-200/95">{t.widgets.commitsLoadError}</p>
            ) : commits.length === 0 ? (
                <p className="text-xs leading-snug text-white/75">{t.widgets.noRecentCommits}</p>
            ) : (
                <ul className="space-y-1.5">
                    {commits.map((c) => (
                        <li key={`${c.repo}-${c.sha}-${c.date}`}>
                            <a
                                href={c.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block rounded-lg px-1.5 py-1.5 transition-colors hover:bg-white/12"
                            >
                                <p className="text-xs font-medium leading-snug text-white">
                                    {truncateCommitMessage(c.message)}
                                </p>
                                <div className="mt-0.5 flex items-center justify-between gap-2 text-[10px] text-white/65">
                                    <span className="min-w-0 truncate font-mono">{c.repo}</span>
                                    <time
                                        className="shrink-0 tabular-nums"
                                        dateTime={c.date}
                                        title={new Date(c.date).toISOString()}
                                    >
                                        {relativeCommitTime(c.date, language)}
                                    </time>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            )}
            {profileUrl ? (
                <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white/25 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/35 transition-colors hover:bg-white/35 sm:text-sm"
                >
                    {t.widgets.viewProfile}
                    <ExternalLink size={14} className="opacity-90 drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.85)]" />
                </a>
            ) : null}
        </div>
    );
}

function MusicCard({ t }: { t: { widgets: { nowPlaying: string; onSpotify: string } } }) {
    const [geoSpotifyUrl, setGeoSpotifyUrl] = useState<string | null>(null);
    const [geoTrack, setGeoTrack] = useState<string | null>(null);
    const [geoArtist, setGeoArtist] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const res = await fetch('/api/geo', { cache: 'no-store' });
                const data = (await res.json()) as { countryCode?: string };
                const cc = (data.countryCode ?? '').toUpperCase();
                const byCountry = portfolioConfig.musicByCountry as
                    | Record<string, { track: string; artist: string; spotifyUrl: string; imageUrl?: string }>
                    | undefined;
                const hit = cc && byCountry ? byCountry[cc] : undefined;
                if (!cancelled && hit?.spotifyUrl) {
                    setGeoSpotifyUrl(hit.spotifyUrl);
                    setGeoTrack(hit.track);
                    setGeoArtist(hit.artist);
                }
            } catch {
                // ignore; fall back to defaults
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const track = geoTrack ?? portfolioConfig.music.track;
    const artist = geoArtist ?? portfolioConfig.music.artist;
    const spotifyUrl = geoSpotifyUrl ?? portfolioConfig.music.spotifyUrl;
    const imageUrl = portfolioConfig.music.imageUrl;

    return (
        <div className={glassPanel}>
            <div className="mb-2 flex items-center gap-2 text-white">
                <Music2 size={16} className={iconOnGlass} aria-hidden />
                <span className="text-xs font-semibold tracking-wide">{t.widgets.nowPlaying}</span>
            </div>
            <div className="flex gap-3">
                <div
                    className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-violet-500/90 to-blue-600/90 shadow-inner ring-1 ring-white/20"
                    style={
                        imageUrl
                            ? {
                                  backgroundImage: `url(${imageUrl})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                              }
                            : undefined
                    }
                />
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{track}</p>
                    <p className="truncate text-xs text-white/75">{artist}</p>
                    {spotifyUrl ? (
                        <a
                            href={spotifyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-green-300 hover:text-green-200"
                        >
                            {t.widgets.onSpotify}
                            <ExternalLink size={12} className="drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.85)]" />
                        </a>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
