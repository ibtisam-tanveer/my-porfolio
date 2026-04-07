 'use client';
 
 import { useEffect, useMemo, useRef, useState } from 'react';
 import { Check, ChevronRight, RotateCcw } from 'lucide-react';
 import { portfolioConfig } from '@/lib/portfolio-config';
 
 type WidgetId = 'availability' | 'music' | 'commits';
 type WidgetVisibility = Record<WidgetId, boolean>;
 
 const WIDGETS_STORAGE_KEY = 'portfolio:widgets:v2';
 const WIDGETS_CHANGED_EVENT = 'portfolio:widgets-changed';
const DESKTOP_MENU_EVENT = 'portfolio:open-desktop-menu';
 const WIDGETS_RESET_EVENT = 'portfolio:widgets-reset';
 
 type WidgetPos = { x: number; y: number };
 type WidgetLayout = Record<WidgetId, WidgetPos>;
 
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
 
 function readVisible(): WidgetVisibility {
     const fallback: WidgetVisibility = getDefaultVisibility();
     try {
         const raw = localStorage.getItem(WIDGETS_STORAGE_KEY);
         if (!raw) return fallback;
         const parsed = JSON.parse(raw) as { visible?: Partial<WidgetVisibility> };
         return {
             availability: parsed.visible?.availability ?? fallback.availability,
             music: parsed.visible?.music ?? fallback.music,
             commits: parsed.visible?.commits ?? fallback.commits,
         };
     } catch {
         return fallback;
     }
 }
 
 function writeVisible(visible: WidgetVisibility) {
     try {
         const raw = localStorage.getItem(WIDGETS_STORAGE_KEY);
         const parsed = raw ? (JSON.parse(raw) as any) : {};
         const next = { ...parsed, visible };
         localStorage.setItem(WIDGETS_STORAGE_KEY, JSON.stringify(next));
     } catch {
         // ignore
     }
     window.dispatchEvent(new CustomEvent(WIDGETS_CHANGED_EVENT));
 }
 
 function resetWidgets() {
     // Let DesktopWidgets compute the real stacked positions from actual sizes.
     try {
         const raw = localStorage.getItem(WIDGETS_STORAGE_KEY);
         const parsed = raw ? (JSON.parse(raw) as any) : {};
         const next = { ...parsed, visible: getDefaultVisibility() };
         localStorage.setItem(WIDGETS_STORAGE_KEY, JSON.stringify(next));
     } catch {
         // ignore
     }
     window.dispatchEvent(new CustomEvent(WIDGETS_RESET_EVENT));
 }
 
 export default function DesktopContextMenu() {
     const [open, setOpen] = useState(false);
     const [pos, setPos] = useState({ x: 0, y: 0 });
     const [visible, setVisible] = useState<WidgetVisibility>(() => ({ availability: true, music: true, commits: true }));
    const panelRef = useRef<HTMLDivElement | null>(null);
     const [widgetsOpen, setWidgetsOpen] = useState(false);
 
     const commitsEnabled = Boolean(portfolioConfig.github.username);
 
     useEffect(() => {
        const onOpen = (e: Event) => {
            const ce = e as CustomEvent<{ x: number; y: number }>;
            const x = ce.detail?.x ?? 0;
            const y = ce.detail?.y ?? 0;
             setVisible(readVisible());
            // keep menu within viewport
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const w = 220;
            const h = 170;
            setPos({
                x: Math.max(8, Math.min(x, vw - w - 8)),
                y: Math.max(40, Math.min(y, vh - h - 8)),
            });
             setOpen(true);
             setWidgetsOpen(false);
         };
 
        const onDown = (e: MouseEvent) => {
            const target = e.target as Node | null;
            if (panelRef.current && target && panelRef.current.contains(target)) return;
            setOpen(false);
        };
         const onKey = (e: KeyboardEvent) => {
             if (e.key === 'Escape') setOpen(false);
         };
 
        window.addEventListener(DESKTOP_MENU_EVENT, onOpen as EventListener);
        window.addEventListener('mousedown', onDown);
         window.addEventListener('keydown', onKey);
         return () => {
            window.removeEventListener(DESKTOP_MENU_EVENT, onOpen as EventListener);
             window.removeEventListener('mousedown', onDown);
             window.removeEventListener('keydown', onKey);
         };
     }, []);
 
     const items = useMemo(
         () =>
             [
                 { id: 'availability' as const, label: 'Availability', disabled: false },
                 { id: 'music' as const, label: 'Now playing', disabled: false },
                 { id: 'commits' as const, label: 'Recent commits', disabled: !commitsEnabled },
             ],
         [commitsEnabled]
     );
 
     if (!open) return null;
 
     return (
         <div className="fixed inset-0 z-[350]">
             <div
                ref={panelRef}
                 className="absolute rounded-2xl border border-white/15 bg-black/55 text-white shadow-2xl backdrop-blur-2xl"
                 style={{ left: pos.x, top: pos.y, width: 220 }}
             >
                 <div className="py-2">
                     <button
                         type="button"
                         onMouseDown={(e) => e.stopPropagation()}
                         onClick={(e) => {
                             e.stopPropagation();
                             resetWidgets();
                             setVisible(getDefaultVisibility());
                             setWidgetsOpen(false);
                             setOpen(false);
                         }}
                         className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-white/10 transition"
                     >
                         <RotateCcw className="h-4 w-4" aria-hidden />
                         <span className="text-[13px]">Reset widgets</span>
                     </button>
 
                     <div className="my-1 h-px bg-white/10" />
 
                     <button
                         type="button"
                         onMouseDown={(e) => e.stopPropagation()}
                         onMouseEnter={() => setWidgetsOpen(true)}
                         onClick={(e) => {
                             e.stopPropagation();
                             setWidgetsOpen((v) => !v);
                         }}
                         className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-white/10 transition"
                     >
                         <span className="text-[13px]">Widgets</span>
                         <ChevronRight className="h-4 w-4 opacity-80" aria-hidden />
                     </button>
                 </div>
             </div>
 
             {widgetsOpen ? (
                 <div
                     className="absolute rounded-2xl border border-white/15 bg-black/55 text-white shadow-2xl backdrop-blur-2xl"
                     style={{ left: pos.x + 228, top: pos.y + 44, width: 220 }}
                     onMouseDown={(e) => e.stopPropagation()}
                     onMouseEnter={() => setWidgetsOpen(true)}
                 >
                     <div className="px-3 pt-2 pb-1 text-[11px] font-semibold text-white/70">Add widgets</div>
                     <div className="pb-2">
                         {items.map((it) => {
                             const checked = visible[it.id];
                             return (
                                 <button
                                     key={it.id}
                                     type="button"
                                     disabled={it.disabled}
                                     onMouseDown={(e) => e.stopPropagation()}
                                     onClick={(e) => {
                                         e.stopPropagation();
                                         const next = { ...visible, [it.id]: !checked };
                                         setVisible(next);
                                         writeVisible(next);
                                     }}
                                     className={`flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm transition ${
                                         it.disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/10'
                                     }`}
                                 >
                                     <span className="text-[13px]">{it.label}</span>
                                     <span className="grid h-5 w-5 place-items-center">
                                         {checked ? <Check className="h-4 w-4" /> : null}
                                     </span>
                                 </button>
                             );
                         })}
                     </div>
                 </div>
             ) : null}
         </div>
     );
 }
 
