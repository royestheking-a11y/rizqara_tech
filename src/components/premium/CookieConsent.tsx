import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cookie, X, Check, Shield, ChevronRight, Settings, Info } from 'lucide-react';
import { useData } from '../../context/DataContext';

// ... imports

export const CookieConsent = () => {
  const navigate = useNavigate();
  const { language } = useData();
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('rizqara_cookie_consent');

    // Strictly check for null (missing) so 'rejected' is respected
    if (consent === null) {
      // Reduced delay for faster visibility
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('rizqara_cookie_consent', 'all');
    localStorage.setItem('rizqara_cookie_preferences', JSON.stringify({ essential: true, analytics: true, marketing: true }));
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('rizqara_cookie_consent', 'custom');
    localStorage.setItem('rizqara_cookie_preferences', JSON.stringify(preferences));
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem('rizqara_cookie_consent', 'rejected');
    localStorage.setItem('rizqara_cookie_preferences', JSON.stringify({ essential: true, analytics: false, marketing: false }));
    setIsVisible(false);
  };

  // Expose a function to open the modal from footer
  useEffect(() => {
    window.openCookieSettings = () => {
      setIsVisible(true);
      setShowDetails(true);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !localStorage.getItem('rizqara_cookie_consent') ? setShowDetails(false) : setIsVisible(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[90]"
            />
          )}

          <motion.div
            initial={showDetails ? { y: 100, opacity: 0 } : { y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed ${showDetails
              ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl rounded-3xl shadow-2xl'
              : 'bottom-0 left-0 right-0 w-full border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]'
              } bg-white/95 backdrop-blur-xl z-[100] overflow-hidden`}
          >
            {showDetails ? (
              // --- DETAIL / CUSTOMIZE VIEW (MODAL) ---
              <>
                <div className="bg-[#500000] p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Cookie size={100} />
                  </div>
                  <div className="relative z-10 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Cookie size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{language === 'bn' ? 'কুকি পছন্দসমূহ' : 'Cookie Preferences'}</h3>
                        <p className="text-white/70 text-xs">{language === 'bn' ? 'আপনার গোপনীয়তা পছন্দ গুরুত্বপূর্ণ' : 'Your privacy choices matter'}</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setShowDetails(false)} className="text-white/50 hover:text-white transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-6">
                    {language === 'bn' ? 'আপনার কুকি পছন্দ কাস্টমাইজ করুন। ওয়েবসাইট সঠিকভাবে কাজ করার জন্য প্রয়োজনীয় কুকিগুলি সর্বদা প্রয়োজন।' : 'Customize your cookie preferences below. Essential cookies are always required for the website to function properly.'}
                  </p>

                  <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                    {/* Option 1: Essential */}
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 opacity-70">
                      <div className="mt-1">
                        <Shield size={20} className="text-[#500000]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-bold text-gray-800 text-sm">{language === 'bn' ? 'প্রয়োজনীয় কুকি' : 'Essential Cookies'}</h4>
                          <span className="text-xs font-bold text-[#500000] bg-red-50 px-2 py-0.5 rounded border border-red-100">{language === 'bn' ? 'প্রয়োজনীয়' : 'Required'}</span>
                        </div>
                        <p className="text-xs text-gray-500">{language === 'bn' ? 'বেসিক ওয়েবসাইট কার্যকারিতা এবং নিরাপত্তার জন্য প্রয়োজনীয়।' : 'Necessary for basic website functionality and security.'}</p>
                      </div>
                      <div className="relative">
                        <input type="checkbox" checked disabled className="peer sr-only" />
                        <div className="w-9 h-5 bg-gray-300 rounded-full peer-checked:bg-[#500000] opacity-50 cursor-not-allowed"></div>
                        <div className="absolute top-1 left-1 bg-white w-3 h-3 rounded-full translate-x-4"></div>
                      </div>
                    </div>

                    {/* Option 2: Analytics */}
                    <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#500000]/30 transition-colors">
                      <div className="mt-1">
                        <div className="p-1 bg-blue-100 rounded text-blue-600"><Settings size={14} /></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-bold text-gray-800 text-sm">{language === 'bn' ? 'অ্যানালিটিক্স' : 'Analytics'}</h4>
                        </div>
                        <p className="text-xs text-gray-500">{language === 'bn' ? 'আমাদের ওয়েবসাইট আপনি কীভাবে ব্যবহার করেন তা বুঝতে এবং অভিজ্ঞতা উন্নত করতে সাহায্য করুন।' : 'Help us understand how you use our website to improve experience.'}</p>
                      </div>
                      <label className="relative cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.analytics}
                          onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                          className="peer sr-only"
                        />
                        <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-red-300 peer-checked:bg-[#500000] transition-colors"></div>
                        <div className="absolute top-1 left-1 bg-white w-3 h-3 rounded-full peer-checked:translate-x-4 transition-transform"></div>
                      </label>
                    </div>

                    {/* Option 3: Marketing */}
                    <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#500000]/30 transition-colors">
                      <div className="mt-1">
                        <div className="p-1 bg-purple-100 rounded text-purple-600"><Info size={14} /></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-bold text-gray-800 text-sm">{language === 'bn' ? 'মার্কেটিং' : 'Marketing'}</h4>
                        </div>
                        <p className="text-xs text-gray-500">{language === 'bn' ? 'প্রাসঙ্গিক বিজ্ঞাপন বিতরণ এবং প্রচারাভিযানের কার্যকারিতা ট্র্যাক করতে ব্যবহৃত হয়।' : 'Used to deliver relevant advertisements and track campaign performance.'}</p>
                      </div>
                      <label className="relative cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.marketing}
                          onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                          className="peer sr-only"
                        />
                        <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-red-300 peer-checked:bg-[#500000] transition-colors"></div>
                        <div className="absolute top-1 left-1 bg-white w-3 h-3 rounded-full peer-checked:translate-x-4 transition-transform"></div>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <button
                      type="button"
                      onClick={handleSavePreferences}
                      className="flex-1 py-3 bg-[#500000] text-white rounded-xl font-bold text-sm hover:bg-[#3a0000] transition-colors shadow-lg shadow-red-900/20"
                    >
                      {language === 'bn' ? 'পছন্দ সংরক্ষণ করুন' : 'Save Preferences'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDetails(false)}
                      className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                    >
                      {language === 'bn' ? 'ফিরে যান' : 'Back'}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // --- BANNER VIEW (BOTTOM BAR) ---
              <div className="flex flex-col lg:flex-row items-center justify-between p-6 gap-6 max-w-7xl mx-auto w-full">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-[#500000]/10 rounded-full text-[#500000] hidden md:block shrink-0 mt-1">
                    <Cookie size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1 flex items-center gap-2">
                      {language === 'bn' ? 'আমরা আপনার গোপনীয়তাকে মূল্য দিই' : 'We value your privacy'}
                      <span className="md:hidden text-[#500000]"><Cookie size={18} /></span>
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
                      {language === 'bn' ? 'আমরা আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করতে, ব্যক্তিগতকৃত বিজ্ঞাপন বা বিষয়বস্তু পরিবেশন করতে এবং আমাদের ট্র্যাফিক বিশ্লেষণ করতে কুকি ব্যবহার করি। "সব গ্রহণ করুন" এ ক্লিক করে, আপনি আমাদের কুকি ব্যবহারে সম্মতি দেন।' : 'We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.'}
                      <button type="button" onClick={() => navigate('/privacy-policy')} className="ml-2 text-[#500000] underline hover:no-underline font-medium cursor-pointer bg-transparent border-0 p-0 inline">{language === 'bn' ? 'নীতি পড়ুন' : 'Read Policy'}</button>
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 shrink-0 w-full lg:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setShowDetails(true)}
                    className="flex-1 lg:flex-none py-3 px-6 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
                  >
                    {language === 'bn' ? 'কাস্টমাইজ' : 'Customize'}
                  </button>
                  <button
                    type="button"
                    onClick={handleRejectAll}
                    className="flex-1 lg:flex-none py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                  >
                    {language === 'bn' ? 'সব প্রত্যাখ্যান' : 'Reject All'}
                  </button>
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="flex-1 lg:flex-none py-3 px-8 bg-[#500000] text-white rounded-xl font-bold text-sm hover:bg-[#3a0000] transition-colors shadow-lg shadow-red-900/20"
                  >
                    {language === 'bn' ? 'সব গ্রহণ করুন' : 'Accept All'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Add global type definition for window
declare global {
  interface Window {
    openCookieSettings: () => void;
  }
}
