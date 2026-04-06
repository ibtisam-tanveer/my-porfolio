'use client';

import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    Search,
    FolderOpen,
    Globe,
    Code,
    Mail,
    Terminal,
    StickyNote,
    FileText,
    Linkedin,
    Github,
    Phone,
    Calendar,
    AtSign,
    Gamepad2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useWindowManager, type AppId } from '@/components/os/WindowManager';
import { portfolioConfig } from '@/lib/portfolio-config';

export const OPEN_SPOTLIGHT_EVENT = 'portfolio:open-spotlight';

type Category = 'apps' | 'links';

type SpotlightRow = {
    id: string;
    category: Category;
    title: string;
    subtitle: string;
    searchBlob: string;
    Icon: LucideIcon;
    action: () => void;
};

function normalize(s: string) {
    return s
        .toLowerCase()
        .normalize('NFD')
        .replace(/\p{M}/gu, '');
}

function matchesQuery(query: string, blob: string) {
    const q = query.trim();
    if (!q) return true;
    return normalize(blob).includes(normalize(q));
}

export default function SpotlightSearch() {
    const { t } = useLanguage();
    const { openWindow } = useWindowManager();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const close = useCallback(() => {
        setOpen(false);
        setQuery('');
        setSelectedIndex(0);
    }, []);

    const run = useCallback(
        (fn: () => void) => {
            fn();
            close();
        },
        [close]
    );

    const rows: SpotlightRow[] = useMemo(() => {
        const apps: { id: AppId; Icon: LucideIcon; extraSearch: string }[] = [
            { id: 'finder', Icon: FolderOpen, extraSearch: 'files macintosh profile documents' },
            { id: 'safari', Icon: Globe, extraSearch: 'browser web internet' },
            { id: 'vscode', Icon: Code, extraSearch: 'editor projects code' },
            { id: 'mail', Icon: Mail, extraSearch: 'email contact message' },
            { id: 'notes', Icon: StickyNote, extraSearch: 'notepad cv text' },
            { id: 'terminal', Icon: Terminal, extraSearch: 'shell command line' },
            { id: 'snake', Icon: Gamepad2, extraSearch: 'game arcade play snake retro' },
            { id: 'resume', Icon: FileText, extraSearch: 'pdf cv lebenslauf curriculum' },
        ];

        const appRows: SpotlightRow[] = apps.map(({ id, Icon, extraSearch }) => {
            const title =
                id === 'finder'
                    ? t.dock.finder
                    : id === 'safari'
                      ? t.dock.safari
                      : id === 'vscode'
                        ? t.dock.vscode
                        : id === 'mail'
                          ? t.dock.mail
                          : id === 'notes'
                            ? t.dock.notes
                            : id === 'terminal'
                              ? t.dock.terminal
                              : id === 'snake'
                                ? t.dock.snake
                                : t.about.resumePdfFile;
            return {
                id,
                category: 'apps' as const,
                title,
                subtitle: t.spotlight.openApp,
                searchBlob: `${title} ${extraSearch} ${id}`,
                Icon,
                action: () => openWindow(id),
            };
        });

        const { linkedIn, github, email, phoneTel } = portfolioConfig.links;
        const { bookingUrl } = portfolioConfig.availability;

        const linkRows: SpotlightRow[] = [
            {
                id: 'link-linkedin',
                category: 'links',
                title: t.safari.linkedInProfile,
                subtitle: t.spotlight.openLink,
                searchBlob: `linkedin social network ${linkedIn}`,
                Icon: Linkedin,
                action: () => window.open(linkedIn, '_blank', 'noopener,noreferrer'),
            },
            {
                id: 'link-github',
                category: 'links',
                title: t.safari.githubProfile,
                subtitle: t.spotlight.openLink,
                searchBlob: `github code repository ${github}`,
                Icon: Github,
                action: () => window.open(github, '_blank', 'noopener,noreferrer'),
            },
            {
                id: 'link-email',
                category: 'links',
                title: t.safari.sendEmail,
                subtitle: email.replace('mailto:', ''),
                searchBlob: `email mail ibtisam`,
                Icon: AtSign,
                action: () => {
                    window.location.href = email;
                },
            },
            {
                id: 'link-phone',
                category: 'links',
                title: t.safari.phone,
                subtitle: phoneTel.replace('tel:', ''),
                searchBlob: `phone call mobile`,
                Icon: Phone,
                action: () => {
                    window.location.href = phoneTel;
                },
            },
        ];

        if (bookingUrl) {
            linkRows.push({
                id: 'link-book',
                category: 'links',
                title: t.widgets.bookCall,
                subtitle: bookingUrl.replace(/^https?:\/\//, ''),
                searchBlob: `cal.com calendar meeting schedule book call availability`,
                Icon: Calendar,
                action: () => window.open(bookingUrl, '_blank', 'noopener,noreferrer'),
            });
        }

        return [...appRows, ...linkRows];
    }, [t, openWindow]);

    const filtered = useMemo(
        () => rows.filter((r) => matchesQuery(query, r.searchBlob)),
        [rows, query]
    );

    useEffect(() => {
        setSelectedIndex((i) => Math.min(i, Math.max(0, filtered.length - 1)));
    }, [filtered.length]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    useLayoutEffect(() => {
        if (!open) return;
        inputRef.current?.focus({ preventScroll: true });
    }, [open]);

    useEffect(() => {
        const el = rowRefs.current[selectedIndex];
        el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, [selectedIndex, open, filtered.length]);

    useEffect(() => {
        const onOpen = () => setOpen(true);
        window.addEventListener(OPEN_SPOTLIGHT_EVENT, onOpen);
        return () => window.removeEventListener(OPEN_SPOTLIGHT_EVENT, onOpen);
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const meta = e.metaKey || e.ctrlKey;
            if (meta && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setOpen((o) => !o);
                return;
            }
            if (!open) return;

            if (e.key === 'Escape') {
                e.preventDefault();
                close();
                return;
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (filtered.length === 0) return;
                setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (filtered.length === 0) return;
                setSelectedIndex((i) => Math.max(i - 1, 0));
                return;
            }
            if (e.key === 'Enter' && filtered.length > 0) {
                e.preventDefault();
                run(filtered[selectedIndex].action);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open, close, filtered, selectedIndex, run]);

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    rowRefs.current = [];

    return (
        <AnimatePresence>
            {open ? (
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label={t.spotlight.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh] px-4"
                >
                    <button
                        type="button"
                        aria-label={t.spotlight.footerClose}
                        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
                        onClick={close}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: -12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/20 bg-white/85 shadow-2xl shadow-black/30 backdrop-blur-2xl"
                    >
                        <div className="flex items-center gap-3 border-b border-gray-200/80 px-4 py-3">
                            <Search className="h-5 w-5 shrink-0 text-gray-400" aria-hidden />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder={t.spotlight.placeholder}
                                className="min-w-0 flex-1 bg-transparent text-base text-gray-900 placeholder:text-gray-400 outline-none"
                                autoComplete="off"
                                autoCorrect="off"
                                spellCheck={false}
                            />
                            <kbd className="hidden shrink-0 rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-500 sm:inline">
                                {t.spotlight.shortcut}
                            </kbd>
                        </div>

                        <div className="max-h-[min(50vh,360px)] overflow-y-auto overscroll-contain py-2">
                            {filtered.length === 0 ? (
                                <p className="px-4 py-8 text-center text-sm text-gray-500">
                                    {t.spotlight.noResults}
                                </p>
                            ) : (
                                (() => {
                                    let lastCat: Category | null = null;
                                    return filtered.map((row, index) => {
                                        const showHeading = row.category !== lastCat;
                                        lastCat = row.category;
                                        const selected = index === selectedIndex;
                                        return (
                                            <div key={row.id}>
                                                {showHeading ? (
                                                    <div className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400 first:pt-0">
                                                        {row.category === 'apps'
                                                            ? t.spotlight.apps
                                                            : t.spotlight.links}
                                                    </div>
                                                ) : null}
                                                <button
                                                    type="button"
                                                    ref={(el) => {
                                                        rowRefs.current[index] = el;
                                                    }}
                                                    onClick={() => run(row.action)}
                                                    onMouseEnter={() => setSelectedIndex(index)}
                                                    className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                                                        selected
                                                            ? 'bg-blue-500/15 text-gray-900'
                                                            : 'text-gray-800 hover:bg-gray-100/80'
                                                    }`}
                                                >
                                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-200/90 text-gray-700">
                                                        <row.Icon className="h-5 w-5" aria-hidden />
                                                    </span>
                                                    <span className="min-w-0 flex-1">
                                                        <span className="block truncate font-medium">
                                                            {row.title}
                                                        </span>
                                                        <span className="block truncate text-xs text-gray-500">
                                                            {row.subtitle}
                                                        </span>
                                                    </span>
                                                </button>
                                            </div>
                                        );
                                    });
                                })()
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-gray-200/80 px-4 py-2 text-[10px] text-gray-400">
                            <span>
                                <kbd className="rounded border border-gray-300 bg-gray-100 px-1 font-mono">
                                    ↑↓
                                </kbd>{' '}
                                {t.spotlight.footerNavigate}
                            </span>
                            <span>
                                <kbd className="rounded border border-gray-300 bg-gray-100 px-1 font-mono">
                                    ↵
                                </kbd>{' '}
                                {t.spotlight.footerOpen}
                            </span>
                            <span>
                                <kbd className="rounded border border-gray-300 bg-gray-100 px-1 font-mono">
                                    esc
                                </kbd>{' '}
                                {t.spotlight.footerClose}
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
}
