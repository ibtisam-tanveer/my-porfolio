/**
 * Edit this file to personalize resume path, booking link, and “now playing”.
 * Replace public/resume.pdf with your own PDF (same filename) or change pdfPath.
 * Optional: set GITHUB_TOKEN in the environment for higher GitHub API rate limits (see app/api/github/commits).
 */
export const portfolioConfig = {
    resume: {
        pdfPath: '/resume.pdf',
        downloadFileName: 'Muhammad_Ibtisam_Tanveer_Frontend_Software_Engineer.pdf',
    },
    availability: {
        /** IANA timezone for the clock widget */
        timezone: 'Europe/Berlin',
        /** Shown in widgets + menu bar */
        status: 'Open to full-time frontend roles',
        /** Cal.com, Calendly, or similar — set to '' to hide the book button */
        bookingUrl: 'https://cal.com/ibtisam-tanveer-yyf7lb/30min',
    },
    music: {
        track: 'Demons',
        artist: 'Imagine Dragons',
        spotifyUrl: 'https://open.spotify.com/track/5qaEfEh1AtSdrdrByCP7qR',
        /** Album art from Spotify oEmbed (Demons — Night Visions) */
        imageUrl:
            'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02407bd04707c463bbb3410737',
    },
    /** Recent commits from public Push events; set username to '' to hide the widget */
    github: {
        username: 'ibtisam-tanveer',
        maxCommits: 5,
    },
    /** Quick links for Spotlight search */
    links: {
        linkedIn: 'https://www.linkedin.com/in/ibtisam-tanveer',
        github: 'https://github.com/ibtisam-tanveer',
        email: 'mailto:ibtisam.tanveer22@gmail.com',
        phoneTel: 'tel:+4915755783296',
    },
} as const;
