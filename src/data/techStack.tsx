export const techStack = [
    // --- DESIGN ---
    {
        name: "Figma",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <path d="M12 2a4 4 0 0 0-4 4v2h4a4 4 0 0 0 4-4 4 4 0 0 0-4-4zm-4 6a4 4 0 0 0 0 8h4v-8h-4zm0 8a4 4 0 1 0 4 4v-4h-4zm8-2v-6h-4v6h4a4 4 0 0 0 0-8 4 4 0 0 0 0 8z" fill="#F24E1E" />
                <path d="M12 2a4 4 0 0 0-4 4v2h4a4 4 0 0 0 4-4 4 4 0 0 0-4-4z" fill="#F24E1E" />
                <circle cx="8" cy="18" r="4" fill="#0ACF83" />
                <path d="M8 6a4 4 0 1 0 0 8h4V6H8z" fill="#A259FF" />
                <path d="M8 14H4a4 4 0 1 0 8 0v-4H8v4z" fill="#F24E1E" />
                <path d="M12 6h4a4 4 0 0 0 0 8 4 4 0 0 0 0-8h-4v8z" fill="#1ABCFE" />
                {/* Simplified for conciseness, using a standard figma shape representation */}
                <g transform="translate(4,2) scale(0.8)">
                    <path fill="#F24E1E" d="M10 0h-5a5 5 0 1 0 0 10h5v-5a5 5 0 0 0 0-5z" />
                    <path fill="#A259FF" d="M5 10a5 5 0 1 0 0 10h5v-10h-5z" />
                    <path fill="#1ABCFE" d="M15 0h-5v10h5a5 5 0 0 0 0-10z" />
                    <path fill="#0ACF83" d="M5 20a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />
                    <path fill="#FF7262" d="M10 10h-5a5 5 0 0 0 0 10z" />
                </g>
            </svg>
        )
    },
    {
        name: "Adobe XD",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <rect width="24" height="24" rx="4" fill="#470137" />
                <text x="3" y="17" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="#FF61F6">Xd</text>
            </svg>
        )
    },
    {
        name: "Illustrator",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <rect width="24" height="24" rx="4" fill="#330000" />
                <text x="3" y="17" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="#FF9A00">Ai</text>
            </svg>
        )
    },
    {
        name: "Photoshop",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <rect width="24" height="24" rx="4" fill="#001E36" />
                <text x="3" y="17" fontFamily="Arial" fontWeight="bold" fontSize="11" fill="#31A8FF">Ps</text>
            </svg>
        )
    },

    // --- DEV ---
    {
        name: "VS Code",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <path d="M2.5 12l6-5.5 1.5 1.5L4.5 12l5.5 4-1.5 1.5zm19 0l-6 5.5-1.5-1.5 5.5-4-5.5-4 1.5-1.5z" fill="#007ACC" />
                <path d="M17.5 2.5L20 4l-4 3.5zm0 19L16 16.5l4 3.5z" fill="#007ACC" /> {/* Simplified abstract shape */}
                <path fill="#007ACC" d="M23.15 2.587l-2.46-.35L6.779 10.38 2.5 6.096v11.808l4.279-4.284 13.911 8.142 2.46-.35.9-1.398V3.985z" />
            </svg>
        )
    },
    {
        name: "React",
        logo: (
            <svg viewBox="-11.5 -10.23174 23 20.46348" className="h-full w-auto">
                <circle cx="0" cy="0" r="2.05" fill="#61dafb" />
                <g stroke="#61dafb" strokeWidth="1" fill="none">
                    <ellipse rx="11" ry="4.2" />
                    <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                    <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                </g>
            </svg>
        )
    },
    {
        name: "Python",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <defs><linearGradient id="a" x1="10%" y1="100%" x2="90%" y2="0%"><stop offset="0%" stopColor="#3776AB" /><stop offset="100%" stopColor="#3776AB" /></linearGradient><linearGradient id="b" x1="10%" y1="100%" x2="90%" y2="0%"><stop offset="0%" stopColor="#FFD343" /><stop offset="100%" stopColor="#FFD343" /></linearGradient></defs>
                <path fill="url(#a)" d="M12 0c-3.1 0-5.8 2.6-5.8 5.8v3.2h5.8V5.8h-3c0-1.6 1.3-2.9 2.9-2.9s2.9 1.3 2.9 2.9v1.4H20V5.8C20 2.6 17.3 0 14.1 0H12z" />
                <path fill="url(#b)" d="M12 24c3.1 0 5.8-2.6 5.8-5.8v-3.2h-5.8v3.2h3c0 1.6-1.3 2.9-2.9 2.9s-2.9-1.3-2.9-2.9v-1.4H4v1.4C4 21.4 6.7 24 9.9 24H12z" />
            </svg>
        )
    },
    {
        name: "JavaScript",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <rect width="24" height="24" fill="#F7DF1E" />
                <path d="M6 18c0 2 1 3 3 3s3-1 3-3V10h-2v8c0 1-.5 1.5-1.5 1.5S7 19 7 18H6zm8 0c0 2 1 3 3 3s3.5-1 3.5-3.5h-2c0 1.5-.5 2-1.5 2 0 0-1.5 0-1.5-1.5 0-1.5 3-2 3-2 2-1 2-2.5 2-4s-1.5-3-3.5-3c-2 0-3.5 1.5-3.5 3.5h2c0-1 .5-1.5 1.5-1.5s1.5.5 1.5 1.5c0 1-2 2-2.5 2.5C14.5 16 14 17 14 18z" fill="#000" />
            </svg>
        )
    },
    {
        name: "TypeScript",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <rect width="24" height="24" fill="#3178C6" />
                <path d="M6 18h2v-8h-4v2h2v6zm8 0h2v-4c0-1 1-1.5 2-1v-2c-2 0-3 1-4 3v4z" fill="#fff" />
                <text x="6" y="18" fontFamily="Arial" fontWeight="bold" fontSize="14" fill="#fff">TS</text>
            </svg>
        )
    },
    {
        name: "Next.js",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <circle cx="12" cy="12" r="12" fill="#000" />
                <path d="M10.5 7v10h-2V7h2zm5 5l-4.5-5h-2L14 13v4h1.5v-5z" fill="#fff" />
            </svg>
        )
    },
    {
        name: "Node.js",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <path d="M12 2L4 6v12l8 4 8-4V6l-8-4z" fill="#339933" />
                <text x="6" y="16" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="10" fill="#fff">Node</text>
            </svg>
        )
    },
    {
        name: "Django",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <rect width="24" height="24" rx="4" fill="#092E20" />
                <text x="2" y="15" fontFamily="Arial" fontWeight="bold" fontSize="9" fill="#fff">dj</text>
            </svg>
        )
    },

    // --- DB ---
    {
        name: "MongoDB",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <path d="M12 2C10 8 7 14 7 14s2 8 5 8 5-8 5-8-3-6-5-14z" fill="#47A248" />
                <path d="M12 22s-4-6-4-10c0-4 1.5-6 4-10v20z" fill="#4DB33D" opacity="0.8" />
            </svg>
        )
    },
    {
        name: "MySQL",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <path d="M2 10q5-5 10-5t10 5q-5 10-10 10t-10-10z" fill="#00758F" />
                <text x="2" y="15" fontFamily="Arial" fontWeight="bold" fontSize="8" fill="#F29111">MySQL</text>
            </svg>
        )
    },
    {
        name: "Supabase",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <path d="M12 2L4 12h7v10l8-10h-7V2z" fill="#3ECF8E" />
            </svg>
        )
    },
    {
        name: "Firebase",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <path d="M4 16l3-10 3 6-3 4z" fill="#FFCA28" />
                <path d="M12 20l-5-4 5-13 5 13-5 4z" fill="#FFA000" />
                <path d="M20 16l-3-10-3 6 3 4z" fill="#FFCA28" />
            </svg>
        )
    },

    // --- HOSTING ---
    {
        name: "Vercel",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <path d="M12 2L22 20H2L12 2z" fill="#000" />
            </svg>
        )
    },
    {
        name: "AWS",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <path d="M12 16l-2-2h4l-2 2zm-5 1l5 4 5-4H7z" fill="#FF9900" />
                <path d="M4 10h16v2H4z" fill="#232F3E" />
                <text x="4" y="10" fontFamily="Arial" fontWeight="bold" fontSize="8" fill="#232F3E">AWS</text>
            </svg>
        )
    },
    {
        name: "Render",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <circle cx="12" cy="12" r="10" fill="#000" />
                <path d="M16 8v8h-8V8h8z" fill="#fff" /> {/* Simplified */}
            </svg>
        )
    },
    {
        name: "Railway",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <rect width="24" height="24" fill="#0B0D0E" />
                <path d="M4 12h16M8 8l-4 4 4 4" stroke="#fff" strokeWidth="2" />
            </svg>
        )
    },
    {
        name: "Fly.io",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <path d="M22 10L2 12l20 2-8-2 8-2z" fill="#24185B" />
            </svg>
        )
    },

    // --- AI ---
    {
        name: "OpenAI",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <path d="M12 2l2 3.5-2 3.5-2-3.5L12 2zm0 8l-3 5.2 3 5.2 3-5.2-3-5.2z" fill="#412991" />
            </svg>
        )
    },
    {
        name: "ChatGPT",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <circle cx="12" cy="12" r="10" fill="#74AA9C" />
                <path d="M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" fill="#fff" opacity="0.5" />
            </svg>
        )
    },
    {
        name: "LangChain",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <text x="2" y="18" fontSize="24" fill="none" stroke="#000" strokeWidth="2">🦜🔗</text>
                <text x="2" y="18" fontSize="16" fill="#000">🦜</text>
            </svg>
        )
    },
    {
        name: "Gemini",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#4E84F9" /><stop offset="1" stopColor="#F94E4E" /></linearGradient></defs>
                <path d="M12 2L8 12l4 10 4-10-4-10z" fill="url(#g)" />
            </svg>
        )
    },
    {
        name: "Claude",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <rect width="24" height="24" fill="#D97757" />
                <circle cx="12" cy="12" r="8" fill="#F4E9DC" />
            </svg>
        )
    },
    {
        name: "ML Tools",
        logo: (
            <svg viewBox="0 0 24 24" className="h-full w-auto">
                <circle cx="12" cy="12" r="10" stroke="#000" strokeWidth="1" fill="none" />
                <circle cx="12" cy="12" r="2" fill="#000" />
                <path d="M12 12l5-5M12 12l-5-5M12 12l5 5M12 12l-5 5" stroke="#000" />
            </svg>
        )
    }
];
