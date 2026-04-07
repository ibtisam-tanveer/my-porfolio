'use client';

import MenuBar from './MenuBar';
import Dock from './Dock';
import Window from './Window';
import { WindowProvider } from './WindowManager';
import AboutApp from '../apps/AboutApp';
import ProjectsApp from '../apps/ProjectsApp';
import ContactApp from '../apps/ContactApp';
import TerminalApp from '../apps/TerminalApp';
import SafariApp from '../apps/SafariApp';
import NotesApp from '../apps/NotesApp';
import ResumeApp from '../apps/ResumeApp';
import SnakeApp from '../apps/SnakeApp';
import StreamingApp from '../apps/StreamingApp';
import InstaBlogApp from '../apps/InstaBlogApp';
import DesktopWidgets from './DesktopWidgets';
import SpotlightSearch from './SpotlightSearch';
import VoiceAssistant from './VoiceAssistant';
import OnboardingTour from './OnboardingTour';


function DesktopContent() {
    return (
        <div
            className="relative h-screen w-screen overflow-hidden bg-cover bg-center transition-all duration-500"
            style={{
                 backgroundImage: `url(https://4kwallpapers.com/images/wallpapers/macos-monterey-stock-blue-dark-mode-layers-5k-4480x2520-5895.jpg)`,
            
            }}
        >
      
            <MenuBar />

            <SpotlightSearch />

            <VoiceAssistant />

            <DesktopWidgets />

            <OnboardingTour />

            <div className="pointer-events-none absolute inset-0 top-8 z-40 sm:top-8 bottom-16 sm:bottom-20">
                <Window id="finder">
                    <AboutApp />
                </Window>

                <Window id="vscode">
                    <ProjectsApp />
                </Window>

                <Window id="safari">
                    <SafariApp />
                </Window>

                <Window id="mail">
                    <ContactApp />
                </Window>

                <Window id="terminal">
                    <TerminalApp />
                </Window>

                <Window id="notes">
                    <NotesApp />
                </Window>

                <Window id="resume">
                    <ResumeApp />
                </Window>

                <Window id="snake">
                    <SnakeApp />
                </Window>

                <Window id="streaming">
                    <StreamingApp />
                </Window>

                <Window id="instablog">
                    <InstaBlogApp />
                </Window>
            </div>

            <Dock />
        </div>
    );
}

export default function Desktop() {
    return (
        <WindowProvider>
            <DesktopContent />
        </WindowProvider>
    );
}
