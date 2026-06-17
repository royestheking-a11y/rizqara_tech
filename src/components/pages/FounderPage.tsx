import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { SEO } from '../SEO';
import {
    Code2, HeartHandshake, GraduationCap, Building2, ShoppingBag,
    Stethoscope, FlaskConical, ArrowRight, CheckCircle2, Zap,
    Clock, Globe, Users, Lightbulb, TrendingUp, Star,
    Heart, Rocket, BookOpen, Shield, Award, Sparkles,
    CalendarDays, MapPin, Brain, Coffee, Flame, Target,
    ChevronRight, Quote, Linkedin, Phone, Mail
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Animated Counter
───────────────────────────────────────────── */
const Counter = ({
    end, suffix = '', prefix = ''
}: { end: number; suffix?: string; prefix?: string }) => {
    const [count, setCount] = useState(0);
    const ref = React.useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const step = Math.ceil(end / (2000 / 16));
        const timer = setInterval(() => {
            start += step;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(start);
        }, 16);
        return () => clearInterval(timer);
    }, [inView, end]);

    return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

/* ─────────────────────────────────────────────
   Section Badge
───────────────────────────────────────────── */
const Badge = ({ text, icon }: { text: string; icon?: React.ReactNode }) => (
    <div className="inline-flex items-center px-5 py-2 rounded-full border
        text-[#500000] text-xs font-black uppercase tracking-widest mb-8 shadow-sm"
        style={{ backgroundColor: 'rgba(80, 0, 0, 0.05)', borderColor: 'rgba(80, 0, 0, 0.15)' }}>
        {icon ? <div className="mr-2">{icon}</div> : <span className="w-1.5 h-1.5 rounded-full bg-[#500000] animate-pulse mr-2" />}
        {text}
    </div>
);

/* ─────────────────────────────────────────────
   Section Heading helper
───────────────────────────────────────────── */
const SectionHeading = ({
    badge, badgeIcon, title, accent, subtitle, center = true
}: {
    badge: string; badgeIcon?: React.ReactNode;
    title: string; accent?: string; subtitle?: string; center?: boolean;
}) => (
    <div className={`mb-16 ${center ? 'text-center' : ''}`}>
        <Badge text={badge} icon={badgeIcon} />
        <h2 className={`text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight mb-6 ${center ? 'mx-auto max-w-3xl' : ''}`}>
            {title}
            {accent && <><br /><span className="text-[#500000]">{accent}</span></>}
        </h2>
        {subtitle && (
            <p className={`text-lg md:text-xl text-gray-500 font-light leading-relaxed ${center ? 'max-w-2xl mx-auto' : 'max-w-xl'}`}>
                {subtitle}
            </p>
        )}
    </div>
);

/* ─────────────────────────────────────────────
   Timeline Item  (alternating left / right)
───────────────────────────────────────────── */
const TimelineItem = ({
    year, title, desc, icon, isLeft, index
}: {
    year: string; title: string; desc: string;
    icon: React.ReactNode; isLeft: boolean; index: number;
}) => (
    <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: index * 0.08 }}
        className={`relative flex items-start md:items-center gap-0 md:gap-8 mb-0
            ${isLeft ? 'md:flex-row flex-col' : 'md:flex-row-reverse flex-col'}`}
    >
        {/* Content card */}
        <div className={`flex-1 pb-12 md:pb-0 pl-12 md:pl-0 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md hover:shadow-xl
                transition-shadow duration-300 inline-block w-full md:max-w-xs lg:max-w-sm">
                <span className="text-[11px] font-black text-[#500000] uppercase tracking-[0.2em] mb-2 block">
                    {year}
                </span>
                <h4 className="text-lg font-black text-gray-900 mb-2 leading-tight">{title}</h4>
                <p className="text-sm text-gray-500 font-light leading-relaxed">{desc}</p>
            </div>
        </div>

        {/* Center dot */}
        <div className="absolute left-0 md:static shrink-0 z-20 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#500000] to-[#8b0000]
                flex items-center justify-center shadow-lg shadow-[#500000]/30">
                {React.cloneElement(icon as any, { size: 18, className: 'text-white' })}
            </div>
        </div>

        {/* Spacer */}
        <div className="flex-1 hidden md:block" />
    </motion.div>
);

/* ─────────────────────────────────────────────
   Venture Card
───────────────────────────────────────────── */
const VentureCard = ({ venture, index }: { venture: any; index: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: Math.min(index * 0.08, 0.4) }}
        className="group relative bg-white rounded-3xl border border-gray-100
            shadow-md hover:shadow-2xl hover:-translate-y-2
            transition-all duration-500 overflow-hidden flex flex-col"
    >
        {/* Top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-[#500000]/40 via-[#500000] to-[#500000]/40
            group-hover:via-[#ff4444] transition-colors duration-500" />

        {/* Glows */}
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-[#500000]/4
            blur-3xl group-hover:bg-[#500000]/8 transition-colors duration-700 pointer-events-none" />

        <div className="p-8 flex flex-col flex-1">
            {/* Header row */}
            <div className="flex items-start justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-[#500000]/10 flex items-center justify-center
                    group-hover:bg-[#500000] transition-colors duration-400 shrink-0">
                    {React.cloneElement(venture.icon, {
                        className: 'text-[#500000] group-hover:text-white transition-colors duration-400',
                        size: 26
                    })}
                </div>
                <span className="px-3 py-1 bg-[#500000]/8 text-[#500000] text-[10px]
                    font-black uppercase rounded-full tracking-widest border border-[#500000]/15">
                    {venture.role}
                </span>
            </div>

            {/* Title & tagline */}
            <h3 className="text-xl font-black text-gray-900 mb-1
                group-hover:text-[#500000] transition-colors">{venture.title}</h3>
            <p className="text-[11px] text-[#500000]/60 font-black uppercase tracking-widest mb-4">
                {venture.tagline}
            </p>

            {/* Description */}
            <p className="text-sm text-gray-500 font-light leading-relaxed mb-6 flex-1">
                {venture.description}
            </p>

            {/* Services */}
            <div className="space-y-2 mb-6">
                {venture.services.map((s: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-gray-600">
                        <CheckCircle2 size={14} className="text-[#500000] shrink-0 mt-0.5" />
                        <span className="leading-snug">{s}</span>
                    </div>
                ))}
            </div>

            {/* Focus countries */}
            {venture.focus && (
                <div className="pt-4 border-t border-gray-50">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                        <MapPin size={10} /> Focus Markets
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        {venture.focus.map((f: string, i: number) => (
                            <span key={i} className="px-2.5 py-1 bg-gray-50 border border-gray-100
                                rounded-lg text-[11px] font-bold text-gray-600">{f}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    </motion.div>
);

/* ─────────────────────────────────────────────
   Value Card
───────────────────────────────────────────── */
const ValueCard = ({ icon, title, desc, index }: { icon: React.ReactNode; title: string; desc: string; index: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.07 }}
        className="group p-8 rounded-3xl border border-gray-100 bg-white
            hover:border-[#500000]/20 hover:shadow-xl transition-all duration-400"
    >
        <div className="w-12 h-12 rounded-2xl bg-[#500000]/10 flex items-center justify-center mb-5
            group-hover:bg-[#500000] transition-colors duration-400">
            {React.cloneElement(icon as any, {
                className: 'text-[#500000] group-hover:text-white transition-colors duration-400',
                size: 20
            })}
        </div>
        <h3 className="text-lg font-black text-gray-900 mb-2
            group-hover:text-[#500000] transition-colors">{title}</h3>
        <p className="text-gray-500 font-light text-sm leading-relaxed">{desc}</p>
    </motion.div>
);

/* ─────────────────────────────────────────────
   Main Page
───────────────────────────────────────────── */
const FounderPage = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    const schema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Aurangzeb Sunny",
        "alternateName": "Md Mizanur Rahman Sunny",
        "jobTitle": "Founder, Entrepreneur & Technology Innovator",
        "nationality": "Bangladeshi",
        "worksFor": { "@type": "Organization", "name": "RizQara Tech", "url": "https://rizqara.tech" },
        "founder": { "@type": "Organization", "name": "RizQara Group" },
        "description": "Bangladeshi entrepreneur who founded RizQara Tech on his birthday — September 12, 2024.",
    };

    /* ── Ventures ── */
    const ventures = [
        {
            title: "RizQara Tech", tagline: "Where Code Meets Vision", role: "Founder & CEO",
            icon: <Code2 />,
            description: "A premium technology company delivering enterprise-grade digital solutions. From beautiful interfaces to powerful AI systems, RizQara Tech transforms ambitious ideas into real, scalable products that matter.",
            services: ["Custom Web & Software Development", "AI Solutions & Automation Systems", "UI/UX Design & Branding", "Digital Marketing & SEO", "Cloud Architecture & DevOps", "E-commerce Platforms"],
            focus: null
        },
        {
            title: "RizQara Global Education", tagline: "Opening Doors, Changing Lives", role: "Founder",
            icon: <GraduationCap />,
            description: "An international education consultancy that helps students reach their full potential by opening doors to world-class universities. Every dream of studying abroad becomes achievable with the right guidance.",
            services: ["Study Abroad Guidance & Planning", "Scholarship Application Support", "University Admissions Counseling", "Visa Application Assistance", "Career Pathway Planning", "Student Community & Mentorship"],
            focus: ["Turkey", "Italy", "Hungary", "Russia", "China", "South Korea", "Romania", "Brazil"]
        },
        {
            title: "RizQara Foundation", tagline: "Technology for Humanity", role: "Founder",
            icon: <HeartHandshake />,
            description: "A social impact initiative rooted in the belief that opportunity should be universal. The Foundation works tirelessly to empower the underserved, equip communities with skills, and build a more equitable future.",
            services: ["Free Educational Programs", "Women Empowerment Initiatives", "Healthcare Awareness Campaigns", "Skills Development Workshops", "Employment Opportunities", "Community Development Projects"],
            focus: null
        },
        {
            title: "RizQara Shop", tagline: "Commerce, Simplified", role: "Founder",
            icon: <ShoppingBag />,
            description: "A modern e-commerce platform curating quality products with a seamless, customer-first shopping experience — built on the same technological excellence that defines the RizQara brand.",
            services: ["Curated Product Selection", "Seamless Online Shopping", "Secure Payment Gateway", "Fast Order Fulfillment", "Customer-First Support"],
            focus: null
        },
        {
            title: "RizQara Healthcare", tagline: "Health Is Wealth", role: "Founder",
            icon: <Stethoscope />,
            description: "A healthcare initiative making quality health resources, awareness, and guidance accessible to all — because a healthy community is the foundation of every other achievement.",
            services: ["Digital Health Resources", "Healthcare Awareness Programs", "Health & Wellness Guidance", "Community Health Initiatives", "Medical Information Access"],
            focus: null
        },
        {
            title: "RizQara Science & Innovation Club", tagline: "Curiosity Becomes Creation", role: "Founder",
            icon: <FlaskConical />,
            description: "A platform that ignites the flame of curiosity in young minds. Science, technology, and innovation come together to produce tomorrow's problem-solvers, thinkers, and world-changers.",
            services: ["STEM Workshops & Bootcamps", "Innovation Competitions", "Research & Project Support", "Mentorship by Industry Experts", "Youth Technology Programs"],
            focus: null
        }
    ];

    /* ── Journey Timeline ── */
    const journey = [
        { year: "Early Life", title: "Just a Curious Student", icon: <Brain />, desc: "Aurangzeb Sunny was never ordinary. While his peers played, he was fascinated by screens and code — drawn to the magical idea that anyone with a keyboard could build something that touches the world." },
        { year: "The Spark", title: "A Dream Takes Form", icon: <Lightbulb />, desc: "Before knowing a single syntax, he made a decision: to build something meaningful. Armed with only determination, he began offering digital services to real clients." },
        { year: "The Grind", title: "15–16 Hours Every Day", icon: <Coffee />, desc: "No shortcuts. No easy paths. He taught himself everything — development, design, architecture — by relentless study. 15 to 16 hours a day became his norm, not his exception." },
        { year: "12 Sep 2024", title: "RizQara Tech Is Born", icon: <Rocket />, desc: "On his own birthday — September 12, 2024 — he launched RizQara Tech. A deeply personal date. A declaration that building something great was the greatest gift he could give the world." },
        { year: "2024–Present", title: "The Ecosystem Expands", icon: <TrendingUp />, desc: "RizQara grew from a single tech company to a full ecosystem spanning education, healthcare, social impact, e-commerce, and innovation. One founder. One relentless vision." },
        { year: "Vision 2030", title: "Empowering 1 Million Lives", icon: <Target />, desc: "The mission is clear: use technology, education, and community to unlock the potential of a million lives. Every venture, every team member, every line of code serves this one purpose." },
    ];

    /* ── Stats ── */
    const stats = [
        { value: 6, suffix: '+', label: "Ventures Founded", icon: <Building2 size={22} /> },
        { value: 8, suffix: '+', label: "Countries Reached", icon: <Globe size={22} /> },
        { value: 15, suffix: 'h/day', label: "Daily Learning Commitment", icon: <Clock size={22} /> },
        { value: 2024, suffix: '', label: "Year Founded", icon: <CalendarDays size={22} /> },
    ];

    /* ── Core Values ── */
    const values = [
        { icon: <Lightbulb />, title: "Innovation First", desc: "Every problem is an invitation to invent a smarter solution. We never settle for 'good enough'." },
        { icon: <Heart />, title: "People Over Profit", desc: "Our deepest success is measured in lives impacted, communities strengthened, and dreams realized." },
        { icon: <Flame />, title: "Relentless Focus", desc: "From 15-hour learning sessions to company-level strategy, obsession with quality is our operating system." },
        { icon: <Shield />, title: "Trust & Integrity", desc: "Every commitment is a covenant. We deliver what we promise, when we promise it — always." },
        { icon: <Users />, title: "Community at Core", desc: "No venture is an island. Everything we build serves the broader community that believes in us." },
        { icon: <TrendingUp />, title: "Growth Mindset", desc: "Failure is data. Learning is momentum. The only direction that matters is forward." },
    ];

    /* ── Story blocks ── */
    const story = [
        { icon: <Star />, heading: "A Student Who Refused to Be Ordinary", body: "Aurangzeb Sunny grew up like millions of others — a normal student from Bangladesh. But there was always a quiet fire inside him. While others studied textbooks, he was drawn to screens, to code, to the idea that anyone with a keyboard could build something that changes the world. Technology wasn't just a subject. It was a calling." },
        { icon: <Rocket />, heading: "He Started Before He Was Ready", body: "Most people wait until they're ready. Sunny didn't have that patience. He began offering digital services to real clients before he fully understood the craft. That gap — between what he knew and what he needed to know — became his greatest teacher. Instead of fear, he chose urgency. Instead of procrastination, he chose action." },
        { icon: <Coffee />, heading: "15 to 16 Hours a Day — No Exceptions", body: "While the world slept, Sunny studied. Every single day. He had no mentor, no expensive courses, no shortcuts. Just sheer, brutal effort. 15 to 16 hours a day of learning, failing, rebuilding, and learning again. Most people quit in this phase. Sunny discovered that this is exactly where champions are forged." },
        { icon: <Award />, heading: "September 12, 2024 — His Birthday, His Beginning", body: "When the time came to launch officially, Sunny chose a date that would mean something forever: September 12 — his own birthday. RizQara Tech was born on the same day as its founder. A declaration: building something extraordinary was the greatest gift he could give — not just to himself, but to everyone the company would serve." },
        { icon: <Globe />, heading: "One Vision, Six Ventures", body: "What began as a tech agency quickly expanded into a philosophy. RizQara became more than a company — it became an ecosystem. Education, healthcare, social impact, e-commerce, science — each venture a new frontier, each carrying the same DNA of excellence and purpose. Because Sunny believes technology isn't just about building apps. It's about rebuilding lives." },
        { icon: <Heart />, heading: "The Mission Has Never Changed", body: "Strip away the logos, the ventures, the lines of code — and the mission is simple: create practical solutions that improve lives and empower communities. Every product built, every student counseled, every community supported traces back to those marathon learning sessions and the unshakeable belief that one determined person can change the world." },
    ];

    /* ── Quotes ── */
    const quotes = [
        { text: "I didn't start with knowledge. I started with fire.", sub: "On the early days" },
        { text: "Every great journey begins before you know the path.", sub: "On starting without being ready" },
        { text: "Technology is the greatest equalizer. My job is to make sure everyone benefits.", sub: "On the mission" },
        { text: "I founded RizQara on my birthday. Because it was a gift — to myself, and to the world.", sub: "On September 12, 2024" },
    ];

    return (
        <div className="min-h-screen bg-white font-sans overflow-x-hidden pt-24">
            <SEO
                title="Aurangzeb Sunny - Founder of RizQara Tech | Tech Entrepreneur Bangladesh"
                description="Learn about Aurangzeb Sunny, the visionary founder and CEO behind RizQara Tech. Discover his journey as a leading tech entrepreneur, software innovator, and business leader in Bangladesh."
                keywords="Aurangzeb Sunny, Founder of RizQara Tech, Tech Entrepreneur Bangladesh, Software Innovator Dhaka, CEO RizQara Group, Best Software Company Founder BD, Aurangzeb Sunny Biography, Tech Leader"
                canonical="https://rizqara.tech/founder"
                schema={schema}
            />

            {/* ══════════════════════════════════════
                HERO
            ══════════════════════════════════════ */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-black">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-red-950 to-[#500000]" />
                <div className="absolute inset-0 opacity-[0.035]"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1.5px, transparent 0)', backgroundSize: '40px 40px' }} />
                {/* Glow orbs */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#500000]/25 rounded-full blur-[140px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-red-900/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-[#500000]/15 rounded-full blur-[80px] pointer-events-none" />

                <div className="container mx-auto px-6 relative z-10 py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        {/* Top badge */}
                        <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full
                            bg-white/20 border border-white/30 text-white
                            text-xs font-black uppercase tracking-widest mb-10 shadow-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                            Founder & Visionary · RizQara Group
                        </div>

                        {/* Name */}
                        <h1 className="text-6xl md:text-7xl lg:text-[80px] xl:text-[100px]
                            font-black text-white leading-[0.88] tracking-tight mb-10 drop-shadow-2xl uppercase">
                            Aurangzeb <span className="text-red-400">Sunny</span>
                        </h1>

                        {/* Sub */}
                        <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl leading-relaxed mb-4 drop-shadow-md">
                            Also known as <span className="text-white font-bold">Md Mizanur Rahman Sunny</span> — a Bangladeshi entrepreneur who turned midnight curiosity into a movement.
                        </p>
                        <p className="text-base md:text-lg text-white font-light max-w-xl leading-relaxed mb-10 drop-shadow-md">
                            Founder of the <strong className="text-white font-black">RizQara Group</strong> · Born & founded on the same date · September 12 · A day that changed everything.
                        </p>

                        {/* Pill tags */}
                        <div className="flex flex-wrap gap-3">
                            {[
                                { icon: <CalendarDays size={13} />, text: "Founded Sept 12, 2024" },
                                { icon: <MapPin size={13} />, text: "Bangladesh → Global" },
                                { icon: <Sparkles size={13} />, text: "Tech · Edu · Impact" },
                                { icon: <Clock size={13} />, text: "15h/day learner" },
                            ].map((pill, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    className="flex items-center gap-2 px-4 py-2 border rounded-full text-white
                                        text-sm font-medium backdrop-blur-sm"
                                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.15)' }}
                                >
                                    <span className="text-white flex items-center gap-2">
                                        {React.cloneElement(pill.icon as React.ReactElement, { color: 'white' })} {pill.text}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                BIRTHDAY BANNER
            ══════════════════════════════════════ */}
            <section className="bg-[#500000] py-6 overflow-hidden relative shadow-inner">
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8 text-center">
                        <div className="flex items-center gap-3 whitespace-nowrap">
                            <CalendarDays size={20} color="white" className="shrink-0" />
                            <p className="text-white font-black text-lg tracking-wide drop-shadow-md">
                                Founded: <span className="text-white opacity-90">September 12, 2024</span>
                            </p>
                        </div>
                        <div className="hidden lg:block h-6 w-px bg-white/30" />
                        <p className="text-white/90 font-medium text-base drop-shadow-md">
                            The founder's birthday and the company's birth — the same date, the same destiny.
                        </p>
                        <div className="hidden lg:block h-6 w-px bg-white/30" />
                        <div className="flex items-center gap-2 whitespace-nowrap">
                            <Award size={18} color="white" className="shrink-0" />
                            <p className="text-white font-bold text-base tracking-wide drop-shadow-md">Bangladesh → The World</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                STATS
            ══════════════════════════════════════ */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center
                                    group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-[#500000]/10 flex items-center justify-center
                                    mx-auto mb-5 group-hover:bg-[#500000] transition-colors duration-300">
                                    {React.cloneElement(stat.icon as any, {
                                        className: 'text-[#500000] group-hover:text-white transition-colors'
                                    })}
                                </div>
                                <div className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                                    <Counter end={stat.value} suffix={stat.suffix} />
                                </div>
                                <p className="text-gray-500 font-semibold text-xs uppercase tracking-wider leading-snug">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                STORY
            ══════════════════════════════════════ */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <SectionHeading
                            badge="The Story"
                            badgeIcon={<BookOpen size={12} />}
                            title="From Zero to"
                            accent="Ecosystem"
                            subtitle="The story of RizQara is not a story of resources — it's a story of relentless will. A young man who decided to bet everything on himself."
                        />
                    </div>

                    <div className="max-w-4xl mx-auto space-y-6">
                        {story.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.65, ease: 'easeOut' }}
                                className="flex items-start p-8 bg-gray-50 rounded-3xl
                                    border border-gray-100 hover:border-[#500000]/15
                                    hover:bg-white hover:shadow-lg transition-all duration-400 mb-6"
                            >
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center
                                    shadow-sm border border-gray-100 shrink-0 mr-6">
                                    {React.cloneElement(item.icon as any, {
                                        size: 22, className: 'text-[#500000]'
                                    })}
                                </div>
                                <div className="pt-1">
                                    <h3 className="text-xl font-black text-gray-900 mb-3 leading-tight">
                                        {item.heading}
                                    </h3>
                                    <p className="text-gray-600 font-light leading-relaxed text-[15px]">
                                        {item.body}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #1a0000, #500000)' }}>
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '36px 36px' }} />

                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-5 py-2 rounded-full border
                            text-xs font-black uppercase tracking-widest mb-0 text-white"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                            <Quote size={11} color="white" className="mr-2" /> In His Own Words
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {quotes.map((q, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12 }}
                                className="p-8 border rounded-3xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-1"
                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                            >
                                <Quote size={28} color="rgba(255,255,255,0.4)" className="mb-5" />
                                <p className="text-xl font-light italic leading-relaxed mb-5" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                    {q.text}
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                                        <span className="text-white text-xs font-black">AS</span>
                                    </div>
                                    <div>
                                        <p className="text-white font-black text-sm">Aurangzeb Sunny</p>
                                        <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{q.sub}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                JOURNEY TIMELINE
            ══════════════════════════════════════ */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <SectionHeading
                            badge="The Timeline"
                            badgeIcon={<CalendarDays size={12} />}
                            title="The Road That"
                            accent="Built Everything"
                            subtitle="Every milestone was earned. None were given. Every step was paid for in effort, sleepless nights, and unwavering belief."
                        />
                    </div>

                    {/* Timeline wrapper */}
                    <div className="max-w-3xl mx-auto relative">
                        {/* Vertical spine — visible only md+ */}
                        <div className="hidden md:block absolute left-1/2 top-6 bottom-6 w-0.5
                            bg-gradient-to-b from-transparent via-[#500000]/30 to-transparent -translate-x-1/2" />

                        <div className="flex flex-col">
                            {journey.map((item, i) => (
                                <div key={i} className="w-full relative" style={{ marginBottom: i !== journey.length - 1 ? '80px' : '0' }}>
                                    <TimelineItem {...item} isLeft={i % 2 === 0} index={i} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                VENTURES / ECOSYSTEM
            ══════════════════════════════════════ */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <SectionHeading
                            badge="RizQara Ecosystem"
                            badgeIcon={<Sparkles size={12} />}
                            title="Six Ventures."
                            accent="One Relentless Mission."
                            subtitle="Each company in the RizQara Group is a different answer to the same question: how do we make the world work better for everyone?"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {ventures.map((venture, i) => (
                            <VentureCard key={i} venture={venture} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                CORE VALUES
            ══════════════════════════════════════ */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <SectionHeading
                            badge="Core Values"
                            badgeIcon={<Heart size={12} />}
                            title="What Drives"
                            accent="Every Decision"
                            subtitle="These aren't posters on a wall. They're lived every single day by every person in the RizQara family."
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {values.map((v, i) => (
                            <ValueCard key={i} {...v} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                WHY HIM + MISSION STATEMENT
            ══════════════════════════════════════ */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                        {/* Left */}
                        <div>
                            <Badge text="Why Aurangzeb Sunny?" icon={<Zap size={11} />} />
                            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-10 leading-tight">
                                Not Just a Founder.<br />
                                <span className="text-[#500000]">A Force of Nature.</span>
                            </h2>

                            <div className="space-y-5">
                                {[
                                    { icon: <BookOpen />, text: "Self-taught through 15–16 hour daily learning sessions with zero formal training in tech" },
                                    { icon: <Rocket />, text: "Founded RizQara on his birthday — September 12 — turning a personal date into a landmark" },
                                    { icon: <Globe />, text: "Operates across 6+ ventures and 8+ countries with a lean, high-performance team" },
                                    { icon: <Heart />, text: "Built social impact alongside commercial ventures from day one — profit and purpose always coexist" },
                                    { icon: <Zap />, text: "Goes from idea to execution at startup speed while maintaining enterprise-level standards" },
                                    { icon: <Users />, text: "Personally invested in students, team members, and communities through direct mentorship" },
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.08 }}
                                        className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm
                                            hover:border-[#500000]/15 hover:shadow-md transition-all duration-300"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-[#500000]/10 flex items-center justify-center shrink-0">
                                            {React.cloneElement(item.icon as any, { size: 17, className: 'text-[#500000]' })}
                                        </div>
                                        <p className="text-gray-600 font-light leading-relaxed text-sm pt-1.5">{item.text}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Right */}
                        <div className="space-y-8">
                            {/* Mission quote card */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="p-8 rounded-3xl text-white relative overflow-hidden"
                                style={{ background: 'linear-gradient(to bottom right, #500000, #2a0000)' }}
                            >
                                <Quote size={32} color="rgba(255,255,255,0.3)" className="mb-6" />
                                <p className="text-xl font-semibold leading-relaxed italic mb-8 relative z-10" style={{ color: 'white' }}>
                                    "I didn't start RizQara to get rich. I started it because I believed — and still believe — that every person deserves access to technology, education, and opportunity. That belief is the engine behind every single thing we build."
                                </p>
                                <div className="flex items-center gap-3 relative z-10">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                                        <span className="text-white font-black text-sm">AS</span>
                                    </div>
                                    <div>
                                        <p className="font-black text-white text-sm">Aurangzeb Sunny</p>
                                        <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Founder, RizQara Group · Est. 12 Sep 2024</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Mini stats */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.15 }}
                                className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm"
                            >
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6">
                                    The Numbers Behind the Story
                                </p>
                                <div className="grid grid-cols-2 gap-6">
                                    {[
                                        { n: "6+", l: "Active Ventures" },
                                        { n: "8+", l: "Countries" },
                                        { n: "2024", l: "Year Founded" },
                                        { n: "∞", l: "Ambition" },
                                    ].map((item, i) => (
                                        <div key={i} className="text-center py-4 px-2 bg-gray-50 rounded-2xl">
                                            <p className="text-3xl font-black text-[#500000] mb-1">{item.n}</p>
                                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{item.l}</p>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Process steps */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm"
                            >
                                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-6">
                                    The Founder's Process
                                </p>
                                <div className="space-y-4">
                                    {[
                                        { step: "01", label: "Identify the Problem" },
                                        { step: "02", label: "Learn Everything Needed" },
                                        { step: "03", label: "Build Without Waiting" },
                                        { step: "04", label: "Serve the Community" },
                                        { step: "05", label: "Scale with Purpose" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4">
                                            <span className="text-xs font-black text-[#500000]/40 w-6 shrink-0">{item.step}</span>
                                            <div className="flex-1 h-px bg-gray-100" />
                                            <span className="text-sm font-bold text-gray-700">{item.label}</span>
                                            <ChevronRight size={14} className="text-[#500000]/40 shrink-0" />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                VISION 2030 CTA
            ══════════════════════════════════════ */}
            <section className="py-32 relative overflow-hidden" style={{ background: '#500000' }}>
                <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center px-5 py-2 rounded-full border
                            text-xs font-black uppercase tracking-widest mb-10 text-white"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                            <Rocket size={11} className="text-red-300 mr-2" /> Vision 2030
                        </div>

                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tight">
                            Empowering<br />
                            <span className="text-red-300">
                                1 Million Lives
                            </span>
                        </h2>

                        <p className="text-xl md:text-2xl text-white text-opacity-50 font-light max-w-2xl mx-auto leading-relaxed mb-16">
                            By 2030, the RizQara ecosystem aims to touch the lives of one million people — through technology, education, healthcare, and community. One person started this. Together, we'll finish it.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center items-center">
                            <a href="/about"
                                className="inline-flex items-center px-8 py-4 bg-white text-[#500000]
                                    font-black rounded-full hover:bg-gray-100 transition-colors
                                    shadow-2xl shadow-black/30 text-sm tracking-wide mb-4 sm:mb-0 sm:mr-4">
                                Our Story <ArrowRight size={17} className="ml-3" />
                            </a>
                            <a href="/contact"
                                className="inline-flex items-center px-8 py-4 text-white
                                    font-black rounded-full transition-colors border text-sm tracking-wide"
                                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.15)' }}>
                                Work With Us
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                CONTACT INFO
            ══════════════════════════════════════ */}
            <section className="py-24 bg-gray-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#500000]/20 to-transparent" />
                <div className="container mx-auto px-6 max-w-5xl relative z-10">
                    <div className="text-center mb-16">
                        <SectionHeading
                            badge="Connect"
                            badgeIcon={<Phone size={12} />}
                            title="Direct Contact"
                            subtitle="Want to build something extraordinary? Get in touch directly."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <a href="https://www.linkedin.com/in/aurangzebsunny/" target="_blank" rel="noopener noreferrer"
                            className="flex items-center p-6 bg-white rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 hover:border-[#500000]/20 group">
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-[#500000] transition-colors duration-400 shrink-0" style={{ marginRight: '20px' }}>
                                <Linkedin size={20} className="text-[#500000] group-hover:text-white transition-colors duration-400" />
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Professional Network</div>
                                <div className="text-lg font-bold text-gray-900 group-hover:text-[#500000] transition-colors truncate">Aurangzeb Sunny</div>
                            </div>
                        </a>

                        <a href="mailto:aurangzebsunnyy@gmail.com"
                            className="flex items-center p-6 bg-white rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 hover:border-[#500000]/20 group">
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-[#500000] transition-colors duration-400 shrink-0" style={{ marginRight: '20px' }}>
                                <Mail size={20} className="text-[#500000] group-hover:text-white transition-colors duration-400" />
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Direct Email</div>
                                <div className="text-lg font-bold text-gray-900 group-hover:text-[#500000] transition-colors truncate">aurangzebsunnyy@gmail.com</div>
                            </div>
                        </a>

                        <a href="tel:016047101170"
                            className="flex items-center p-6 bg-white rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 hover:border-[#500000]/20 group">
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-[#500000] transition-colors duration-400 shrink-0" style={{ marginRight: '20px' }}>
                                <Phone size={20} className="text-[#500000] group-hover:text-white transition-colors duration-400" />
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Phone Number</div>
                                <div className="text-lg font-bold text-gray-900 group-hover:text-[#500000] transition-colors truncate">016047101170</div>
                            </div>
                        </a>

                        <a href="https://aurangzebsunny.vercel.app" target="_blank" rel="noopener noreferrer"
                            className="flex items-center p-6 bg-white rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 hover:border-[#500000]/20 group">
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-[#500000] transition-colors duration-400 shrink-0" style={{ marginRight: '20px' }}>
                                <Globe size={20} className="text-[#500000] group-hover:text-white transition-colors duration-400" />
                            </div>
                            <div className="overflow-hidden">
                                <div className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Personal Portfolio</div>
                                <div className="text-lg font-bold text-gray-900 group-hover:text-[#500000] transition-colors truncate">aurangzesbsunny.vercel.app</div>
                            </div>
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default FounderPage;
