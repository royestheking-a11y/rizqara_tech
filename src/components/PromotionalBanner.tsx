import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Sparkles } from 'lucide-react';
import { useData } from '../context/DataContext';

export const PromotionalBanner = () => {
  const { promotion } = useData();
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{days: number, hours: number, minutes: number, seconds: number} | null>(null);

  useEffect(() => {
    // Show banner only if active and not previously closed in this session
    const isClosed = sessionStorage.getItem('rizqara_promo_closed');
    if (promotion.isActive && !isClosed) {
      // Delay slightly for dramatic effect
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [promotion.isActive]);

  useEffect(() => {
    if (!promotion.isActive) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(promotion.expiryDate) - +new Date();
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return null;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [promotion.expiryDate, promotion.isActive]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('rizqara_promo_closed', 'true');
  };

  if (!promotion.isActive || !timeLeft) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-[100] w-[90vw] md:w-[400px]"
        >
          <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#500000]/10">
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#500000] via-red-600 to-[#500000]"></div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#500000]/5 rounded-full blur-2xl"></div>
            
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-[#500000]/10 rounded-lg text-[#500000]">
                  <Sparkles size={20} />
                </div>
                <span className="text-sm font-bold text-[#500000] tracking-wider uppercase">Limited Offer</span>
              </div>

              <h3 className="text-3xl font-black text-gray-900 mb-2 leading-tight">
                {promotion.offerRate}% OFF
              </h3>
              <p className="text-gray-600 mb-6 font-medium">
                On all <span className="text-[#500000] font-bold">{promotion.serviceName}</span>.
                <br />
                <span className="text-sm font-normal text-gray-500">{promotion.description}</span>
              </p>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                <div className="text-center">
                   <span className="block text-2xl font-black text-[#500000] leading-none">{timeLeft.days}</span>
                   <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Days</span>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="text-center">
                   <span className="block text-2xl font-black text-[#500000] leading-none">{timeLeft.hours}</span>
                   <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Hrs</span>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="text-center">
                   <span className="block text-2xl font-black text-[#500000] leading-none">{timeLeft.minutes}</span>
                   <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Mins</span>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="text-center">
                   <span className="block text-2xl font-black text-[#500000] leading-none">{timeLeft.seconds}</span>
                   <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Secs</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-gray-400 justify-center">
                 <Clock size={12} />
                 <span>Offer ends {new Date(promotion.expiryDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
