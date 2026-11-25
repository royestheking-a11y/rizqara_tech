import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, ArrowRight, Gift } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useNavigate } from 'react-router-dom';

import { useDialog } from '../../utils/useDialog';
import { getSlug } from '../../utils/content';

function promotionExpiry(value: string) {
    return Date.parse(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T23:59:59.999+06:00` : value);
}

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
            const difference = promotionExpiry(expiryDate) - Date.now();

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

    const bn = language === 'bn';
    const rate = offerRate.trim().replace(/[%٪]+\s*$/, '').trim();
    const end = promotionExpiry(expiryDate);
    const date = Number.isFinite(end)
        ? new Intl.DateTimeFormat(bn ? 'bn-BD' : 'en-US', { dateStyle: 'long', timeZone: 'Asia/Dhaka' }).format(end)
        : '';
    const units = [
        { value: timeLeft?.days, label: bn ? 'দিন' : 'Days' },
        { value: timeLeft?.hours, label: bn ? 'ঘণ্টা' : 'Hours' },
        { value: timeLeft?.minutes, label: bn ? 'মিনিট' : 'Mins' },
        { value: timeLeft?.seconds, label: bn ? 'সেকেন্ড' : 'Secs' },
    ];

    return (
        <div className={`relative w-full max-w-[480px] overflow-hidden rounded-[26px] border border-[#ffffff40] bg-[#fffaf8] shadow-2xl ${className}`}>
            <div className="relative overflow-hidden bg-[#3b1024] px-6 pb-7 pt-6 text-center text-white"
                style={{ backgroundImage: 'radial-gradient(ellipse at 12% 0%, #822b4a 0%, transparent 58%), linear-gradient(150deg, #4d152c, #280b19)' }}>
                <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border border-white/15 shadow-[0_0_0_24px_#ffffff0a,0_0_0_50px_#ffffff06]" />
                {onClose && (
                    <button type="button" aria-label={bn ? 'অফার বন্ধ করুন' : 'Close offer'} onClick={onClose}
                        className="absolute right-2 top-2 z-10 grid size-11 place-items-center rounded-full text-white hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white">
                        <X size={20} aria-hidden="true" />
                    </button>
                )}
                <div className="relative">
                    <span className="mx-auto grid size-11 place-items-center rounded-xl bg-white/10 text-[#ffd9e6] ring-1 ring-white/20">
                        <Gift size={22} aria-hidden="true" />
                    </span>
                    <div className="mt-3 flex items-baseline justify-center gap-2">
                        <span className="text-[clamp(44px,13vw,68px)] font-black leading-none tracking-[-0.065em]">{rate}%</span>
                        <span className="text-lg font-bold text-[#ffd2e2]">{bn ? 'ছাড়' : 'OFF'}</span>
                    </div>
                    <h2 className="mt-2 break-words text-xl font-bold leading-tight">{serviceName}</h2>
                </div>
            </div>

            <div className="px-5 pb-5 pt-5 text-center sm:px-7">
                <div className="grid grid-cols-4 gap-2" aria-label={bn ? 'অফারের বাকি সময়' : 'Time remaining'}>
                    {units.map(unit => (
                        <div key={unit.label} className="rounded-xl border border-[#ebdce2] bg-[#f7edf1] px-1 py-2.5">
                            <strong className="block text-xl font-bold leading-none text-[#3b1024] tabular-nums">{String(unit.value ?? 0).padStart(2, '0')}</strong>
                            <span className="mt-1.5 block text-[11px] font-semibold text-[#674958]">{unit.label}</span>
                        </div>
                    ))}
                </div>
                {date && <p className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-[#674958]">
                    <Clock size={13} aria-hidden="true" />
                    {bn ? 'মেয়াদ শেষ' : 'Offer ends'} <time dateTime={expiryDate}>{date}</time>
                </p>}
                <button type="button" onClick={onClaim} disabled={!onClaim}
                    className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#661d3a] px-4 py-3 text-sm font-bold text-white hover:bg-[#4c122b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#661d3a]">
                    {bn ? 'অফারটি নিন' : 'Claim This Offer'} <ArrowRight size={17} aria-hidden="true" />
                </button>
            </div>
        </div>
    );
};

export const PromotionOverlay = () => {
    const { promotion, services } = useData();
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();
    const end = promotionExpiry(promotion.expiryDate);
    const active = promotion.isActive && end > Date.now();
    const dialog = useDialog(active && isVisible, () => setIsVisible(false));

    useEffect(() => {
        // Show after a short delay on initial load
        if (!active) { setIsVisible(false); return; }
        const timer = setTimeout(() => setIsVisible(Date.now() < end), 2000);
        const expiryCheck = setInterval(() => { if (Date.now() >= end) setIsVisible(false); }, 30000);
        return () => { clearTimeout(timer); clearInterval(expiryCheck); };
    }, [active, end]);

    if (!active) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] flex overflow-y-auto px-4 py-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-md pointer-events-auto transition-all"
                        onClick={() => setIsVisible(false)}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        transition={{ type: "spring", duration: 0.7, bounce: 0.3 }}
                        ref={dialog}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Promotion offer"
                        tabIndex={-1}
                        className="relative z-10 m-auto w-full max-w-sm pointer-events-auto"
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
                                    navigate(`/services/${getSlug(targetService)}`);
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
