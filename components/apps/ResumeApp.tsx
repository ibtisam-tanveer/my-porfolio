'use client';

import { Download } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { portfolioConfig } from '@/lib/portfolio-config';

export default function ResumeApp() {
    const { t } = useLanguage();
    const { pdfPath, downloadFileName } = portfolioConfig.resume;

    return (
        <div className="flex h-full min-h-0 flex-col bg-[#f5f5f7]">
            <div className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-gray-200 bg-white px-3 py-2 sm:px-4">
                <p className="text-xs text-gray-500 sm:text-sm">{t.resumeWindow.subtitle}</p>
                <a
                    href={pdfPath}
                    download={downloadFileName}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:text-sm"
                >
                    <Download size={16} className="shrink-0" />
                    {t.resumeWindow.download}
                </a>
            </div>
            <div className="relative min-h-0 flex-1 bg-neutral-200">
                <iframe
                    title={t.resumeWindow.title}
                    src={`${pdfPath}#view=FitH`}
                    className="absolute inset-0 h-full w-full border-0"
                />
            </div>
        </div>
    );
}
