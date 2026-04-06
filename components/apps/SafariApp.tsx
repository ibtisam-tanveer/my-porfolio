'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Plus, X, Home, Share2, BookOpen } from 'lucide-react';
import { Linkedin, Mail, Github, Globe, FileText } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { Translations } from '@/lib/i18n';

type Tab = {
    id: string;
    title: string;
    url: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    content?: React.ReactNode | null;
};

// URL to content mapping
const urlMapping: Record<string, { title: string; icon: React.ComponentType<{ size?: number; className?: string }>; contentKey: string }> = {
    'linkedin.com/in/ibtisam-tanveer': { title: 'LinkedIn', icon: Linkedin, contentKey: 'linkedin' },
    'www.linkedin.com/in/ibtisam-tanveer': { title: 'LinkedIn', icon: Linkedin, contentKey: 'linkedin' },
    'linkedin.com': { title: 'LinkedIn', icon: Linkedin, contentKey: 'linkedin' },
    'ibtisam.tanveer22@gmail.com': { title: 'Email', icon: Mail, contentKey: 'email' },
    'mailto:ibtisam.tanveer22@gmail.com': { title: 'Email', icon: Mail, contentKey: 'email' },
    'github.com/ibtisam-tanveer': { title: 'GitHub', icon: Github, contentKey: 'github' },
    'www.github.com/ibtisam-tanveer': { title: 'GitHub', icon: Github, contentKey: 'github' },
    'github.com': { title: 'GitHub', icon: Github, contentKey: 'github' },
};

function getTabFromUrl(url: string, t: Translations): { title: string; icon: React.ComponentType<{ size?: number; className?: string }>; contentKey: string } {
    // Normalize URL
    const normalizedUrl = url.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    
    // Try exact match first
    if (urlMapping[url.trim().toLowerCase()]) {
        return urlMapping[url.trim().toLowerCase()];
    }
    
    // Try normalized match
    for (const [key, value] of Object.entries(urlMapping)) {
        if (key.toLowerCase().includes(normalizedUrl) || normalizedUrl.includes(key.toLowerCase())) {
            return value;
        }
    }
    
    // Default to new tab
    return { title: t.safari.newTab, icon: Globe, contentKey: 'newtab' };
}

function getContentByKey(contentKey: string, onNavigate?: (url: string) => void) {
    switch (contentKey) {
        case 'linkedin':
            return <LinkedInContent />;
        case 'email':
            return <EmailContent />;
        case 'github':
            return <GitHubContent />;
        case 'newtab':
            return onNavigate ? <NewTabContent onNavigate={onNavigate} /> : <NewTabContent onNavigate={() => {}} />;
        default:
            return onNavigate ? <NewTabContent onNavigate={onNavigate} /> : <NewTabContent onNavigate={() => {}} />;
    }
}

export default function SafariApp() {
    const { t } = useLanguage();
    const [tabs, setTabs] = useState<Tab[]>([
        {
            id: '1',
            title: 'LinkedIn',
            url: 'linkedin.com/in/ibtisam-tanveer',
            icon: Linkedin,
            content: null
        },
        {
            id: '2',
            title: 'Email',
            url: 'ibtisam.tanveer22@gmail.com',
            icon: Mail,
            content: null
        },
        {
            id: '3',
            title: 'GitHub',
            url: 'github.com/ibtisam-tanveer',
            icon: Github,
            content: null
        }
    ]);
    const [activeTabId, setActiveTabId] = useState('1');
    const [urlInput, setUrlInput] = useState('');

    const activeTab = tabs.find(tab => tab.id === activeTabId) || tabs[0];

    const navigateToUrl = (url: string) => {
        if (!url.trim()) return;

        // Check if a tab with this URL already exists
        const existingTab = tabs.find(tab => tab.url.toLowerCase() === url.trim().toLowerCase());
        if (existingTab) {
            setActiveTabId(existingTab.id);
            setUrlInput('');
            return;
        }

        // Get content for the URL
        const tabData = getTabFromUrl(url, t);
        
        // Update current tab
        setTabs(tabs.map(tab => 
            tab.id === activeTabId 
                ? { ...tab, url: url.trim(), title: tabData.title, icon: tabData.icon, content: null }
                : tab
        ));
        setUrlInput('');
    };

    const addNewTab = () => {
        const newTab: Tab = {
            id: Date.now().toString(),
            title: t.safari.newTab,
            url: '',
            icon: Globe,
            content: null
        };
        setTabs([...tabs, newTab]);
        setActiveTabId(newTab.id);
        setUrlInput('');
    };

    const closeTab = (tabId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newTabs = tabs.filter(tab => tab.id !== tabId);
        if (newTabs.length === 0) {
            return;
        }
        setTabs(newTabs);
        if (activeTabId === tabId) {
            setActiveTabId(newTabs[newTabs.length - 1].id);
        }
    };

    // Update urlInput when active tab changes
    useEffect(() => {
        setUrlInput(activeTab.url);
    }, [activeTab.id, activeTab.url]);

    return (
        <div className="flex flex-col h-full w-full bg-white">
            {/* Safari Toolbar */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded hover:bg-gray-200 transition-colors" title={t.safari.back}>
                        <ChevronLeft size={16} className="text-gray-600" />
                    </button>
                    <button className="p-1.5 rounded hover:bg-gray-200 transition-colors" title={t.safari.forward}>
                        <ChevronRight size={16} className="text-gray-600" />
                    </button>
                    <button className="p-1.5 rounded hover:bg-gray-200 transition-colors" title={t.safari.reload}>
                        <RotateCw size={16} className="text-gray-600" />
                    </button>
                </div>
                <div className="flex-1 flex items-center gap-2 mx-2">
                    <div 
                        className="flex-1 flex items-center bg-white rounded-lg border border-gray-300 px-3 py-1.5 shadow-sm cursor-text"
                        onClick={(e) => {
                            if (e.target instanceof HTMLElement && e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
                                const input = e.currentTarget.querySelector('input');
                                input?.focus();
                            }
                        }}
                    >
                        <activeTab.icon size={16} className="text-gray-500 mr-2 flex-shrink-0" />
                        <input
                            type="text"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    navigateToUrl(urlInput);
                                    e.currentTarget.blur();
                                }
                            }}
                            onFocus={(e) => e.currentTarget.select()}
                            className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
                            placeholder={t.safari.enterUrl}
                        />
                        <div className="flex items-center gap-1 ml-2">
                            <button 
                                onClick={() => navigateToUrl(urlInput)}
                                className="p-1 rounded hover:bg-gray-100 text-blue-600 font-medium text-xs px-2"
                                title={t.safari.go}
                            >
                                {t.safari.go}
                            </button>
                            <button className="p-1 rounded hover:bg-gray-100" title={t.safari.share}>
                                <Share2 size={14} className="text-gray-500" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded hover:bg-gray-200 transition-colors" title={t.safari.bookmarks}>
                        <BookOpen size={16} className="text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Tabs Bar */}
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 border-b border-gray-200 overflow-x-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = tab.id === activeTabId;
                    return (
                        <div
                            key={tab.id}
                            onClick={() => setActiveTabId(tab.id)}
                            className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-lg cursor-pointer transition-colors min-w-[120px] max-w-[240px] ${
                                isActive
                                    ? 'bg-white border-t border-l border-r border-gray-300 text-gray-900'
                                    : 'bg-gray-200/50 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <Icon size={14} className="flex-shrink-0" />
                            <span className="text-xs font-medium truncate flex-1">{tab.title}</span>
                            <button
                                onClick={(e) => closeTab(tab.id, e)}
                                className={`p-0.5 rounded hover:bg-gray-300 transition-all flex-shrink-0 ${
                                    isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                }`}
                            >
                                <X size={12} className="text-gray-500" />
                            </button>
                        </div>
                    );
                })}
                <button
                    onClick={addNewTab}
                    className="p-1.5 rounded hover:bg-gray-200 transition-colors ml-1"
                    title={t.safari.newTab}
                >
                    <Plus size={16} className="text-gray-600" />
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto bg-white">
                {activeTab.url === '' ? (
                    <NewTabContent onNavigate={navigateToUrl} />
                ) : (() => {
                    const tabData = getTabFromUrl(activeTab.url, t);
                    return getContentByKey(tabData.contentKey, navigateToUrl);
                })()}
            </div>
        </div>
    );
}

function LinkedInContent() {
    const { t } = useLanguage();
    return (
        <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="text-center max-w-md p-8">
                <div className="mb-6">
                    <Linkedin size={64} className="text-blue-600 mx-auto" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.safari.linkedInProfile}</h2>
                <p className="text-gray-700 mb-6">
                    {t.safari.connectLinkedIn}
                </p>
                <a
                    href="https://www.linkedin.com/in/ibtisam-tanveer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg"
                >
                    <Linkedin size={20} />
                    {t.safari.visitLinkedIn}
                </a>
            </div>
        </div>
    );
}

function EmailContent() {
    const { t } = useLanguage();
    return (
        <div className="h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
            <div className="text-center max-w-md p-8">
                <div className="mb-6">
                    <Mail size={64} className="text-red-600 mx-auto" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.safari.getInTouch}</h2>
                <p className="text-gray-700 mb-2">
                    {t.safari.reachOut}
                </p>
                <div className="bg-white rounded-lg p-6 mt-6 shadow-lg">
                    <p className="text-lg font-semibold text-gray-900 mb-2">{t.contact.emailAddress}</p>
                    <a
                        href="mailto:ibtisam.tanveer22@gmail.com"
                        className="text-blue-600 hover:text-blue-700 text-lg font-medium break-all"
                    >
                        ibtisam.tanveer22@gmail.com
                    </a>
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">{t.safari.phone}</p>
                        <a
                            href="tel:+4915755783296"
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            +49 157 55783296
                        </a>
                    </div>
                </div>
                <a
                    href="mailto:ibtisam.tanveer22@gmail.com"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg mt-6"
                >
                    <Mail size={20} />
                    {t.safari.sendEmail}
                </a>
            </div>
        </div>
    );
}

function GitHubContent() {
    const { t } = useLanguage();
    return (
        <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="text-center max-w-md p-8">
                <div className="mb-6">
                    <Github size={64} className="text-gray-900 mx-auto" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.safari.githubProfile}</h2>
                <p className="text-gray-700 mb-6">
                    {t.safari.exploreGithub}
                </p>
                <div className="bg-white rounded-lg p-6 mt-6 shadow-lg text-left">
                    <h3 className="font-semibold text-gray-900 mb-3">{t.safari.featuredRepos}</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                            <span className="text-gray-400 mr-2">•</span>
                            <span>WAM Studio — diagram editor (Next.js, React Flow)</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-gray-400 mr-2">•</span>
                            <span>PIMdesk / e-commerce tooling</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-gray-400 mr-2">•</span>
                            <span>Pushka Hub — React Native</span>
                        </li>
                        <li className="flex items-start">
                            <span className="text-gray-400 mr-2">•</span>
                            <span>ML & Flutter apps from earlier roles</span>
                        </li>
                    </ul>
                    <p className="text-xs text-gray-500 mt-4">{t.safari.repositoriesAvailable}</p>
                </div>
                <a
                    href="https://github.com/ibtisam-tanveer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors shadow-lg mt-6"
                >
                    <Github size={20} />
                    {t.safari.visitGithub}
                </a>
            </div>
        </div>
    );
}

function NewTabContent({ onNavigate }: { onNavigate: (url: string) => void }) {
    const { t } = useLanguage();
    return (
        <div className="h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="text-center max-w-md p-8">
                <div className="mb-6">
                    <Home size={64} className="text-blue-600 mx-auto" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.safari.newTab}</h2>
                <p className="text-gray-700 mb-6">
                    {t.safari.startBrowsing}
                </p>
                <div className="grid grid-cols-2 gap-4 mt-8">
                    <QuickLink 
                        icon={Linkedin} 
                        label="LinkedIn" 
                        color="blue" 
                        url="linkedin.com/in/ibtisam-tanveer"
                        onNavigate={onNavigate}
                    />
                    <QuickLink 
                        icon={Mail} 
                        label="Email" 
                        color="red" 
                        url="ibtisam.tanveer22@gmail.com"
                        onNavigate={onNavigate}
                    />
                    <QuickLink 
                        icon={Github} 
                        label="GitHub" 
                        color="gray" 
                        url="github.com/ibtisam-tanveer"
                        onNavigate={onNavigate}
                    />
                    <QuickLink 
                        icon={FileText} 
                        label={t.safari.resume} 
                        color="purple" 
                        url=""
                        onNavigate={() => {}}
                    />
                </div>
            </div>
        </div>
    );
}

function QuickLink({ 
    icon: Icon, 
    label, 
    color, 
    url, 
    onNavigate 
}: { 
    icon: React.ComponentType<{ size?: number; className?: string }>, 
    label: string, 
    color: string,
    url: string,
    onNavigate: (url: string) => void
}) {
    const colorClasses = {
        blue: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
        red: 'bg-red-100 hover:bg-red-200 text-red-700',
        gray: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
        purple: 'bg-purple-100 hover:bg-purple-200 text-purple-700',
    };

    return (
        <button 
            onClick={() => url && onNavigate(url)}
            className={`p-4 rounded-lg transition-colors ${colorClasses[color as keyof typeof colorClasses]}`}
        >
            <Icon size={24} className="mx-auto mb-2" />
            <span className="text-sm font-medium">{label}</span>
        </button>
    );
}
