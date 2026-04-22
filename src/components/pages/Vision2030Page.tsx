import React, { useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Rocket, Globe, Users, ChevronDown, ArrowRight, Target, Lightbulb, Activity, Cpu, ShieldCheck, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SEO } from '../SEO';
import { useData } from '../../context/DataContext';

// Background Particles Component
const ParticleBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Dark cosmic gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a0505] via-[#0a0000] to-black"></div>
            
            {/* Animated glowing orbs */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 50, 0],
                    y: [0, -50, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#500000]/30 rounded-full blur-[120px]"
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, -50, 0],
                    y: [0, 50, 0]
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-red-900/20 rounded-full blur-[150px]"
            />
            
            {/* Grid lines */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05] invert"></div>
        </div>
    );
};

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = '', label }: { value: number, suffix?: string, label: string }) => {
    const [count, setCount] = React.useState(0);
    const nodeRef = React.useRef(null);
    const { scrollYProgress } = useScroll({ target: nodeRef, offset: ["start end", "end start"] });
    const isInView = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

    useEffect(() => {
        let unsubscribe = isInView.on("change", (v) => {
            if (v > 0) {

                const end = value;
                const duration = 2000;
                const startTime = performance.now();

                const updateCount = (currentTime: number) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // easeOutQuart
                    const easeProgress = 1 - Math.pow(1 - progress, 4);
                    setCount(Math.floor(easeProgress * end));

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    }
                };
                requestAnimationFrame(updateCount);
                unsubscribe();
            }
        });
        return () => unsubscribe();
    }, [isInView, value]);

    return (
        <div ref={nodeRef} className="flex flex-col items-center justify-center p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
            <div className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white mb-2 tracking-tighter">
                {count}{suffix}
            </div>
            <div className="text-white/60 font-medium tracking-widest uppercase text-sm">{label}</div>
        </div>
    );
};

// Timeline Node Component
const TimelineNode = ({ year, title, desc, icon: Icon, isLeft, index }: any) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className={`flex flex-col md:flex-row items-center w-full mb-24 ${isLeft ? 'md:flex-row-reverse' : ''}`}
        >
            <div className={`w-full md:w-1/2 flex flex-col ${isLeft ? 'md:items-start md:pl-16' : 'md:items-end md:pr-16'} text-center md:text-left`}>
                <div className={`p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:bg-white/10 transition-colors shadow-2xl relative group w-full max-w-lg ${isLeft ? '' : 'text-right'}`}>
                    <div className={`absolute -inset-1 bg-gradient-to-r from-[#500000] to-red-600 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200`}></div>
                    <div className="relative">
                        <div className={`text-4xl font-black text-white mb-2 ${isLeft ? '' : 'justify-end'}`}>{title}</div>
                        <p className="text-white/60 leading-relaxed">{desc}</p>
                    </div>
                </div>
            </div>

            <div className="relative flex items-center justify-center w-20 h-20 my-8 md:my-0 z-10 shrink-0">
                <div className="absolute w-full h-full bg-[#500000] rounded-full opacity-20 animate-ping"></div>
                <div className="w-16 h-16 bg-gradient-to-br from-[#500000] to-red-900 rounded-full border-4 border-black flex items-center justify-center shadow-[0_0_30px_rgba(80,0,0,0.8)] z-10 relative">
                    <Icon className="text-white" size={24} />
                </div>
                {/* Year Label */}
                <div className={`absolute top-1/2 -translate-y-1/2 font-black text-2xl text-transparent bg-clip-text bg-gradient-to-br from-white/80 to-white/20 ${isLeft ? 'right-24' : 'left-24'}`}>
                    {year}
                </div>
            </div>

            <div className="w-full md:w-1/2"></div>
        </motion.div>
    );
};


export const Vision2030Page = () => {
    const navigate = useNavigate();
    const { language } = useData();
    const { scrollYProgress } = useScroll();
    
    // Vertical progress line
    const yRange = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const timelineData = [
        {
            year: "2026",
            title: "Global Expansion",
            desc: "Establishing a physical presence in 5+ international markets including the Middle East and Europe, focusing on AI-driven enterprise solutions.",
            icon: Globe
        },
        {
            year: "2027",
            title: "Product Ecosystem",
            desc: "Launching a suite of 20+ proprietary SaaS products designed to automate and optimize business operations for SMEs globally.",
            icon: Target
        },
        {
            year: "2028",
            title: "AI Integration Center",
            desc: "Opening an advanced AI research lab in Bangladesh to pioneer next-generation automation and predictive software solutions.",
            icon: Lightbulb
        },
        {
            year: "2029",
            title: "1M+ Active Users",
            desc: "Reaching a milestone of over 1 million daily active users across our managed enterprise systems and proprietary platforms.",
            icon: Users
        },
        {
            year: "2030",
            title: "The Ultimate Vision",
            desc: "Becoming a top 10 global software development agency, redefining industry standards and empowering businesses with unparalleled tech innovations.",
            icon: Rocket
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden relative selection:bg-[#500000] selection:text-white">
            <SEO 
                title="Vision 2030 | RizQara Tech" 
                description="Explore RizQara Tech's grand roadmap to 2030. Our goals, global expansion, and future innovations." 
            />

            <ParticleBackground />

            {/* Navbar Overlay - Since standard Navbar is white, we might want a dark overlay for this specific page, or just keep it */}
            <div className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center pointer-events-none">
                <button 
                    onClick={() => navigate('/')} 
                    className="pointer-events-auto flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all font-bold text-sm tracking-widest uppercase text-white"
                >
                    <ArrowRight className="rotate-180" size={16} /> Back to Home
                </button>
            </div>

            {/* HERO SECTION */}
            <div className="relative h-screen flex flex-col items-center justify-center text-center px-6 z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                >
                    <div className="inline-block px-4 py-2 rounded-full border border-[#500000] bg-[#500000]/20 text-red-400 text-xs font-black uppercase tracking-[0.3em] mb-8 shadow-[0_0_20px_rgba(80,0,0,0.5)]">
                        Strategic Roadmap
                    </div>
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tighter leading-none">
                        VISION <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#500000] via-red-500 to-[#500000] animate-pulse">2030</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/60 font-light max-w-3xl mx-auto leading-relaxed mb-12">
                        {language === 'bn' 
                            ? "আগামীকালের জন্য আমাদের কৌশল। আমরা কীভাবে প্রযুক্তি এবং উদ্ভাবনকে পুনরায় সংজ্ঞায়িত করতে যাচ্ছি।"
                            : "Building the future. Discover how RizQara Tech is evolving to redefine the global technology landscape."
                        }
                    </p>
                    
                    <motion.div 
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/40 flex flex-col items-center gap-2"
                    >
                        <span className="text-xs uppercase tracking-widest font-bold">Scroll to Explore</span>
                        <ChevronDown size={24} />
                    </motion.div>
                </motion.div>
            </div>

            {/* METRICS SECTION */}
            <div className="relative z-10 container mx-auto px-6 py-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <AnimatedCounter value={1} suffix="M+" label="Global Users" />
                    <AnimatedCounter value={100} suffix="+" label="Innovative Products" />
                    <AnimatedCounter value={50} suffix="+" label="Countries Reached" />
                </div>
            </div>

            {/* CORE PILLARS SECTION */}
            <div className="relative z-10 container mx-auto px-6 py-24 bg-gradient-to-b from-transparent via-[#500000]/5 to-transparent">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Our Core Pillars</h2>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto">The foundational principles that drive our vision and guarantee our success in the upcoming decade.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[
                        { icon: Cpu, title: "AI-First Innovation", desc: "Integrating advanced artificial intelligence into all our solutions to automate and optimize complex workflows." },
                        { icon: ShieldCheck, title: "Unbreakable Security", desc: "Building enterprise-grade, resilient systems that protect data integrity across all our global platforms." },
                        { icon: TrendingUp, title: "Scalable Ecosystems", desc: "Designing architectures capable of supporting millions of users seamlessly as we expand our market reach." }
                    ].map((pillar, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: i * 0.2 }}
                            className="p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl hover:bg-white/10 hover:border-[#500000]/50 transition-all group"
                        >
                            <div className="w-16 h-16 bg-[#500000]/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#500000]/40 transition-all border border-[#500000]/30">
                                <pillar.icon className="text-red-400 group-hover:text-red-300" size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4">{pillar.title}</h3>
                            <p className="text-white/60 leading-relaxed">{pillar.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* TIMELINE SECTION */}
            <div className="relative z-10 container mx-auto px-6 py-32">
                <div className="text-center mb-32">
                    <h2 className="text-5xl font-black text-white mb-6">The Journey Ahead</h2>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto">Milestones we are committed to achieving as we scale towards global prominence.</p>
                </div>

                <div className="relative max-w-5xl mx-auto">
                    {/* Vertical Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-white/10 -translate-x-1/2 rounded-full overflow-hidden">
                        <motion.div 
                            className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#500000] to-red-500 rounded-full shadow-[0_0_15px_red]"
                            style={{ height: yRange }}
                        />
                    </div>

                    {timelineData.map((node, i) => (
                        <TimelineNode 
                            key={node.year}
                            year={node.year}
                            title={node.title}
                            desc={node.desc}
                            icon={node.icon}
                            isLeft={i % 2 === 0}
                            index={i}
                        />
                    ))}
                </div>
            </div>

            {/* CTA SECTION */}
            <div className="relative z-10 container mx-auto px-6 py-32 text-center pb-64">
                <div className="max-w-3xl mx-auto p-12 bg-gradient-to-br from-[#500000]/20 to-transparent border border-[#500000]/30 rounded-[40px] backdrop-blur-xl">
                    <Activity className="mx-auto text-red-500 mb-6" size={48} />
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Be Part of the Future</h2>
                    <p className="text-white/70 text-lg mb-10 leading-relaxed">
                        Join hands with a forward-thinking technology partner. Let's build solutions today that will shape tomorrow.
                    </p>
                    <button 
                        onClick={() => navigate('/contact')}
                        className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest text-sm rounded-full hover:scale-105 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)] flex items-center gap-3 mx-auto"
                    >
                        Start Your Project <ArrowRight size={18} />
                    </button>
                </div>
            </div>

            {/* Floating gradient overlay at bottom to blend out */}
            <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none"></div>
        </div>
    );
};
