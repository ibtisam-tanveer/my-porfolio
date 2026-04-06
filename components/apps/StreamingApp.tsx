'use client';

import { Play, Plus, ExternalLink, Search, Info } from 'lucide-react';
import { useWindowManager } from '@/components/os/WindowManager';
import { portfolioConfig } from '@/lib/portfolio-config';
import { useLanguage } from '@/providers/LanguageProvider';

const HERO_GIF =
    'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExOTZ5eWwwbjRpdWM1amxyd3VueHhteTVzajVjeGZtZGJ1dDc4MXMyNCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9dg/16u7Ifl2T4zYfQ932F/giphy.gif';

type Pick = {
    title: string;
    subtitle?: string;
    action: () => void;
};

type PosterItem = {
    id: string;
    title: string;
    subtitle?: string;
    image: string;
    badge?: string;
    action: () => void;
};

function PickCard({ pick }: { pick: Pick }) {
    return (
        <button
            type="button"
            onClick={pick.action}
            className="group relative h-20 w-44 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left shadow-[0_16px_40px_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-0.5 hover:bg-white/10 active:translate-y-0"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />
            <div className="relative z-10 flex h-full flex-col justify-end p-3">
                <div className="text-xs font-semibold text-white">{pick.title}</div>
                {pick.subtitle ? (
                    <div className="mt-0.5 text-[10px] text-white/70">{pick.subtitle}</div>
                ) : null}
            </div>
            <div className="absolute inset-0 ring-1 ring-white/0 transition group-hover:ring-white/15" />
        </button>
    );
}

function PosterCard({ item }: { item: PosterItem }) {
    return (
        <button
            type="button"
            onClick={item.action}
            className="group relative shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 shadow-[0_18px_52px_rgba(0,0,0,0.45)] transition-transform duration-200 hover:scale-[1.06] hover:border-white/25 active:scale-[1.03]"
            style={{ width: 150, height: 220 }}
        >
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${item.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/20" />

            {item.badge ? (
                <div className="absolute left-2 top-2 rounded-md bg-black/55 px-2 py-1 text-[10px] font-semibold text-white ring-1 ring-white/10 backdrop-blur">
                    {item.badge}
                </div>
            ) : null}

            <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                <div className="text-xs font-semibold text-white">{item.title}</div>
                {item.subtitle ? (
                    <div className="mt-0.5 line-clamp-2 text-[10px] leading-snug text-white/70">
                        {item.subtitle}
                    </div>
                ) : null}
            </div>

            <div className="absolute inset-0 ring-1 ring-white/0 transition group-hover:ring-white/15" />
        </button>
    );
}

function Row({
    title,
    items,
}: {
    title: string;
    items: PosterItem[];
}) {
    return (
        <section className="mt-6">
            <div className="mb-2 flex items-end justify-between gap-3">
                <div className="text-sm font-semibold text-white/95">{title}</div>
             
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {items.map((it) => (
                    <PosterCard key={it.id} item={it} />
                ))}
            </div>
        </section>
    );
}

export default function StreamingApp() {
    const { t } = useLanguage();
    const { openWindow } = useWindowManager();

    const picks: Pick[] = [
        { title: t.about.resumePdfFile, subtitle: t.about.openResumePdf, action: () => openWindow('resume') },
        { title: t.about.skills, subtitle: 'Tech stack & strengths', action: () => openWindow('finder') },
        { title: t.about.experience, subtitle: 'Roles & impact', action: () => openWindow('finder') },
        { title: t.about.projects, subtitle: 'Selected work', action: () => openWindow('vscode') },
        { title: t.contact.getInTouch, subtitle: 'Email / phone', action: () => openWindow('mail') },
        { title: t.assistant.title, subtitle: 'Ask my portfolio', action: () => openWindow('terminal') },
    ];

    // High-quality, hotlink-friendly cover images (Unsplash) — swap anytime.
    const covers = {
        resume:
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=75',
        skills:
            'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=75',
        experience:
            'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=75',
        projects:
            'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=900&q=75',
        contact:
            'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=900&q=75',
        ai:
            'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=75',
        github:
            'https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=900&q=75',
        fun:
            'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=75',
    } as const;

    const topPicksForRecruiters: PosterItem[] = [
        {
            id: 'resume',
            title: 'Resume',
            subtitle: 'PDF · one page overview',
            image: covers.resume,
            badge: 'Top pick',
            action: () => openWindow('resume'),
        },
        {
            id: 'projects',
            title: 'Projects',
            subtitle: 'Selected work & impact',
            image: covers.projects,
            action: () => openWindow('vscode'),
        },
        {
            id: 'experience',
            title: 'Experience',
            subtitle: 'Roles · ownership · results',
            image: covers.experience,
            action: () => openWindow('finder'),
        },
        {
            id: 'skills',
            title: 'Skills',
            subtitle: 'Frontend · full‑stack · tooling',
            image: covers.skills,
            action: () => openWindow('finder'),
        },
        {
            id: 'contact',
            title: 'Hire me',
            subtitle: 'Email · phone · booking',
            image: covers.contact,
            badge: 'Fast',
            action: () => openWindow('mail'),
        },
        {
            id: 'ai',
            title: 'Ask AI',
            subtitle: 'Ask my portfolio anything',
            image: covers.ai,
            badge: 'New',
            action: () => openWindow('terminal'),
        },
    ];

    const moreLikeThis: PosterItem[] = [
        {
            id: 'github',
            title: 'GitHub',
            subtitle: 'Open source & activity',
            image: covers.github,
            action: () => window.open(portfolioConfig.links.github, '_blank', 'noopener,noreferrer'),
        },
        {
            id: 'safari',
            title: 'Links',
            subtitle: 'LinkedIn · email · quick access',
            image: covers.contact,
            action: () => openWindow('safari'),
        },
        {
            id: 'notes',
            title: 'Notes',
            subtitle: 'Short bio & highlights',
            image: covers.skills,
            action: () => openWindow('notes'),
        },
        {
            id: 'snake',
            title: 'Snake',
            subtitle: 'Fun break',
            image: covers.fun,
            action: () => openWindow('snake'),
        },
    ];

    return (
        <div className="h-full w-full bg-black text-white">
            {/* Netflix-like top bar */}
            <div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-white/10 bg-black/70 px-4 py-3 backdrop-blur-xl sm:px-6">
                <div className="flex items-center gap-3">
                    <div className="text-sm font-extrabold tracking-[0.18em] text-red-500">
                        STREAM
                    </div>
                    <nav className="hidden items-center gap-3 text-xs font-medium text-white/80 sm:flex">
                        <button type="button" onClick={() => openWindow('resume')} className="hover:text-white">
                            Resume
                        </button>
                        <button type="button" onClick={() => openWindow('vscode')} className="hover:text-white">
                            Projects
                        </button>
                        <button type="button" onClick={() => openWindow('mail')} className="hover:text-white">
                            Hire me
                        </button>
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 sm:flex">
                        <Search size={14} className="text-white/50" />
                        <span className="select-none">Search apps…</span>
                    </div>
                </div>
            </div>

            {/* Hero */}
            <div className="relative w-full overflow-hidden">
                <div className="relative h-72 sm:h-96">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${HERO_GIF})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/15" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(white_1px,transparent_1px)] [background-size:10px_10px]" />

                    <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-6 sm:px-6 sm:pb-10">
                        <div className="max-w-2xl">
                            <div className="text-3xl font-black tracking-tight sm:text-5xl">
                                {t.about.title}
                            </div>
                            <div className="mt-2 text-sm text-white/85 sm:text-base">{t.about.subtitle}</div>
                            <p className="mt-4 line-clamp-3 text-xs leading-relaxed text-white/75 sm:text-sm">
                                {t.about.profileSummaryText}
                            </p>

                            <div className="mt-5 flex flex-wrap items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => openWindow('resume')}
                                    className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2.5 text-xs font-bold text-black hover:bg-white/90"
                                >
                                    <Play size={16} />
                                    {t.about.openResumePdf}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => openWindow('vscode')}
                                    className="inline-flex items-center gap-2 rounded-md bg-white/15 px-4 py-2.5 text-xs font-bold text-white ring-1 ring-white/15 backdrop-blur transition hover:bg-white/20"
                                >
                                    <Info size={16} />
                                    Open projects
                                </button>

                                {portfolioConfig.links.linkedIn ? (
                                    <a
                                        href={portfolioConfig.links.linkedIn}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-2.5 text-xs font-bold text-white ring-1 ring-white/10 transition hover:bg-white/15"
                                    >
                                        <Plus size={16} />
                                        LinkedIn
                                        <ExternalLink size={12} className="opacity-80" />
                                    </a>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 pb-10 pt-4 sm:px-6">
                {/* Keep the small “picks” strip (more compact than posters) */}
             

                <Row title="Top picks for recruiters" items={topPicksForRecruiters} />
                <Row title="More like this" items={moreLikeThis} />

             
            </div>
        </div>
    );
}

