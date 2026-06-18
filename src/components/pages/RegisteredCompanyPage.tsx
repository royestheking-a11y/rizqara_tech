import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, MapPin, Building2, Globe, FileText, CheckCircle2, Clock } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const RegisteredCompanyPage = () => {
    const { language } = useData();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const registrations = [
        {
            country: 'Bangladesh',
            country_bn: 'বাংলাদেশ',
            status: 'Verified',
            status_bn: 'যাচাইকৃত',
            icon: <MapPin className="text-[#500000]" size={24} />,
            color: 'bg-green-50 border-green-200 text-green-700',
            shield: <ShieldCheck size={20} className="text-green-600" />,
            details: 'Primary Headquarters & Operations Center',
            details_bn: 'প্রধান সদর দপ্তর এবং অপারেশন কেন্দ্র'
        },
        {
            country: 'United Kingdom',
            country_bn: 'যুক্তরাজ্য',
            status: 'Verified',
            status_bn: 'যাচাইকৃত',
            icon: <Building2 className="text-[#500000]" size={24} />,
            color: 'bg-green-50 border-green-200 text-green-700',
            shield: <ShieldCheck size={20} className="text-green-600" />,
            details: 'European Regional Office & Registration',
            details_bn: 'ইউরোপীয় আঞ্চলিক অফিস এবং নিবন্ধন'
        },
        {
            country: 'Australia',
            country_bn: 'অস্ট্রেলিয়া',
            status: 'Verified',
            status_bn: 'যাচাইকৃত',
            icon: <Globe className="text-[#500000]" size={24} />,
            color: 'bg-green-50 border-green-200 text-green-700',
            shield: <ShieldCheck size={20} className="text-green-600" />,
            details: 'Oceania Regional Operations',
            details_bn: 'ওশেনিয়া আঞ্চলিক অপারেশন'
        },
        {
            country: 'Canada',
            country_bn: 'কানাডা',
            status: 'Verified',
            status_bn: 'যাচাইকৃত',
            icon: <FileText className="text-[#500000]" size={24} />,
            color: 'bg-green-50 border-green-200 text-green-700',
            shield: <ShieldCheck size={20} className="text-green-600" />,
            details: 'North American Regional Registration',
            details_bn: 'উত্তর আমেরিকান আঞ্চলিক নিবন্ধন'
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="container mx-auto px-6 max-w-5xl">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-[#500000]/10 text-[#500000] px-4 py-2 rounded-full font-bold text-sm mb-6 border border-[#500000]/20"
                    >
                        <ShieldCheck size={18} />
                        {language === 'bn' ? 'অফিসিয়ালি যাচাইকৃত' : 'Officially Verified'}
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight"
                    >
                        {language === 'bn' ? 'Rizqara Tech ' : 'Rizqara Tech '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#500000] to-red-600">
                            {language === 'bn' ? 'নিবন্ধিত কোম্পানি' : 'Registered Company'}
                        </span>
                    </motion.h1>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed"
                    >
                        {language === 'bn' 
                            ? 'আমরা একটি বিশ্বব্যাপী স্বীকৃত এবং আইনগতভাবে নিবন্ধিত সফটওয়্যার ডেভেলপমেন্ট কোম্পানি। আমরা কঠোর আন্তর্জাতিক কমপ্লায়েন্স এবং মান বজায় রেখে বিশ্বের বিভিন্ন দেশে আইনিভাবে কাজ করে থাকি।' 
                            : 'We are a globally recognized and legally registered software development agency. We operate legally across multiple jurisdictions worldwide, ensuring strict compliance, security, and trust for our enterprise clients.'}
                    </motion.p>
                </div>

                {/* Registration Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {registrations.map((reg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + (index * 0.1) }}
                            className="bg-white rounded-3xl p-8 shadow-xl shadow-black/5 border border-gray-100 flex items-start gap-6 hover:-translate-y-1 transition-transform"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-gray-100 flex items-center justify-center shrink-0">
                                {reg.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {language === 'bn' ? reg.country_bn : reg.country}
                                    </h3>
                                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${reg.color}`}>
                                        {reg.shield}
                                        {language === 'bn' ? reg.status_bn : reg.status}
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm">
                                    {language === 'bn' ? reg.details_bn : reg.details}
                                </p>
                                
                                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-xs text-gray-400 font-medium">
                                    <CheckCircle2 size={14} className="text-green-500" />
                                    {language === 'bn' ? 'আইনগতভাবে সক্রিয়' : 'Legally Active & Compliant'}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Processing Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="bg-gradient-to-br from-gray-900 to-black rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-2xl"
                >
                    <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center shrink-0 backdrop-blur-md border border-white/20">
                            <Clock size={32} className="text-white" />
                        </div>
                        
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-white mb-2">
                                {language === 'bn' ? 'বিশ্বব্যাপী প্রক্রিয়াকরণ চলমান' : 'Global Expansion Processing'}
                            </h3>
                            <p className="text-white/70 text-lg">
                                {language === 'bn' 
                                    ? 'আমরা অন্যান্য দেশেও আমাদের আইনি সত্তা নিবন্ধনের প্রক্রিয়ায় আছি যাতে বিশ্বব্যাপী আমাদের গ্রাহকদের আরও ভালোভাবে সেবা দিতে পারি।' 
                                    : 'We are actively in the processing stages for official registration in several other countries worldwide to better serve our global clientele.'}
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Trust Footer */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="mt-16 text-center text-gray-400 text-sm flex items-center justify-center gap-2"
                >
                    <ShieldCheck size={16} />
                    {language === 'bn' ? 'আপনার ডিজিটাল অংশীদার, যাচাইকৃত এবং বিশ্বস্ত।' : 'Your digital partner, verified and trusted globally.'}
                </motion.div>

            </div>
        </div>
    );
};
