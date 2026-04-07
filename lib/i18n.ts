export type Language = "en" | "de" | "ur";

export interface Translations {
    menuBar: {
        portfolio: string;
        file: string;
        edit: string;
        view: string;
        go: string;
        window: string;
        help: string;
        brightness: string;
        sound: string;
        language: string;
        availability: string;
        lockScreen: string;
        aboutThisPortfolio: string;
        systemSettings: string;
    };
    about: {
        resume: string;
        documents: string;
        resumePdfFile: string;
        openResumePdf: string;
        profile: string;
        skills: string;
        education: string;
        experience: string;
        projects: string;
        additional: string;
        locations: string;
        macintoshHD: string;
        network: string;
        profileSummary: string;
        workExperience: string;
        relevantCoursework: string;
        languages: string;
        nativeSpeaker: string;
        programmingLanguages: string;
        backendDatabases: string;
        frontend: string;
        toolsTechnologies: string;
        foundations: string;
        machineLearning: string;
        practices: string;
        title: string;
        subtitle: string;
        profileSummaryText: string;
        educationChemnitz: string;
        educationChemnitzLocation: string;
        educationChemnitzDegree: string;
        educationChemnitzPeriod: string;
        educationUndergradInstitution: string;
        educationUndergradLocation: string;
        educationUndergradDegree: string;
        educationUndergradPeriod: string;
        coursework: string[];
        experiences: Array<{
            title: string;
            company: string;
            period: string;
            responsibilities: string[];
        }>;
        projectsList: Array<{
            title: string;
            role?: string;
            category?: string;
            period?: string;
            description: string;
            tech: string[];
        }>;
        additionalInfo: string;
        languageUrdu: string;
        languageUrduLevel: string;
        languageEnglish: string;
        languageEnglishLevel: string;
        languageGerman: string;
        languageGermanLevel: string;
    };
    contact: {
        getInTouch: string;
        haveProject: string;
        emailAddress: string;
        message: string;
        sendMessage: string;
        placeholderEmail: string;
        placeholderMessage: string;
    };
    projects: {
        explorer: string;
        portfolio: string;
        src: string;
    };
    dock: {
        finder: string;
        safari: string;
        vscode: string;
        mail: string;
        notes: string;
        terminal: string;
        streaming: string;
        snake: string;
        instablog: string;
    };
    snakeGame: {
        score: string;
        best: string;
        gameOver: string;
        playAgain: string;
        paused: string;
        resume: string;
        newGame: string;
        tapOrKeys: string;
        hint: string;
        footer: string;
    };
    safari: {
        back: string;
        forward: string;
        reload: string;
        go: string;
        share: string;
        bookmarks: string;
        newTab: string;
        enterUrl: string;
        linkedInProfile: string;
        connectLinkedIn: string;
        visitLinkedIn: string;
        getInTouch: string;
        reachOut: string;
        phone: string;
        sendEmail: string;
        githubProfile: string;
        exploreGithub: string;
        featuredRepos: string;
        repositoriesAvailable: string;
        visitGithub: string;
        startBrowsing: string;
        resume: string;
    };
    notes: {
        cvNotes: string;
        startTyping: string;
        cvContent: string;
    };
    terminal: {
        terminal: string;
    };
    widgets: {
        desktopWidgets: string;
        availability: string;
        bookCall: string;
        nowPlaying: string;
        onSpotify: string;
        recentCommits: string;
        viewProfile: string;
        commitsLoadError: string;
        noRecentCommits: string;
    };
    resumeWindow: {
        title: string;
        subtitle: string;
        download: string;
    };
    spotlight: {
        title: string;
        placeholder: string;
        apps: string;
        links: string;
        noResults: string;
        openApp: string;
        openLink: string;
        footerNavigate: string;
        footerOpen: string;
        footerClose: string;
        shortcut: string;
    };
    assistant: {
        title: string;
        subtitle: string;
        open: string;
        tapMic: string;
        listening: string;
        thinking: string;
        speaking: string;
        yourQuestion: string;
        answer: string;
        close: string;
        stopSpeaking: string;
        voiceOn: string;
        voiceOff: string;
        askAgain: string;
        typeQuestion: string;
        pillPlaceholder: string;
        send: string;
        notSupported: string;
        noSpeech: string;
    };
}

const enProjectsList: Translations["about"]["projectsList"] = [
    {
        title: "WAM Studio (Enfield) — Web Architecture Diagram Editor",
        category: "Research / tooling",
        description:
            "Collaborative web-based diagram editor for Web Architecture Modeling (WAM) using the Next.js App Router and React 19. Built canvas, node palette, properties panel, version history, and export with React Flow; integrated REST APIs for CRUD, sharing, comments, and versions; real-time collaboration and export to JSON, PNG, and PDF.",
        tech: ["Next.js", "React 19", "TypeScript", "Tailwind CSS", "React Flow"],
    },
    {
        title: "Pushka Hub",
        category: "Mobile",
        description:
            "Cross-platform mobile features with React Native; secure wallet and transaction flows against Ruby on Rails APIs; improved UI/UX on Android and iOS and reduced crashes.",
        tech: ["React Native", "Ruby on Rails"],
    },
    {
        title: "PIMdesk",
        category: "Product Information Management",
        description:
            "Vue.js front end for a PIM platform managing large e-commerce catalogs; bulk uploads, attribute mapping, image management, search, filtering, and tagging; performance tuning for multi-channel data.",
        tech: ["Vue.js", "NestJS", "Ruby on Rails", "Shopify"],
    },
    {
        title: "AAT Wholesale E-Commerce App",
        category: "Mobile",
        description:
            "Wholesale e-commerce app in React Native with Laravel backend; catalog for 10,000+ SKUs with search, filters, and categories; wishlists, push notifications, and reviews.",
        tech: ["React Native", "Laravel"],
    },
    {
        title: "Consumer Information App (SNGPL)",
        category: "Mobile — field operations",
        description:
            "Flutter app for meter reading and consumer complaints for field teams; location services for faster response; 50,000+ downloads on Google Play.",
        tech: ["Flutter", "Provider"],
    },
    {
        title: "Automated Personality Prediction System",
        category: "ML / API",
        description:
            "Deep learning pipeline to predict OCEAN personality traits; processed 10,000+ videos with computer vision; Flask API for real-time predictions to the mobile client.",
        tech: ["Python", "TensorFlow", "Flask", "OpenCV"],
    },
];

const enExperiences: Translations["about"]["experiences"] = [
    {
        title: "Software Engineer (Frontend-Focused)",
        company: "Smart Energy Pays — Berlin, Germany",
        period: "Feb 2025 – Present",
        responsibilities: [
            "Built a scalable banking web platform for retail, business, and junior products with Next.js 15 App Router, React 19, TypeScript, and Tailwind CSS.",
            "Structured maintainable frontend architecture with route groups, shared layouts, and dynamic routes for dashboards and product modules.",
            "Delivered complex flows: KYC/KYB onboarding, crypto wallet, transfers, subscriptions, and support ticketing from design.",
            "Centralized API layer with retry logic and token refresh for auth, payment, and business APIs.",
            "State and server data with Redux Toolkit and TanStack Query; collaboration on contracts, validation, errors, and WebSocket updates.",
            "Performance and DX: Query caching, Turbopack, and next-intl for i18n.",
        ],
    },
    {
        title: "Software Engineer",
        company: "Gigalabs (Pvt) Ltd. — Lahore, Pakistan",
        period: "Nov 2022 – Sep 2024",
        responsibilities: [
            "Full-stack delivery on PIMdesk, Pushka Hub, and enterprise integrations with React, Next.js, TypeScript, Node.js, and NestJS.",
            "Scalable UI and data-management interfaces for PIMdesk (large e-commerce product datasets).",
            "REST APIs with NestJS and Flask; sync between apps, databases, and third parties.",
            "Import/export and catalog workflows for multi-channel e-commerce.",
            "Migrated legacy JavaScript to TypeScript for safer, more maintainable production code.",
            "PostgreSQL schema and query design for large product and transactional data.",
            "Cross-functional delivery, production debugging, and frontend performance work.",
        ],
    },
];

export const translations: Record<Language, Translations> = {
    en: {
        menuBar: {
            portfolio: "Portfolio",
            file: "File",
            edit: "Edit",
            view: "View",
            go: "Go",
            window: "Window",
            help: "Help",
            brightness: "Brightness",
            sound: "Sound",
            language: "Language",
            availability: "Availability",
            lockScreen: "Lock screen",
            aboutThisPortfolio: "About This Portfolio",
            systemSettings: "System Settings…",
        },
        about: {
            resume: "Resume",
            documents: "Documents",
            resumePdfFile: "Resume.pdf",
            openResumePdf: "View resume (PDF)",
            profile: "Profile",
            skills: "Skills",
            education: "Education",
            experience: "Experience",
            projects: "Projects",
            additional: "Additional",
            locations: "Locations",
            macintoshHD: "Macintosh HD",
            network: "Network",
            profileSummary: "Profile Summary",
            workExperience: "Work Experience",
            relevantCoursework: "Relevant coursework:",
            languages: "Languages",
            nativeSpeaker: "Native",
            programmingLanguages: "Programming languages",
            backendDatabases: "Backend & APIs",
            frontend: "Frontend",
            toolsTechnologies: "Tools & platforms",
            foundations: "Data & ML",
            machineLearning: "Machine learning",
            practices: "Practices",
            title: "Muhammad Ibtisam Tanveer",
            subtitle: "Software Engineer | M.Sc. Web Engineering",
            profileSummaryText:
                "Software Engineer building scalable web applications with Next.js, React, TypeScript, and Tailwind CSS. I implement complex user flows, integrate backend APIs, and care about maintainable architecture, performance, and accessible UX. Based in Germany; experience across fintech-style banking UIs, PIM/e‑commerce, and mobile (React Native / Flutter).",
            educationChemnitz: "Technical University of Chemnitz",
            educationChemnitzLocation: "Chemnitz, Saxony, Germany",
            educationChemnitzDegree: "M.Sc. Web Engineering",
            educationChemnitzPeriod: "2024 – 2026",
            educationUndergradInstitution: "National University of Technology",
            educationUndergradLocation: "Islamabad, Pakistan",
            educationUndergradDegree: "Bachelor of Science in Computer Science",
            educationUndergradPeriod: "2018 – 2022",
            coursework: [],
            experiences: enExperiences,
            projectsList: enProjectsList,
            additionalInfo: "Additional information",
            languageUrdu: "Urdu",
            languageUrduLevel: "Native",
            languageEnglish: "English",
            languageEnglishLevel: "Fluent",
            languageGerman: "German",
            languageGermanLevel: "Professional working proficiency",
        },
        contact: {
            getInTouch: "Get in touch",
            haveProject: "Have a project in mind? Send a message and let’s talk.",
            emailAddress: "Email",
            message: "Message",
            sendMessage: "Send message",
            placeholderEmail: "you@example.com",
            placeholderMessage: "Tell me about your project…",
        },
        projects: { explorer: "EXPLORER", portfolio: "PORTFOLIO", src: "src" },
        dock: {
            finder: "Finder",
            safari: "Safari",
            vscode: "VS Code",
            mail: "Mail",
            notes: "Notes",
            terminal: "Terminal",
            streaming: "Streaming",
            snake: "Snake",
            instablog: "InstaBlog",
        },
        snakeGame: {
            score: "Score",
            best: "Best",
            gameOver: "Game over",
            playAgain: "Play again",
            paused: "Paused",
            resume: "Resume",
            newGame: "New game",
            tapOrKeys: "Tap the board or use keys to start",
            hint: "Arrows or WASD to turn · Space to pause",
            footer: "Eat the red dots. Don’t hit the walls or yourself.",
        },
        safari: {
            back: "Back",
            forward: "Forward",
            reload: "Reload",
            go: "Go",
            share: "Share",
            bookmarks: "Bookmarks",
            newTab: "New Tab",
            enterUrl: "Enter URL or search",
            linkedInProfile: "LinkedIn",
            connectLinkedIn:
                "Connect on LinkedIn for experience, projects, and recommendations.",
            visitLinkedIn: "Open LinkedIn",
            getInTouch: "Contact",
            reachOut: "Collaborations, roles, or a quick hello — I’m happy to hear from you.",
            phone: "Phone",
            sendEmail: "Send email",
            githubProfile: "GitHub",
            exploreGithub: "Repositories, experiments, and open-source contributions.",
            featuredRepos: "Highlights",
            repositoriesAvailable: "public repositories",
            visitGithub: "Open GitHub",
            startBrowsing: "Open a tab or type a URL above.",
            resume: "Resume",
        },
        notes: {
            cvNotes: "CV — Notes",
            startTyping: "Start typing…",
            cvContent: `MUHAMMAD IBTISAM TANVEER
Software Engineer | M.Sc. Web Engineering (in progress)

CONTACT
Phone: +49 157 55783296
Email: ibtisam.tanveer22@gmail.com
LinkedIn: https://www.linkedin.com/in/ibtisam-tanveer
GitHub: https://github.com/ibtisam-tanveer

PROFILE
Frontend engineer focused on Next.js, React, TypeScript, and Tailwind. Experience with complex product flows, API integration, and maintainable app structure. Background in full-stack (NestJS, Node, Flask) and mobile (React Native, Flutter).

EDUCATION
Technical University of Chemnitz — M.Sc. Web Engineering — 2024–2026 — Chemnitz, Germany
National University of Technology — B.Sc. Computer Science — 2018–2022 — Islamabad, Pakistan

EXPERIENCE
Smart Energy Pays — Software Engineer (Frontend-Focused) — Feb 2025–Present — Berlin
Gigalabs (Pvt) Ltd. — Software Engineer — Nov 2022–Sep 2024 — Lahore

STACK (summary)
JavaScript/TypeScript, React, Next.js (App Router), Vue.js, Redux Toolkit, TanStack Query, Tailwind, MUI
Node.js, NestJS, Express, Flask, Django, REST, JWT
PostgreSQL, MongoDB — Git, Jira, Postman, Figma, Vercel, AWS (EC2, S3)
TensorFlow, OpenCV, Pandas (selected ML work)

See Finder → Projects for detailed project write-ups.`,
        },
        terminal: { terminal: "Terminal" },
        widgets: {
            desktopWidgets: "Desktop widgets",
            availability: "Availability",
            bookCall: "Book a call",
            nowPlaying: "Now playing",
            onSpotify: "Open in Spotify",
            recentCommits: "Recent commits",
            viewProfile: "View on GitHub",
            commitsLoadError: "Could not load activity",
            noRecentCommits: "No recent public commits",
        },
        resumeWindow: {
            title: "Resume.pdf",
            subtitle: "Preview — replace public/resume.pdf with your CV",
            download: "Download PDF",
        },
        spotlight: {
            title: "Spotlight",
            placeholder: "Search for apps, resume, and links",
            apps: "Applications",
            links: "Links",
            noResults: "No results",
            openApp: "Open app",
            openLink: "Open link",
            footerNavigate: "Navigate",
            footerOpen: "Open",
            footerClose: "Close",
            shortcut: "⌘K",
        },
        assistant: {
            title: "Ask",
            subtitle: "Speak or type a question. Answers use my CV and project details.",
            open: "Open Ask",
            tapMic: "Click the microphone to speak",
            listening: "Listening…",
            thinking: "Working…",
            speaking: "Speaking…",
            yourQuestion: "Question",
            answer: "Reply",
            close: "Close",
            stopSpeaking: "Stop speaking",
            voiceOn: "Read answers aloud",
            voiceOff: "Mute voice",
            askAgain: "Ask another question",
            typeQuestion: "Or type your question",
            pillPlaceholder: "Type to ask…",
            send: "Send",
            notSupported:
                "Voice input is not available in this browser. Try Chrome or Safari, or type your question.",
            noSpeech: "No speech heard. Try again or type your question.",
        },
    },
    de: {
        menuBar: {
            portfolio: "Portfolio",
            file: "Ablage",
            edit: "Bearbeiten",
            view: "Darstellung",
            go: "Gehe zu",
            window: "Fenster",
            help: "Hilfe",
            brightness: "Helligkeit",
            sound: "Ton",
            language: "Sprache",
            availability: "Verfügbarkeit",
            lockScreen: "Sperrbildschirm",
            aboutThisPortfolio: "Über dieses Portfolio",
            systemSettings: "Systemeinstellungen…",
        },
        about: {
            resume: "Lebenslauf",
            documents: "Dokumente",
            resumePdfFile: "Lebenslauf.pdf",
            openResumePdf: "Lebenslauf ansehen (PDF)",
            profile: "Profil",
            skills: "Skills",
            education: "Ausbildung",
            experience: "Erfahrung",
            projects: "Projekte",
            additional: "Weiteres",
            locations: "Orte",
            macintoshHD: "Macintosh HD",
            network: "Netzwerk",
            profileSummary: "Profil",
            workExperience: "Berufserfahrung",
            relevantCoursework: "Relevante Kurse:",
            languages: "Sprachen",
            nativeSpeaker: "Muttersprache",
            programmingLanguages: "Programmiersprachen",
            backendDatabases: "Backend & APIs",
            frontend: "Frontend",
            toolsTechnologies: "Tools & Plattformen",
            foundations: "Daten & ML",
            machineLearning: "Machine Learning",
            practices: "Vorgehen",
            title: "Muhammad Ibtisam Tanveer",
            subtitle: "Frontend-Softwareingenieur | M.Sc. Web Engineering",
            profileSummaryText:
                "Frontend-Softwareingenieur für skalierbare Webanwendungen mit Next.js, React, TypeScript und Tailwind CSS. Ich setze komplexe User Flows um, integriere APIs und lege Wert auf wartbare Architektur, Performance und klare UX. Standort Deutschland; Erfahrung u. a. in Banking-UIs, PIM/E-Commerce und Mobile (React Native / Flutter).",
            educationChemnitz: "Technische Universität Chemnitz",
            educationChemnitzLocation: "Chemnitz, Sachsen, Deutschland",
            educationChemnitzDegree: "M.Sc. Web Engineering",
            educationChemnitzPeriod: "2024 – 2026",
            educationUndergradInstitution: "National University of Technology",
            educationUndergradLocation: "Islamabad, Pakistan",
            educationUndergradDegree: "B.Sc. Computer Science",
            educationUndergradPeriod: "2018 – 2022",
            coursework: [],
            experiences: [
                {
                    title: "Software Engineer (Frontend-Fokus)",
                    company: "Smart Energy Pays — Berlin, Deutschland",
                    period: "Feb. 2025 – heute",
                    responsibilities: [
                        "Skalierbare Banking-Webplattform für Retail-, Business- und Junior-Produkte mit Next.js 15 App Router, React 19, TypeScript und Tailwind.",
                        "Wartbare Frontend-Architektur mit Route Groups, Layouts und dynamischen Routen für Dashboards und Module.",
                        "Komplexe Flows: KYC/KYB, Crypto-Wallet, Überweisungen, Abos und Support-Tickets nach Design.",
                        "Zentralisierte API-Schicht mit Retry und Token-Refresh.",
                        "State und Serverdaten mit Redux Toolkit und TanStack Query; WebSockets und Abstimmung mit Backend/Product.",
                        "Performance und DX: Query-Caching, Turbopack, next-intl.",
                    ],
                },
                {
                    title: "Software Engineer",
                    company: "Gigalabs (Pvt) Ltd. — Lahore, Pakistan",
                    period: "Nov. 2022 – Sep. 2024",
                    responsibilities: [
                        "Full-Stack an PIMdesk, Pushka Hub und Enterprise-Integrationen mit React, Next.js, TypeScript, Node.js und NestJS.",
                        "Skalierbare UI und Datenoberflächen für große E-Commerce-Produktkataloge.",
                        "REST-APIs mit NestJS und Flask; Synchronisation mit DBs und Drittsystemen.",
                        "Import/Export-Workflows für Multi-Channel-Daten.",
                        "Migration von Legacy-JavaScript zu TypeScript.",
                        "PostgreSQL-Schema und Queries für große Datenmengen.",
                        "Teamübergreifende Lieferung, Debugging und Frontend-Performance.",
                    ],
                },
            ],
            projectsList: enProjectsList.map((p) => ({ ...p })),
            additionalInfo: "Weitere Angaben",
            languageUrdu: "Urdu",
            languageUrduLevel: "Muttersprache",
            languageEnglish: "Englisch",
            languageEnglishLevel: "Fließend",
            languageGerman: "Deutsch",
            languageGermanLevel: "Berufliche Alltagskompetenz",
        },
        contact: {
            getInTouch: "Kontakt",
            haveProject: "Projektidee? Schreiben Sie mir.",
            emailAddress: "E-Mail",
            message: "Nachricht",
            sendMessage: "Senden",
            placeholderEmail: "sie@beispiel.de",
            placeholderMessage: "Erzählen Sie von Ihrem Projekt…",
        },
        projects: { explorer: "EXPLORER", portfolio: "PORTFOLIO", src: "src" },
        dock: {
            finder: "Finder",
            safari: "Safari",
            vscode: "VS Code",
            mail: "Mail",
            notes: "Notizen",
            terminal: "Terminal",
            streaming: "Streaming",
            snake: "Snake",
            instablog: "InstaBlog",
        },
        snakeGame: {
            score: "Punkte",
            best: "Rekord",
            gameOver: "Game over",
            playAgain: "Nochmal",
            paused: "Pause",
            resume: "Weiter",
            newGame: "Neu",
            tapOrKeys: "Tippen oder Taste drücken zum Start",
            hint: "Pfeile oder WASD · Leertaste pausiert",
            footer: "Rote Punkte fressen. Wände und Schlange meiden.",
        },
        safari: {
            back: "Zurück",
            forward: "Vor",
            reload: "Neu laden",
            go: "Los",
            share: "Teilen",
            bookmarks: "Lesezeichen",
            newTab: "Neuer Tab",
            enterUrl: "URL eingeben oder suchen",
            linkedInProfile: "LinkedIn",
            connectLinkedIn: "Auf LinkedIn verbinden — Erfahrung und Projekte.",
            visitLinkedIn: "LinkedIn öffnen",
            getInTouch: "Kontakt",
            reachOut: "Kooperationen, Rollen oder ein kurzes Hallo — melden Sie sich gern.",
            phone: "Telefon",
            sendEmail: "E-Mail senden",
            githubProfile: "GitHub",
            exploreGithub: "Repos, Experimente und Open Source.",
            featuredRepos: "Highlights",
            repositoriesAvailable: "öffentliche Repositories",
            visitGithub: "GitHub öffnen",
            startBrowsing: "Tab öffnen oder URL oben eingeben.",
            resume: "Lebenslauf",
        },
        notes: {
            cvNotes: "CV — Notizen",
            startTyping: "Hier tippen…",
            cvContent: `MUHAMMAD IBTISAM TANVEER
Frontend-Softwareingenieur | M.Sc. Web Engineering (laufend)

KONTAKT
Tel.: +49 157 55783296
E-Mail: ibtisam.tanveer22@gmail.com
LinkedIn: https://www.linkedin.com/in/ibtisam-tanveer
GitHub: https://github.com/ibtisam-tanveer

KURZPROFIL
Frontend mit Next.js, React, TypeScript, Tailwind. Komplexe Flows, API-Integration, wartbare Architektur. Full-Stack- und Mobile-Hintergrund.

AUSBILDUNG
TU Chemnitz — M.Sc. Web Engineering — 2024–2026
National University of Technology — B.Sc. Informatik — 2018–2022 — Islamabad

ERFAHRUNG
Smart Energy Pays — Software Engineer (Frontend) — Feb. 2025–heute — Berlin
Gigalabs — Software Engineer — Nov. 2022–Sep. 2024 — Lahore

Details zu Projekten: Finder → Projekte.`,
        },
        terminal: { terminal: "Terminal" },
        widgets: {
            desktopWidgets: "Desktop-Widgets",
            availability: "Verfügbarkeit",
            bookCall: "Termin buchen",
            nowPlaying: "Läuft gerade",
            onSpotify: "In Spotify öffnen",
            recentCommits: "Letzte Commits",
            viewProfile: "Auf GitHub ansehen",
            commitsLoadError: "Aktivität konnte nicht geladen werden",
            noRecentCommits: "Keine öffentlichen Commits",
        },
        resumeWindow: {
            title: "Lebenslauf.pdf",
            subtitle: "Vorschau — ersetzen Sie public/resume.pdf durch Ihren Lebenslauf",
            download: "PDF herunterladen",
        },
        spotlight: {
            title: "Spotlight",
            placeholder: "Apps, Lebenslauf und Links durchsuchen",
            apps: "Programme",
            links: "Links",
            noResults: "Keine Treffer",
            openApp: "App öffnen",
            openLink: "Link öffnen",
            footerNavigate: "Navigation",
            footerOpen: "Öffnen",
            footerClose: "Schließen",
            shortcut: "⌘K",
        },
        assistant: {
            title: "Fragen",
            subtitle: "Sprechen oder tippen. Antworten basieren auf Lebenslauf und Projekten.",
            open: "Fragen öffnen",
            tapMic: "Mikrofon klicken zum Sprechen",
            listening: "Hört zu…",
            thinking: "Bitte warten…",
            speaking: "Spricht…",
            yourQuestion: "Frage",
            answer: "Antwort",
            close: "Schließen",
            stopSpeaking: "Stimme stoppen",
            voiceOn: "Antworten vorlesen",
            voiceOff: "Stumm",
            askAgain: "Weitere Frage",
            typeQuestion: "Oder Frage eintippen",
            pillPlaceholder: "Frage eingeben…",
            send: "Senden",
            notSupported:
                "Spracheingabe wird hier nicht unterstützt. Chrome oder Safari nutzen oder tippen.",
            noSpeech: "Nichts gehört. Bitte erneut versuchen oder tippen.",
        },
    },
    ur: {
        menuBar: {
            portfolio: "پورٹ فولیو",
            file: "فائل",
            edit: "ترمیم",
            view: "منظر",
            go: "جائیں",
            window: "ونڈو",
            help: "مدد",
            brightness: "چمک",
            sound: "آواز",
            language: "زبان",
            availability: "دستیابی",
            lockScreen: "لاک اسکرین",
            aboutThisPortfolio: "اس پورٹ فولیو کے بارے میں",
            systemSettings: "سسٹم کی ترتیبات…",
        },
        about: {
            resume: "ریزیومے",
            documents: "دستاویزات",
            resumePdfFile: "Resume.pdf",
            openResumePdf: "ریزیومے دیکھیں (PDF)",
            profile: "پروفائل",
            skills: "مہارتیں",
            education: "تعلیم",
            experience: "تجربہ",
            projects: "منصوبے",
            additional: "اضافی",
            locations: "مقامات",
            macintoshHD: "Macintosh HD",
            network: "نیٹ ورک",
            profileSummary: "خلاصہ",
            workExperience: "ملازمت کا تجربہ",
            relevantCoursework: "متعلقہ کورسز:",
            languages: "زبانیں",
            nativeSpeaker: "مادری",
            programmingLanguages: "پروگرامنگ زبانیں",
            backendDatabases: "بیک اینڈ اور APIs",
            frontend: "فرنٹ اینڈ",
            toolsTechnologies: "اوزار اور پلیٹ فارم",
            foundations: "ڈیٹا اور ML",
            machineLearning: "مشین لرننگ",
            practices: "طریقہ کار",
            title: "محمد ابتسام تنویر",
            subtitle: "فرنٹ اینڈ سافٹ ویئر انجینئر | M.Sc. ویب انجینئرنگ",
            profileSummaryText:
                "میں Next.js، React، TypeScript اور Tailwind CSS کے ساتھ قابل توسیع ویب ایپلیکیشنز بناتا ہوں۔ پیچیدہ صارف فلو، API انٹیگریشن اور صاف معماری پر توجہ۔ جرمنی میں مقیم؛ بینکنگ جیسے UIs، PIM/e-commerce اور موبائل (React Native / Flutter) کا تجربہ۔",
            educationChemnitz: "ٹیکنیکل یونیورسٹی آف کیمنٹز",
            educationChemnitzLocation: "کیمنٹز، سیکسنی، جرمنی",
            educationChemnitzDegree: "M.Sc. ویب انجینئرنگ",
            educationChemnitzPeriod: "۲۰۲۴ – ۲۰۲۶",
            educationUndergradInstitution: "نیشنل یونیورسٹی آف ٹیکنالوجی",
            educationUndergradLocation: "اسلام آباد، پاکستان",
            educationUndergradDegree: "بیچلر آف سائنس، کمپیوٹر سائنس",
            educationUndergradPeriod: "۲۰۱۸ – ۲۰۲۲",
            coursework: [],
            experiences: [
                {
                    title: "سافٹ ویئر انجینئر (فرنٹ اینڈ)",
                    company: "Smart Energy Pays — برلن، جرمنی",
                    period: "فروری ۲۰۲۵ – حال",
                    responsibilities: [
                        "Next.js 15، React 19، TypeScript، Tailwind کے ساتھ بینکنگ ویب پلیٹ فارم۔",
                        "route groups، shared layouts اور dynamic routes سے معماری۔",
                        "KYC/KYB، کرپٹو والیٹ، ٹرانسفر، سبسکرپشن اور سپورٹ ٹکٹنگ۔",
                        "مرکزی API پرت، retry اور token refresh۔",
                        "Redux Toolkit اور TanStack Query؛ WebSockets اور ٹیم کے ساتھ تعاون۔",
                        "کارکردگی: Query caching، Turbopack، next-intl۔",
                    ],
                },
                {
                    title: "سافٹ ویئر انجینئر",
                    company: "Gigalabs (Pvt) Ltd. — لاہور، پاکستان",
                    period: "نومبر ۲۰۲۲ – ستمبر ۲۰۲۴",
                    responsibilities: [
                        "PIMdesk، Pushka Hub اور انٹیگریشنز پر full-stack کام۔",
                        "بڑے e-commerce ڈیٹا سیٹس کے لیے UI۔",
                        "NestJS اور Flask REST APIs۔",
                        "ملٹی چینل کیٹلاگ ورک فلو۔",
                        "JavaScript سے TypeScript مائگریشن۔",
                        "PostgreSQL سکیمہ اور کوئریز۔",
                        "پروڈکشن مسائل اور فرنٹ اینڈ کارکردگی۔",
                    ],
                },
            ],
            projectsList: [
                {
                    title: "WAM Studio — ویب آرکیٹیکچر ڈایاگرام ایڈیٹر",
                    category: "ٹولنگ",
                    description:
                        "Next.js اور React 19 پر مشترکہ ڈایاگرام ایڈیٹر؛ React Flow، REST APIs، اشتراک، تبصرے، ورژنز؛ JSON/PNG/PDF ایکسپورٹ۔",
                    tech: ["Next.js", "React 19", "TypeScript", "Tailwind CSS", "React Flow"],
                },
                {
                    title: "Pushka Hub",
                    category: "موبائل",
                    description: "React Native؛ Ruby on Rails APIs کے ساتھ والیٹ اور لین دین؛ UI/UX اور استحکام۔",
                    tech: ["React Native", "Ruby on Rails"],
                },
                {
                    title: "PIMdesk",
                    category: "PIM",
                    description: "Vue.js؛ بلک اپلوڈ، اٹی بیوٹ میپنگ، تصاویر، سرچ اور فلٹرز۔",
                    tech: ["Vue.js", "NestJS", "Ruby on Rails", "Shopify"],
                },
                {
                    title: "AAT Wholesale E-Commerce",
                    category: "موبائل",
                    description: "React Native اور Laravel؛ ۱۰،۰۰۰+ SKU، وش لسٹ، نوٹیفیکیشنز۔",
                    tech: ["React Native", "Laravel"],
                },
                {
                    title: "Consumer Information App (SNGPL)",
                    category: "فیلڈ",
                    description: "Flutter؛ میٹر ریڈنگ اور شکایات؛ لوکیشن؛ ۵۰،۰۰۰+ ڈاؤن لوڈز۔",
                    tech: ["Flutter", "Provider"],
                },
                {
                    title: "Personality Prediction System",
                    category: "ML",
                    description: "OCEAN پیشن گوئی؛ ۱۰،۰۰۰+ ویڈیوز؛ Flask API۔",
                    tech: ["Python", "TensorFlow", "Flask", "OpenCV"],
                },
            ],
            additionalInfo: "مزید معلومات",
            languageUrdu: "اردو",
            languageUrduLevel: "مادری",
            languageEnglish: "انگریزی",
            languageEnglishLevel: "رواں",
            languageGerman: "جرمن",
            languageGermanLevel: "پیشہ ورانہ استعمال",
        },
        contact: {
            getInTouch: "رابطہ",
            haveProject: "کوئی منصوبہ؟ پیغام بھیجیں۔",
            emailAddress: "ای میل",
            message: "پیغام",
            sendMessage: "بھیجیں",
            placeholderEmail: "you@example.com",
            placeholderMessage: "اپنے منصوبے کے بارے میں…",
        },
        projects: { explorer: "EXPLORER", portfolio: "PORTFOLIO", src: "src" },
        dock: {
            finder: "Finder",
            safari: "Safari",
            vscode: "VS Code",
            mail: "Mail",
            notes: "نوٹس",
            terminal: "ٹرمینل",
            streaming: "اسٹریمنگ",
            snake: "سنیک",
            instablog: "InstaBlog",
        },
        snakeGame: {
            score: "اسکور",
            best: "بہترین",
            gameOver: "کھیل ختم",
            playAgain: "دوبارہ",
            paused: "روکا ہوا",
            resume: "جاری",
            newGame: "نیا کھیل",
            tapOrKeys: "شروع کرنے کے لیے ٹیپ یا کی دبائیں",
            hint: "تیر یا WASD · وقفے کے لیے space",
            footer: "سرخ نقطے کھائیں۔ دیوار یا اپنے آپ سے نہ ٹکرائیں۔",
        },
        safari: {
            back: "واپس",
            forward: "آگے",
            reload: "ری لوڈ",
            go: "جائیں",
            share: "شیئر",
            bookmarks: "بک مارکس",
            newTab: "نیا ٹیب",
            enterUrl: "URL درج کریں",
            linkedInProfile: "لنکڈ ان",
            connectLinkedIn: "لنکڈ ان پر جڑیں۔",
            visitLinkedIn: "لنکڈ ان کھولیں",
            getInTouch: "رابطہ",
            reachOut: "تعاون یا مواقع — رابطہ کریں۔",
            phone: "فون",
            sendEmail: "ای میل بھیجیں",
            githubProfile: "GitHub",
            exploreGithub: "ریپوز اور کوڈ۔",
            featuredRepos: "نمایاں",
            repositoriesAvailable: "عوامی ریپوز",
            visitGithub: "GitHub کھولیں",
            startBrowsing: "اوپر URL ٹائپ کریں۔",
            resume: "ریزیومے",
        },
        notes: {
            cvNotes: "CV — نوٹس",
            startTyping: "یہاں لکھیں…",
            cvContent: `محمد ابتسام تنویر
فرنٹ اینڈ سافٹ ویئر انجینئر

رابطہ: +49 157 55783296 | ibtisam.tanveer22@gmail.com
LinkedIn: linkedin.com/in/ibtisam-tanveer | GitHub: github.com/ibtisam-tanveer

تعلیم: TU Chemnitz (M.Sc. Web Engineering) | NUTECH Islamabad (B.Sc. CS)

تفصیلی منصوبے Finder میں دیکھیں۔`,
        },
        terminal: { terminal: "ٹرمینل" },
        widgets: {
            desktopWidgets: "ڈیسک ٹاپ ویجٹس",
            availability: "دستیابی",
            bookCall: "کال بک کریں",
            nowPlaying: "اب چل رہا ہے",
            onSpotify: "Spotify میں کھولیں",
            recentCommits: "حالیہ کمیٹس",
            viewProfile: "GitHub پر دیکھیں",
            commitsLoadError: "سرگرمی لوڈ نہیں ہو سکی",
            noRecentCommits: "کوئی عوامی کمیٹ نہیں",
        },
        resumeWindow: {
            title: "Resume.pdf",
            subtitle: "پیش نظارہ — اپنی CV کے لیے public/resume.pdf بدلیں",
            download: "PDF ڈاؤن لوڈ",
        },
        spotlight: {
            title: "Spotlight",
            placeholder: "ایپس، ریزیومے اور لنکس تلاش کریں",
            apps: "ایپلیکیشنز",
            links: "لنکس",
            noResults: "کچھ نہیں ملا",
            openApp: "ایپ کھولیں",
            openLink: "لنک کھولیں",
            footerNavigate: "نیویگیٹ",
            footerOpen: "کھولیں",
            footerClose: "بند کریں",
            shortcut: "⌘K",
        },
        assistant: {
            title: "سوال",
            subtitle: "بولیں یا لکھیں۔ جواب CV اور منصوبوں کی معلومات سے ہیں۔",
            open: "سوال کھولیں",
            tapMic: "بولنے کے لیے مائیک دبائیں",
            listening: "سن رہا ہے…",
            thinking: "کام ہو رہا ہے…",
            speaking: "بول رہا ہے…",
            yourQuestion: "سوال",
            answer: "جواب",
            close: "بند کریں",
            stopSpeaking: "بولنا بند کریں",
            voiceOn: "جواب سنیں",
            voiceOff: "آواز بند",
            askAgain: "ایک اور سوال",
            typeQuestion: "یا سوال لکھیں",
            pillPlaceholder: "یہاں لکھیں…",
            send: "بھیجیں",
            notSupported:
                "اس براؤزر میں آواز نہیں۔ Chrome/Safari آزمائیں یا ٹائپ کریں۔",
            noSpeech: "کچھ سنا نہیں گیا۔ دوبارہ کوشش کریں۔",
        },
    },
};
