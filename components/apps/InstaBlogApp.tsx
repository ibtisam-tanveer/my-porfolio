 'use client';
 
 import { useMemo, useState } from 'react';
 import { X, ChevronLeft, ChevronRight, Play, Pause, Heart, Send, Bookmark } from 'lucide-react';
 import { useLanguage } from '@/providers/LanguageProvider';
 
type Slide = {
     id: string;
     title: string;
     caption: string;
     tags: string[];
    mediaUrl: string;
 };
 
 export default function InstaBlogApp() {
     const { t } = useLanguage();
    const seriesTitle = 'Planspiel 2025–2026';
    const slides: Slide[] = useMemo(
         () => [
             {
                id: 'planspiel-1',
                title: `${seriesTitle} · Story 1`,
                caption: 'Planspiel 2025–2026 — highlights captured as a story.',
                tags: ['Planspiel', '2025–2026', 'Story'],
                mediaUrl: '/insta/planspiel/planspiel-1.webp',
             },
             {
                id: 'planspiel-2',
                title: `${seriesTitle} · Story 2`,
                caption: 'Planspiel 2025–2026 — another moment from the series.',
                tags: ['Planspiel', '2025–2026', 'Story'],
                mediaUrl: '/insta/planspiel/planspiel-2.webp',
             },
                   {
                id: 'planspiel-3',
                title: `${seriesTitle} · Story 3`,
                caption: 'Planspiel 2025–2026 — quick recap with caption + tags.',
                tags: ['Planspiel', '2025–2026', 'Blog'],
                mediaUrl: '/insta/planspiel/planspiel-5.webp',
            },
                  {
                id: 'planspiel-4',
                title: `${seriesTitle} · Story 4`,
                caption: 'Planspiel 2025–2026 — quick recap with caption + tags.',
                tags: ['Planspiel', '2025–2026', 'Blog'],
                mediaUrl: '/insta/planspiel/planspiel-6.webp',
            },
             {
                id: 'planspiel-5',
                title: `${seriesTitle} · Story 5`,
                caption: 'Planspiel 2025–2026 — quick recap with caption + tags.',
                tags: ['Planspiel', '2025–2026', 'Blog'],
                mediaUrl: '/insta/planspiel/planspiel-3.jpeg',
            },
            {
                id: 'planspiel-6',
                title: `${seriesTitle} · Story 6`,
                caption: 'Planspiel 2025–2026 — final slide in this story set.',
                tags: ['Planspiel', '2025–2026', 'Story'],
                mediaUrl: '/insta/planspiel/plaspiel-4.jpeg',
             },
         ],
         []
     );
 
     const [storyOpen, setStoryOpen] = useState(false);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);
    const [activePostIndex, setActivePostIndex] = useState(0);
     const [paused, setPaused] = useState(false);
 
    const active = slides[activeSlideIndex];
 
     return (
         <div className="h-full w-full bg-black text-white flex flex-col">
             {/* Header */}
             <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                 <div className="flex items-center gap-2">
                     <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-400" />
                     <div className="leading-tight">
                         <div className="text-sm font-semibold">{t.dock.instablog}</div>
                        <div className="text-[11px] text-white/60">{seriesTitle} · Blog stories</div>
                     </div>
                 </div>
                 <button
                     type="button"
                    onClick={() => {
                        setActiveSlideIndex(0);
                        setStoryOpen(true);
                    }}
                     className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15 transition"
                 >
                     Open stories
                 </button>
             </div>
 
             {/* Stories row */}
             <div className="px-4 py-3 border-b border-white/10">
                 <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <button
                        key="planspeil-series"
                        type="button"
                        onClick={() => {
                            setActiveSlideIndex(0);
                            setStoryOpen(true);
                        }}
                        className="flex flex-col items-center gap-1 shrink-0"
                    >
                        <div className="p-[2px] rounded-full bg-gradient-to-tr from-fuchsia-500 via-rose-500 to-amber-400">
                            <div className="h-12 w-12 rounded-full bg-black overflow-hidden">
                                <img
                                    src={slides[0]?.mediaUrl}
                                    alt={seriesTitle}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        </div>
                        <span className="text-[10px] text-white/70 w-20 truncate">{seriesTitle}</span>
                    </button>
                 </div>
             </div>
 
            {/* Instagram-style post (carousel) */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-5">
                <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
                    {/* Post header */}
                    <div className="flex items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-fuchsia-500 via-rose-500 to-amber-400 p-[2px]">
                                <div className="h-full w-full rounded-full bg-black grid place-items-center text-[10px] font-semibold text-white/80">
                                    IT
                                </div>
                            </div>
                            <div className="min-w-0">
                                <div className="text-sm font-semibold truncate">{seriesTitle}</div>
                                <div className="text-[11px] text-white/60 truncate">Blog post · carousel</div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setActiveSlideIndex(0);
                                setStoryOpen(true);
                            }}
                            className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15 transition"
                        >
                            View story
                        </button>
                    </div>

                    {/* Carousel media */}
                    <div className="relative bg-black/30">
                        <img
                            src={slides[activePostIndex]?.mediaUrl}
                            alt={slides[activePostIndex]?.title ?? seriesTitle}
                            className="w-full aspect-[4/5] object-contain bg-black"
                        />

                        <button
                            type="button"
                            aria-label="Previous carousel image"
                            onClick={() => setActivePostIndex((i) => Math.max(0, i - 1))}
                            disabled={activePostIndex === 0}
                            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/40 p-2 hover:bg-black/55 transition disabled:opacity-30"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            aria-label="Next carousel image"
                            onClick={() => setActivePostIndex((i) => Math.min(slides.length - 1, i + 1))}
                            disabled={activePostIndex === slides.length - 1}
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/40 p-2 hover:bg-black/55 transition disabled:opacity-30"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>

                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                            {slides.map((s, idx) => (
                                <span
                                    key={s.id}
                                    className={`h-1.5 w-1.5 rounded-full ${idx === activePostIndex ? 'bg-white' : 'bg-white/35'}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="px-4 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-white/90">
                                <Heart className="h-5 w-5" aria-hidden />
                                <Send className="h-5 w-5" aria-hidden />
                            </div>
                            <Bookmark className="h-5 w-5 text-white/90" aria-hidden />
                        </div>

                        {/* Caption + tags */}
                        <div className="mt-3 text-sm text-white/80 leading-relaxed">
                            <span className="font-semibold text-white">{seriesTitle}</span>{' '}
                            {slides[activePostIndex]?.caption}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {(slides[activePostIndex]?.tags ?? []).map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
 
             {/* Story modal */}
             {storyOpen ? (
                 <div className="absolute inset-0 z-50 bg-black">
                     <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
 
                     <div className="relative z-10 flex h-full w-full flex-col">
                         <div className="px-4 pt-4">
                             <div className="flex gap-1">
                                {slides.map((p, i) => (
                                     <div
                                         key={p.id}
                                         className={`h-1 flex-1 rounded-full ${
                                            i <= activeSlideIndex ? 'bg-white' : 'bg-white/20'
                                         }`}
                                     />
                                 ))}
                             </div>
                         </div>
 
                         <div className="px-4 py-3 flex items-center justify-between">
                             <div className="flex items-center gap-2 min-w-0">
                                 <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-fuchsia-500 via-rose-500 to-amber-400" />
                                 <div className="min-w-0">
                                     <div className="text-sm font-semibold truncate">
                                         {active.title}
                                     </div>
                                     <div className="text-[11px] text-white/60 truncate">
                                         {t.dock.instablog} · story
                                     </div>
                                 </div>
                             </div>
                             <div className="flex items-center gap-2">
                                 <button
                                     type="button"
                                     onClick={() => setPaused((p) => !p)}
                                     className="rounded-xl border border-white/15 bg-white/10 p-2 hover:bg-white/15 transition"
                                     aria-label={paused ? 'Play' : 'Pause'}
                                 >
                                     {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                                 </button>
                                 <button
                                     type="button"
                                     onClick={() => setStoryOpen(false)}
                                     className="rounded-xl border border-white/15 bg-white/10 p-2 hover:bg-white/15 transition"
                                     aria-label="Close"
                                 >
                                     <X className="h-4 w-4" />
                                 </button>
                             </div>
                         </div>
 
                        <div className="relative flex-1 px-4 pb-6 flex items-center justify-center">
                            <button
                                type="button"
                                aria-label="Previous story slide"
                                onClick={() => setActiveSlideIndex((i) => Math.max(0, i - 1))}
                                disabled={activeSlideIndex === 0}
                                className="absolute left-0 top-0 h-full w-1/3 cursor-pointer disabled:cursor-default"
                            />
                            <button
                                type="button"
                                aria-label="Next story slide"
                                onClick={() => setActiveSlideIndex((i) => Math.min(slides.length - 1, i + 1))}
                                disabled={activeSlideIndex === slides.length - 1}
                                className="absolute right-0 top-0 h-full w-1/3 cursor-pointer disabled:cursor-default"
                            />
                             <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
                                 <div className="text-xs text-white/60 mb-2">Story</div>
                                 <div className="text-xl font-semibold">{active.title}</div>
                                <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                                    <img
                                        src={active.mediaUrl}
                                        alt={active.title}
                                        className="h-[38vh] sm:h-[42vh] w-full object-contain bg-black"
                                    />
                                </div>
                                <p className="mt-4 text-sm text-white/75 leading-relaxed">{active.caption}</p>
                                 <div className="mt-4 flex flex-wrap gap-2">
                                     {active.tags.map((tag) => (
                                         <span
                                             key={tag}
                                             className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80"
                                         >
                                             #{tag}
                                         </span>
                                     ))}
                                 </div>
                             </div>
                         </div>
 
                        <div className="sticky bottom-0 px-4 pb-4 pt-3 bg-gradient-to-b from-transparent to-black/60 flex items-center justify-between gap-3">
                             <button
                                 type="button"
                                onClick={() => setActiveSlideIndex((i) => Math.max(0, i - 1))}
                                 className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-xs hover:bg-white/15 transition disabled:opacity-40"
                                disabled={activeSlideIndex === 0}
                             >
                                 <ChevronLeft className="h-4 w-4" /> Prev
                             </button>
                             <button
                                 type="button"
                                onClick={() => setActiveSlideIndex((i) => Math.min(slides.length - 1, i + 1))}
                                 className="flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-xs hover:bg-white/15 transition disabled:opacity-40"
                                disabled={activeSlideIndex === slides.length - 1}
                             >
                                 Next <ChevronRight className="h-4 w-4" />
                             </button>
                         </div>
                     </div>
                 </div>
             ) : null}
         </div>
     );
 }

