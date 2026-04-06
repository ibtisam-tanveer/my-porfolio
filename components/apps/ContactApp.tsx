'use client';

import { Mail, Send } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';

export default function ContactApp() {
    const { t } = useLanguage();
    return (
        <div className="max-w-md mx-auto p-4 sm:p-6 md:p-8">
            <div className="mb-6 sm:mb-8 text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Mail size={20} className="sm:w-6 sm:h-6" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t.contact.getInTouch}</h2>
                <p className="mt-2 text-xs sm:text-sm text-gray-500">
                    {t.contact.haveProject}
                </p>
            </div>

            <form className="space-y-3 sm:space-y-4">
                <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-700">
                        {t.contact.emailAddress}
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder={t.contact.placeholderEmail}
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-xs font-medium text-gray-700">
                        {t.contact.message}
                    </label>
                    <textarea
                        id="message"
                        rows={4}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder={t.contact.placeholderMessage}
                    />
                </div>

                <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    <Send size={16} />
                    {t.contact.sendMessage}
                </button>
            </form>
        </div>
    );
}
