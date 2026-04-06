'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/providers/LanguageProvider';

export default function NotesApp() {
    const { t } = useLanguage();
    const [content, setContent] = useState(t.notes.cvContent);

    // Update content when language changes
    useEffect(() => {
        setContent(t.notes.cvContent);
    }, [t]);

    return (
        <div className="h-full w-full bg-yellow-50 flex flex-col">
            {/* Notepad Header */}
            <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-2 flex items-center gap-2">
                {/* <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div> */}
                <span className="text-xs text-gray-600 ml-2">{t.notes.cvNotes}</span>
            </div>

            {/* Editable Content Area */}
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 w-full p-6 text-sm sm:text-base font-mono text-gray-800 bg-transparent resize-none focus:outline-none leading-relaxed overflow-auto"
                placeholder={t.notes.startTyping}
                spellCheck={false}
            />
        </div>
    );
}
