'use client';

import { motion, useDragControls, AnimatePresence } from 'framer-motion';
import { X, Minus, Maximize2 } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { useWindowManager, AppId } from './WindowManager';
import { useLanguage } from '@/providers/LanguageProvider';

interface WindowProps {
    id: AppId;
    children: React.ReactNode;
}

export default function Window({ id, children }: WindowProps) {
    const { windows, closeWindow, minimizeWindow, maximizeWindow, focusWindow } = useWindowManager();
    const { t } = useLanguage();
    const windowState = windows[id];
    const isResume = id === 'resume';
    const isSnake = id === 'snake';
    const dragControls = useDragControls();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!windowState.isOpen) return null;

    return (
        <AnimatePresence>
            {!windowState.isMinimized && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 100 }}
                    animate={{
                        scale: windowState.isMaximized ? 1 : 1,
                        opacity: 1,
                        y: 0,
                        width: windowState.isMaximized
                            ? '100%'
                            : isMobile
                              ? 'calc(100% - 1rem)'
                              : isResume
                                ? '920px'
                                : isSnake
                                  ? '400px'
                                  : '800px',
                        height: windowState.isMaximized
                            ? '100%'
                            : isMobile
                              ? 'calc(100% - 2rem)'
                              : isResume
                                ? '640px'
                                : isSnake
                                  ? '560px'
                                  : '500px',
                        top: windowState.isMaximized ? 32 : isMobile ? 40 : 100,
                        left: windowState.isMaximized ? 0 : isMobile ? '50%' : 100,
                        x: windowState.isMaximized ? 0 : isMobile ? '-50%' : 0,
                        borderRadius: windowState.isMaximized ? 0 : 12,
                    }}
                    exit={{ scale: 0, opacity: 0, y: 500, x: 0 }}
                    transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
                    style={{ zIndex: windowState.zIndex }}
                    className="pointer-events-auto absolute bg-white shadow-2xl overflow-hidden flex flex-col border border-black/10"
                    onMouseDown={() => focusWindow(id)}
                    drag={!windowState.isMaximized && !isMobile}
                    dragControls={dragControls}
                    dragMomentum={false}
                    dragListener={false}
                >
                    {/* Title Bar */}
                    <div
                        className="flex h-8 sm:h-10 items-center justify-between bg-[#f6f6f6] px-2 sm:px-4 border-b border-[#d1d1d1] cursor-default"
                        onPointerDown={(e) => !windowState.isMaximized && !isMobile && dragControls.start(e)}
                        onDoubleClick={() => maximizeWindow(id)}
                    >
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <button onClick={(e) => { e.stopPropagation(); closeWindow(id); }} className="flex h-2.5 w-2.5 sm:h-3 sm:w-3 items-center justify-center rounded-full bg-[#FF5F56] hover:brightness-90 group border border-[#E0443E]">
                                <X size={5} className="sm:w-1.5 sm:h-1.5 text-black/50 opacity-0 group-hover:opacity-100" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }} className="flex h-2.5 w-2.5 sm:h-3 sm:w-3 items-center justify-center rounded-full bg-[#FFBD2E] hover:brightness-90 group border border-[#DEA123]">
                                <Minus size={5} className="sm:w-1.5 sm:h-1.5 text-black/50 opacity-0 group-hover:opacity-100" />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); maximizeWindow(id); }} className="flex h-2.5 w-2.5 sm:h-3 sm:w-3 items-center justify-center rounded-full bg-[#27C93F] hover:brightness-90 group border border-[#1AAB29]">
                                <Maximize2 size={5} className="sm:w-1.5 sm:h-1.5 text-black/50 opacity-0 group-hover:opacity-100" />
                            </button>
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-gray-700 truncate max-w-[40%] sm:max-w-none">
                            {isResume ? t.resumeWindow.title : windowState.title}
                        </span>
                        <div className="w-8 sm:w-14" />
                    </div>

                    {/* Content */}
                    <div
                        className={`flex-1 bg-white ${isResume || isSnake ? 'min-h-0 overflow-hidden' : 'overflow-auto'}`}
                    >
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
