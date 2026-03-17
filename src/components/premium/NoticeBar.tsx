import { motion } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { Bell } from 'lucide-react';

export const NoticeBar = () => {
    const { notices, language } = useData();

    // Filter active notices
    const activeNotices = notices.filter(n => n.isActive);
    if (activeNotices.length === 0) return null;

    // Calculate dynamic duration based on content length
    const totalChars = activeNotices.reduce((acc, n) => acc + (language === 'bn' ? (n.text_bn?.length || 0) : (n.text?.length || 0)), 0);
    const duration = Math.max(30, totalChars / 4); // Adjust speed based on readability

    return (
        <div className="w-full bg-[#500000] overflow-hidden py-3 relative my-16 shadow-[0_20px_50px_rgba(80,0,0,0.2)]">
            {/* Main Gradient Background - Matches Footer Line Style */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#500000] via-red-600 to-[#500000] opacity-100"></div>
            
            <div className="container mx-auto px-6 flex items-center gap-6 relative z-10">
                {/* Branding Badge */}
                <div className="flex items-center gap-2 bg-white text-[#500000] px-4 py-1.5 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.15em] shrink-0 shadow-lg border border-white/10">
                    <Bell size={14} className="animate-bounce" />
                    <span>Notice</span>
                </div>

                {/* Seamless Marquee Wrapper */}
                <div className="flex-1 overflow-hidden relative flex items-center">
                    <motion.div
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{
                            repeat: Infinity,
                            duration: duration,
                            ease: "linear"
                        }}
                        className="flex whitespace-nowrap items-center"
                    >
                        {/* Content Set 1 */}
                        <div className="flex items-center gap-8 pr-8">
                            {activeNotices.map((n, i) => (
                                <div key={`n1-${i}`} className="flex items-center gap-8">
                                    <span className="text-white font-bold text-sm md:text-lg tracking-wide">
                                        {language === 'bn' ? n.text_bn : n.text}
                                    </span>
                                    {/* Bullet Divider */}
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                                </div>
                            ))}
                        </div>
                        {/* Content Set 2 (Duplicate for Seamless Loop) */}
                        <div className="flex items-center gap-8 pr-8">
                            {activeNotices.map((n, i) => (
                                <div key={`n2-${i}`} className="flex items-center gap-8">
                                    <span className="text-white font-bold text-sm md:text-lg tracking-wide">
                                        {language === 'bn' ? n.text_bn : n.text}
                                    </span>
                                    {/* Bullet Divider */}
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
            
            {/* Polished Overlays */}
            <div className="absolute top-0 left-0 w-full h-px bg-white/20"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-black/10"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>
        </div>
    );
};
