'use client';

import { useState } from 'react';
import Image from 'next/image';
import { HardDrive, Clock, User, Briefcase, GraduationCap, Code, FolderOpen, Info, FileText } from 'lucide-react';
import { useLanguage } from '@/providers/LanguageProvider';
import { useWindowManager } from '@/components/os/WindowManager';

type Tab = 'profile' | 'skills' | 'education' | 'experience' | 'projects' | 'additional';

export default function AboutApp() {
    const { t } = useLanguage();
    const { openWindow } = useWindowManager();
    const [activeTab, setActiveTab] = useState<Tab>('profile');

    const tabs = [
        { id: 'profile' as Tab, label: t.about.profile, icon: User },
        { id: 'skills' as Tab, label: t.about.skills, icon: Code },
        { id: 'education' as Tab, label: t.about.education, icon: GraduationCap },
        { id: 'experience' as Tab, label: t.about.experience, icon: Briefcase },
        { id: 'projects' as Tab, label: t.about.projects, icon: FolderOpen },
        { id: 'additional' as Tab, label: t.about.additional, icon: Info },
    ];

    return (
        <div className="flex h-full w-full bg-white">
            {/* Sidebar */}
            <div className="hidden sm:flex w-32 sm:w-48 bg-gray-100/80 p-2 backdrop-blur-xl border-r border-gray-200 flex-col gap-1">
                <div className="px-2 py-1 text-xs font-semibold text-gray-500">{t.about.resume}</div>
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors text-left w-full ${
                                activeTab === tab.id
                                    ? 'bg-gray-300/50 text-gray-900'
                                    : 'text-gray-600 hover:bg-gray-200/50'
                            }`}
                        >
                            <Icon size={16} />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}

                <div className="mt-4 px-2 py-1 text-xs font-semibold text-gray-500">{t.about.documents}</div>
                <button
                    type="button"
                    onClick={() => openWindow('resume')}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-gray-700 transition-colors hover:bg-gray-200/50"
                >
                    <FileText size={16} className="shrink-0 text-red-500" />
                    <span className="truncate">{t.about.resumePdfFile}</span>
                </button>

                <div className="mt-4 px-2 py-1 text-xs font-semibold text-gray-500">{t.about.locations}</div>
                <SidebarItem icon={<HardDrive size={16} />} label={t.about.macintoshHD} />
                <SidebarItem icon={<Clock size={16} />} label={t.about.network} />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Tabs */}
                <div className="sm:hidden flex border-b border-gray-200 bg-gray-50/50 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                                    activeTab === tab.id
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
                                }`}
                            >
                                <Icon size={16} />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
                    {activeTab === 'profile' && <ProfileTab onOpenResume={() => openWindow('resume')} />}
                    {activeTab === 'skills' && <SkillsTab />}
                    {activeTab === 'education' && <EducationTab />}
                    {activeTab === 'experience' && <ExperienceTab />}
                    {activeTab === 'projects' && <ProjectsTab />}
                    {activeTab === 'additional' && <AdditionalTab />}
                </div>
            </div>
        </div>
    );
}

function ProfileTab({ onOpenResume }: { onOpenResume: () => void }) {
    const { t } = useLanguage();
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="sm:hidden">
                <button
                    type="button"
                    onClick={onOpenResume}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50 py-3 text-sm font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-100"
                >
                    <FileText size={18} className="text-red-500" />
                    {t.about.openResumePdf}
                </button>
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full shadow-xl ring-2 ring-gray-200/80">
                    <Image
                        src="/profile.jpg"
                        alt={t.about.title}
                        width={256}
                        height={256}
                        className="h-full w-full object-cover object-[center_20%]"
                        sizes="128px"
                        priority
                    />
                </div>
                <div className="text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.about.title}</h1>
                    <p className="text-lg text-gray-600 mb-4">{t.about.subtitle}</p>
                    <div className="flex flex-col sm:flex-row gap-2 text-sm text-gray-500">
                        <a href="tel:+4915755783296" className="hover:text-blue-600">+49 157 55783296</a>
                        <span className="hidden sm:inline">|</span>
                        <a href="mailto:ibtisam.tanveer22@gmail.com" className="hover:text-blue-600">ibtisam.tanveer22@gmail.com</a>
                        <span className="hidden sm:inline">|</span>
                        <a href="https://www.linkedin.com/in/ibtisam-tanveer" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">LinkedIn</a>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.about.profileSummary}</h2>
                <p className="text-gray-700 leading-relaxed">
                    {t.about.profileSummaryText}
                </p>
            </div>
        </div>
    );
}

function SkillsTab() {
    const { t } = useLanguage();
    const skillCategories = [
        {
            title: t.about.programmingLanguages,
            skills: ['JavaScript (ES6+)', 'TypeScript', 'Python', 'SQL'],
        },
        {
            title: t.about.frontend,
            skills: [
                'React',
                'Next.js (App Router)',
                'Vue.js',
                'Redux Toolkit',
                'TanStack Query',
                'Tailwind CSS',
                'Material UI',
                'HTML5',
                'CSS3 / SCSS',
                'Responsive design',
            ],
        },
        {
            title: t.about.backendDatabases,
            skills: [
                'Node.js',
                'Express.js',
                'NestJS',
                'Flask',
                'Django',
                'REST APIs',
                'JWT',
                'PostgreSQL',
                'MongoDB',
            ],
        },
        {
            title: t.about.toolsTechnologies,
            skills: [
                'Git',
                'GitHub',
                'GitLab',
                'VS Code',
                'Jira',
                'Postman',
                'Android Studio',
                'Jupyter Notebook',
                'Figma',
                'Vercel',
                'AWS (EC2, S3)',
            ],
        },
        {
            title: t.about.machineLearning,
            skills: ['TensorFlow', 'Scikit-learn', 'OpenCV', 'Pandas', 'Matplotlib'],
        },
        {
            title: t.about.practices,
            skills: [
                'Clean architecture',
                'Design patterns',
                'Debugging',
                'Code review',
                'Unit testing',
                'Agile / Scrum',
                'ClickUp',
            ],
        },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">{t.about.skills}</h2>
            <div className="space-y-6">
                {skillCategories.map((category, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.title}</h3>
                        <div className="flex flex-wrap gap-2">
                            {category.skills.map((skill, skillIndex) => (
                                <span
                                    key={skillIndex}
                                    className="px-3 py-1.5 bg-white rounded-md text-sm font-medium text-gray-700 border border-gray-300 shadow-sm"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function EducationTab() {
    const { t } = useLanguage();
    const education = [
        {
            institution: t.about.educationChemnitz,
            location: t.about.educationChemnitzLocation,
            degree: t.about.educationChemnitzDegree,
            period: t.about.educationChemnitzPeriod,
            coursework: [],
        },
        {
            institution: t.about.educationUndergradInstitution,
            location: t.about.educationUndergradLocation,
            degree: t.about.educationUndergradDegree,
            period: t.about.educationUndergradPeriod,
            coursework: t.about.coursework,
        },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">{t.about.education}</h2>
            <div className="space-y-6">
                {education.map((edu, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">{edu.institution}</h3>
                                <p className="text-gray-600 mt-1">{edu.location}</p>
                            </div>
                            <span className="text-sm text-gray-500 mt-2 sm:mt-0">{edu.period}</span>
                        </div>
                        <p className="text-lg font-medium text-gray-800 mb-4">{edu.degree}</p>
                        {edu.coursework.length > 0 && (
                            <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">{t.about.relevantCoursework}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {edu.coursework.map((course, courseIndex) => (
                                        <span
                                            key={courseIndex}
                                            className="px-2 py-1 bg-white rounded text-xs text-gray-600 border border-gray-300"
                                        >
                                            {course}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function ExperienceTab() {
    const { t } = useLanguage();
    const experiences = t.about.experiences;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">{t.about.workExperience}</h2>
            <div className="space-y-6">
                {experiences.map((exp, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">{exp.title}</h3>
                                <p className="text-lg text-gray-700 mt-1">{exp.company}</p>
                            </div>
                            <span className="text-sm text-gray-500 mt-2 sm:mt-0">{exp.period}</span>
                        </div>
                        <ul className="space-y-2">
                            {exp.responsibilities.map((resp, respIndex) => (
                                <li key={respIndex} className="text-gray-700 flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span>{resp}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ProjectsTab() {
    const { t } = useLanguage();
    const projects = t.about.projectsList;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">{t.about.projects}</h2>
            <div className="space-y-6">
                {projects.map((project, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                                {project.category && (
                                    <p className="text-sm text-gray-600 mt-1">{project.category}</p>
                                )}
                                {project.role && (
                                    <p className="text-sm text-gray-600 mt-1">{project.role}</p>
                                )}
                            </div>
                            {project.period && (
                                <span className="text-sm text-gray-500 mt-2 sm:mt-0">{project.period}</span>
                            )}
                        </div>
                        <p className="text-gray-700 mb-4 leading-relaxed">{project.description}</p>
                        {project.tech && project.tech.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {project.tech.map((tech, techIndex) => (
                                    <span
                                        key={techIndex}
                                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function AdditionalTab() {
    const { t } = useLanguage();
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">{t.about.additionalInfo}</h2>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.about.languages}</h3>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">{t.about.languageUrdu}</span>
                        <span className="text-sm text-gray-500">{t.about.languageUrduLevel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">{t.about.languageEnglish}</span>
                        <span className="text-sm text-gray-500">{t.about.languageEnglishLevel}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-700 font-medium">{t.about.languageGerman}</span>
                        <span className="text-sm text-gray-500">{t.about.languageGermanLevel}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SidebarItem({ icon, label, active }: { icon: any, label: string, active?: boolean }) {
    return (
        <div className={`flex items-center gap-2 rounded-md px-2 py-1 text-sm cursor-default ${active ? 'bg-gray-300/50 text-gray-900' : 'text-gray-600 hover:bg-gray-200/50'}`}>
            {icon}
            <span>{label}</span>
        </div>
    );
}
