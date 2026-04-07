'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export type AppId =
    | 'finder'
    | 'safari'
    | 'vscode'
    | 'mail'
    | 'terminal'
    | 'notes'
    | 'resume'
    | 'snake'
    | 'streaming'
    | 'instablog';

interface WindowState {
    id: AppId;
    title: string;
    isOpen: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    zIndex: number;
}

interface WindowContextType {
    windows: Record<AppId, WindowState>;
    activeWindowId: AppId | null;
    openWindow: (id: AppId) => void;
    closeWindow: (id: AppId) => void;
    minimizeWindow: (id: AppId) => void;
    maximizeWindow: (id: AppId) => void;
    focusWindow: (id: AppId) => void;
}

const WindowContext = createContext<WindowContextType | undefined>(undefined);

const INITIAL_WINDOWS: Record<AppId, WindowState> = {
    finder: { id: 'finder', title: 'Finder', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0 },
    safari: { id: 'safari', title: 'Safari', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0 },
    vscode: { id: 'vscode', title: 'VS Code', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0 },
    mail: { id: 'mail', title: 'Mail', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0 },
    terminal: { id: 'terminal', title: 'Terminal', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0 },
    notes: { id: 'notes', title: 'Notes', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0 },
    resume: { id: 'resume', title: 'Resume.pdf', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0 },
    snake: { id: 'snake', title: 'Snake', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0 },
    streaming: { id: 'streaming', title: 'Streaming', isOpen: true, isMinimized: false, isMaximized: false, zIndex: 1 },
    instablog: { id: 'instablog', title: 'InstaBlog', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 0 },
};

export function WindowProvider({ children }: { children: React.ReactNode }) {
    const [windows, setWindows] = useState<Record<AppId, WindowState>>(INITIAL_WINDOWS);
    const [activeWindowId, setActiveWindowId] = useState<AppId | null>('streaming');
    const [maxZIndex, setMaxZIndex] = useState(1);

    const focusWindow = useCallback((id: AppId) => {
        setActiveWindowId(id);
        setWindows((prev) => {
            if (prev[id].zIndex === maxZIndex) return prev;
            const newMaxZ = maxZIndex + 1;
            setMaxZIndex(newMaxZ);
            return {
                ...prev,
                [id]: { ...prev[id], zIndex: newMaxZ, isMinimized: false },
            };
        });
    }, [maxZIndex]);

    const openWindow = useCallback((id: AppId) => {
        setWindows((prev) => ({
            ...prev,
            [id]: { ...prev[id], isOpen: true, isMinimized: false },
        }));
        focusWindow(id);
    }, [focusWindow]);

    const closeWindow = useCallback((id: AppId) => {
        setWindows((prev) => ({
            ...prev,
            [id]: { ...prev[id], isOpen: false, isMaximized: false },
        }));
    }, []);

    const minimizeWindow = useCallback((id: AppId) => {
        setWindows((prev) => ({
            ...prev,
            [id]: { ...prev[id], isMinimized: true },
        }));
        setActiveWindowId(null);
    }, []);

    const maximizeWindow = useCallback((id: AppId) => {
        setWindows((prev) => ({
            ...prev,
            [id]: { ...prev[id], isMaximized: !prev[id].isMaximized },
        }));
        focusWindow(id);
    }, [focusWindow]);

    return (
        <WindowContext.Provider
            value={{
                windows,
                activeWindowId,
                openWindow,
                closeWindow,
                minimizeWindow,
                maximizeWindow,
                focusWindow,
            }}
        >
            {children}
        </WindowContext.Provider>
    );
}

export function useWindowManager() {
    const context = useContext(WindowContext);
    if (context === undefined) {
        throw new Error('useWindowManager must be used within a WindowProvider');
    }
    return context;
}
