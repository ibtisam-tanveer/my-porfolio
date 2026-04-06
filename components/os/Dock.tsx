'use client';

import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { useRef, useState } from 'react';
import type React from 'react';
import { useWindowManager } from './WindowManager';
import { FolderOpen, Globe, Code, Mail, StickyNote, Calendar, Terminal, Gamepad2 } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

const iconMap = {
    finder: FolderOpen,
    safari: Globe,
    vscode: Code,
    mail: Mail,
    notes: StickyNote,
    calendar: Calendar,
    terminal: Terminal,
    snake: Gamepad2,
};

export default function Dock() {
    const { t } = useLanguage();
    const mouseX = useMotionValue(Infinity);
    const { openWindow, windows } = useWindowManager();

    return (
        <div className="fixed bottom-2 sm:bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 sm:gap-3 rounded-xl sm:rounded-2xl border border-white/20 bg-white/10 px-2 sm:px-4 py-2 sm:py-3 backdrop-blur-2xl overflow-x-auto overflow-y-visible max-w-[calc(100vw-1rem)] sm:max-w-none z-50 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <DockIcon mouseX={mouseX} id="finder" label={t.dock.finder} IconComponent={iconMap.finder} onClick={() => openWindow('finder')} isOpen={windows.finder.isOpen} />
            <DockIcon mouseX={mouseX} id="safari" label={t.dock.safari} IconComponent={iconMap.safari} onClick={() => openWindow('safari')} isOpen={windows.safari.isOpen} />
            <DockIcon mouseX={mouseX} id="vscode" label={t.dock.vscode} IconComponent={iconMap.vscode} onClick={() => openWindow('vscode')} isOpen={windows.vscode.isOpen} />
            <DockIcon mouseX={mouseX} id="mail" label={t.dock.mail} IconComponent={iconMap.mail} onClick={() => openWindow('mail')} isOpen={windows.mail.isOpen} />
            <DockIcon mouseX={mouseX} id="notes" label={t.dock.notes} IconComponent={iconMap.notes} onClick={() => openWindow('notes')} isOpen={windows.notes.isOpen} />
            {/* <DockIcon mouseX={mouseX} id="calendar" label="Calendar" IconComponent={iconMap.calendar} onClick={() => { }} isOpen={false} /> */}
            <DockIcon mouseX={mouseX} id="terminal" label={t.dock.terminal} IconComponent={iconMap.terminal} onClick={() => openWindow('terminal')} isOpen={windows.terminal.isOpen} />
            <DockIcon mouseX={mouseX} id="snake" label={t.dock.snake} IconComponent={iconMap.snake} onClick={() => openWindow('snake')} isOpen={windows.snake.isOpen} />
        </div>
    );
}

function DockIcon({ mouseX, id, label, IconComponent, onClick, isOpen }: { mouseX: any, id: string, label: string, IconComponent: React.ComponentType<{ size?: number; className?: string }>, onClick: () => void, isOpen: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const distance = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthSync = useTransform(distance, [-150, 0, 150], [48, 64, 48]);
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 300, damping: 20 });
    
    const heightSync = useTransform(distance, [-150, 0, 150], [48, 64, 48]);
    const height = useSpring(heightSync, { mass: 0.1, stiffness: 300, damping: 20 });

    const scale = useTransform(distance, [-150, 0, 150], [1, 1, 1]);
    // const y = useTransform(distance, [-150, 0, 150], [0, -16, 0]);
    
    const iconSize = useTransform(distance, [-150, 0, 150], [24, 32, 24]);
    const iconSizeSpring = useSpring(iconSize, { mass: 0.1, stiffness: 300, damping: 20 });
    
    const bgOpacity = useTransform(distance, [-150, 0, 150], [0.05, 0.2, 0.05]);
    const borderOpacity = useTransform(distance, [-150, 0, 150], [0.1, 0.4, 0.1]);
    const shadowOpacity = useTransform(distance, [-150, 0, 150], [0.1, 0.3, 0.1]);
    
    const backgroundColor = useMotionTemplate`rgba(255, 255, 255, ${bgOpacity})`;
    const borderColor = useMotionTemplate`rgba(255, 255, 255, ${borderOpacity})`;
    const boxShadow = useMotionTemplate`0 4px 12px rgba(0, 0, 0, ${shadowOpacity})`;

    return (
        <div className="flex flex-col items-center justify-end gap-1.5 relative isolate" style={{ zIndex: isHovered ? 100 : 50 }}>
            {/* {isHovered && (
                <motion.div
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 2 }}
                    className="absolute bottom-full mb-2 px-2.5 py-1 bg-black/85 backdrop-blur-md rounded-md text-white text-xs font-medium whitespace-nowrap pointer-events-none z-[101] shadow-lg"
                >
                    {label}
                </motion.div>
            )} */}
            <motion.div
                ref={ref}
                style={{ 
                    width, 
                    height,
                    scale,
                    // y,
                    zIndex: isHovered ? 100 : 50,
                    backgroundColor,
                    borderColor,
                    boxShadow,
                }}
                className="cursor-pointer rounded-xl backdrop-blur-md flex items-center justify-center border relative isolate overflow-hidden"
                onClick={onClick}
                onMouseMove={(e) => {
                    mouseX.set(e.pageX);
                    setIsHovered(true);
                }}
                onMouseLeave={() => {
                    mouseX.set(Infinity);
                    setIsHovered(false);
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
                <motion.div
                    style={{ width: iconSizeSpring, height: iconSizeSpring }}
                    className="relative flex items-center justify-center"
                >
                    <IconComponent 
                        size={24}
                        className="text-white drop-shadow-md w-full h-full" 
                    />
                </motion.div>
            </motion.div>
            <motion.div 
                className="h-1 w-1 rounded-full bg-white/90"
                animate={{ opacity: isOpen ? 1 : 0, scale: isOpen ? 1 : 0.5 }}
                transition={{ duration: 0.2 }}
            />
        </div>
    );
}
