'use client';

import { useState, useEffect, useRef } from 'react';
import { Wifi, Battery, Search, Command, Sun, Volume2, Globe, Calendar, Clock, ExternalLink } from 'lucide-react';
import SiriOrbIcon from '@/components/os/SiriOrbIcon';
import { useLanguage } from '@/providers/LanguageProvider';
import { Language } from '@/lib/i18n';
import { portfolioConfig } from '@/lib/portfolio-config';
import { OPEN_SPOTLIGHT_EVENT } from '@/components/os/SpotlightSearch';
import { OPEN_VOICE_ASSISTANT_EVENT } from '@/components/os/VoiceAssistant';

export default function MenuBar() {
    const { t, language, setLanguage } = useLanguage();
    const [time, setTime] = useState<string>('');
    const [brightness, setBrightness] = useState<number>(100);
    const [volume, setVolume] = useState<number>(70);
    const [showBrightness, setShowBrightness] = useState<boolean>(false);
    const [showVolume, setShowVolume] = useState<boolean>(false);
    const [showLanguage, setShowLanguage] = useState<boolean>(false);
    const [showAvailability, setShowAvailability] = useState<boolean>(false);
    const [localTime, setLocalTime] = useState<string>('');
    const brightnessRef = useRef<HTMLDivElement>(null);
    const volumeRef = useRef<HTMLDivElement>(null);
    const languageRef = useRef<HTMLDivElement>(null);
    const availabilityRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const locale = language === 'de' ? 'de-DE' : language === 'ur' ? 'ur-PK' : 'en-US';
            setTime(now.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit', hour12: true }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [language]);

    const { timezone, status, bookingUrl } = portfolioConfig.availability;

    useEffect(() => {
        const tick = () => {
            const locale = language === 'de' ? 'de-DE' : language === 'ur' ? 'ur-PK' : 'en-US';
            setLocalTime(
                new Date().toLocaleTimeString(locale, {
                    timeZone: timezone,
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                })
            );
        };
        tick();
        const interval = setInterval(tick, 30_000);
        return () => clearInterval(interval);
    }, [language, timezone]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (brightnessRef.current && !brightnessRef.current.contains(event.target as Node)) {
                setShowBrightness(false);
            }
            if (volumeRef.current && !volumeRef.current.contains(event.target as Node)) {
                setShowVolume(false);
            }
            if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
                setShowLanguage(false);
            }
            if (availabilityRef.current && !availabilityRef.current.contains(event.target as Node)) {
                setShowAvailability(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Apply brightness filter to the entire page in real-time
    useEffect(() => {
        // Convert brightness (0-100) to CSS brightness filter (0-1.5, where 1 = normal)
        // Map 0% -> 0.4 (very dim), 100% -> 1.0 (normal brightness)
        const brightnessValue = 0.4 + (brightness / 100) * 0.6;
        const rootElement = document.documentElement;
        rootElement.style.filter = `brightness(${brightnessValue})`;
        rootElement.style.transition = 'filter 0.15s ease-out';
        
        return () => {
            rootElement.style.filter = '';
            rootElement.style.transition = '';
        };
    }, [brightness]);

    const toggleBrightness = () => {
        setShowBrightness(!showBrightness);
        setShowVolume(false);
        setShowLanguage(false);
        setShowAvailability(false);
    };

    const toggleVolume = () => {
        setShowVolume(!showVolume);
        setShowBrightness(false);
        setShowLanguage(false);
        setShowAvailability(false);
    };

    const toggleLanguage = () => {
        setShowLanguage(!showLanguage);
        setShowBrightness(false);
        setShowVolume(false);
        setShowAvailability(false);
    };

    const toggleAvailability = () => {
        setShowAvailability(!showAvailability);
        setShowBrightness(false);
        setShowVolume(false);
        setShowLanguage(false);
    };

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
        setShowLanguage(false);
    };

    const openSpotlight = () => {
        window.dispatchEvent(new CustomEvent(OPEN_SPOTLIGHT_EVENT));
    };

    const openVoiceAssistant = () => {
        window.dispatchEvent(new CustomEvent(OPEN_VOICE_ASSISTANT_EVENT));
    };

    return (
        <div
            data-tour="menubar"
            className="fixed top-0 left-0 right-0 z-50 flex h-8 sm:h-8 w-full items-center justify-between bg-white/20 px-2 sm:px-4 text-xs font-medium text-white backdrop-blur-md"
        >
            <div className="flex items-center gap-1 sm:gap-4">
                <span className="text-sm font-bold"></span>
                <span className="hidden font-semibold sm:inline">{t.menuBar.portfolio}</span>
                <span className="hidden md:inline">{t.menuBar.file}</span>
                <span className="hidden md:inline">{t.menuBar.edit}</span>
                <span className="hidden lg:inline">{t.menuBar.view}</span>
                <span className="hidden lg:inline">{t.menuBar.go}</span>
                <span className="hidden lg:inline">{t.menuBar.window}</span>
                <span className="hidden lg:inline">{t.menuBar.help}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 md:gap-4 relative">
                {/* Brightness Control */}
                <div className="relative" ref={brightnessRef}>
                    <button
                        onClick={toggleBrightness}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title={t.menuBar.brightness}
                    >
                        <Sun size={14} className="sm:w-4 sm:h-4" />
                    </button>
                    {showBrightness && (
                        <div className="absolute top-full right-0 mt-2 bg-gray-800/95 backdrop-blur-md rounded-lg p-3 shadow-2xl border border-gray-700 min-w-[200px] z-50">
                            <div className="flex items-center gap-2 mb-3">
                                <Sun size={16} className="text-gray-400" />
                                <span className="text-xs text-gray-300 font-medium">{t.menuBar.brightness}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Sun size={14} className="text-gray-500 flex-shrink-0" />
                                <div className="flex-1 relative px-1.5">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={brightness}
                                        onChange={(e) => setBrightness(Number(e.target.value))}
                                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                        style={{
                                            background: `linear-gradient(to right, #ffffff 0%, #ffffff ${brightness}%, #4a4a4a ${brightness}%, #4a4a4a 100%)`
                                        }}
                                    />
                                </div>
                                <span className="text-xs text-gray-400 w-8 text-right font-mono">{brightness}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Volume Control */}
                <div className="relative" ref={volumeRef}>
                    <button
                        onClick={toggleVolume}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title={t.menuBar.sound}
                    >
                        <Volume2 size={14} className="sm:w-4 sm:h-4" />
                    </button>
                    {showVolume && (
                        <div className="absolute top-full right-0 mt-2 bg-gray-800/95 backdrop-blur-md rounded-lg p-3 shadow-2xl border border-gray-700 min-w-[200px] z-50">
                            <div className="flex items-center gap-2 mb-3">
                                <Volume2 size={16} className="text-gray-400" />
                                <span className="text-xs text-gray-300 font-medium">{t.menuBar.sound}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Volume2 size={14} className="text-gray-500 flex-shrink-0" />
                                <div className="flex-1 relative px-1.5">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={volume}
                                        onChange={(e) => setVolume(Number(e.target.value))}
                                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                        style={{
                                            background: `linear-gradient(to right, #ffffff 0%, #ffffff ${volume}%, #4a4a4a ${volume}%, #4a4a4a 100%)`
                                        }}
                                    />
                                </div>
                                <span className="text-xs text-gray-400 w-8 text-right font-mono">{volume}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Language Control */}
                <div className="relative" ref={languageRef}>
                    <button
                        onClick={toggleLanguage}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title={t.menuBar.language}
                    >
                        <Globe size={14} className="sm:w-4 sm:h-4" />
                    </button>
                    {showLanguage && (
                        <div className="absolute top-full right-0 mt-2 bg-gray-800/95 backdrop-blur-md rounded-lg p-2 shadow-2xl border border-gray-700 min-w-[150px] z-50">
                            <div className="flex items-center gap-2 mb-2 px-2">
                                <Globe size={16} className="text-gray-400" />
                                <span className="text-xs text-gray-300 font-medium">{t.menuBar.language}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <button
                                    onClick={() => handleLanguageChange('en')}
                                    className={`text-left px-3 py-2 rounded text-xs transition-colors ${
                                        language === 'en'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-700'
                                    }`}
                                >
                                    English
                                </button>
                                <button
                                    onClick={() => handleLanguageChange('de')}
                                    className={`text-left px-3 py-2 rounded text-xs transition-colors ${
                                        language === 'de'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-700'
                                    }`}
                                >
                                    Deutsch
                                </button>
                                <button
                                    onClick={() => handleLanguageChange('ur')}
                                    className={`text-left px-3 py-2 rounded text-xs transition-colors ${
                                        language === 'ur'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-300 hover:bg-gray-700'
                                    }`}
                                >
                                    اردو
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="relative" ref={availabilityRef}>
                    <button
                        type="button"
                        onClick={toggleAvailability}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                        title={t.menuBar.availability}
                    >
                        <Calendar size={14} className="sm:w-4 sm:h-4" />
                    </button>
                    {showAvailability && (
                        <div className="absolute top-full right-0 mt-2 min-w-[220px] rounded-lg border border-gray-700 bg-gray-800/95 p-3 shadow-2xl backdrop-blur-md z-50">
                            <div className="mb-2 flex items-center gap-2 text-gray-300">
                                <Calendar size={16} className="text-gray-400" />
                                <span className="text-xs font-medium">{t.menuBar.availability}</span>
                            </div>
                            <div className="flex items-center gap-2 font-mono text-sm text-white">
                                <Clock size={14} className="text-gray-400" />
                                {localTime}
                            </div>
                            <p className="mt-1 text-[10px] text-gray-500">{timezone.replace(/_/g, ' ')}</p>
                            <p className="mt-2 text-xs leading-snug text-gray-200">{status}</p>
                            {bookingUrl ? (
                                <a
                                    href={bookingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                                >
                                    {t.widgets.bookCall}
                                    <ExternalLink size={12} />
                                </a>
                            ) : null}
                        </div>
                    )}
                </div>

                <Battery size={14} className="sm:w-4 sm:h-4" />
                <Wifi size={14} className="sm:w-4 sm:h-4" />
                <button
                    type="button"
                    onClick={openVoiceAssistant}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    title={t.assistant.open}
                    data-tour="assistant-button"
                >
                    <SiriOrbIcon size={14} className="shrink-0" />
                </button>
                <button
                    type="button"
                    onClick={openSpotlight}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                    title={t.spotlight.title}
                    data-tour="spotlight-button"
                >
                    <Search size={14} className="sm:w-4 sm:h-4" />
                </button>
                <button
                    type="button"
                    onClick={openSpotlight}
                    className="p-1 hover:bg-white/10 rounded transition-colors hidden sm:block"
                    title={`${t.spotlight.title} (${t.spotlight.shortcut})`}
                >
                    <Command size={14} className="sm:w-4 sm:h-4" />
                </button>
                <span className="text-[10px] sm:text-xs">{time}</span>
            </div>
        </div>
    );
}
