'use client';

import { useEffect, useState } from 'react';
import { Calendar, Clock, ExternalLink, Github, Music2 } from 'lucide-react';
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

    return (
        <div
            className="pointer-events-none absolute right-2 top-10 z-20 flex max-w-[min(18rem,calc(100vw-1rem))] flex-col gap-2 sm:right-4 sm:top-12 sm:gap-3"
            aria-label={t.widgets.desktopWidgets}
        >
            <div className="pointer-events-auto">
                <AvailabilityCard />
            </div>
            <div className="pointer-events-auto">
                <MusicCard t={t} />
            </div>
            {portfolioConfig.github.username ? (
                <div className="pointer-events-auto">
                    <GitCommitsCard />
                </div>
            ) : null}
        </div>
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
    const { track, artist, spotifyUrl, imageUrl } = portfolioConfig.music;

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
