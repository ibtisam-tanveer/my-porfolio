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
    /**
     * Optional: personalize the “Now playing” card by visitor country.
     * Keys are ISO 3166-1 alpha-2 codes (e.g. "DE", "US").
     *
     * Tip: use playlist URLs (e.g. "Top 50 - Germany") if you want it to always feel fresh.
     */
    musicByCountry: {
        DE: {
            track: 'Top Hits Germany',
            artist: 'Spotify Playlist',
            spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZEVXbJiZcmkrIHGU',
        },
        US: {
            track: 'Top Hits USA',
            artist: 'Spotify Playlist',
            spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZEVXbLp5XoPON0wI',
        },
        PK: {
            track: 'Top Hits Pakistan',
            artist: 'Spotify Playlist',
            spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZEVXbK4gjvS1FjPY',
        },
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
