import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, ArrowRight, Gift } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';

interface PromotionCardProps {
    offerRate: string;
    serviceName: string;
    expiryDate: string;
    onClose?: () => void;
    onClaim?: () => void;
    className?: string;
}

export const PromotionCard: React.FC<PromotionCardProps> = ({
    offerRate,
    serviceName,
    expiryDate,
    onClose,
    onClaim,
    className = ""
}) => {
    const { language } = useData();
    const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);

    useEffect(() => {
        if (!expiryDate) return;

        const calculateTimeLeft = () => {
            const difference = +new Date(expiryDate) - +new Date();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                setTimeLeft(null); // Expired
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [expiryDate]);

    // If expired and not in preview (we assume consistent date for preview), handled by parent or just show 00
    const timeDisplay = timeLeft || { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return (
        <div className={`relative w-full max-w-[480px] bg-white rounded-3xl shadow-2xl overflow-hidden ring-1 ring-black/5 ${className}`}>
            {/* Premium Glass Effect Header */}
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-br from-[#500000] to-[#2a0000] overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                {/* Abstract Shapes */}
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
                <div className="absolute top-12 -left-12 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
            </div>

            {/* Close Button */}
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white/80 hover:text-white transition-all duration-300"
                >
                    <X size={16} />
                </button>
            )}

            <div className="relative pt-10 px-5 pb-6 md:pt-12 md:px-8 md:pb-8 text-center">
                {/* Floating Icon */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mx-auto w-16 h-16 md:w-20 md:h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-[#500000] mb-6 md:mb-8 relative z-10 ring-4 ring-white"
                >
                    <Gift size={32} className="md:w-9 md:h-9" strokeWidth={2.5} />
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 tracking-tight">
                        {language === 'bn' ? 'এক্সক্লুসিভ অফার' : 'Exclusive Offer'}
                    </h2>
                    <p className="text-gray-500 mb-6 md:mb-8 font-medium max-w-xs mx-auto leading-relaxed text-sm md:text-base">
                        {language === 'bn' ? 'একটি অপরাজেয় হারে আপনার ব্যবসার জন্য প্রিমিয়াম সক্ষমতা আনলক করুন।' : 'Unlock premium capabilities for your business at an unbeatable rate.'}
                    </p>
                </motion.div>

                {/* Main Offer Card */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-4 md:p-6 border border-gray-200 mb-6 md:mb-8 relative overflow-hidden group"
                >
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#500000]"></div>
                    <div className="flex flex-col items-center relative z-10">
                        <div className="text-xs md:text-sm font-bold text-[#500000] uppercase tracking-widest mb-1">{language === 'bn' ? 'সীমিত সময়ের ডিসকাউন্ট' : 'Limited Time Discount'}</div>
                        <div className="flex items-baseline justify-center gap-1 mb-1">
                            <span className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight">{offerRate}%</span>
                            <span className="text-xl md:text-2xl font-bold text-gray-400">{language === 'bn' ? 'ছাড়' : 'OFF'}</span>
                        </div>
                        <div className="text-gray-600 font-medium text-sm md:text-base">{serviceName}</div>
                    </div>
                </motion.div>

                {/* Countdown Timer */}
                <div className="flex justify-center gap-3 md:gap-4 mb-6 md:mb-8">
                    {[
                        { val: timeDisplay.days, label: language === 'bn' ? 'দিন' : 'Days' },
                        { val: timeDisplay.hours, label: language === 'bn' ? 'ঘন্টা' : 'Hours' },
                        { val: timeDisplay.minutes, label: language === 'bn' ? 'মিনিট' : 'Mins' },
                        { val: timeDisplay.seconds, label: language === 'bn' ? 'সেকেন্ড' : 'Secs' }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div className="w-10 h-10 md:w-12 md:h-12 bg-white border border-gray-200 text-gray-900 rounded-xl flex items-center justify-center text-base md:text-lg font-bold shadow-sm mb-1 md:mb-2">
                                {item.val.toString().padStart(2, '0')}
                            </div>
                            <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.label}</span>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <button
                    onClick={onClaim}
                    className="w-full py-3 md:py-4 bg-[#500000] text-white rounded-xl font-bold shadow-xl shadow-red-900/20 hover:bg-[#3a0000] hover:shadow-2xl hover:shadow-red-900/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 group text-sm md:text-base"
                >
                    <span>{language === 'bn' ? 'এই অফারটি দাবি করুন' : 'Claim This Offer'}</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-4 md:mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
                    <Clock size={12} />
                    <span>{language === 'bn' ? 'মেয়াদ শেষ হবে' : 'Expires on'} {new Date(expiryDate).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
};

export const PromotionOverlay = () => {
    const { promotion, services } = useData();
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Show after a short delay on initial load
        if (promotion.isActive) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, [promotion.isActive]);

    if (!promotion.isActive) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 backdrop-blur-md pointer-events-auto transition-all"
                        onClick={() => setIsVisible(false)}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        transition={{ type: "spring", duration: 0.7, bounce: 0.3 }}
                        className="pointer-events-auto"
                    >
                        <PromotionCard
                            offerRate={promotion.offerRate}
                            serviceName={promotion.serviceName}
                            expiryDate={promotion.expiryDate}
                            onClose={() => setIsVisible(false)}
                            onClaim={() => {
                                setIsVisible(false);
                                const targetService = services.find(s => s.title === promotion.serviceName);
                                if (targetService) {
                                    navigate(`/services/${targetService.id}`);
                                } else {
                                    navigate('/contact');
                                }
                            }}
                        />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
