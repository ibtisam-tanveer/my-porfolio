'use client';

import { FileCode, Folder, Search, GitBranch, Settings, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/providers/LanguageProvider';

const projects = [
    {
        id: 1,
        name: 'wam-studio-editor.tsx',
        description:
            '// WAM Studio — collaborative Web Architecture Modeling editor\n// Next.js App Router, React 19, React Flow canvas, REST + real-time collab\n// Export JSON / PNG / PDF for documentation handoff',
        tags: ['Next.js', 'React 19', 'TypeScript', 'React Flow', 'Tailwind'],
    },
    {
        id: 2,
        name: 'smart-energy-banking.tsx',
        description:
            '// Frontend-focused banking platform (retail / business / junior)\n// Next.js 15, Redux Toolkit, TanStack Query, next-intl, WebSockets\n// KYC/KYB, wallets, transfers, subscriptions, support tickets',
        tags: ['Next.js 15', 'React 19', 'Redux', 'TanStack Query'],
    },
    {
        id: 3,
        name: 'pimdesk-catalog.vue',
        description:
            '// PIMdesk — product information management at scale\n// Vue.js UI: bulk upload, attributes, images, search & filters\n// NestJS / Rails integrations for multi-channel commerce',
        tags: ['Vue.js', 'NestJS', 'Rails', 'Shopify'],
    },
    {
        id: 4,
        name: 'pushka-hub-mobile.tsx',
        description:
            '// Pushka Hub — React Native wallet & transactions\n// Secure flows against Ruby on Rails APIs; Android + iOS polish',
        tags: ['React Native', 'Ruby on Rails'],
    },
    {
        id: 5,
        name: 'aat-wholesale-app.tsx',
        description:
            '// AAT Wholesale — React Native + Laravel\n// 10k+ SKU catalog, search, categories, wishlists, push, reviews',
        tags: ['React Native', 'Laravel'],
    },
    {
        id: 6,
        name: 'sngpl-consumer-app.dart',
        description:
            '// SNGPL field app — meter reading & complaints (Flutter)\n// Location-aware routing; 50k+ Play Store downloads',
        tags: ['Flutter', 'Provider'],
    },
    {
        id: 7,
        name: 'ocean-personality-ml.py',
        description:
            '# OCEAN personality prediction — TensorFlow + OpenCV\n# 10k+ videos processed; Flask API for mobile inference',
        tags: ['Python', 'TensorFlow', 'Flask', 'OpenCV'],
    },
];

export default function ProjectsApp() {
    const { t } = useLanguage();
    const [activeFile, setActiveFile] = useState(projects[0]);

    return (
        <div className="flex h-full w-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm">
            {/* Activity Bar */}
            <div className="hidden sm:flex w-10 sm:w-12 flex-col items-center py-4 bg-[#333333] border-r border-[#1e1e1e] gap-4 text-[#858585]">
                <FileCode size={20} className="sm:w-6 sm:h-6 text-white" />
                <Search size={20} className="sm:w-6 sm:h-6" />
                <GitBranch size={20} className="sm:w-6 sm:h-6" />
                <div className="flex-1" />
                <Settings size={20} className="sm:w-6 sm:h-6" />
            </div>

            {/* Sidebar */}
            <div className="hidden md:flex w-48 md:w-60 bg-[#252526] flex-col">
                <div className="h-10 flex items-center px-4 text-xs font-bold tracking-wider text-[#bbbbbb]">{t.projects.explorer}</div>
                <div className="px-2">
                    <div className="flex items-center gap-1 text-[#bbbbbb] mb-1">
                        <ChevronDown size={14} />
                        <span className="font-bold text-xs">{t.projects.portfolio}</span>
                    </div>
                    <div className="pl-4 flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-[#bbbbbb]">
                            <ChevronDown size={14} />
                            <Folder size={14} className="text-blue-400" />
                            <span>{t.projects.src}</span>
                        </div>
                        <div className="pl-4 flex flex-col">
                            {projects.map((p) => (
                                <div
                                    key={p.id}
                                    className={`flex items-center gap-2 px-2 py-1 cursor-pointer ${activeFile.id === p.id ? 'bg-[#37373d] text-white' : 'text-[#969696] hover:bg-[#2a2d2e]'}`}
                                    onClick={() => setActiveFile(p)}
                                >
                                    <FileCode size={14} className="text-yellow-400" />
                                    <span>{p.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex flex-col bg-[#1e1e1e]">
                {/* Tabs */}
                <div className="flex bg-[#252526] overflow-x-auto">
                    {projects.map((p) => (
                        <div
                            key={p.id}
                            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-[10px] sm:text-xs border-r border-[#1e1e1e] cursor-pointer whitespace-nowrap ${activeFile.id === p.id ? 'bg-[#1e1e1e] text-white border-t-2 border-t-blue-500' : 'bg-[#2d2d2d] text-[#969696]'}`}
                            onClick={() => setActiveFile(p)}
                        >
                            <FileCode size={12} className="sm:w-3.5 sm:h-3.5 text-yellow-400" />
                            <span className="hidden sm:inline">{p.name}</span>
                            <span className="sm:hidden">{p.name.split('.')[0]}</span>
                            <X size={10} className="sm:w-3 sm:h-3 hover:bg-[#444] rounded-sm p-0.5 hidden sm:block" />
                        </div>
                    ))}
                </div>

                {/* Code Content */}
                <div className="flex-1 p-2 sm:p-4 overflow-auto">
                    <div className="flex gap-2 sm:gap-4">
                        <div className="hidden sm:flex flex-col text-right text-[#858585] select-none">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <span key={i} className="leading-6">{i + 1}</span>
                            ))}
                        </div>
                        <div className="flex-1 text-xs sm:text-sm">
                            <div className="text-[#6a9955] mb-4 whitespace-pre-wrap">{activeFile.description}</div>
                            <div className="text-[#569cd6]">import</div> <span className="text-[#9cdcfe]">React</span> <div className="text-[#569cd6]">from</div> <span className="text-[#ce9178]">'react'</span>;
                            <br />
                            <div className="text-[#569cd6]">export default function</div> <span className="text-[#dcdcaa]">{activeFile.name.split('.')[0].replace(/-/g, '')}</span>() {'{'}
                            <br />
                            &nbsp;&nbsp;<div className="text-[#569cd6]">return</div> (
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-[#4ec9b0]">div</span> className=<span className="text-[#ce9178]">'project-card'</span>&gt;
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-[#4ec9b0]">h1</span>&gt;{activeFile.name}&lt;/<span className="text-[#4ec9b0]">h1</span>&gt;
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'{/* Tech Stack */}'}
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-[#4ec9b0]">div</span> className=<span className="text-[#ce9178]">'tags'</span>&gt;
                            <br />
                            {activeFile.tags.map(tag => (
                                <div key={tag}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-[#4ec9b0]">span</span>&gt;{tag}&lt;/<span className="text-[#4ec9b0]">span</span>&gt;</div>
                            ))}
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-[#4ec9b0]">div</span>&gt;
                            <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-[#4ec9b0]">div</span>&gt;
                            <br />
                            &nbsp;&nbsp;);
                            <br />
                            {'}'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
