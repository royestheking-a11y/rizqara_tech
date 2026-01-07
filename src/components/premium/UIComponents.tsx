import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
    ArrowRight, ChevronLeft, ChevronRight, Check, X,
    Globe, Award, Briefcase, Zap, Users,
    Rocket, Star, Crown,
    Layout, Monitor, Clock,
    Settings, Sliders, Play, User, Send, MapPin, Phone, Mail,
    MessageCircle, Bot, Loader, Activity, PlayCircle, MessageSquare
} from 'lucide-react';
import { useData } from '../../context/DataContext';

import { toast } from "sonner";

// --- UTILS ---
// const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

// --- 1. CAROUSEL (Generic) ---
export const Carousel = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
    return (
        <div className={`flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide ${className}`} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {children}
        </div>
    );
};

// --- 2. AUTO SCROLL CAROUSEL ---
export const AutoScrollCarousel = ({ items }: { items: React.ReactNode[] }) => {
    return (
        <div className="flex overflow-hidden relative w-full mask-gradient">
            <motion.div
                className="flex gap-12 whitespace-nowrap"
                animate={{ x: ["0%", "-33.33%"] }}
                transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            >
                {items}
                {items} {/* Duplicate for smooth loop */}
                {items}
            </motion.div>
        </div>
    );
};

// --- 3. STATS COUNTER ---
export const StatsCounter = ({ value, label, suffix = "" }: { value: number, label: string, suffix?: string }) => {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref);

    useEffect(() => {
        if (isInView) {
            const duration = 2000;
            const steps = 60;
            const stepTime = duration / steps;
            let current = 0;
            const timer = setInterval(() => {
                current += value / steps;
                if (current >= value) {
                    setCount(value);
                    clearInterval(timer);
                } else {
                    setCount(Math.ceil(current));
                }
            }, stepTime);
            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return (
        <div ref={ref} className="text-center">
            <div className="text-5xl font-black text-[#500000] mb-2">{count}{suffix}</div>
            <div className="text-gray-500 text-sm uppercase tracking-widest font-bold">{label}</div>
        </div>
    );
};

// --- 4. LIVE STATUS WIDGET ---
export const LiveStatusWidget = ({ projectsCount }: { projectsCount: number }) => {
    const { language } = useData();
    return (
        <div className="space-y-4">
            {/* Fake Terminal / Status Log */}
            <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 h-48 overflow-hidden relative border border-gray-800 shadow-inner">
                <div className="absolute top-2 right-2 flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div className="opacity-70 space-y-1">
                    <p>&gt; {language === 'bn' ? 'সিস্টেম শুরু হচ্ছে...' : 'System initialized...'}</p>
                    <p>&gt; {language === 'bn' ? 'নিরাপদ সার্ভারে সংযোগ করা হচ্ছে...' : 'Connecting to secure servers...'}</p>
                    <p>&gt; [OK] {language === 'bn' ? 'ডাটাবেস সংযোগ স্থাপিত' : 'Database connection established'}</p>
                    <p>&gt; {language === 'bn' ? `${projectsCount}টি সক্রিয় প্রকল্প পর্যবেক্ষণ করা হচ্ছে` : `Monitoring ${projectsCount} active projects`}</p>
                    <p>&gt; {language === 'bn' ? 'RizqAI বট: অনলাইন' : 'RizqAI Bot: Online'}</p>
                    <p>&gt; {language === 'bn' ? 'রিয়েল-টাইম অ্যানালিটিক্স: সক্রিয়' : 'Real-time analytics: Active'}</p>
                    <motion.p
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    >_</motion.p>
                </div>
            </div>
        </div>
    );
};

// --- 5. JOURNEY ROADMAP (Snake Style) ---
export const JourneyRoadmap = () => {
    const [activeIdx, setActiveIdx] = useState<number | null>(null);
    const { language } = useData();

    const milestones = [
        {
            year: language === 'bn' ? '২০২৪ এর শুরুতে' : 'Early 2024',
            icon: Users,
            title: language === 'bn' ? 'ফ্রিল্যান্স শিকড়' : 'Freelance Roots',
            subtitle: language === 'bn' ? 'ভিত্তি' : 'The Foundation',
            short: language === 'bn' ? 'ছোট চালিত দল। কোনো নাম নেই। বিশুদ্ধ গুণমান।' : 'Small driven team. No name. Pure quality.',
            details: language === 'bn' ? 'রিজকারা টেক ২০২৪ সালের শুরুতে একটি ছোট কিন্তু চালিত ফ্রিল্যান্স দল হিসেবে শুরু হয়েছিল—ডেভেলপার এবং ডিজাইনাররা একটি শেয়ার করা মানসিকতা নিয়ে একসাথে কাজ করছে: বাস্তব ফলাফল প্রদান করা। কোনো কোম্পানির নাম বা আনুষ্ঠানিক কাঠামো ছাড়াই, আমরা সম্পূর্ণরূপে গুণমান, সহযোগিতা এবং ক্লায়েন্টদের বিশ্বাস অর্জনের দিকে মনোনিবেশ করেছি। সেই পর্যায়টি আমাদের সংস্কৃতিকে রূপ দিয়েছে এবং পরবর্তীতে যা কিছু হয়েছে তার ভিত্তি স্থাপন করেছে।' : 'RizQara Tech started in early 2024 as a small but driven freelance team—developers and designers working together with one shared mindset: deliver real results. Without a company name or formal structure, we focused purely on quality, collaboration, and earning client trust. That phase shaped our culture and laid the foundation for everything that followed.',
            theme: 'white',
            position: 'left'
        },
        {
            year: language === 'bn' ? 'জানুয়ারি ২০২৫' : 'Jan 2025',
            icon: Rocket,
            title: language === 'bn' ? 'অফিসিয়াল লঞ্চ' : 'Official Launch',
            subtitle: language === 'bn' ? 'শুরু' : 'The Beginning',
            short: language === 'bn' ? '৮ জন মূল সদস্য। অফিসিয়াল নিবন্ধন।' : '8 Core Members. Official Registration.',
            stat: '8',
            statLabel: language === 'bn' ? 'মূল সদস্য' : 'Core Members',
            details: language === 'bn' ? 'ডিসেম্বর ২০২৪-এর মধ্যে, আমাদের ক্রমবর্ধমান কাজের চাপ এবং দৃষ্টিভঙ্গি একটি বিষয় পরিষ্কার করে দিয়েছে—আরও বড় কিছু তৈরি করার সময় এসেছে। ৫ জানুয়ারী, ২০২৫-এ, রিজকারা টেক একটি সফটওয়্যার কোম্পানি হিসেবে আনুষ্ঠানিকভাবে নিবন্ধিত হয়েছে, ৮ জন দক্ষ পেশাদারের একটি মূল দলের সাথে লঞ্চ করছে।' : 'By December 2024, our growing workload and vision made one thing clear—it was time to build something bigger. On January 5, 2025, RizQara Tech was officially registered as a software company, launching with a core team of 8 skilled professionals.',
            theme: 'white',
            position: 'right'
        },
        {
            year: language === 'bn' ? 'প্রথম বছর' : 'First Year',
            icon: Briefcase,
            title: language === 'bn' ? 'দ্রুত বৃদ্ধি' : 'Rapid Growth',
            subtitle: language === 'bn' ? 'প্রভাব' : 'The Impact',
            short: language === 'bn' ? '১২টি প্রকল্প বিতরণ। জায়ান্টদের দ্বারা বিশ্বস্ত।' : '12 Projects Delivered. Trusted by Giants.',
            stat: '12',
            statLabel: language === 'bn' ? 'প্রকল্প সম্পন্ন' : 'Projects Done',
            details: language === 'bn' ? 'আমাদের প্রথম বছরের মধ্যে, আমরা সফলভাবে ১২টি সম্পূর্ণ প্রকল্প ডেলিভার করেছি, ৫টি প্রাথমিক এনগেজমেন্ট দিয়ে শুরু করেছি এবং পারফরম্যান্স এবং রেফারেলের মাধ্যমে প্রসারিত করেছি। আমরা গর্বের সাথে গ্রামীণফোন, অ্যাপেক্স, সাউথইস্ট ব্যাংক, দারাজের মতো ব্র্যান্ডের পাশাপাশি রেস্তোরাঁ, কোচিং সেন্টার এবং আন্তর্জাতিক ক্লায়েন্টদের সাথে কাজ করেছি।' : 'Within our first year, we successfully delivered 12 complete projects, starting with 5 initial engagements and expanding through performance and referrals. We’ve proudly worked with brands such as Grameenphone, Apex, Southeast Bank, Daraz, along with restaurants, coaching centers, and international clients.',
            tags: ['Grameenphone', 'Apex', 'Daraz', 'SE Bank'],
            theme: 'maroon',
            position: 'left'
        },
        {
            year: '2026',
            icon: Award,
            title: language === 'bn' ? 'স্কেল এবং কর্তৃত্ব' : 'Scale & Authority',
            subtitle: language === 'bn' ? 'উচ্চ-মূল্যের প্রকল্প + প্রক্রিয়া পরিপক্কতা' : 'High-value projects + process maturity',
            short: language === 'bn' ? '৫টি এন্টারপ্রাইজ-স্তরের প্রকল্প সুরক্ষিত করুন। দল ১৫-১৮ সদস্যে বৃদ্ধি পায়।' : 'Secure 5 enterprise-level projects. Team grows to 15–18 members.',
            stat: '15+',
            statLabel: language === 'bn' ? 'টিম সদস্য' : 'Team Members',
            details: language === 'bn' ? `ফোকাস: উচ্চ-মূল্যের প্রকল্প + প্রক্রিয়া পরিপক্কতা\n\n• ৫টি এন্টারপ্রাইজ-স্তর / উচ্চ-বাজেট প্রকল্প সুরক্ষিত করা\n• মূল পরিষেবাগুলি শক্তিশালী করা: ওয়েব অ্যাপস, পিডব্লিউএ, ইউআই/ইউএক্স, সফটওয়্যার ডেভেলপমেন্ট\n• একটি শক্তিশালী প্রকল্প কেস স্টাডি লাইব্রেরি তৈরি করা\n• দল ৮ → ১৫-১৮ সদস্যে প্রসারিত করা\n• কন্টেন্ট-চালিত বৃদ্ধি শুরু করা: ব্লগ, টেক ভিডিও, লিংকডইন উপস্থিতি\n• অভ্যন্তরীণ সিস্টেম উন্নত করা: কিউএ, ডেভঅপস, প্রজেক্ট ট্র্যাকিং\n• আন্তর্জাতিক ক্লায়েন্ট অধিগ্রহণ শুরু করা (আপওয়ার্ক, লিংকডইন, রেফারেল)\n\nফলাফল: একটি গুরুতর, নির্ভরযোগ্য সফটওয়্যার কোম্পানি হিসেবে স্বীকৃত` : `Focus: High-value projects + process maturity

• Secure 5 enterprise-level / high-budget projects
• Strengthen core services: Web Apps, PWA, UI/UX, Software Development
• Build a strong project case study library
• Expand team from 8 → 15–18 members
• Launch content-driven growth: blogs, tech videos, LinkedIn presence
• Improve internal systems: QA, DevOps, project tracking
• Start international client acquisition (Upwork, LinkedIn, referrals)

Outcome: Recognized as a serious, reliable software company`,
            theme: 'white',
            position: 'right'
        },
        {
            year: '2027',
            icon: Globe,
            title: language === 'bn' ? 'সম্প্রসারণ এবং গ্লোবাল রিচ' : 'Expansion & Global Reach',
            subtitle: language === 'bn' ? 'ব্র্যান্ড + আন্তর্জাতিক ফুটপ্রিন্ট' : 'Brand + international footprint',
            short: language === 'bn' ? 'রিমোট আন্তর্জাতিক অপারেশন খুলুন। দল ২৫-৩০ সদস্যে বৃদ্ধি পায়।' : 'Open remote international operations. Team grows to 25–30 members.',
            stat: '25+',
            statLabel: language === 'bn' ? 'টিম সদস্য' : 'Team Members',
            details: language === 'bn' ? `ফোকাস: ব্র্যান্ড + আন্তর্জাতিক ফুটপ্রিন্ট\n\n• রিমোট আন্তর্জাতিক অপারেশন খোলা (২-৩টি দেশে ক্লায়েন্ট)\n• টিম বৃদ্ধি: ২৫-৩০ সদস্য\n• বিশেষায়িত দল চালু করা (ফ্রন্টএন্ড, ব্যাকএন্ড, ইউআই/ইউএক্স, মার্কেটিং)\n• SaaS / অভ্যন্তরীণ পণ্য চালু করা (অ্যাডমিন টুল, সিআরএম, বা বিশেষ প্ল্যাটফর্ম)\n• স্টার্টআপ, এজেন্সি এবং স্থানীয় এন্টারপ্রাইজগুলির সাথে অংশীদারিত্ব\n• অফিসিয়াল সার্টিফিকেশন এবং অংশীদারিত্ব (গুগল, মেটা, এডব্লিউএস, ইত্যাদি)\n\nফলাফল: রিজকারা টেক একটি স্বীকৃত ক্রস-বর্ডার সার্ভিস প্রোভাইডার হয়ে ওঠে` : `Focus: Brand + international footprint

• Open remote international operations (clients in 2–3 countries)
• Team growth: 25–30 members
• Introduce specialized teams (Frontend, Backend, UI/UX, Marketing)
• Launch SaaS / internal product (admin tool, CRM, or niche platform)
• Partnerships with startups, agencies, and local enterprises
• Official certifications & partnerships (Google, Meta, AWS, etc.)

Outcome: RizQara Tech becomes a recognized cross-border service provider`,
            theme: 'white',
            position: 'left'
        },
        {
            year: '2028',
            icon: Zap,
            title: language === 'bn' ? 'উদ্ভাবন এবং বাজার নেতৃত্ব' : 'Innovation & Market Leadership',
            subtitle: language === 'bn' ? 'পণ্য, নেতৃত্ব, এবং প্রভাব' : 'Products, leadership, and influence',
            short: language === 'bn' ? '২-৩টি নিজস্ব পণ্য চালু করুন। টিমের আকার: ৪০+ পেশাদার।' : 'Launch 2–3 proprietary products. Team size: 40+ professionals.',
            stat: '40+',
            statLabel: language === 'bn' ? 'পেশাদার' : 'Professionals',
            details: language === 'bn' ? `ফোকাস: পণ্য, নেতৃত্ব, এবং প্রভাব\n\n• বড় মাপের এন্টারপ্রাইজ এবং সরকারি স্তরের প্রকল্পগুলি সরবরাহ করা\n• ২-৩টি নিজস্ব পণ্য বা প্ল্যাটফর্ম চালু করা\n• টিমের আকার: ৪০+ পেশাদার\n• ফিজিক্যাল অফিস সম্প্রসারণ বা দ্বিতীয় শাখা খোলা\n• আরএন্ডডি এবং এআই-চালিত সমাধান তৈরি করা\n• টেক ইভেন্ট, ওয়ার্কশপ এবং ডেভেলপার প্রোগ্রাম হোস্ট করা\n• রিজকারা টেক-কে টেক এবং উদ্ভাবনে চিন্তাশীল নেতা হিসেবে অবস্থান করা\n\nফলাফল: পণ্য, মানুষ এবং দীর্ঘমেয়াদী প্রভাব সহ মার্কেট লিডার` : `Focus: Products, leadership, and influence

• Deliver large-scale enterprise & government-level projects
• Launch 2–3 proprietary products or platforms
• Team size: 40+ professionals
• Open physical office expansion or second branch
• Build R&D and AI-driven solutions
• Host tech events, workshops, and developer programs
• Position RizQara Tech as a thought leader in tech & innovation

Outcome: Market leader with products, people, and long-term impact`,
            theme: 'maroon',
            position: 'right'
        },
        {
            year: '2029',
            icon: Crown,
            title: language === 'bn' ? 'গ্লোবাল উপস্থিতি এবং ব্র্যান্ড পাওয়ার' : 'Global Presence & Brand Power',
            subtitle: language === 'bn' ? 'আন্তর্জাতিক প্রতিষ্ঠা + এন্টারপ্রাইজ বিশ্বাস' : 'International establishment + enterprise trust',
            short: language === 'bn' ? '৫+ দেশে ক্লায়েন্টদের সেবা করুন। টিম: ৬০-৮০ পেশাদার।' : 'Serve clients across 5+ countries. Team: 60–80 professionals.',
            stat: '60+',
            statLabel: language === 'bn' ? 'পেশাদার' : 'Professionals',
            details: language === 'bn' ? `ফোকাস: আন্তর্জাতিক প্রতিষ্ঠা + এন্টারপ্রাইজ বিশ্বাস\n\n• রিজকারা টেক-কে স্থানীয়ভাবে একটি বড় মাপের সফটওয়্যার কোম্পানি হিসেবে প্রতিষ্ঠিত করা\n• অফিসিয়াল আন্তর্জাতিক অপারেশন খোলা (শাখা বা আইনি সত্তা)\n• ৫+ দেশে ক্লায়েন্টদের সেবা করা\n• টিম বৃদ্ধি: ৬০-৮০ পেশাদার\n• মিশন-ক্রিটিক্যাল এন্টারপ্রাইজ প্রকল্পগুলি সরবরাহ করা\n• শক্তিশালী নিয়োগকর্তা ব্র্যান্ড: সেরা প্রতিভা এখানে কাজ করতে চায়\n• বাংলাদেশ-ভিত্তিক গ্লোবাল টেক কোম্পানি হিসেবে স্বীকৃত\n• দীর্ঘমেয়াদী চুক্তি এবং রিটেইনার থেকে আয়\n• শক্তিশালী অভ্যন্তরীণ নেতৃত্ব এবং ব্যবস্থাপনা কাঠামো\n\nফলাফল: রিজকারা টেক একটি বিশ্বস্ত আন্তর্জাতিক সফটওয়্যার পার্টনার হয়ে ওঠে` : `Focus: International establishment + enterprise trust

• Establish RizQara Tech as a large-scale software company locally
• Open official international operations (branch or legal entity)
• Serve clients across 5+ countries
• Team growth: 60–80 professionals
• Deliver mission-critical enterprise projects
• Strong employer brand: top talent wants to work here
• Recognized as a Bangladesh-based global tech company
• Revenue from long-term contracts & retainers
• Strong internal leadership and management structure

Outcome: RizQara Tech becomes a trusted international software partner`,
            theme: 'white',
            position: 'left'
        },
        {
            year: '2030',
            icon: Star,
            title: language === 'bn' ? 'পণ্য কোম্পানি এবং শিল্প নেতা' : 'Product Company & Industry Leader',
            subtitle: language === 'bn' ? 'মালিকানা, উদ্ভাবন এবং প্রভাব' : 'Ownership, innovation, and influence',
            short: language === 'bn' ? 'পরিষেবা থেকে পণ্য কোম্পানিতে রূপান্তর। টিম: ১০০+ কর্মচারী।' : 'Transition to service + product company. Team: 100+ employees.',
            stat: '100+',
            statLabel: language === 'bn' ? 'কর্মচারী' : 'Employees',
            details: language === 'bn' ? `ফোকাস: মালিকানা, উদ্ভাবন এবং প্রভাব\n\n• শুধুমাত্র পরিষেবা থেকে পরিষেবা + পণ্য কোম্পানিতে রূপান্তর\n• বিশ্বব্যাপী ব্যবহৃত ফ্ল্যাগশিপ SaaS পণ্য চালু করা\n• ডেডিকেটেড আরএন্ডডি এবং এআই উদ্ভাবন বিভাগ\n• সরকার, বড় এন্টারপ্রাইজ এবং গ্লোবাল ব্র্যান্ডগুলির সাথে কাজ করা\n• টিমের আকার: ১০০+ কর্মচারী\n• ইন-হাউস ট্রেনিং প্রোগ্রাম এবং টেক একাডেমি তৈরি করা\n• সফটওয়্যার, ডিজাইন এবং ডিজিটাল উদ্ভাবনে চিন্তাশীল নেতা হওয়া\n• ২০৩০ এর পরে দীর্ঘমেয়াদী ভিশন পরিকল্পনা\n\nফলাফল: রিজকারা টেক একটি গ্লোবাল টেক লিডার হিসেবে দাঁড়িয়েছে, শুধু একটি ভেন্ডর নয়` : `Focus: Ownership, innovation, and influence

• Transition from service-only to service + product company
• Launch flagship SaaS products used globally
• Dedicated R&D and AI innovation division
• Work with government, large enterprises, and global brands
• Team size: 100+ employees
• Build in-house training programs & tech academy
• Become a thought leader in software, design, and digital innovation
• Long-term vision planning beyond 2030

Outcome: RizQara Tech stands as a global tech leader, not just a vendor`,
            theme: 'white',
            position: 'right'
        }
    ];

    return (
        <div className="relative py-12 md:py-24 px-4 md:px-6 overflow-hidden bg-gradient-to-b from-white to-gray-50">
            {/* Page Title */}
            <div className="text-center mb-16 md:mb-24 max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-6 py-2 rounded-full border border-[#500000]/20 text-[#500000] uppercase tracking-wider mb-6"
                >
                    {language === 'bn' ? 'আমাদের যাত্রা' : 'Our Journey'}
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-3xl md:text-4xl font-black text-[#500000] mb-6 leading-tight"
                >
                    {language === 'bn' ? 'প্রবৃদ্ধির রোডম্যাপ' : 'Growth Roadmap'}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl text-gray-600 leading-relaxed"
                >
                    {language === 'bn' ? 'ফ্রিল্যান্স শিকড় থেকে গ্লোবাল টেক নেতৃত্ব — ভবিষ্যতের জন্য আমাদের ভিশন' : 'From freelance roots to global tech leadership — our vision for the future'}
                </motion.p>
            </div>

            {/* Grid of Milestone Cards */}
            <div className="max-w-7xl mx-auto relative">
                {/* Connecting Lines SVG - Desktop */}
                <svg className="hidden lg:block absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                    {milestones.map((_, i) => {
                        if (i === milestones.length - 1) return null;

                        // Calculate grid positions (3 columns on desktop)
                        const currentCol = i % 3;
                        const currentRow = Math.floor(i / 3);
                        const nextCol = (i + 1) % 3;
                        const nextRow = Math.floor((i + 1) / 3);

                        // Card dimensions and gaps (approximate)
                        const cardWidth = 100 / 3; // percentage
                        const gapX = 2.5; // percentage
                        const rowHeight = 600; // pixels

                        // Calculate center points of cards
                        const x1 = (currentCol * cardWidth) + (currentCol * gapX) + (cardWidth / 2);
                        const y1 = (currentRow * rowHeight) + 300;
                        const x2 = (nextCol * cardWidth) + (nextCol * gapX) + (cardWidth / 2);
                        const y2 = (nextRow * rowHeight) + 300;

                        // Create smooth curve
                        const midX = (x1 + x2) / 2;
                        const midY = (y1 + y2) / 2;

                        return (
                            <motion.path
                                key={`line-${i}`}
                                d={`M ${x1}% ${y1} Q ${midX}% ${midY}, ${x2}% ${y2}`}
                                stroke="#500000"
                                strokeWidth="3"
                                fill="none"
                                strokeDasharray="8 4"
                                opacity="0.2"
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 0.2 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: i * 0.2, ease: "easeInOut" }}
                            />
                        );
                    })}
                </svg>

                {/* Connecting Lines SVG - Tablet */}
                <svg className="hidden md:block lg:hidden absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                    {milestones.map((_, i) => {
                        if (i === milestones.length - 1) return null;

                        // Calculate grid positions (2 columns on tablet)
                        const currentCol = i % 2;
                        const currentRow = Math.floor(i / 2);
                        const nextCol = (i + 1) % 2;
                        const nextRow = Math.floor((i + 1) / 2);

                        const cardWidth = 50;
                        const gapX = 3;
                        const rowHeight = 600;

                        const x1 = (currentCol * cardWidth) + (currentCol * gapX) + (cardWidth / 2);
                        const y1 = (currentRow * rowHeight) + 300;
                        const x2 = (nextCol * cardWidth) + (nextCol * gapX) + (cardWidth / 2);
                        const y2 = (nextRow * rowHeight) + 300;

                        const midX = (x1 + x2) / 2;
                        const midY = (y1 + y2) / 2;

                        return (
                            <motion.path
                                key={`line-${i}`}
                                d={`M ${x1}% ${y1} Q ${midX}% ${midY}, ${x2}% ${y2}`}
                                stroke="#500000"
                                strokeWidth="3"
                                fill="none"
                                strokeDasharray="8 4"
                                opacity="0.2"
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 0.2 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: i * 0.2, ease: "easeInOut" }}
                            />
                        );
                    })}
                </svg>

                {/* Connecting Lines SVG - Mobile */}
                <svg className="md:hidden absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                    {milestones.map((_, i) => {
                        if (i === milestones.length - 1) return null;

                        const rowHeight = 650;
                        const x = 50; // center
                        const y1 = (i * rowHeight) + 300;
                        const y2 = ((i + 1) * rowHeight) + 300;

                        return (
                            <motion.line
                                key={`line-${i}`}
                                x1={`${x}%`}
                                y1={y1}
                                x2={`${x}%`}
                                y2={y2}
                                stroke="#500000"
                                strokeWidth="3"
                                strokeDasharray="8 4"
                                opacity="0.2"
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 0.2 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: i * 0.15, ease: "easeInOut" }}
                            />
                        );
                    })}
                </svg>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative z-10">
                    {milestones.map((m, i) => {
                        const isMaroon = m.theme === 'maroon';

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                onClick={() => setActiveIdx(i)}
                                className={`p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer group border relative ${isMaroon ? 'bg-gradient-to-br from-[#500000] to-[#3a0000] border-[#500000] ring-2 ring-[#500000]/20' : 'bg-white border-gray-200 hover:border-[#500000]/30 hover:shadow-2xl'}`}
                            >
                                {/* Year Badge */}
                                <div className={`inline-block px-4 py-2 rounded-full mb-6 text-sm font-bold ${isMaroon ? 'bg-white/20 text-white' : 'bg-[#500000] text-white'}`}>
                                    {m.year}
                                </div>

                                {/* Icon */}
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 ${isMaroon ? 'bg-white/10 text-white' : 'bg-gray-50 text-[#500000]'}`}>
                                    <m.icon size={32} />
                                </div>

                                {/* Stats */}
                                {m.stat && (
                                    <div className="mb-6">
                                        <div className={`text-5xl font-black mb-1 ${isMaroon ? 'text-white' : 'text-[#500000]'}`}>
                                            {m.stat}
                                        </div>
                                        <div className={`text-sm uppercase tracking-wider ${isMaroon ? 'text-white/80' : 'text-gray-500'}`}>
                                            {m.statLabel}
                                        </div>
                                    </div>
                                )}

                                {/* Content */}
                                <h3 className={`font-black text-2xl mb-2 ${isMaroon ? 'text-white' : 'text-gray-900'}`}>
                                    {m.title}
                                </h3>
                                <p className={`text-sm font-medium mb-3 ${isMaroon ? 'text-white/70' : 'text-gray-500'}`}>
                                    {m.subtitle}
                                </p>
                                <p className={`leading-relaxed ${isMaroon ? 'text-white/90' : 'text-gray-600'}`}>
                                    {m.short}
                                </p>

                                {/* Tags */}
                                {m.tags && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {m.tags.map(tag => (
                                            <span key={tag} className={`px-3 py-1 rounded-full text-xs font-medium ${isMaroon ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'}`}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Hover Cue */}
                                <div className={`flex items-center gap-2 mt-6 opacity-0 group-hover:opacity-100 transition-opacity text-sm ${isMaroon ? 'text-white' : 'text-[#500000]'}`}>
                                    {language === 'bn' ? 'আরও পড়তে ক্লিক করুন' : 'Click to Read More'} <ArrowRight size={12} />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Premium Detail Modal */}
            <AnimatePresence>
                {activeIdx !== null && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setActiveIdx(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />

                        <motion.div
                            layoutId={`card-${activeIdx}`}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-4xl bg-white rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setActiveIdx(null)}
                                className="absolute top-4 right-4 md:top-6 md:right-6 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 backdrop-blur text-gray-900 md:text-white md:bg-white/20 flex items-center justify-center hover:bg-white hover:text-[#500000] transition-all shadow-lg"
                            >
                                <X size={20} />
                            </button>

                            {/* Left: Visual Context */}
                            <div className="w-full md:w-2/5 bg-gradient-to-br from-[#500000] to-[#3a0000] p-8 md:p-10 flex flex-col justify-between text-white relative overflow-hidden">
                                <div className="absolute -bottom-20 -left-20 text-white/5">
                                    {React.createElement(milestones[activeIdx].icon, { size: 300 })}
                                </div>

                                <div className="relative z-10">
                                    <div className="inline-block px-4 py-1 rounded-full border border-white/30 mb-4 md:mb-6">
                                        {milestones[activeIdx].year}
                                    </div>
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-2">
                                        {milestones[activeIdx].title}
                                    </h2>
                                    <p className="text-white/70 text-base md:text-lg font-light">
                                        {milestones[activeIdx].subtitle}
                                    </p>
                                </div>

                                <div className="relative z-10 mt-8 md:mt-0">
                                    <div className="flex gap-3">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setActiveIdx((prev) => prev !== null && prev > 0 ? prev - 1 : milestones.length - 1) }}
                                            className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-[#500000] transition-all"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setActiveIdx((prev) => prev !== null && prev < milestones.length - 1 ? prev + 1 : 0) }}
                                            className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-[#500000] transition-all"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Content */}
                            <div className="w-full md:w-3/5 p-8 md:p-10 lg:p-14 overflow-y-auto bg-white relative">
                                <div className="prose prose-lg prose-red max-w-none">
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">{language === 'bn' ? 'আমাদের গল্প' : 'Our Story'}</h3>
                                    <p className="text-gray-600 leading-relaxed text-base md:text-lg whitespace-pre-line">
                                        {milestones[activeIdx].details}
                                    </p>

                                    <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-100 flex items-center gap-4">
                                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#500000] shrink-0">
                                            <Users size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">RizQara Tech Team</p>
                                            <p className="text-gray-500">{language === 'bn' ? 'ভবিষ্যত নির্মাণ, একসাথে।' : 'Building the future, together.'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

// --- 6. PRICING DETAILED ---
type PricingDetailedProps = { onNavigate: (page: string, id?: string) => void };
export const PricingDetailed: React.FC<PricingDetailedProps> = ({ onNavigate }) => {
    const { language } = useData();
    const packages = [
        {
            name: language === 'bn' ? 'বেসিক' : 'Basic',
            subtitle: language === 'bn' ? 'ছোট ব্যবসার জন্য ডিজাইন করা' : 'Designed for small business',
            features: [
                language === 'bn' ? 'পূর্ব-ডিজাইন করা ওয়েবসাইট টেমপ্লেট' : 'Pre-designed website templates',
                language === 'bn' ? 'স্ট্যান্ডার্ড নিরাপত্তা বৈশিষ্ট্য' : 'Standard security features',
                language === 'bn' ? 'বেসিক হোস্টিং অপশন' : 'Basic hosting options',
                language === 'bn' ? 'কোন এপিআই ডেভেলপমেন্ট নেই' : 'No API development',
                language === 'bn' ? 'কোন পারফরম্যান্স অপ্টিমাইজেশন নেই' : 'No performance optimization',
                language === 'bn' ? 'কোন ডেডিকেটেড প্রজেক্ট ম্যানেজার নেই' : 'No dedicated project manager',
                language === 'bn' ? 'সীমিত টেস্টিং এবং কিউএ' : 'Limited testing and QA',
                language === 'bn' ? 'বেসিক ওয়েবসাইট ডিজাইন' : 'Basic website design',
                language === 'bn' ? 'কোন অ্যাডভান্সড রিপোর্টিং নেই' : 'No advanced reporting',
                language === 'bn' ? 'কোন সাপোর্ট এবং রক্ষণাবেক্ষণ নেই' : 'No support and maintenance',
                language === 'bn' ? 'সীমিত ইন্টিগ্রেশন ক্ষমতা' : 'Limited integration capabilities',
                language === 'bn' ? 'বেসিক ডাটাবেস সমাধান' : 'Basic database solutions',
                language === 'bn' ? 'কোন ডেটা বিশ্লেষণ নেই' : 'No data analysis',
                language === 'bn' ? 'সিঙ্গেল-প্ল্যাটফর্ম অ্যাপ ডেভেলপমেন্ট' : 'Single-platform app development'
            ]
        },
        {
            name: language === 'bn' ? 'এন্টারপ্রাইজ' : 'Enterprise',
            subtitle: language === 'bn' ? 'বৃহৎ এন্টারপ্রাইজ ব্যবসার জন্য' : 'For large enterprise business with higher traffic',
            popular: true,
            features: [
                language === 'bn' ? 'কাস্টমাইজড ওয়েব এবং মোবাইল অ্যাপ ডেভেলপমেন্ট' : 'Customized web and mobile app development',
                language === 'bn' ? 'অ্যাডভান্সড নিরাপত্তা বৈশিষ্ট্য' : 'Advanced security features',
                language === 'bn' ? 'ক্লাউড ইন্টিগ্রেশন' : 'Cloud integration',
                language === 'bn' ? 'এপিআই ডেভেলপমেন্ট এবং ইন্টিগ্রেশন' : 'API development and integration',
                language === 'bn' ? 'পারফরম্যান্স অপ্টিমাইজেশন' : 'Performance optimization',
                language === 'bn' ? 'ডেডিকেটেড প্রজেক্ট ম্যানেজার' : 'Dedicated project manager',
                language === 'bn' ? 'ব্যাপক টেস্টিং এবং কিউএ' : 'Comprehensive testing and QA',
                language === 'bn' ? 'ইউজার এক্সপেরিয়েন্স (UX) ডিজাইন' : 'User experience (UX) design',
                language === 'bn' ? 'অ্যানালিটিক্স এবং রিপোর্টিং' : 'Analytics and reporting',
                language === 'bn' ? 'ক্রমাগত সাপোর্ট এবং রক্ষণাবেক্ষণ' : 'Continuous support and maintenance',
                language === 'bn' ? 'এন্টারপ্রাইজ সিস্টেমের সাথে ইন্টিগ্রেশন' : 'Integration with enterprise systems',
                language === 'bn' ? 'এন্টারপ্রাইজ-গ্রেড ডাটাবেস সমাধান' : 'Enterprise-grade database solutions',
                language === 'bn' ? 'অ্যাডভান্সড ডেটা অ্যানালিটিক্স' : 'Advanced data analytics',
                language === 'bn' ? 'মাল্টি-প্ল্যাটফর্ম অ্যাপ ডেভেলপমেন্ট' : 'Multi-platform app development'
            ]
        },
        {
            name: language === 'bn' ? 'এসএমই' : 'SME',
            subtitle: language === 'bn' ? 'মাঝারি এন্টারপ্রাইজ ব্যবসার জন্য' : 'For Medium Enterprise Business at Growth stage',
            features: [
                language === 'bn' ? 'উপযুক্ত ওয়েব এবং মোবাইল অ্যাপ ডেভেলপমেন্ট' : 'Tailored web and mobile app development',
                language === 'bn' ? 'স্ট্যান্ডার্ড নিরাপত্তা বৈশিষ্ট্য' : 'Standard security features',
                language === 'bn' ? 'ক্লাউড হোস্টিং অপশন' : 'Cloud hosting options',
                language === 'bn' ? 'এপিআই ডেভেলপমেন্ট' : 'API development',
                language === 'bn' ? 'বেসিক পারফরম্যান্স অপ্টিমাইজেশন' : 'Basic performance optimization',
                language === 'bn' ? 'প্রজেক্ট ম্যানেজার সহায়তা' : 'Project manager assistance',
                language === 'bn' ? 'বেসিক টেস্টিং এবং কিউএ' : 'Basic testing and QA',
                language === 'bn' ? 'রেসপন্সিভ ওয়েব ডিজাইন' : 'Responsive web design',
                language === 'bn' ? 'বেসিক রিপোর্টিং এবং অ্যানালিটিক্স' : 'Basic reporting and analytics',
                language === 'bn' ? 'সীমিত সাপোর্ট এবং রক্ষণাবেক্ষণ' : 'Limited support and maintenance',
                language === 'bn' ? 'প্রয়োজনীয় সিস্টেমের সাথে ইন্টিগ্রেশন' : 'Integration with essential systems',
                language === 'bn' ? 'এসএমই ডাটাবেস সমাধান' : 'SME database solutions',
                language === 'bn' ? 'সীমিত ডেটা অ্যানালিটিক্স' : 'Limited data analytics',
                language === 'bn' ? 'সিঙ্গেল-প্ল্যাটফর্ম অ্যাপ ডেভেলপমেন্ট' : 'Single-platform app development'
            ]
        },
        {
            name: language === 'bn' ? 'ইমার্জিং' : 'Emerging',
            subtitle: language === 'bn' ? 'স্টার্টআপ / ছোট ব্যবসার জন্য উপযুক্ত' : 'Suitable for Startup / small business',
            features: [
                language === 'bn' ? 'অফ-দ্য-শেলফ ওয়েব এবং মোবাইল অ্যাপ টেমপ্লেট' : 'Off-the-shelf web and mobile app templates',
                language === 'bn' ? 'বেসিক নিরাপত্তা বৈশিষ্ট্য' : 'Basic security features',
                language === 'bn' ? 'শেয়ার্ড হোস্টিং অপশন' : 'Shared hosting options',
                language === 'bn' ? 'সীমিত এপিআই ডেভেলপমেন্ট' : 'Limited API development',
                language === 'bn' ? 'ন্যূনতম পারফরম্যান্স অপ্টিমাইজেশন' : 'Minimal performance optimization',
                language === 'bn' ? 'বেসিক প্রজেক্ট কোঅর্ডিনেশন' : 'Basic project coordination',
                language === 'bn' ? 'ন্যূনতম টেস্টিং এবং কিউএ' : 'Minimal testing and QA',
                language === 'bn' ? 'বেসিক ওয়েব ডিজাইন' : 'Basic web design',
                language === 'bn' ? 'বেসিক রিপোর্টিং' : 'Basic reporting',
                language === 'bn' ? 'সীমিত সাপোর্ট এবং রক্ষণাবেক্ষণ' : 'Limited support and maintenance',
                language === 'bn' ? 'ন্যূনতম ইন্টিগ্রেশন ক্ষমতা' : 'Minimal integration capabilities',
                language === 'bn' ? 'স্টার্টআপ ডাটাবেস সমাধান' : 'Startup database solutions',
                language === 'bn' ? 'সীমিত ডেটা বিশ্লেষণ' : 'Limited data analysis',
                language === 'bn' ? 'সিঙ্গেল-প্ল্যাটফর্ম অ্যাপ ডেভেলপমেন্ট' : 'Single-platform app development'
            ]
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
                <div key={pkg.name} className={`relative p-6 rounded-3xl border ${pkg.popular ? 'bg-white border-[#500000] shadow-2xl z-10 ring-4 ring-[#500000]/5' : 'bg-white border-gray-200 shadow-sm'} flex flex-col transition-all hover:translate-y-1`}>
                    {pkg.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#500000] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">Top Tier</div>}
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{pkg.name}</h3>
                    <p className="text-xs text-gray-500 mb-6 h-8">{pkg.subtitle}</p>

                    <ul className="space-y-3 mb-8 flex-1">
                        {pkg.features.map(f => (
                            <li key={f} className="flex items-start gap-2 text-gray-600 text-xs">
                                <Check size={12} className="text-white bg-[#500000] rounded-full p-0.5 mt-0.5 shrink-0" />
                                <span className={f.startsWith('No ') || f.startsWith('কোন ') ? 'text-gray-400' : ''}>{f}</span>
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => onNavigate('Contact')} className={`w-full py-3 rounded-xl font-bold transition-all text-sm uppercase tracking-wider shadow-md ${pkg.popular ? 'bg-[#500000] text-white hover:bg-[#3a0000]' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                        {language === 'bn' ? 'শুরু করুন' : 'Get Started'}
                    </button>
                </div>
            ))}
        </div>
    );
};

// --- 7. LATEST VIDEOS ---

export const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export const VideoModal = ({ video, onClose }: { video: any, onClose: () => void }) => {
    const { addVideoComment, language } = useData();
    const [commentText, setCommentText] = useState('');
    const [userName, setUserName] = useState('');
    const videoId = getYoutubeId(video.url);

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !userName.trim()) return;

        addVideoComment(video.id, {
            user: userName,
            text: commentText
        });
        setCommentText('');
        toast.success(language === 'bn' ? "মন্তব্য যোগ করা হয়েছে!" : "Comment added!");
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-6xl rounded-2xl md:rounded-3xl border border-gray-200 overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[80vh] shadow-2xl relative">

                {/* Close Button (Universal) */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-[100] p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100 hover:text-[#500000] transition-colors shadow-lg border border-gray-100"
                >
                    <X size={20} />
                </button>

                {/* Video Player Section */}
                <div className="relative flex-1 bg-black flex items-center justify-center group shrink-0 w-full md:w-0 min-w-0 order-first">
                    {videoId ? (
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
                            title={video.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full aspect-video md:aspect-auto"
                        ></iframe>
                    ) : (
                        <div className="text-white/50 flex flex-col items-center">
                            <PlayCircle size={48} className="mb-4 opacity-50" />
                            <p>{language === 'bn' ? 'ভিডিও অনুপলব্ধ' : 'Video unavailable'}</p>
                        </div>
                    )}
                </div>

                {/* Comments Section */}
                <div className="flex-none w-full md:w-[350px] lg:w-[400px] bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col min-h-0 relative shrink-0">
                    <div className="p-4 md:p-6 border-b border-gray-200 bg-white shrink-0">
                        <h3 className="font-bold text-gray-900 text-lg line-clamp-1 pr-12 text-left">{video.title}</h3>
                        <p className="text-gray-500 text-xs mt-1 uppercase tracking-wider text-left">{video.category}</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-left">
                        <h4 className="text-gray-700 text-sm font-bold sticky top-0 bg-gray-50 py-2 z-10 text-left">{language === 'bn' ? 'মন্তব্যসমূহ' : 'Comments'} ({video.comments?.length || 0})</h4>

                        {video.comments && video.comments.length > 0 ? (
                            video.comments.map((c: any) => (
                                <div key={c.id} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm text-left">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-gray-900 text-sm">{c.user}</span>
                                        <span className="text-[10px] text-gray-400">{c.date}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm leading-relaxed">{c.text}</p>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-400 text-sm">
                                <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                                {language === 'bn' ? 'প্রথম মন্তব্য করুন!' : 'Be the first to comment!'}
                            </div>
                        )}
                    </div>

                    <div className="p-4 bg-white border-t border-gray-200 shrink-0">
                        <form onSubmit={handleCommentSubmit} className="space-y-3">
                            <input
                                placeholder={language === 'bn' ? "আপনার নাম" : "Your Name"}
                                value={userName}
                                onChange={e => setUserName(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#500000] placeholder:text-gray-400"
                                required
                            />
                            <div className="relative">
                                <textarea
                                    placeholder={language === 'bn' ? "একটি মন্তব্য যোগ করুন..." : "Add a comment..."}
                                    value={commentText}
                                    onChange={e => setCommentText(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#500000] placeholder:text-gray-400 pr-10 resize-none h-14 md:h-20"
                                    required
                                />
                                <button type="submit" className="absolute bottom-2 right-2 p-1.5 bg-[#500000] text-white rounded-md hover:bg-[#3a0000] transition-colors shadow-sm">
                                    <Send size={14} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

type LatestVideosProps = { onNavigate?: (page: string, id?: string) => void };
export const LatestVideos: React.FC<LatestVideosProps> = () => {
    const { videos, language } = useData();
    const [selectedVideo, setSelectedVideo] = useState<any>(null);

    if (!videos.length) return null;

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.slice(0, 3).map((video) => {
                    const title = language === 'bn' ? (video.title_bn || video.title) : video.title;
                    return (
                        <div
                            key={video.id}
                            className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm cursor-pointer hover:shadow-lg transition-all"
                            onClick={() => setSelectedVideo(video)}
                        >
                            <div className="aspect-video relative">
                                {/* Use YouTube Thumbnail if available, else fallback to stored thumbnail */}
                                <img
                                    src={getYoutubeId(video.url) ? `https://img.youtube.com/vi/${getYoutubeId(video.url)}/maxresdefault.jpg` : video.thumbnail}
                                    alt={title}
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-[#500000] transition-all duration-300 border border-white/50 shadow-lg">
                                        <Play size={24} className="text-white fill-current ml-1" />
                                    </div>
                                </div>
                                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                    <PlayCircle size={12} /> {language === 'bn' ? 'দেখতে ক্লিক করুন' : 'Click to View'}
                                </div>
                            </div>
                            <div className="p-4">
                                <h4 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#500000] transition-colors">{title}</h4>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-gray-500 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded-md border border-gray-200">{video.category}</span>
                                    <span className="text-xs text-gray-400 flex items-center gap-1"><MessageSquare size={12} /> {video.comments?.length || 0}</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <AnimatePresence>
                {selectedVideo && (
                    <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
                )}
            </AnimatePresence>
        </>
    );
};

// --- 8. LATEST BLOGS ---
export const LatestBlogs = ({ onNavigate }: any) => {
    const { blogs, language } = useData();
    if (!blogs.length) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.slice(0, 2).map((blog) => {
                const title = language === 'bn' ? (blog.title_bn || blog.title) : blog.title;
                const excerpt = language === 'bn' ? (blog.excerpt_bn || blog.excerpt) : blog.excerpt;

                return (
                    <div key={blog.id} onClick={() => onNavigate('BlogDetail', blog.id)} className="flex gap-6 items-start group cursor-pointer bg-white p-4 rounded-2xl border border-gray-200 hover:shadow-lg transition-all">
                        <img src={blog.image} alt={title} className="w-32 h-32 rounded-xl object-cover shadow-sm" />
                        <div>
                            <div className="text-xs text-white bg-[#500000] inline-block px-2 py-0.5 rounded-md font-bold mb-2 shadow-sm">{blog.date}</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#500000] leading-tight transition-colors">{title}</h3>
                            <p className="text-gray-500 text-sm line-clamp-2">{excerpt}</p>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

// --- 9. TESTIMONIAL SLIDER ---
export const TestimonialSlider = () => {
    const { reviews, language } = useData();
    const [index, setIndex] = useState(0);

    return (
        <div className="relative bg-white border border-gray-200 rounded-3xl p-12 shadow-xl text-center max-w-4xl mx-auto">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    <div className="mb-8 text-[#500000]">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={24} className="inline-block fill-current" />)}
                    </div>
                    <p className="text-2xl md:text-3xl font-light text-gray-800 italic mb-8 leading-relaxed">"{language === 'bn' ? (reviews[index]?.content_bn || reviews[index]?.content) : reviews[index]?.content}"</p>
                    <div>
                        <h4 className="text-gray-900 font-bold text-lg">{language === 'bn' ? (reviews[index]?.name_bn || reviews[index]?.name) : reviews[index]?.name}</h4>
                        <p className="text-gray-500 text-sm">{language === 'bn' ? (reviews[index]?.role_bn || reviews[index]?.role) : reviews[index]?.role}, {reviews[index]?.company}</p>
                    </div>
                </motion.div>
            </AnimatePresence>
            <div className="flex justify-center gap-4 mt-8">
                <button onClick={() => setIndex((index - 1 + reviews.length) % reviews.length)} className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-[#500000] hover:text-white transition-colors shadow-sm"><ChevronLeft /></button>
                <button onClick={() => setIndex((index + 1) % reviews.length)} className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-[#500000] hover:text-white transition-colors shadow-sm"><ChevronRight /></button>
            </div>
        </div>
    );
};

// --- 10. PREMIUM COMPARISON ---
export const PremiumComparison = ({ onNavigate }: { onNavigate: (page: string, id?: string) => void }) => {
    const { language } = useData();
    const features = [
        {
            id: "end-to-end",
            icon: Briefcase,
            title: language === 'bn' ? 'এন্ড-টু-এন্ড ডিজিটাল পার্টনার' : "End-to-End Digital Partner",
            desc: language === 'bn' ? 'শুধু ডেভেলপার নয় — একটি সম্পূর্ণ সমাধান দল। আমরা এক ছাদের নিচে সব কিছু পরিচালনা করি।' : "Not just developers — a full solution team. We handle everything under one roof.",
            color: "from-blue-50 to-blue-100",
            border: "group-hover:border-blue-200"
        },
        {
            id: "performance",
            icon: Rocket,
            title: language === 'bn' ? 'পারফরম্যান্স, স্কেল এবং নিরাপত্তার জন্য তৈরি' : "Built for Performance, Scale & Security",
            desc: language === 'bn' ? 'সিস্টেম যা আপনার ব্যবসার সাথে বাড়ে। দীর্ঘমেয়াদী রক্ষণাবেক্ষণের জন্য ইঞ্জিন করা।' : "Systems that grow with your business. Engineered for long-term maintainability.",
            color: "from-amber-50 to-amber-100",
            border: "group-hover:border-amber-200"
        },
        {
            id: "transparency",
            icon: Users,
            title: language === 'bn' ? 'স্বচ্ছ প্রক্রিয়া এবং ডেডিকেটেড টিম' : "Transparent Process & Dedicated Team",
            desc: language === 'bn' ? 'আপনি সবসময় জানেন কি হচ্ছে। পরিষ্কার টাইমলাইন, দৃশ্যমান অগ্রগতি, কোন চমক নেই।' : "You always know what’s happening. Clear timelines, visible progress, no surprises.",
            color: "from-green-50 to-green-100",
            border: "group-hover:border-green-200"
        },
        {
            id: "partnership",
            icon: Clock,
            title: language === 'bn' ? 'দীর্ঘমেয়াদী অংশীদারিত্ব' : "Long-Term Partnership",
            desc: language === 'bn' ? 'লঞ্চের পরেও আমরা থাকি। রক্ষণাবেক্ষণ, উন্নতি এবং প্রবৃদ্ধি সহায়তা।' : "We stay after launch. Maintenance, improvements, and growth support.",
            color: "from-red-50 to-red-100",
            border: "group-hover:border-red-200"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {/* Decorative Background Blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#500000] opacity-[0.03] blur-[100px] -z-10 rounded-full pointer-events-none" />

            {features.map((f) => (
                <div
                    key={f.id}
                    onClick={() => onNavigate('FeatureDetail', f.id)}
                    className={`group relative p-8 rounded-3xl bg-white border border-gray-200 overflow-hidden transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-xl ${f.border} cursor-pointer shadow-sm`}
                >

                    {/* Hover Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white rounded-2xl border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm">
                            <f.icon size={32} className="text-[#500000]" />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">{f.title}</h3>
                        <p className="text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors">
                            {f.desc}
                        </p>
                    </div>

                    {/* Corner Accent */}
                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                        <ArrowRight className="text-[#500000]" />
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- 11. FEATURE DETAIL PAGE ---
export const FeatureDetail = ({ id, onBack }: { id: string, onBack: () => void }) => {
    const { language } = useData();
    const details: Record<string, any> = {
        "end-to-end": {
            title: language === 'bn' ? 'এন্ড-টু-এন্ড ডিজিটাল পার্টনার' : "End-to-End Digital Partner",
            subtitle: language === 'bn' ? 'শুধুমাত্র ডেভেলপার নয় — একটি সম্পূর্ণ সমাধান দল।' : "Not just developers — a full solution team.",
            description: language === 'bn' ? 'আমরা এক ছাদের নিচে সব কিছু পরিচালনা করি: UI/UX ডিজাইন, ওয়েবসাইট, ওয়েব অ্যাপস, PWA, সফটওয়্যার ডেভেলপমেন্ট, মোবাইল-রেসপন্সিভ সিস্টেম, ব্র্যান্ডিং, গ্রাফিক্স, SEO এবং ডিজিটাল মার্কেটিং। ক্লায়েন্টরা ভেন্ডরদের নিয়ে জাগল করে না — আমরা ধারণা থেকে লঞ্চ পর্যন্ত সম্পূর্ণ মালিকানা নিই।' : "We handle everything under one roof: UI/UX design, websites, web apps, PWA, software development, mobile-responsive systems, branding, graphics, SEO, and digital marketing. Clients don’t juggle vendors — we take full ownership from idea to launch.",
            stats: [
                { label: language === 'bn' ? 'সেবা' : "Services", value: language === 'bn' ? 'অল-ইন-ওয়ান' : "All-in-One" },
                { label: language === 'bn' ? 'ভেন্ডর' : "Vendors", value: "1 (Us)" },
                { label: language === 'bn' ? 'মালিকানা' : "Ownership", value: "100%" },
                { label: language === 'bn' ? 'সাপোর্ট' : "Support", value: "24/7" }
            ],
            capabilities: [
                "UI/UX Design & Branding",
                "Web & Mobile Development",
                "SEO & Digital Marketing",
                "Cloud Infrastructure"
            ],
            image: "https://res.cloudinary.com/dhutfywg2/image/upload/v1767679597/rizqara/why_choose_us/end_to_end.jpg"
        },
        "performance": {
            title: language === 'bn' ? 'পারফরম্যান্স, স্কেল এবং নিরাপত্তার জন্য তৈরি' : "Built for Performance, Scale & Security",
            subtitle: language === 'bn' ? 'সিস্টেম যা আপনার ব্যবসার সাথে বাড়ে।' : "Systems that grow with your business.",
            description: language === 'bn' ? 'প্রতিটি প্রকল্প আধুনিক, প্রমাণিত প্রযুক্তি এবং পরিষ্কার আর্কিটেকচার ব্যবহার করে ইঞ্জিন করা হয়। আমরা পারফরম্যান্স, স্কেলেবিলিটি, নিরাপত্তা এবং দীর্ঘমেয়াদী রক্ষণাবেক্ষণের উপর ফোকাস করি, যাতে আপনার ব্যবসা বাড়লে আপনার পণ্যটি ভেঙে না যায়।' : "Every project is engineered using modern, proven technologies and clean architecture. We focus on performance, scalability, security, and long-term maintainability, so your product doesn’t break when your business grows.",
            stats: [
                { label: "Uptime", value: "99.9%" },
                { label: language === 'bn' ? 'নিরাপত্তা' : "Security", value: language === 'bn' ? 'এন্টারপ্রাইজ' : "Enterprise" },
                { label: language === 'bn' ? 'স্কেলেবিলিটি' : "Scalability", value: language === 'bn' ? 'অসীম' : "Infinite" },
                { label: "Tech Stack", value: "Modern" }
            ],
            capabilities: [
                "Clean Architecture",
                "Auto-Scaling Infrastructure",
                "Advanced Security Protocols",
                "Performance Optimization"
            ],
            image: "https://res.cloudinary.com/dhutfywg2/image/upload/v1767679598/rizqara/why_choose_us/performance.jpg"
        },
        "transparency": {
            title: language === 'bn' ? 'স্বচ্ছ প্রক্রিয়া এবং ডেডিকেটেড টিম' : "Transparent Process & Dedicated Team",
            subtitle: language === 'bn' ? 'আপনি সবসময় জানেন কি হচ্ছে।' : "You always know what’s happening.",
            description: language === 'bn' ? 'ক্লায়েন্টরা ডিজাইনার, ডেভেলপার এবং প্রজেক্ট ম্যানেজারদের একটি ডেডিকেটেড টিমের সাথে কাজ করে। পরিষ্কার টাইমলাইন, দৃশ্যমান অগ্রগতি, সৎ যোগাযোগ এবং কাঠামোগত কর্মপ্রবাহ — কোন অনুমান নেই, কোন বিশৃঙ্খলা নেই, কোন চমক নেই।' : "Clients work with a dedicated team of designers, developers, and project managers. Clear timelines, visible progress, honest communication, and structured workflows — no guessing, no chaos, no surprises.",
            stats: [
                { label: language === 'bn' ? 'আপডেট' : "Updates", value: language === 'bn' ? 'সাপ্তাহিক' : "Weekly" },
                { label: language === 'bn' ? 'যোগাযোগ' : "Communication", value: language === 'bn' ? 'সরাসরি' : "Direct" },
                { label: "Project Mgmt", value: "Agile" },
                { label: language === 'bn' ? 'দল' : "Team", value: language === 'bn' ? 'ডেডিকেটেড' : "Dedicated" }
            ],
            capabilities: [
                "Regular Progress Reports",
                "Direct Access to Team",
                "Clear Timelines",
                "No Hidden Costs"
            ],
            image: "https://res.cloudinary.com/dhutfywg2/image/upload/v1767679600/rizqara/why_choose_us/transparency.jpg"
        },
        "partnership": {
            title: language === 'bn' ? 'দীর্ঘমেয়াদী অংশীদারিত্ব, শুধুমাত্র ডেলিভারি নয়' : "Long-Term Partnership, Not Just Delivery",
            subtitle: language === 'bn' ? 'লঞ্চের পরেও আমরা থাকি।' : "We stay after launch.",
            description: language === 'bn' ? 'রিজকারা টেক রক্ষণাবেক্ষণ, উন্নতি, অপ্টিমাইজেশন এবং প্রবৃদ্ধি সহায়তার মাধ্যমে ডেলিভারির বাইরেও ক্লায়েন্টদের সমর্থন করে। আমরা সৎ পরামর্শ দিই, ব্যবসায়িক লক্ষ্যগুলিতে ফোকাস করি এবং এমন সম্পর্ক গড়ে তুলি যা স্থায়ী হয় — এককালীন প্রকল্প নয়।' : "RizQara Tech supports clients beyond delivery with maintenance, improvements, optimization, and growth support. We give honest advice, focus on business goals, and build relationships that last — not one-time projects.",
            stats: [
                { label: language === 'bn' ? 'সাপোর্ট' : "Support", value: language === 'bn' ? 'চলমান' : "Ongoing" },
                { label: language === 'bn' ? 'পরামর্শ' : "Advice", value: language === 'bn' ? 'কৌশলগত' : "Strategic" },
                { label: language === 'bn' ? 'লক্ষ্য ফোকাস' : "Goal Focus", value: language === 'bn' ? 'ব্যবসা' : "Business" },
                { label: language === 'bn' ? 'সম্পর্ক' : "Relationship", value: language === 'bn' ? 'দীর্ঘমেয়াদী' : "Long-term" }
            ],
            capabilities: [
                "Post-Launch Maintenance",
                "Growth Strategy",
                "Feature Enhancements",
                "Business Consultation"
            ],
            image: "https://res.cloudinary.com/dhutfywg2/image/upload/v1767679601/rizqara/why_choose_us/partnership.jpg"
        }
    };

    const data = details[id] || details["end-to-end"];

    return (
        <div className="container mx-auto px-6 py-24 min-h-screen">
            <button onClick={onBack} className="flex items-center text-gray-500 hover:text-[#500000] mb-12 transition-colors group">
                <div className="p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 mr-4 transition-colors">
                    <ArrowRight className="rotate-180" size={20} />
                </div>
                <span className="text-sm uppercase tracking-widest font-bold">{language === 'bn' ? 'ওভারভিউতে ফিরে যান' : 'Back to Overview'}</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                    <div className="inline-block px-4 py-1 rounded-full bg-[#500000]/10 border border-[#500000]/20 text-sm font-bold text-[#500000] mb-6 uppercase tracking-wider">
                        {language === 'bn' ? 'প্রিমিয়াম সক্ষমতা' : 'Premium Capability'}
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">{data.title}</h1>
                    <h2 className="text-2xl text-gray-500 mb-8 font-light">{data.subtitle}</h2>
                    <p className="text-lg text-gray-600 leading-relaxed mb-12 border-l-2 border-[#500000] pl-6">
                        {data.description}
                    </p>

                    <div className="grid grid-cols-2 gap-6 mb-12">
                        {data.stats.map((stat: any, i: number) => (
                            <div key={i} className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-3xl font-bold text-[#500000] mb-1">{stat.value}</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-6">{language === 'bn' ? 'মূল সক্ষমতা' : 'Core Capabilities'}</h3>
                    <div className="space-y-4">
                        {data.capabilities.map((cap: string, i: number) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-sm transition-all cursor-default">
                                <Check className="text-white bg-[#500000] rounded-full p-0.5" size={20} />
                                <span className="text-gray-700 font-medium">{cap}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative h-full min-h-[600px] rounded-[3rem] overflow-hidden border border-gray-200 shadow-2xl group">
                    <img src={data.image} alt={data.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    <div className="absolute bottom-0 left-0 p-12">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 flex items-center justify-center mb-6 shadow-lg">
                            <Activity size={40} className="text-white" />
                        </div>
                        <p className="text-white/90 text-sm max-w-xs font-medium drop-shadow-md">
                            {language === 'bn' ? `রিজকারা টেকের এন্টারপ্রাইজ সমাধানের সাথে ${data.title} এর পার্থক্য অনুভব করুন।` : `Experience the difference of ${data.title} with Rizqara Tech's enterprise solutions.`}
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// --- Hero Carousel ---
export const HeroCarousel = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
    const { carouselSlides, language } = useData();
    const [current, setCurrent] = useState(0);

    const slides = carouselSlides || [];

    useEffect(() => {
        const timer = setInterval(() => {
            if (slides.length > 0) {
                setCurrent((prev) => (prev + 1) % slides.length);
            }
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    if (slides.length === 0) {
        return (
            <div className="relative h-[90vh] w-full overflow-hidden bg-gray-50 animate-pulse flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#500000] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const handleCtaClick = (action: string) => {
        // Map localized action back to English action for logic if needed, or just handle navigation
        // For simplicity, just navigate to Contact unless specific keywords match
        if (action.includes('Project') || action.includes('প্রকল্প')) onNavigate('Projects');
        else if (action.includes('Service') || action.includes('সেবা')) onNavigate('Services');
        else if (action.includes('Package') || action.includes('প্যাকেজ')) onNavigate('Packages');
        else if (action.includes('Blog') || action.includes('ব্লগ')) onNavigate('Blog');
        else if (action.includes('Appointment') || action.includes('অ্যাপয়েন্টমেন্ট')) window.open('https://cal.com/rizqara-tech-a8z6yt', '_blank');
        else onNavigate('Contact');
    };

    const currentSlide = slides[current];
    const title = language === 'bn' ? (currentSlide?.title_bn || currentSlide?.title) : currentSlide?.title;
    const subtitle = language === 'bn' ? (currentSlide?.subtitle_bn || currentSlide?.subtitle) : currentSlide?.subtitle;
    const cta = language === 'bn' ? (currentSlide?.cta_bn || currentSlide?.cta || 'Contact Now') : (currentSlide?.cta || 'Contact Now');

    return (
        <div className="relative h-[90vh] w-full overflow-hidden bg-white">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={current}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    {/* Gradient Overlay: White -> Transparent */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />

                    <img
                        src={currentSlide.image}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            console.error('Failed to load image:', currentSlide.image);
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 z-20 container mx-auto px-6 flex items-center">
                <div className="max-w-3xl pt-20">
                    <motion.div
                        key={`text-${current}`}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <div className="inline-block px-4 py-1 border border-[#500000]/20 rounded-full text-[#500000] text-sm uppercase tracking-widest mb-6 backdrop-blur-md bg-white/50 font-bold shadow-sm">
                            Rizqara Tech • 2025
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-[#500000] mb-6 leading-tight drop-shadow-sm">
                            {title}
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-xl font-light leading-relaxed">
                            {subtitle}
                        </p>
                        <button
                            onClick={() => handleCtaClick(currentSlide.cta || 'Contact Now')}
                            className="bg-[#500000] text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-[#3a0000] transition-all flex items-center gap-3 shadow-[0_10px_30px_rgba(80,0,0,0.3)] hover:-translate-y-1"
                        >
                            {cta} <ArrowRight size={20} />
                        </button>
                    </motion.div>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-12 right-6 md:right-12 z-30 flex gap-4">
                <button onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)} className="p-4 rounded-full border border-white/50 text-white hover:bg-white hover:text-[#500000] transition-colors bg-black/10 backdrop-blur-md">
                    <ChevronLeft size={24} />
                </button>
                <button onClick={() => setCurrent((prev) => (prev + 1) % slides.length)} className="p-4 rounded-full border border-white/50 text-white hover:bg-white hover:text-[#500000] transition-colors bg-black/10 backdrop-blur-md">
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-12 left-6 md:left-12 z-30 flex gap-3">
                {slides.map((_, idx) => (
                    <div
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${current === idx ? 'w-12 bg-[#500000]' : 'w-4 bg-gray-300 hover:bg-[#500000]/50'}`}
                    />
                ))}
            </div>
        </div>
    );
};

// --- Helper for Styled Selects ---
const GlassSelect = ({ label, value, onChange, options, icon: Icon }: any) => (
    <div className="space-y-2 w-full">
        {label && <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
            {Icon && <Icon size={14} className="text-white bg-[#500000] rounded-full p-0.5" />} {label}
        </label>}
        <div className="relative group">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 p-4 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:border-[#500000] appearance-none transition-all cursor-pointer font-medium shadow-sm"
            >
                {options.map((opt: any) => (
                    <option key={opt.id || opt} value={opt.label || opt} className="bg-white text-gray-900 py-2">{opt.label || opt}</option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-[#500000] transition-colors">
                <ChevronLeft size={16} className="-rotate-90" />
            </div>
        </div>
    </div>
);

// --- Home Page Teaser (With Options) ---
export const BuildPreviewTeaser = ({ onNavigate, setBuildConfig }: any) => {
    const { buildOptions, language } = useData();

    // Filter options
    const types = buildOptions.filter(o => o.category === 'type');
    const features = buildOptions.filter(o => o.category === 'feature');
    const times = buildOptions.filter(o => o.category === 'time');

    const [localConfig, setLocalConfig] = useState({
        type: types[0]?.label || 'Web App',
        feature: features[0]?.label || 'Standard',
        time: times[0]?.label || '1 Month'
    });

    const handleGenerate = () => {
        setBuildConfig(localConfig);
        onNavigate('Build');
    };

    if (!buildOptions.length) return null;

    return (
        <section className="container mx-auto px-6 -mt-20 relative z-20 mb-32">
            <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">

                    {/* Header */}
                    <div className="lg:col-span-3 pb-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#500000]/10 border border-[#500000]/20 text-xs font-bold text-[#500000] uppercase tracking-wider mb-4">
                            <Rocket size={12} className="text-[#500000]" /> {language === 'bn' ? 'তৈরি শুরু করুন' : 'Start Building'}
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 mb-2 leading-tight">{language === 'bn' ? 'আপনার স্বপ্নের প্রকল্প তৈরি করুন' : 'Build Your Dream Project'}</h3>
                        <p className="text-gray-500 text-sm">{language === 'bn' ? 'একটি তাত্ক্ষণিক উদ্ধৃতি এবং প্রিভিউ পেতে নিচে কনফিগার করুন।' : 'Configure below to get an instant quote and preview.'}</p>
                    </div>

                    {/* Inputs */}
                    <div className="lg:col-span-3">
                        <GlassSelect
                            label={language === 'bn' ? 'প্রকল্পের ধরন' : "Project Type"}
                            icon={Layout}
                            value={localConfig.type}
                            onChange={(v: string) => setLocalConfig({ ...localConfig, type: v })}
                            options={types.map(t => ({ ...t, label: language === 'bn' ? (t.label_bn || t.label) : t.label }))}
                        />
                    </div>

                    <div className="lg:col-span-3">
                        <GlassSelect
                            label={language === 'bn' ? 'জটিলতা' : "Complexity"}
                            icon={Sliders}
                            value={localConfig.feature}
                            onChange={(v: string) => setLocalConfig({ ...localConfig, feature: v })}
                            options={features.map(f => ({ ...f, label: language === 'bn' ? (f.label_bn || f.label) : f.label }))}
                        />
                    </div>

                    {/* Row 2: Timeline & Button */}
                    <div className="lg:col-span-3">
                        <GlassSelect
                            label={language === 'bn' ? 'সময়রেখা' : "Timeline"}
                            icon={Clock}
                            value={localConfig.time}
                            onChange={(v: string) => setLocalConfig({ ...localConfig, time: v })}
                            options={times.map(t => ({ ...t, label: language === 'bn' ? (t.label_bn || t.label) : t.label }))}
                        />
                    </div>

                    <div className="lg:col-span-12 lg:hidden h-1 bg-gray-100 rounded-full my-2" />

                    <div className="lg:col-span-12 flex justify-end mt-4 lg:mt-0">
                        <button
                            onClick={handleGenerate}
                            className="w-full md:w-auto px-8 py-4 bg-[#500000] hover:bg-[#3a0000] text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg group"
                        >
                            {language === 'bn' ? 'প্রকল্প তৈরি করুন' : 'Generate Project'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

// --- Full Page Build Wizard (Updated UI) ---
export const BuildPage = ({ onNavigate, initialConfig }: { onNavigate: (page: string) => void, initialConfig: any }) => {
    const { projects, buildOptions, language } = useData();

    // Filter options
    const types = buildOptions.filter(o => o.category === 'type');
    const features = buildOptions.filter(o => o.category === 'feature');
    const times = buildOptions.filter(o => o.category === 'time');

    const [config, setConfig] = useState(initialConfig || {
        type: types[0]?.label || 'Web App',
        feature: features[0]?.label || 'Standard',
        time: times[0]?.label || '1 Month'
    });

    const relevantProject = projects.find(p => p.category?.toLowerCase() === config.type.toLowerCase())
        || projects.find(p => p.category === 'Web App')
        || projects[0];

    const handlePurchase = () => {
        // Updated logic: Save inquiry and navigate to contact
        const orderDetails = `I am interested in building a ${config.type}.\n\nConfiguration Details:\n- Complexity: ${config.feature}\n- Timeline: ${config.time}\n\nPlease contact me to discuss the details and provide a quote.`;

        localStorage.setItem('pendingInquiry', JSON.stringify({
            subject: `Project Inquiry: ${config.type}`,
            message: orderDetails
        }));

        onNavigate('Contact');
    };

    return (
        <div className="container mx-auto px-6 py-12 min-h-screen">
            <div className="mb-12">
                <button onClick={() => onNavigate('Home')} className="flex items-center text-gray-500 hover:text-[#500000] mb-6 transition-colors font-bold">
                    <ChevronLeft size={20} className="mr-2" /> {language === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}
                </button>
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-200 pb-8">
                    <div>
                        <h1 className="text-5xl font-black text-[#500000] mb-2">{language === 'bn' ? 'প্রজেক্ট বিল্ডার' : 'Project Builder'}</h1>
                        <p className="text-xl text-gray-600">{language === 'bn' ? 'কাস্টম কোটের জন্য আপনার স্পেসিফিকেশনগুলি ঠিক করুন।' : 'Fine-tune your specifications for a custom quote.'}</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-full text-sm font-bold border border-green-500/30">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> {language === 'bn' ? 'অনুরোধ গ্রহণ করা হচ্ছে' : 'Accepting Requests'}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* LEFT: Controls (Now all Dropdowns) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Settings size={20} /> {language === 'bn' ? 'কনফিগারেশন' : 'Configuration'}
                        </h3>

                        <div className="space-y-6">
                            <GlassSelect
                                label={language === 'bn' ? '১. প্রকল্পের ধরন' : "1. Project Type"}
                                icon={Layout}
                                value={config.type}
                                onChange={(v: string) => setConfig({ ...config, type: v })}
                                options={types.map(t => ({ ...t, label: language === 'bn' ? (t.label_bn || t.label) : t.label }))}
                            />

                            <GlassSelect
                                label={language === 'bn' ? '২. জটিলতা স্তর' : "2. Complexity Level"}
                                icon={Sliders}
                                value={config.feature}
                                onChange={(v: string) => setConfig({ ...config, feature: v })}
                                options={features.map(f => ({ ...f, label: language === 'bn' ? (f.label_bn || f.label) : f.label }))}
                            />

                            <GlassSelect
                                label={language === 'bn' ? '৩. কাঙ্ক্ষিত সময়রেখা' : "3. Desired Timeline"}
                                icon={Clock}
                                value={config.time}
                                onChange={(v: string) => setConfig({ ...config, time: v })}
                                options={times.map(t => ({ ...t, label: language === 'bn' ? (t.label_bn || t.label) : t.label }))}
                            />
                        </div>
                    </div>

                    <div className="bg-[#500000] rounded-3xl p-8 text-center relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform shadow-xl">
                        <div className="relative z-10">
                            <div className="text-white/70 text-sm font-bold uppercase tracking-widest mb-1">{language === 'bn' ? 'শুরু করতে প্রস্তুত?' : 'Ready to Start?'}</div>
                            <div className="text-2xl font-bold text-white mb-6 mt-2">{language === 'bn' ? 'কাস্টম কোট অনুরোধ করুন' : 'Request Custom Quote'}</div>
                            <button
                                onClick={handlePurchase}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-colors flex justify-center items-center gap-2 bg-white text-[#500000] hover:bg-gray-100`}
                            >
                                {language === 'bn' ? 'অনুরোধ জমা দিন' : 'Submit Request'} <ArrowRight size={18} />
                            </button>
                        </div>
                        <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/20 transition-colors" />
                    </div>
                </div>

                {/* RIGHT: Preview */}
                <div className="lg:col-span-8">
                    <div className="h-full bg-gray-100 rounded-3xl border border-gray-200 overflow-hidden relative group shadow-inner min-h-[600px]">
                        {/* Header Overlay */}
                        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-20 bg-gradient-to-b from-black/50 to-transparent">
                            <div>
                                <div className="bg-white/90 backdrop-blur-md text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-gray-200 inline-flex items-center gap-2 shadow-sm">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> {language === 'bn' ? 'লাইভ প্রিভিউ' : 'Live Preview'}
                                </div>
                            </div>
                            <div className="text-right">
                                <h3 className="text-2xl font-bold text-white drop-shadow-md">{relevantProject.title}</h3>
                                <p className="text-white/90 text-sm drop-shadow-md">{relevantProject.category}</p>
                            </div>
                        </div>

                        {relevantProject ? (
                            <>
                                <img src={relevantProject.image} alt="Preview" className="w-full h-full object-cover transition-all duration-700 hover:scale-105" />

                                {/* Bottom Info Panel */}
                                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl flex flex-col md:flex-row gap-6 items-center justify-between shadow-lg">
                                    <div className="flex-1">
                                        <h4 className="text-gray-900 font-bold mb-2">{language === 'bn' ? 'প্যাকেজে অন্তর্ভুক্ত' : 'Package Includes'}</h4>
                                        <p className="text-gray-600 text-sm mb-0">
                                            {language === 'bn' ? `${config.feature} বৈশিষ্ট্য সহ সম্পূর্ণ ${config.type} ডেভেলপমেন্ট।` : `Full ${config.type} development with ${config.feature} features.`}
                                            {language === 'bn' ? 'রেসপন্সিভ ডিজাইন, এসইও অপ্টিমাইজেশন এবং ডিপ্লয়মেন্ট অন্তর্ভুক্ত।' : 'includes responsive design, SEO optimization, and deployment.'}
                                        </p>
                                    </div>
                                    <div className="flex gap-4 border-l border-gray-200 pl-6">
                                        <div className="text-center">
                                            <div className="text-gray-400 text-xs uppercase font-bold">{language === 'bn' ? 'ডেলিভারি' : 'Delivery'}</div>
                                            <div className="text-gray-900 font-bold">{config.time}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-gray-400 text-xs uppercase font-bold">{language === 'bn' ? 'রিভিশন' : 'Revisions'}</div>
                                            <div className="text-gray-900 font-bold">{language === 'bn' ? 'আনলিমিটেড' : 'Unlimited'}</div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                <Monitor size={48} className="mb-4 opacity-50" />
                                <span>No preview available</span>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- NEW: Contact Form + Real Map (Professional Redesign) ---
export const ContactFormWithMap = () => {
    const { addMessage, language } = useData();
    const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
    const [initialSubject, setInitialSubject] = useState('');
    const [initialMessage, setInitialMessage] = useState('');

    useEffect(() => {
        // Initialize EmailJS
        // @ts-ignore
        if (window.emailjs) return; // Prevent double init
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.async = true;
        script.onload = () => {
            // @ts-ignore
            // @ts-ignore
            window.emailjs.init((import.meta as any).env.VITE_EMAILJS_PUBLIC_KEY);
        };
        document.body.appendChild(script);

        // Check for pending inquiry from Build Page
        const pendingInquiry = localStorage.getItem('pendingInquiry');
        if (pendingInquiry) {
            try {
                const data = JSON.parse(pendingInquiry);
                setInitialSubject(data.subject);
                setInitialMessage(data.message);
                localStorage.removeItem('pendingInquiry');
                toast.success(language === 'bn' ? "প্রকল্পের বিবরণ পূরণ করা হয়েছে। আপনার যোগাযোগ তথ্য যোগ করুন!" : "Project details pre-filled. Please add your contact info!");
            } catch (e) {
                console.error("Failed to parse inquiry", e);
            }
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        const formData = new FormData(e.target as HTMLFormElement);
        const data = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            subject: formData.get('subject') as string,
            message: formData.get('message') as string,
        };

        try {
            // 1. Send Email via EmailJS
            // @ts-ignore
            await window.emailjs?.send(
                (import.meta as any).env.VITE_EMAILJS_SERVICE_ID,
                (import.meta as any).env.VITE_EMAILJS_CONTACT_TEMPLATE_ID,
                {
                    from_name: data.name,
                    from_email: data.email,
                    email: data.email, // Matched to template variable {{email}}
                    subject: data.subject,
                    message: data.message,
                    reply_to: data.email
                }
            );

            // 2. Log to Admin Panel (DataContext)
            addMessage({
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message,
                type: 'Contact'
            });

            setStatus('success');
            toast.success(language === 'bn' ? "বার্তা সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।" : "Message sent successfully! We'll be in touch shortly.");

            // 3. Reset Form
            (e.target as HTMLFormElement).reset();
            setInitialSubject('');
            setInitialMessage('');
            setTimeout(() => setStatus('idle'), 3000);

        } catch (error) {
            console.error('EmailJS Error:', error);
            setStatus('idle');
            toast.error(language === 'bn' ? "বার্তা পাঠাতে ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।" : "Failed to send message. Please try again.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center">

                {/* Left Side: Redesigned for Beauty */}
                <div className="lg:pr-8">
                    <div className="mb-10">
                        <h2 className="text-3xl md:text-4xl font-black text-[#500000] mb-6 tracking-tighter leading-[1.1]">
                            {language === 'bn' ? 'আসুন একটি' : "Let's start a"} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600">{language === 'bn' ? 'কথোপকথন শুরু করি।' : 'conversation.'}</span>
                        </h2>
                        <p className="text-xl text-gray-500 font-light leading-relaxed max-w-md">
                            {language === 'bn' ? 'আপনার ডিজিটাল উপস্থিতি রূপান্তর করতে প্রস্তুত? আমরা আপনাকে স্কেলেবল, প্রিমিয়াম সফটওয়্যার সমাধান তৈরি করতে সাহায্য করতে এখানে আছি।' : "Ready to transform your digital presence? We're here to help you build scalable, premium software solutions."}
                        </p>
                    </div>

                    <div className="space-y-5">
                        {/* Interactive Contact Cards */}
                        <a href="#" className="flex items-center gap-6 p-5 rounded-2xl bg-gray-50/80 border border-gray-100 hover:border-[#500000]/30 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all group duration-300">
                            <div className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm group-hover:bg-[#500000] group-hover:text-white group-hover:border-[#500000] transition-all duration-300">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h5 className="font-bold text-gray-900 text-xs uppercase tracking-widest mb-1 opacity-60 group-hover:opacity-100 transition-opacity">{language === 'bn' ? 'সদর দপ্তর' : 'Headquarters'}</h5>
                                <p className="text-lg font-medium text-gray-800 group-hover:text-[#500000] transition-colors">{language === 'bn' ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh'}</p>

                                <h5 className="font-bold text-gray-900 text-xs uppercase tracking-widest mb-1 mt-4 opacity-60 group-hover:opacity-100 transition-opacity">{language === 'bn' ? 'সাব-ব্রাঞ্চ' : 'Subbranch'}</h5>
                                <p className="text-lg font-medium text-gray-800 group-hover:text-[#500000] transition-colors">{language === 'bn' ? 'বরিশাল, বাংলাদেশ' : 'Barisal, Bangladesh'}</p>
                            </div>
                        </a>

                        <a href="mailto:rizqaratech@gmail.com" className="flex items-center gap-6 p-5 rounded-2xl bg-gray-50/80 border border-gray-100 hover:border-[#500000]/30 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all group duration-300">
                            <div className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm group-hover:bg-[#500000] group-hover:text-white group-hover:border-[#500000] transition-all duration-300">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h5 className="font-bold text-gray-900 text-xs uppercase tracking-widest mb-1 opacity-60 group-hover:opacity-100 transition-opacity">{language === 'bn' ? 'ইমেইল করুন' : 'Email Us'}</h5>
                                <p className="text-lg font-medium text-gray-800 group-hover:text-[#500000] transition-colors">rizqaratech@gmail.com</p>
                            </div>
                        </a>

                        <a href="tel:+880123456789" className="flex items-center gap-6 p-5 rounded-2xl bg-gray-50/80 border border-gray-100 hover:border-[#500000]/30 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all group duration-300">
                            <div className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400 shadow-sm group-hover:bg-[#500000] group-hover:text-white group-hover:border-[#500000] transition-all duration-300">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h5 className="font-bold text-gray-900 text-xs uppercase tracking-widest mb-1 opacity-60 group-hover:opacity-100 transition-opacity">{language === 'bn' ? 'ফোন' : 'Phone'}</h5>
                                <p className="text-lg font-medium text-gray-800 group-hover:text-[#500000] transition-colors">+880 (1343-042761)</p>
                            </div>
                        </a>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#500000] opacity-5 rounded-bl-[100px] pointer-events-none" />

                    <h3 className="text-2xl font-black text-gray-900 mb-8">{language === 'bn' ? 'বার্তা পাঠান' : 'Send a Message'}</h3>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{language === 'bn' ? 'আপনার নাম' : 'Your Name'}</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-[#500000] transition-colors" size={18} />
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 pl-12 focus:outline-none focus:border-[#500000] focus:ring-1 focus:ring-[#500000] transition-all placeholder:text-gray-300 font-medium"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{language === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-[#500000] transition-colors" size={18} />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 pl-12 focus:outline-none focus:border-[#500000] focus:ring-1 focus:ring-[#500000] transition-all placeholder:text-gray-300 font-medium"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{language === 'bn' ? 'বিষয়' : 'Subject'}</label>
                            <div className="relative group">
                                <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-hover:text-[#500000] transition-colors" size={18} />
                                <input
                                    name="subject"
                                    type="text"
                                    required
                                    defaultValue={initialSubject}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 pl-12 focus:outline-none focus:border-[#500000] focus:ring-1 focus:ring-[#500000] transition-all placeholder:text-gray-300 font-medium"
                                    placeholder={language === 'bn' ? 'প্রকল্প অনুসন্ধান...' : "Project Inquiry..."}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">{language === 'bn' ? 'বার্তা' : 'Message'}</label>
                            <textarea
                                name="message"
                                rows={4}
                                required
                                defaultValue={initialMessage}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-[#500000] focus:ring-1 focus:ring-[#500000] transition-all placeholder:text-gray-300 font-medium resize-none"
                                placeholder={language === 'bn' ? 'আমাদের আপনার প্রকল্প সম্পর্কে বলুন...' : "Tell us about your project..."}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'sending'}
                            className="w-full bg-[#500000] text-white font-bold py-4 rounded-xl hover:bg-[#3a0000] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {status === 'sending' ? (
                                <><Loader className="animate-spin" /> {language === 'bn' ? 'পাঠানো হচ্ছে...' : 'Sending...'}</>
                            ) : (
                                <>{language === 'bn' ? 'বার্তা পাঠান' : 'Send Message'} <Send size={18} className="group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Google Map Embed */}
            <div className="mt-16 md:mt-24 rounded-3xl overflow-hidden shadow-xl border border-gray-200 h-[400px] md:h-[500px] relative grayscale hover:grayscale-0 transition-all duration-700">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d456.196619620925!2d90.41513833191516!3d23.83377999382946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sbd!4v1767719304428!5m2!1sen!2sbd"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Rizqara Tech Location"
                ></iframe>
                <div className="absolute bottom-6 left-6 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#500000] rounded-full flex items-center justify-center text-white">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-gray-500 uppercase">Our Location</div>
                        <div className="font-bold text-gray-900">Dhaka, Bangladesh</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- RizqAI Chatbot ---
export const RizqAIBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { language, services, jobs } = useData();
    const [messages, setMessages] = useState<{ id: number, text: string, sender: 'user' | 'bot', type?: 'text' | 'button' | 'link', actionLink?: string, actionLabel?: string }[]>([
        { id: 1, text: language === 'bn' ? 'হ্যালো! আমি RizqAI। আজ আমি আপনাকে কিভাবে সাহায্য করতে পারি?' : "Hello! I'm RizqAI. How can I help you build your digital product today?", sender: 'bot', type: 'text' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Local Team Data
    const teamData = [
        { name: "Ahmed Rizq", role: "Chairman", bio: "Visionary leader with 20+ years in tech innovation." },
        { name: "Sarah Chen", role: "CEO", bio: "Driving global strategy and operational excellence." },
        { name: "Michael Ross", role: "Operations Manager", bio: "Ensuring seamless delivery across all projects." },
        { name: "David Kim", role: "Lead Developer", bio: "Expert in full-stack architecture." },
        { name: "Elena Rodriguez", role: "Senior UI/UX Designer", bio: "Crafting intuitive and beautiful user experiences." }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const simulateAIResponse = (userText: string) => {
        setIsTyping(true);
        setTimeout(() => {
            let reply = language === 'bn'
                ? "দুঃখিত, আমি এটি বুঝতে পারিনি। আপনি কি আমাদের পরিষেবা বা মূল্য সম্পর্কে জানতে চান?"
                : "I didn't quite catch that. Could you ask about our services, team, or projects?";
            let type: 'text' | 'button' | 'link' = 'text';
            let actionLink = '';
            let actionLabel = '';

            const lowerText = userText.toLowerCase();

            // --- 1. GREETING & SMALL TALK ---
            if (lowerText.match(/\b(hello|hi|hey|greetings|start)\b/)) {
                const greetings = [
                    "Hey there! How are you doing today?",
                    "Hello! Great to see you. How can I assist you?",
                    "Hi! Welcome to RizQara Tech. What are you looking to build?"
                ];
                reply = language === 'bn' ? "হ্যালো! আপনাকে কিভাবে সাহায্য করতে পারি?" : greetings[Math.floor(Math.random() * greetings.length)];
            }
            else if (lowerText.match(/\b(how are you|how r u)\b/)) {
                reply = "I'm doing fantastic, thanks for asking! I'm fully operational and ready to help you.";
            }
            else if (lowerText.match(/\b(who are you|what are you)\b/)) {
                reply = "I am RizqAI, your virtual assistant. I'm here to guide you through our services, projects, and team.";
            }
            else if (lowerText.match(/\b(what do you need|why are you here)\b/)) {
                reply = "I'm here to serve you! Whether you need a website, app, or AI solution, I can help you find the right information.";
            }
            // --- 2. CONTACT / WHATSAPP ---
            else if (lowerText.match(/\b(contact|email|phone|call|whatsapp|chat|help)\b/)) {
                reply = language === 'bn'
                    ? "আপনি আমাদের সাথে সরাসরি চ্যাট করতে পারেন!"
                    : "Let's connect directly! You can chat with our team on WhatsApp right now.";
                type = 'button';
                actionLabel = "Chat on WhatsApp";
                actionLink = "https://wa.link/bx60tv";
            }
            // --- 3. PRICING ---
            else if (lowerText.match(/\b(price|cost|package|rate|money)\b/)) {
                reply = language === 'bn'
                    ? "আমাদের বিভিন্ন প্যাকেজ আছে: বেসিক, এসএমই, এবং এন্টারপ্রাইজ। বিস্তারিত দেখতে 'প্যাকেজ' পেজ ভিজিট করুন।"
                    : "We have flexible pricing models tailored to your needs. Check out our packages/pricing page for details.";
                type = 'link';
                actionLabel = "View Packages";
                actionLink = "/packages";
            }
            // --- 4. SERVICES ---
            else if (lowerText.match(/\b(service|offer|do|web|app|ai|tech)\b/)) {
                const serviceList = services.slice(0, 3).map((s: any) => s.title).join(', '); // Limit to 3 for brevity
                reply = language === 'bn'
                    ? `আমরা প্রদান করি: ${serviceList}...`
                    : `We specialize in ${serviceList}, and much more. What specific solution are you looking for?`;
            }
            // --- 5. TEAM ---
            else if (lowerText.match(/\b(team|ceo|founder|developer|designer|who)\b/)) {
                const foundMember = teamData.find(m => lowerText.includes(m.name.toLowerCase()) || lowerText.includes(m.role.toLowerCase()));
                if (foundMember) {
                    reply = `${foundMember.name} is our ${foundMember.role}. ${foundMember.bio}`;
                } else {
                    reply = language === 'bn'
                        ? "আমাদের একটি বিশেষজ্ঞ দল আছে। আপনি কি নির্দিষ্ট কারো সম্পর্কে জানতে চান?"
                        : "We have a world-class team! You can ask about our CEO, Developers, or Designers.";
                }
            }
            // --- 6. CAREERS ---
            else if (lowerText.match(/\b(job|career|hiring|work|vacancy)\b/)) {
                if (jobs.length > 0) {
                    reply = language === 'bn'
                        ? `আমরা নিয়োগ দিচ্ছি!`
                        : `Yes, we are hiring! We're looking for talented individuals to join our team.`;
                    type = 'link';
                    actionLabel = "View Openings";
                    actionLink = "/careers";
                } else {
                    reply = "We don't have open positions right now, but feel free to send us your CV for future opportunities.";
                }
            }
            // --- 7. PROJECTS ---
            else if (lowerText.match(/\b(project|portfolio|built|work|case)\b/)) {
                reply = language === 'bn'
                    ? "আমাদের সেরা কিছু প্রকল্প দেখুন।"
                    : "We've delivered enterprise solutions globally. Check out our latest success stories.";
                type = 'link';
                actionLabel = "View Projects";
                actionLink = "/projects";
            }

            setMessages(prev => [...prev, { id: Date.now(), text: reply, sender: 'bot', type, actionLink, actionLabel }]);
            setIsTyping(false);
        }, 1200); // Slightly faster response
    };

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        const userMsg = inputText.trim();
        setMessages(prev => [...prev, { id: Date.now(), text: userMsg, sender: 'user' }]);
        setInputText('');

        simulateAIResponse(userMsg);
    };

    // Force Refresh: RizqAIBot Update
    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 bg-white rounded-3xl shadow-2xl border border-gray-100 w-[90vw] md:w-96 overflow-hidden flex flex-col ring-1 ring-black/5"
                    >
                        {/* Header */}
                        <div className="bg-white p-4 border-b border-gray-100 flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#500000] rounded-full flex items-center justify-center">
                                    <Bot size={22} className="text-white" />
                                </div>
                                <div>
                                    <span className="font-bold text-gray-900 text-lg block leading-none">RizqAI</span>
                                    <span className="text-xs text-green-500 font-medium flex items-center gap-1 mt-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Always Active
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-900"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="h-[400px] bg-slate-50 p-5 overflow-y-auto flex flex-col gap-4 scrollbar-thin scrollbar-thumb-gray-200">
                            {messages.map(msg => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
                                >
                                    <div
                                        className={`p-4 rounded-2xl text-sm shadow-sm leading-relaxed ${msg.sender === 'user'
                                            ? 'bg-[#500000] text-white rounded-br-none'
                                            : 'bg-white text-gray-700 rounded-bl-none border border-gray-100'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>

                                    {/* Action Buttons/Links with Fixed Styling */}
                                    {msg.type === 'button' && msg.actionLink && (
                                        <div className="mt-4 w-full flex flex-col items-start">
                                            <a
                                                href={msg.actionLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group relative flex items-center gap-2.5 px-6 py-3 rounded-full text-white font-bold text-[15px] shadow-[0_8px_20px_rgba(37,211,102,0.3)] hover:shadow-[0_10px_25px_rgba(37,211,102,0.5)] hover:-translate-y-0.5 transition-all w-fit overflow-hidden"
                                                style={{ background: 'linear-gradient(135deg, #25D366 0%, #075E54 100%)' }}
                                            >
                                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                <MessageCircle size={22} fill="white" className="relative z-10 drop-shadow-sm" />
                                                <span className="relative z-10 tracking-wide font-medium">{msg.actionLabel}</span>
                                            </a>
                                        </div>
                                    )}
                                    {msg.type === 'link' && msg.actionLink && (
                                        <div className="mt-2">
                                            <a href={msg.actionLink} className="text-xs font-bold text-[#500000] hover:underline flex items-center gap-1 group">
                                                {msg.actionLabel} <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                            </a>
                                        </div>
                                    )}

                                    <span className="text-[10px] text-gray-300 mt-1 px-1 font-medium">
                                        {msg.sender === 'bot' ? 'AI Assistant' : 'You'}
                                    </span>
                                </motion.div>
                            ))}

                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="self-start bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex gap-1.5 items-center w-fit"
                                >
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75" />
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150" />
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-3 shrink-0 items-center">
                            <input
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={language === 'bn' ? 'বার্তা লিখুন...' : "Type your message..."}
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#500000] focus:ring-1 focus:ring-[#500000]/10 transition-all text-gray-800 placeholder:text-gray-400"
                            />
                            <button
                                type="submit"
                                className="p-3 bg-[#500000] text-white rounded-xl flex items-center justify-center disabled:opacity-50"
                                disabled={!inputText.trim()}
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Trigger Button - Persistent Bot Icon (No Big X) */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-[#500000] text-white rounded-full flex items-center justify-center cursor-pointer z-50 relative"
            >

                {/* Always show Bot/Sparkle icon primarily. If open, maybe just a subtle animation or different icon state implies toggle, avoiding the 'big cross' complaint. */}
                {isOpen ? (
                    <MessageSquare size={24} />
                ) : (
                    <Bot size={28} />
                )}


            </div>
        </div>
    );
};
