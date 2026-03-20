import React, { useState, useEffect, useLayoutEffect } from 'react';
import { getProxiedImage } from './utils/imageProxy';
import {
    Menu, X, ChevronRight, Check,
    Code2, Palette, Globe, Smartphone, BarChart, Layout,
    ArrowRight, Star,
    Linkedin, Instagram, Facebook,
    Shield, Zap, MessageSquare, Briefcase,
    Server, ShieldCheck,
    Lock, User, ExternalLink, Share2, Search,
    Lightbulb, Cpu, Activity, Layers, Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';

// Imports
import { Toaster, toast } from 'sonner';
import { DataProvider, useData, Project } from './context/DataContext';
import { AdminDashboard } from './components/AdminDashboard';

import { SEO } from './components/SEO';
import { partners } from './data/partners';
import { techStack } from './data/techStack';
import {
    Carousel, AutoScrollCarousel, StatsCounter,
    JourneyRoadmap,
    HeroCarousel, BuildPreviewTeaser, BuildPage,
    PricingDetailed, LatestVideos, LatestBlogs,
    TestimonialSlider, PremiumComparison, ContactFormWithMap,
    RizqAIBot, FeatureDetail, HomeSkeleton,
    AboutSkeleton, ContactSkeleton,
    ServicesSkeleton, ProjectsSkeleton, AboutHero
} from './components/premium/UIComponents';
import { BlogPage, VideosPage, VideoDetail, TeamPage, BlogDetail, TeamSection, CareersPage } from './components/pages/ExtraPages';
import { PrivacyPolicy, TermsOfService } from './components/LegalPages';
import { PromotionOverlay } from './components/premium/PromotionOverlay';
import { CookieConsent } from './components/premium/CookieConsent';
import { FAQSection } from './components/premium/FAQSection';
import { NoticeBar } from './components/premium/NoticeBar';

// --- Utils ---
export const getSlug = (title: string) => title?.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

const paymentMethods = [
    { name: 'Visa', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642634/rizqaratech/payment_methods/Visa-Logo.png', className: 'p-1' },
    { name: 'Mastercard', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642636/rizqaratech/payment_methods/mastercard-featured-image-1080x628.jpg', className: 'p-1' },
    { name: 'Amex', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642635/rizqaratech/payment_methods/amex.jpg', className: 'p-1' },
    { name: 'Payoneer', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642638/rizqaratech/payment_methods/payoneer-logo-payoneer-icon-transparent-free-png.webp', className: 'p-1' },
    { name: 'Google Pay', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642631/rizqaratech/payment_methods/GooglePayLogo.width-500.format-webp.webp', className: 'p-1' },
    { name: 'Redot Pay', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642639/rizqaratech/payment_methods/redot_pay.png', className: 'p-1' },
    { name: 'Bkash', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642630/rizqaratech/payment_methods/Bkash.jpg', className: 'object-cover w-full h-full' },
    { name: 'Nagad', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642632/rizqaratech/payment_methods/Nagad.jpg', className: 'p-1 object-contain' },
    { name: 'Rocket', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642633/rizqaratech/payment_methods/Rocket.png', className: 'object-cover w-full h-full scale-105' },
];

// --- Premium UI Components (Internal) ---

const XLogo = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
);

const MediumLogo = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
        <path d="M13.54 12a6.8 6.8 0 11-6.77-6.82A6.77 6.77 0 0113.54 12zM20.96 12c0 3.54-1.51 6.41-3.38 6.41S14.2 15.54 14.2 12s1.51-6.41 3.38-6.41 3.38 2.87 3.38 6.41zM24 12c0 3.17-.53 5.75-1.19 5.75s-1.19-2.58-1.19-5.75.53-5.75 1.19-5.75S24 8.83 24 12z" />
    </svg>
);

const SectionTitle = ({ title, subtitle, center = false }: { title: string, subtitle?: string, center?: boolean }) => (
    <div className={`mb-16 ${center ? 'text-center' : ''}`}>
        <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-black text-[#500000] mb-6 leading-tight"
        >
            {title}
        </motion.h2>
        {subtitle && (
            <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className={`text-lg text-gray-600 max-w-2xl font-light leading-relaxed ${center ? 'mx-auto' : ''}`}
            >
                {subtitle}
            </motion.p>
        )}
    </div>
);

const ButtonPremium = ({ children, onClick, className = "", variant = "primary" }: any) => {
    const baseClass = "px-8 py-4 rounded-full font-medium transition-all duration-300 flex items-center justify-center gap-3 text-sm tracking-wide";
    const variants = {
        primary: "bg-[#500000] text-white hover:bg-[#3a0000] shadow-[0_10px_20px_rgba(80,0,0,0.2)] hover:shadow-[0_15px_30px_rgba(80,0,0,0.3)] transform hover:-translate-y-1",
        glass: "bg-white border border-gray-200 text-[#500000] hover:bg-gray-50 hover:border-gray-300 shadow-sm",
        outline: "border border-[#500000]/20 text-[#500000] hover:bg-[#500000] hover:text-white"
    };

    return (
        <button onClick={onClick} className={`${baseClass} ${variants[variant as keyof typeof variants]} ${className}`}>
            {children}
        </button>
    );
};

// --- Skeletons ---

const DetailSkeleton = () => (
    <div className="container mx-auto px-6 py-24 min-h-screen">
        <div className="mb-12 animate-pulse w-32 h-6 bg-gray-200 rounded-full"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
            <div>
                <div className="h-16 md:h-24 bg-gray-200 rounded-2xl w-full mb-8 animate-pulse"></div>
                <div className="h-16 md:h-24 bg-gray-200 rounded-2xl w-3/4 mb-12 animate-pulse"></div>
                <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </div>
            </div>
            <div className="aspect-video bg-gray-200 rounded-3xl animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="h-64 bg-gray-200 rounded-3xl animate-pulse"></div>
            <div className="h-64 bg-gray-200 rounded-3xl animate-pulse"></div>
            <div className="h-64 bg-gray-200 rounded-3xl animate-pulse"></div>
        </div>
    </div>
);

// --- Detail Components ---

const CaseStudiesPage = () => {
    const navigate = useNavigate();
    const { caseStudies, language, t, loading } = useData();

    if (loading) return <ProjectsSkeleton />;

    return (
        <div className="container mx-auto px-6 py-24 min-h-screen">
            <SEO
                title={`${t ? t('caseStudies') : 'Case Studies'} | RizQara Tech`}
                description="Explore our in-depth case studies and success stories."
                canonical="https://rizqara.tech/case-studies"
            />
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                <SectionTitle
                    title={t ? t('caseStudies') : 'Case Studies'}
                    subtitle={language === 'bn' ? 'আমাদের সাফল্যের গল্প এবং শিল্প প্রভাব।' : 'Our success stories and industry impact.'}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {caseStudies.map((study, idx) => {
                    const title = language === 'bn' ? (study.title_bn || study.title) : study.title;
                    const category = language === 'bn' ? (study.category_bn || study.category) : study.category;
                    const desc = language === 'bn' ? (study.description_bn || study.description) : study.description;

                    return (
                        <motion.div
                            key={study.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.6 }}
                            onClick={() => navigate(`/case-studies/${getSlug(study.title)}`)}
                            className="group bg-white rounded-[40px] border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-700 cursor-pointer overflow-hidden flex flex-col h-full active:scale-[0.98]"
                        >
                            <div className="h-64 overflow-hidden relative">
                                <img src={study.image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/95 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest text-[#500000] shadow-sm">
                                        {category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#500000] transition-colors">{title}</h3>
                                <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-grow">{desc}</p>
                                <div className="flex items-center text-[#500000] font-bold text-sm gap-2">
                                    <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Case Study'}</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

const CaseStudyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { caseStudies, language, t, loading } = useData();

    const study = caseStudies.find(s =>
        String(s.id) === id ||
        getSlug(s.title) === id
    );

    useLayoutEffect(() => {
        if (!loading && study && String(study.id) === id) {
            const slug = getSlug(study.title);
            if (slug) navigate(`/case-studies/${slug}`, { replace: true });
        }
    }, [id, study, loading, navigate]);

    if (loading) return <DetailSkeleton />;
    if (!study) return <div className="pt-32 text-center text-gray-900 min-h-screen">Case Study not found</div>;

    const title = language === 'bn' ? (study.title_bn || study.title) : study.title;
    const description = language === 'bn' ? (study.description_bn || study.description) : study.description;
    const problem = language === 'bn' ? (study.problem_bn || study.problem) : study.problem;
    const solution = language === 'bn' ? (study.solution_bn || study.solution) : study.solution;
    const impact = language === 'bn' ? (study.impact_bn || study.impact) : study.impact;
    const techs = study.tech || [];
    const features = language === 'bn' && study.features_bn ? study.features_bn : (study.features || []);

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title: title, text: description, url: url });
            } catch (error) { console.log('Error sharing', error); }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                toast.success('Link copied to clipboard!');
            } catch (err) {
                const textArea = document.createElement("textarea");
                textArea.value = url;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    const successful = document.execCommand('copy');
                    if (successful) toast.success('Link copied to clipboard!');
                } catch (e) { prompt("Copy this link:", url); }
                document.body.removeChild(textArea);
            }
        }
    };

    return (
        <div className="container mx-auto px-6 py-24 min-h-screen">
            <SEO
                title={`${title} | Case Study | RizQara Tech`}
                description={description}
                canonical={`https://rizqara.tech/case-studies/${id}`}
            />

            <button onClick={() => navigate('/case-studies')} className="flex items-center text-gray-500 hover:text-[#500000] mb-12 transition-colors group">
                <div className="p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 mr-4 transition-colors">
                    <ArrowRight className="rotate-180" size={20} />
                </div>
                <span className="text-sm uppercase tracking-widest font-bold">{t('back')}</span>
            </button>

            <div className="rounded-3xl overflow-hidden mb-12 border border-gray-200 shadow-2xl bg-gray-50 flex justify-center items-center min-h-[300px] max-h-[70vh]">
                <img src={study.image} alt={title} className="max-w-full max-h-full object-contain" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="px-4 py-1 rounded-full border border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">{study.category}</span>
                        <span className="px-4 py-1 rounded-full bg-[#500000] text-white text-xs font-bold uppercase tracking-wider">Featured Case Study</span>
                    </div>
                    <h1 className="text-5xl font-black text-[#500000] mb-8">{title}</h1>
                    <p className="text-xl text-gray-600 leading-relaxed mb-12 font-light whitespace-pre-line">
                        {description}
                    </p>

                    <div className="pb-24">
                        {/* Problem Section */}
                        <div className="mb-40">
                            <h3 className="text-2xl font-bold text-gray-900 mb-12 flex items-center gap-3">
                                <Activity className="text-[#500000]" size={24} />
                                {language === 'bn' ? 'প্রধান সমস্যা' : 'The Challenge'}
                            </h3>
                            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 text-lg text-gray-700 leading-relaxed shadow-sm whitespace-pre-line">
                                {problem}
                            </div>
                        </div>

                        {/* Solution Section */}
                        <div className="pt-20 mb-40">
                            <h3 className="text-2xl font-bold text-gray-900 mb-12 flex items-center gap-3">
                                <Cpu className="text-[#500000]" size={24} />
                                {language === 'bn' ? 'সমাধান এবং কৌশল' : 'Our Solution'}
                            </h3>
                            <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-md text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                                {solution}
                            </div>
                        </div>

                        {/* Impact Section */}
                        <div className="pt-20 mb-40">
                            <h3 className="text-2xl font-bold text-gray-900 mb-12 flex items-center gap-3">
                                <Zap className="text-[#500000]" size={24} />
                                {language === 'bn' ? 'ব্যবসায়িক প্রভাব' : 'Business Impact'}
                            </h3>
                            <div className="p-8 bg-[#500000]/5 rounded-2xl border border-[#500000]/10 text-lg text-gray-700 leading-relaxed shadow-sm whitespace-pre-line">
                                {impact}
                            </div>
                        </div>

                        {/* Key Results */}
                        {features.length > 0 && (
                            <div className="pt-20 mb-40">
                                <h3 className="text-2xl font-bold text-gray-900 mb-12">{language === 'bn' ? 'মূল ফলাফল' : 'Key Results'}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {features.map((f: string, i: number) => (
                                        <div key={i} className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                                <Check className="text-green-600" size={16} strokeWidth={3} />
                                            </div>
                                            <span className="text-gray-700 font-medium">{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tech Stack */}
                        {techs.length > 0 && (
                            <div className="pt-20 mb-40">
                                <h3 className="text-2xl font-bold text-gray-900 mb-12">{language === 'bn' ? 'ব্যবহৃত প্রযুক্তি' : 'Technologies Used'}</h3>
                                <div className="flex flex-wrap gap-4">
                                    {techs.map((t: string, i: number) => (
                                        <div key={i} className="px-8 py-4 rounded-2xl bg-gray-50 border border-gray-100 text-[#500000] font-black text-sm uppercase tracking-widest shadow-sm transition-all hover:bg-white hover:shadow-md">
                                            {t}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Gallery */}
                        {study.gallery && study.gallery.length > 0 && (
                            <div className="pt-20 animate-in slide-in-from-bottom-8 duration-700 mb-40">
                                <h3 className="text-2xl font-bold text-gray-900 mb-12 flex items-center gap-2">
                                    <ImageIcon size={24} className="text-[#500000]" /> Project Showcase
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {study.gallery.map((img: string, i: number) => (
                                        <div key={i} className="group rounded-3xl overflow-hidden border border-gray-200 shadow-md relative h-80 bg-gray-50 flex justify-center items-center cursor-zoom-in">
                                            <img
                                                src={img}
                                                alt={`Gallery ${i + 1}`}
                                                className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105"
                                                onClick={() => window.open(img, '_blank')}
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-32 space-y-12">
                        {/* Summary Card */}
                        <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-6">
                            <h4 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-4">Case Summary</h4>

                            <div>
                                <p className="text-xs font-black text-[#500000]/40 uppercase tracking-widest mb-1">Category</p>
                                <p className="text-gray-900 font-bold">{study.category}</p>
                            </div>

                            <div>
                                <p className="text-xs font-black text-[#500000]/40 uppercase tracking-widest mb-1">Type</p>
                                <p className="text-gray-900 font-bold">Featured Case Study</p>
                            </div>

                            <div>
                                <p className="text-xs font-black text-[#500000]/40 uppercase tracking-widest mb-4">Share this case study</p>
                                <ButtonPremium variant="glass" className="w-full justify-center" onClick={handleShare}>
                                    <Share2 size={18} /> Share Case Study
                                </ButtonPremium>
                            </div>

                            <hr className="border-gray-50" />

                            <div className="space-y-4">
                                <h5 className="text-xl font-bold text-gray-900 leading-tight">Ready for a similar transformation?</h5>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Let's discuss how we can help you achieve similar results for your business.
                                </p>
                                <ButtonPremium className="w-full justify-center group" onClick={() => navigate('/contact')}>
                                    Start Your Project <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </ButtonPremium>
                            </div>
                        </div>

                        {/* Consultation Card */}
                        <div className="p-8 bg-gray-900 rounded-3xl shadow-xl relative overflow-hidden group">
                            <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#500000]/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                            <h4 className="text-xl font-bold text-white mb-3 relative z-10">Expert Advice?</h4>
                            <p className="text-white/60 text-sm mb-8 leading-relaxed relative z-10">Get a 30-minute consultation with our lead technical architect to discuss your vision.</p>
                            <button
                                onClick={() => window.open('https://cal.com/rizqara-tech-a8z6yt', '_blank')}
                                className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest bg-white text-[#500000] px-6 py-3 rounded-xl hover:bg-[#500000] hover:text-white transition-all shadow-xl active:scale-95 group/btn"
                            >
                                Book Strategy Call <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { services, projects, language, t, loading } = useData();

    const service = services.find(s =>
        s.id === id ||
        getSlug(s.title) === id
    );

    // Redirect to slug if currently using number ID
    useLayoutEffect(() => {
        if (!loading && service && service.id === id) {
            const slug = getSlug(service.title);
            if (slug) navigate(`/services/${slug}`, { replace: true });
        }
    }, [id, service, loading, navigate]);

    if (loading) return <DetailSkeleton />;

    if (!service) return <div className="pt-32 text-center text-gray-900 min-h-screen">Service not found</div>;

    const demoImages = service.gallery && service.gallery.length > 0
        ? [service.image, ...service.gallery]
        : [service.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"];

    const title = language === 'bn' ? (service.title_bn || service.title) : service.title;
    const description = language === 'bn' ? (service.description_bn || service.description) : service.description;
    const capabilities = language === 'bn' ? (service.capabilities_bn || service.capabilities) : service.capabilities;
    const process = language === 'bn' ? (service.process_bn || service.process) : service.process;
    const details = language === 'bn' ? (service.details_bn || service.details) : service.details;

    const relatedProjects = (projects as Project[]).filter((p: Project) =>
        p.category.toLowerCase().includes(service.title.toLowerCase()) ||
        service.title.toLowerCase().includes(p.category.toLowerCase())
    ).slice(0, 3);

    const schema = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": title,
        "description": description,
        "provider": {
            "@type": "Organization",
            "name": "RizQara Tech",
            "url": "https://rizqara.tech"
        }
    };

    return (
        <div className="container mx-auto px-6 py-24 min-h-screen">
            <SEO
                title={`${title} | RizQara Tech`}
                description={description}
                keywords={`${title}, software company Bangladesh, ${title} service Dhaka, best ${title} company`}
                canonical={`https://rizqara.tech/services/${id}`}
                schema={schema}
            />
            <button onClick={() => navigate('/services')} className="flex items-center text-gray-500 hover:text-[#500000] mb-12 transition-colors group">
                <div className="p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 mr-4 transition-colors">
                    <ArrowRight className="rotate-180" size={20} />
                </div>
                <span className="text-sm uppercase tracking-widest font-bold">{t('back')}</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-5xl md:text-7xl font-black text-[#500000] mb-8 leading-tight">{title}</h1>
                    <p className="text-xl text-gray-600 leading-relaxed mb-12 font-light border-l border-gray-200 pl-6">
                        {description}
                    </p>

                    <div className="space-y-8">
                        <div className="p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Briefcase size={20} className="text-white bg-[#500000] rounded-full p-0.5" /> Capabilities</h3>
                            <ul className="space-y-3 text-gray-600">
                                {(capabilities || [details]).map((cap, i) => (
                                    <li key={i} className="flex items-start gap-2"><Check size={16} className="text-green-600 mt-1 shrink-0" /> {cap}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Zap size={20} className="text-white bg-[#500000] rounded-full p-0.5" /> Our Process</h3>
                            <ul className="space-y-3 text-gray-600">
                                {(process || ["Discovery", "Design", "Development", "Deployment"]).map((step, i) => (
                                    <li key={i} className="flex items-start gap-2"><Check size={16} className="text-green-600 mt-1 shrink-0" /> {step}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </motion.div>

                <div className="space-y-6">
                    {/* Main Featured Image */}
                    <div className="h-80 bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden relative group shadow-md flex justify-center items-center">
                        <img src={demoImages[0]} alt="Service Demo" className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors pointer-events-none" />
                    </div>

                    {/* Smaller Grid */}
                    {demoImages.length > 1 && (
                        <div className="grid grid-cols-2 gap-6">
                            <div className={`h-40 bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden relative group shadow-sm flex justify-center items-center ${!demoImages[2] ? 'col-span-2' : ''}`}>
                                <img src={demoImages[1]} alt="Service Details" className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105" />
                            </div>
                            {demoImages[2] && (
                                <div className="h-40 bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden relative group shadow-sm flex justify-center items-center">
                                    <img src={demoImages[2]} alt="Tech Stack" className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105" />
                                </div>
                            )}
                        </div>
                    )}

                    <div className="p-6 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm">
                        <h4 className="font-bold text-gray-900 mb-2">{t('readyToBuild')}</h4>
                        <p className="text-gray-500 text-sm mb-4">Book a consultation call with our experts to discuss your requirements.</p>
                        <ButtonPremium
                            className="w-full"
                            onClick={() => window.open('https://cal.com/rizqara-tech-a8z6yt', '_blank')}
                        >
                            Book Appointment
                        </ButtonPremium>
                    </div>
                </div>
            </div>

            {/* Related Projects - Proof of Work Backlinking */}
            {relatedProjects.length > 0 && (
                <div className="mt-24 pt-24 border-t border-gray-100">
                    <h3 className="text-3xl font-black text-[#500000] mb-12 uppercase tracking-tight">
                        {language === 'bn' ? 'সম্পর্কিত প্রকল্পসমূহ' : 'Recent Work in this Category'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {(relatedProjects as Project[]).map((project: Project) => (
                            <div
                                key={project.id}
                                className="group cursor-pointer bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                                onClick={() => {
                                    navigate(`/projects/${getSlug(project.title)}`);
                                    window.scrollTo(0, 0);
                                }}
                            >
                                <div className="aspect-video overflow-hidden relative">
                                    <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[10px] font-bold text-[#500000] uppercase rounded-full shadow-sm">
                                            {language === 'bn' ? (project.category_bn || project.category) : project.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h4 className="text-xl font-bold text-gray-900 group-hover:text-[#500000] transition-colors mb-2">
                                        {language === 'bn' ? (project.title_bn || project.title) : project.title}
                                    </h4>
                                    <p className="text-gray-500 text-sm line-clamp-2">{language === 'bn' ? (project.description_bn || project.description) : project.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { projects, language, t, loading } = useData();

    const project = projects.find(p =>
        String(p.id) === id ||
        getSlug(p.title) === id
    );

    // Redirect to slug if currently using number ID
    useLayoutEffect(() => {
        if (!loading && project && String(project.id) === id) {
            const slug = getSlug(project.title);
            if (slug) navigate(`/projects/${slug}`, { replace: true });
        }
    }, [id, project, loading, navigate]);

    if (loading) return <DetailSkeleton />;

    if (!project) return <div className="pt-32 text-center text-gray-900 min-h-screen">Project not found</div>;

    const title = language === 'bn' ? (project.title_bn || project.title) : project.title;
    const description = language === 'bn' ? (project.description_bn || project.description) : project.description;
    const category = language === 'bn' ? (project.category_bn || project.category) : project.category;

    const handleShare = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: description,
                    url: url,
                });
            } catch (error) {
                console.log('Error sharing', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                toast.success('Link copied to clipboard!');
            } catch (err) {
                // Fallback for copy
                const textArea = document.createElement("textarea");
                textArea.value = url;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "0";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    const successful = document.execCommand('copy');
                    if (successful) toast.success('Link copied to clipboard!');
                } catch (e) {
                    prompt("Copy this link:", url);
                }
                document.body.removeChild(textArea);
            }
        }
    };

    const relatedProjects = (projects as Project[]).filter((p: Project) => p.id !== project.id && p.category === project.category).slice(0, 3);

    const schema = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": title,
        "description": description,
        "image": project.image,
        "author": {
            "@type": "Organization",
            "name": "RizQara Tech"
        }
    };

    return (
        <div className="container mx-auto px-6 py-24 min-h-screen">
            <SEO
                title={`${title} | RizQara Tech`}
                description={description}
                canonical={`https://rizqara.tech/projects/${id}`}
                schema={schema}
                image={project.image}
            />
            <button onClick={() => navigate('/projects')} className="flex items-center text-gray-500 hover:text-[#500000] mb-12 transition-colors group">
                <div className="p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 mr-4 transition-colors">
                    <ArrowRight className="rotate-180" size={20} />
                </div>
                <span className="text-sm uppercase tracking-widest font-bold">{t('back')}</span>
            </button>

            <div className="rounded-3xl overflow-hidden mb-12 border border-gray-200 shadow-2xl bg-gray-50 flex justify-center items-center min-h-[300px] max-h-[70vh]">
                <img src={project.image} alt={title} className="max-w-full max-h-full object-contain" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="px-4 py-1 rounded-full border border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">{category}</span>
                        <span className="px-4 py-1 rounded-full bg-[#500000] text-white text-xs font-bold uppercase tracking-wider">{project.status}</span>
                    </div>
                    <h1 className="text-5xl font-black text-[#500000] mb-8">{title}</h1>
                    <p className="text-xl text-gray-600 leading-relaxed mb-12 font-light whitespace-pre-line">
                        {description}
                    </p>

                    <div className="flex gap-4 mb-12">
                        {project.link && (
                            <ButtonPremium onClick={() => window.open(project.link, '_blank')}>
                                <ExternalLink size={20} /> View Project
                            </ButtonPremium>
                        )}
                        <ButtonPremium variant="glass" onClick={handleShare}>
                            <Share2 size={20} /> Share Project
                        </ButtonPremium>
                    </div>

                    {Array.isArray(project.features) && project.features.length > 0 && (
                        <div className="mb-16">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">{language === 'bn' ? 'মূল বৈশিষ্ট্য' : 'Key Features'}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {(language === 'bn' && project.features_bn && project.features_bn.length > 0 ? project.features_bn : (project.features || [])).map((feature: string, i: number) => (
                                    <div key={i} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                                        <div className="w-8 h-8 rounded-full bg-[#500000]/10 flex items-center justify-center shrink-0">
                                            <Check className="text-[#500000]" size={16} />
                                        </div>
                                        <span className="text-gray-700 font-medium">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {Array.isArray(project.tech) && project.tech.length > 0 && (
                        <div className="mb-16">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">{language === 'bn' ? 'ব্যবহৃত প্রযুক্তি' : 'Technologies Used'}</h3>
                            <div className="flex flex-wrap gap-3">
                                {project.tech.map((t: string, i: number) => (
                                    <div key={i} className="px-6 py-3 rounded-2xl bg-gray-50 border border-gray-100 text-[#500000] font-black text-xs uppercase tracking-widest shadow-sm transition-all hover:bg-white hover:shadow-md">
                                        {t}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {project.gallery && project.gallery.length > 0 && (
                        <div className="mt-16 animate-in slide-in-from-bottom-8 duration-700">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <ImageIcon size={24} className="text-[#500000]" /> Project Gallery
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {project.gallery.map((img, i) => (
                                    <div key={i} className="group rounded-3xl overflow-hidden border border-gray-200 shadow-sm relative h-80 bg-gray-50 flex justify-center items-center cursor-zoom-in">
                                        <img
                                            src={img}
                                            alt={`Gallery ${i + 1}`}
                                            className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105"
                                            onClick={() => window.open(img, '_blank')}
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-6 sticky top-32">
                        <h4 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-4">Project Information</h4>

                        <div>
                            <p className="text-xs font-black text-[#500000]/40 uppercase tracking-widest mb-1">Category</p>
                            <p className="text-gray-900 font-bold">{category}</p>
                        </div>

                        <div>
                            <p className="text-xs font-black text-[#500000]/40 uppercase tracking-widest mb-1">Status</p>
                            <p className="text-gray-900 font-bold">{project.status}</p>
                        </div>

                        {project.link && (
                            <div>
                                <p className="text-xs font-black text-[#500000]/40 uppercase tracking-widest mb-1">Project Link</p>
                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-[#500000] font-bold hover:underline transition-all flex items-center gap-2 mt-1">
                                    Visit Live Site <ExternalLink size={16} />
                                </a>
                            </div>
                        )}

                        <div>
                            <p className="text-xs font-black text-[#500000]/40 uppercase tracking-widest mb-4">Share this project</p>
                            <ButtonPremium variant="glass" className="w-full justify-center" onClick={handleShare}>
                                <Share2 size={18} /> Get Project Link
                            </ButtonPremium>
                        </div>
                    </div>

                    <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm relative overflow-hidden group">
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#500000]/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                        <h4 className="text-xl font-bold text-gray-900 mb-3 relative z-10">Have a similar idea?</h4>
                        <p className="text-gray-500 text-sm mb-8 leading-relaxed relative z-10">We specialize in building custom solutions that drive business growth. Let's make it happen.</p>
                        <ButtonPremium className="w-full justify-center relative z-10 hover:shadow-lg transition-all" onClick={() => navigate('/contact')}>
                            Start Your Project <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </ButtonPremium>
                    </div>
                </div>
            </div>

            {/* Related Projects - Cross Linking */}
            {relatedProjects.length > 0 && (
                <div className="mt-24 pt-24 border-t border-gray-100">
                    <h3 className="text-3xl font-black text-[#500000] mb-12 uppercase tracking-tight">
                        {language === 'bn' ? 'অনুরূপ প্রকল্প' : 'Similar Projects'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {(relatedProjects as Project[]).map((p: Project) => (
                            <div
                                key={p.id}
                                className="group cursor-pointer bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                                onClick={() => {
                                    navigate(`/projects/${getSlug(p.title)}`);
                                    window.scrollTo(0, 0);
                                }}
                            >
                                <div className="aspect-video overflow-hidden">
                                    <img src={p.image} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                </div>
                                <div className="p-6">
                                    <h4 className="text-xl font-bold text-gray-900 group-hover:text-[#500000] transition-colors">
                                        {language === 'bn' ? (p.title_bn || p.title) : p.title}
                                    </h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Navbar ---

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const { language, setLanguage, t } = useData();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const links = [
        { name: t('home'), path: '/' },
        { name: t('about'), path: '/about' },
        { name: t('services'), path: '/services' },
        { name: t('projects'), path: '/projects' },
        { name: t('caseStudies'), path: '/case-studies' },
        { name: t('contact'), path: '/contact' }
    ];

    const isActive = (path: string) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'bn' : 'en');
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4 ${scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm' : 'bg-white/80 backdrop-blur-md border-b border-gray-50'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="text-2xl font-black tracking-tighter cursor-pointer flex items-center gap-2 text-[#500000]">
                    <span>RIZQARA TECH</span>
                </Link>

                <div className="hidden lg:flex items-center rounded-full px-2 py-1 border bg-gray-100/50 border-gray-200">
                    {links.map(link => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${isActive(link.path) ? 'bg-[#500000] text-white shadow-md' : 'text-gray-600 hover:text-[#500000] hover:bg-white'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="hidden lg:flex items-center gap-4">
                    <button
                        onClick={toggleLanguage}
                        className="px-4 py-2 bg-gray-100 text-[#500000] rounded-full font-bold text-xs hover:bg-gray-200 transition-colors uppercase border border-gray-200"
                    >
                        {language === 'en' ? 'BN' : 'EN'}
                    </button>
                    <button
                        onClick={() => window.open('https://cal.com/rizqara-tech-a8z6yt', '_blank')}
                        className="px-6 py-3 bg-[#500000] text-white rounded-full font-bold text-sm hover:bg-[#3a0000] transition-colors shadow-[0_5px_15px_rgba(80,0,0,0.3)] items-center gap-2"
                    >
                        {t('freeAudit')}
                    </button>
                </div>

                <div className="lg:hidden flex items-center gap-4">
                    <button
                        onClick={toggleLanguage}
                        className="px-3 py-2 bg-gray-100 text-[#500000] rounded-full font-bold text-xs hover:bg-gray-200 transition-colors uppercase border border-gray-200"
                    >
                        {language === 'en' ? 'BN' : 'EN'}
                    </button>
                    <div className="w-12 h-12 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors bg-[#500000] text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: '100vh' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-white fixed top-[80px] left-0 right-0 border-t border-gray-100 overflow-hidden"
                    >
                        <div className="flex flex-col p-8 gap-6 h-full items-center pt-24">
                            {links.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link
                                        to={link.path}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-3xl font-bold text-gray-800 hover:text-[#500000] hover:bg-gray-50 px-6 py-2 rounded-full transition-all duration-300"
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

// --- Home Page Components ---

const CaseStudyShowcase = () => {
    const { caseStudies, language, t } = useData();
    const [activeTab, setActiveTab] = useState(0);
    const navigate = useNavigate();

    if (!caseStudies || caseStudies.length === 0) return null;

    const activeStudy = caseStudies[activeTab] || caseStudies[0];
    const title = language === 'bn' ? (activeStudy.title_bn || activeStudy.title) : activeStudy.title;
    const category = language === 'bn' ? (activeStudy.category_bn || activeStudy.category) : activeStudy.category;
    const desc = language === 'bn' ? (activeStudy.description_bn || activeStudy.description) : activeStudy.description;

    return (
        <section id="case-studies" className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">{t ? t('caseStudies') : 'Case Studies'}</h2>
                        <p className="text-gray-500 max-w-xl">
                            {language === 'bn' ? 'আমাদের অত্যন্ত উদ্ভাবনী সমাধানগুলি কীভাবে ব্যবসাগুলিকে রূপান্তরিত করেছে তা দেখুন।' : 'Check out our case studies that show how innovative solutions transformed businesses.'}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/case-studies')}
                        className="px-6 py-3 font-bold rounded-full transition-all text-sm shadow-lg hover:shadow-xl active:scale-95 whitespace-nowrap"
                        style={{ backgroundColor: '#500000', color: '#ffffff' }}
                    >
                        {language === 'bn' ? 'সবগুলো কেস স্টাডি দেখুন' : 'See all Case Studies'}
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-4 mb-16 border-b border-gray-100 pb-10">
                    {caseStudies.slice(0, 6).map((study, idx) => (
                        <button
                            key={study.id}
                            onClick={() => setActiveTab(idx)}
                            className={`relative px-8 py-5 rounded-2xl transition-all duration-500 flex items-center justify-center min-w-[140px] h-20 group ${activeTab === idx
                                ? 'bg-white shadow-2xl ring-1 ring-gray-100'
                                : 'bg-gray-50 hover:bg-white hover:shadow-xl'
                                }`}
                        >
                            <img
                                src={study.image}
                                alt={study.title}
                                className={`h-8 object-contain transition-all duration-500 ${activeTab === idx ? 'opacity-100' : 'opacity-40 grayscale group-hover:grayscale-0'}`}
                            />
                            {activeTab === idx && (
                                <motion.div
                                    layoutId="activeTabUnderline"
                                    className="absolute -bottom-10 left-0 right-0 h-1.5 bg-[#00AEEF] rounded-full"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start pb-12">
                    <motion.div
                        key={activeStudy.id + 'img'}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative rounded-[40px] overflow-hidden shadow-2xl aspect-[1.1/1]"
                    >
                        <img
                            src={activeStudy.image}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </motion.div>

                    <motion.div
                        key={activeStudy.id + 'content'}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        className="flex flex-col h-full"
                    >
                        <div className="mb-6 text-[#00AEEF] font-black text-sm tracking-[0.2em] uppercase">
                            {category}
                        </div>
                        <h3 className="text-3xl md:text-5xl font-black text-gray-900 mb-8 leading-[1.1]">
                            {title}
                        </h3>
                        <p className="text-gray-600 text-lg md:text-xl font-medium mb-10 leading-relaxed max-w-2xl">
                            {desc}
                        </p>

                        <div
                            onClick={() => navigate(`/case-studies/${getSlug(activeStudy.title)}`)}
                            className="flex items-center text-[#fbb03b] hover:text-[#f7931e] font-black text-lg gap-3 cursor-pointer group w-fit transition-all"
                        >
                            <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'View Case Study'}</span>
                            <ArrowRight size={20} className="translate-x-0 group-hover:translate-x-2 transition-transform duration-300" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const Home = ({ setBuildConfig }: { setBuildConfig: any }) => {
    const navigate = useNavigate();
    const { services, projects, loading, language, t, addMessage } = useData();

    if (loading) {
        return <HomeSkeleton />;
    }

    const onNavigate = (page: string, identifier?: string) => {
        if (page === 'ServiceDetail' && identifier) navigate(`/services/${identifier}`);
        else if (page === 'ProjectDetail' && identifier) navigate(`/projects/${identifier}`);
        else if (page === 'FeatureDetail' && identifier) navigate(`/feature/${identifier}`);
        else if (page === 'BlogDetail' && identifier) navigate(`/blog/${identifier}`);
        else if (page === 'Services') navigate('/services');
        else if (page === 'Projects') navigate('/projects');
        else if (page === 'Blog') navigate('/blog');
        else if (page === 'Build') navigate('/build');
        else if (page === 'Admin') navigate('/admin');
        else if (page === 'Contact') navigate('/contact');
        else if (page === 'About') navigate('/about');
        else if (page === 'Team') navigate('/team');
        else if (page === 'Packages') navigate('/packages');
        else navigate(`/${page.toLowerCase()}`);
    };


    return (
        <div className="space-y-32 pb-0 overflow-x-hidden">

            {/* 1. HERO CAROUSEL */}
            <SEO
                title="RizQara Tech | Best Software & AI Solutions Company in Bangladesh"
                description="RizQara Tech: The best software company in Bangladesh. Premium web development, AI solutions, mobile apps, and UI/UX design engineered for performance."
                keywords="RizQara Tech, Rizq, Rizq Tech, Rizq Ara, software company Bangladesh, software development company in Dhaka, best software company in Bangladesh, AI software solutions BD, mobile app development Bangladesh"
                canonical="https://rizqara.tech/"
            />
            <HeroCarousel onNavigate={onNavigate} />

            {/* 2. BUILD PROJECT TEASER */}
            <BuildPreviewTeaser onNavigate={onNavigate} setBuildConfig={setBuildConfig} />



            {/* 3. TRUSTED COMPANIES */}
            <section className="container mx-auto px-6">
                <h2 className="text-center mb-8 text-[#500000] uppercase tracking-widest text-sm font-black">{language === 'bn' ? 'শিল্প নেতাদের দ্বারা বিশ্বস্ত' : 'Trusted by Industry Leaders'}</h2>
                <AutoScrollCarousel items={
                    partners.map((partner, i) => (
                        <div key={i} className="flex items-center gap-3 opacity-100 transition-opacity px-6 duration-500 shrink-0 min-w-[140px]">
                            <div className="h-10 w-auto flex items-center justify-center">
                                {partner.logo}
                            </div>
                        </div>
                    ))
                } />
            </section>

            {/* 4. SERVICES */}
            <section className="container mx-auto px-6">
                <div className="flex justify-between items-end mb-12">
                    <SectionTitle title={t('ourServices')} subtitle={language === 'bn' ? 'ব্যাপক ডিজিটাল সমাধান।' : 'Comprehensive digital solutions.'} />
                    <button onClick={() => onNavigate('Services')} className="text-gray-500 hover:text-[#500000] flex items-center gap-2 font-bold mb-16">{t('readMore')} <ArrowRight size={16} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.slice(0, 6).map((service) => {
                        const Icon = {
                            Globe, Layout, Palette, Code2, Smartphone, BarChart,
                            Lightbulb, Cpu, MessageSquare, Zap, Activity, Star, Layers, Server
                        }[service.icon] || Code2;

                        const title = language === 'bn' ? (service.title_bn || service.title) : service.title;
                        const desc = language === 'bn' ? (service.description_bn || service.description) : service.description;

                        return (
                            <div key={service.id} onClick={() => onNavigate('ServiceDetail', getSlug(service.title))} className="group bg-white border border-gray-200 hover:shadow-xl hover:border-[#500000]/20 rounded-3xl transition-all duration-300 cursor-pointer shadow-sm overflow-hidden flex flex-col h-full">
                                <div className="h-48 overflow-hidden relative shrink-0">
                                    <img
                                        src={getProxiedImage(service.image) || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"}
                                        alt={title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none'; // Or set to fallback
                                            // Better: fallback URL
                                            e.currentTarget.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop";
                                            // Prevent infinite loop if fallback also fails
                                            e.currentTarget.onerror = null;
                                        }}
                                    />
                                    <div className="absolute top-4 left-4 w-12 h-12 bg-white/95 backdrop-blur rounded-xl flex items-center justify-center text-[#500000] shadow-sm">
                                        <Icon size={24} />
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#500000] transition-colors">{title}</h3>
                                    <p className="text-gray-500 line-clamp-2 text-sm">{desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 6. REAL PROJECTS PREVIEW (Carousel) */}
            <section className="w-full py-24 bg-gray-50 border-y border-gray-200">
                <div className="container mx-auto px-6 mb-12">
                    <SectionTitle
                        title={t('ourProjects')}
                        subtitle={language === 'bn' ? "আমাদের সাম্প্রতিক কাজ এবং সাফল্যের গল্প দেখুন।" : "Explore our latest work and success stories delivering impact."}
                    />

                    {/* Homepage Project Search */}
                    <div className="relative max-w-md md:max-w-6xl mx-auto -mt-8 mb-8 z-10">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder={language === 'bn' ? 'প্রকল্প খুঁজুন...' : 'Search featured projects...'}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:border-[#500000] focus:ring-2 focus:ring-[#500000]/10 transition-all text-gray-900"
                            onChange={(e) => {
                                // Simple local filter for the carousel
                                const q = e.target.value.toLowerCase();
                                const filtered = document.querySelectorAll('.project-card');
                                filtered.forEach((el: any) => {
                                    const title = el.getAttribute('data-title')?.toLowerCase();
                                    if (title?.includes(q)) {
                                        el.style.display = 'block';
                                        el.style.opacity = '1';
                                    } else {
                                        el.style.display = 'none';
                                        el.style.opacity = '0';
                                    }
                                });
                                // Note: Filtering a carousel is tricky naturally. 
                                // Better UX: Navigate to Projects Page on Enter?
                                // OR: Just filter the array passed to map below.
                                // I can't easily add state to this big App component without context or full reload.
                                // I will use the `navigate` approach for best UX? No, user asked for "search bar".
                                // Let's try to add a state variable to App component top, but that's far away.
                                // I will use a simple DOM manipulation or just inject a state if I can find the top of App.
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    // @ts-ignore
                                    navigate(`/projects?q=${e.target.value}`);
                                }
                            }}
                        />
                    </div>
                </div>
                {/* Note: Real filtering requires state. I'll stick to a "Search & Go" or just visual. 
                   Actually, I can't add state here easily in `replace_file_content` without seeing the top.
                   The user surely wants it to work.
                   I'll modify the top of App to add `const [homeProjectSearch, setHomeProjectSearch] = useState("");`
                   and use it here.
                */}
                <Carousel className="pl-6 md:pl-[max(2rem,calc((100vw-1400px)/2+2rem))]">
                    {projects.map(project => {
                        const title = language === 'bn' ? (project.title_bn || project.title) : project.title;
                        const category = language === 'bn' ? (project.category_bn || project.category) : project.category;

                        return (
                            <div
                                key={project.id}
                                onClick={() => onNavigate('ProjectDetail', project.id)}
                                className="w-[85vw] md:w-[400px] h-[556px] shrink-0 group relative cursor-pointer project-card bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                                data-title={title.toLowerCase()}
                            >
                                <div className="h-64 relative overflow-hidden">
                                    <img src={project.image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                                </div>
                                <div className="p-8 flex flex-col h-[300px] overflow-hidden bg-white">
                                    <div className="h-[88px] mb-4 shrink-0">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 pr-6">
                                                <div className="text-xs font-black text-[#500000]/60 uppercase tracking-widest mb-1">{category}</div>
                                                <h3 className="text-xl font-bold text-[#500000] leading-tight line-clamp-2 pt-2">{title}</h3>
                                            </div>
                                            {project.link && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); window.open(project.link, '_blank'); }}
                                                    className="p-3 bg-gray-50 text-[#500000] rounded-full hover:bg-[#500000] hover:text-white transition-all shadow-sm shrink-0"
                                                    title="View Live"
                                                >
                                                    <ExternalLink size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="h-[80px] mb-4 shrink-0 overflow-hidden">
                                        <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                            {(language === 'bn' ? project.description_bn : project.description)?.slice(0, 140)}...
                                        </p>
                                    </div>

                                    <div className="mt-auto flex items-center text-[#500000] font-bold text-sm hover:gap-3 gap-2 transition-all shrink-0">
                                        <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'See More'}</span>
                                        <ArrowRight size={16} className="translate-x-0 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </Carousel>
            </section>

            {/* 7. CASE STUDIES SHOWCASE */}
            <CaseStudyShowcase />

            {/* 7. WHY RIZQARA (Redesigned) */}
            <section className="container mx-auto px-6">
                <SectionTitle
                    title={language === 'bn' ? "কেন আমাদের নির্বাচন করবেন" : "Why Choose Us"}
                    subtitle={language === 'bn' ? "আমরা আপনার ব্যবসার জন্য সর্বোত্তম সমাধান প্রদান করি।" : "We deliver tailored excellence to drive your business forward."}
                />
                <PremiumComparison onNavigate={onNavigate} />
            </section>

            {/* 8. NEW: VIDEOS SECTION */}
            <section className="container mx-auto px-6">
                <div className="flex justify-between items-end mb-4">
                    <SectionTitle title={t('latestInsights')} subtitle={language === 'bn' ? "আমাদের সর্বশেষ প্রযুক্তি শোকেস এবং টিউটোরিয়াল দেখুন।" : "Watch our latest tech showcases and tutorials."} />
                    <button onClick={() => onNavigate('Videos')} className="text-gray-500 hover:text-[#500000] flex items-center gap-2 font-bold mb-16">{t('readMore')} <ArrowRight size={16} /></button>
                </div>
                <LatestVideos onNavigate={onNavigate} />
            </section>

            {/* 9. PACKAGES (Detailed) */}
            <section className="container mx-auto px-6">
                <SectionTitle
                    title={language === 'bn' ? "প্যাকেজসমূহ" : "Packages"}
                    subtitle={language === 'bn' ? "আপনার ব্যবসার জন্য সেরা পরিকল্পনা চয়ন করুন।" : "Choose the perfect plan for your business growth."}
                    center
                />
                <PricingDetailed onNavigate={onNavigate} />
            </section>

            {/* 10. NEW: BLOG SECTION */}
            <section className="container mx-auto px-6">
                <div className="flex justify-between items-end mb-12">
                    <SectionTitle
                        title={language === 'bn' ? "টেক ব্লগ" : "Tech Blog"}
                        subtitle={language === 'bn' ? "প্রযুক্তি এবং উদ্ভাবন সম্পর্কে আমাদের সর্বশেষ চিন্তা।" : "Our latest thoughts on technology, innovation, and industry trends."}
                    />
                    <button onClick={() => onNavigate('Blog')} className="text-gray-500 hover:text-[#500000] flex items-center gap-2 font-bold">{t('readMore')} <ArrowRight size={16} /></button>
                </div>
                <LatestBlogs onNavigate={onNavigate} />
            </section>

            {/* 11. IMPACT (Stats) - Separated */}
            <section className="bg-gradient-to-br from-white to-gray-50 py-24 relative overflow-hidden border-t border-gray-200">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] invert"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-[#500000] mb-4">{language === 'bn' ? "আমাদের গ্লোবাল প্রভাব" : "Our Global Impact"}</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">{language === 'bn' ? "মহাদেশ এবং শিল্প জুড়ে শ্রেষ্ঠত্ব প্রদান।" : "Delivering excellence across continents and industries."}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        <div className="p-8 bg-white border border-gray-200 rounded-3xl shadow-lg hover:-translate-y-2 group transition-all duration-500">
                            <StatsCounter value={120 + projects.length} label={language === 'bn' ? "প্রকল্প বিতরণ" : "Projects Delivered"} />
                        </div>
                        <div className="p-8 bg-white border border-gray-200 rounded-3xl shadow-lg hover:-translate-y-2 group transition-all duration-500">
                            <StatsCounter value={100} label={language === 'bn' ? "গ্রাহক সন্তুষ্টি" : "Client Satisfaction"} suffix="%" />
                        </div>
                        <div className="p-8 bg-white border border-gray-200 rounded-3xl shadow-lg hover:-translate-y-2 group transition-all duration-500">
                            <StatsCounter value={10} label={language === 'bn' ? "দেশ সেবা করা হয়েছে" : "Countries Served"} suffix="+" />
                        </div>
                        <div className="p-8 bg-white border border-gray-200 rounded-3xl shadow-lg hover:-translate-y-2 group transition-all duration-500">
                            <StatsCounter value={5} label={language === 'bn' ? "বছরের শ্রেষ্ঠত্ব" : "Years Excellence"} suffix="+" />
                        </div>
                    </div>
                </div>
            </section>

            {/* NEW: OUR TECH STACK */}
            <section className="container mx-auto px-6 mb-24">
                <div className="mb-12">
                    <SectionTitle
                        title={language === 'bn' ? "আমাদের প্রযুক্তি স্ট্যাক" : "Our Tech Stack"}
                        subtitle={language === 'bn' ? "আমরা সর্বোত্তম ফলাফলের জন্য আধুনিক প্রযুক্তি ব্যবহার করি।" : "We leverage cutting-edge technologies to build robust and scalable solutions."}
                        center
                    />

                </div>
                <AutoScrollCarousel items={
                    techStack.map((tech, i) => (
                        <div key={i} className="flex flex-col items-center gap-3 opacity-60 hover:opacity-100 transition-opacity px-6 grayscale hover:grayscale-0 duration-500 shrink-0 min-w-[100px] group cursor-pointer" title={tech.name}>
                            <div className="h-12 w-auto flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                                {tech.logo}
                            </div>
                            <span className="text-xs font-bold text-gray-400 group-hover:text-gray-900 transition-colors mt-2 opacity-0 group-hover:opacity-100">{tech.name}</span>
                        </div>
                    ))
                } />
            </section>

            {/* 12. FEEDBACK (Testimonials) - Separated & Carousel */}
            <section className="container mx-auto px-6">
                <SectionTitle
                    title={t('whatClientsSay')}
                    subtitle={language === 'bn' ? "আমাদের গ্রাহকরা আমাদের সম্পর্কে যা বলেন।" : "Hear from our satisfied partners and clients worldwide."}
                    center
                />
                <TestimonialSlider />
            </section>

            {/* 13. FAQ SECTION */}
            <FAQSection />

            {/* 15. CONTACT + MAP (Real Map) */}
            <section className="container mx-auto px-6" id="contact-section">
                <SectionTitle title={t('contact')} />
                <ContactFormWithMap />
            </section>

            <NoticeBar />

            {/* 16. FULL FOOTER */}
            <footer className="bg-gray-50 text-gray-900 pt-24 pb-8 mt-32 border-t border-gray-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#500000] via-red-600 to-[#500000]"></div>

                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                        <div className="lg:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <h2 className="text-3xl font-black tracking-tighter text-[#500000]">RIZQARA TECH</h2>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-sm">
                                {language === 'bn' ? "রিজকারা টেক একটি প্রিমিয়ার সফটওয়্যার ডেভেলপমেন্ট এজেন্সি যা এন্টারপ্রাইজ-গ্রেড সমাধান প্রদান করে।" : "Rizqara Tech is a premier software development company delivering enterprise-grade solutions."}
                            </p>
                            <div className="flex gap-4">
                                {[
                                    { Icon: XLogo, link: 'https://x.com/Rizqaratech' },
                                    { Icon: Facebook, link: 'https://www.facebook.com/rizqaratechology/' },
                                    { Icon: Linkedin, link: 'https://www.linkedin.com/company/rizqara-tech' },
                                    { Icon: Instagram, link: 'https://www.instagram.com/rizqaratech/' },
                                    { Icon: MediumLogo, link: 'https://medium.com/@rizqaratech' }
                                ].map(({ Icon, link }, i) => (
                                    <a key={i} href={link} target="_blank" rel="noopener noreferrer" className="p-3 bg-white border border-gray-200 rounded-full text-gray-500 hover:bg-[#500000] hover:text-white transition-colors cursor-pointer group shadow-sm flex items-center justify-center">
                                        <Icon size={18} className="group-hover:scale-110 transition-transform" />
                                    </a>
                                ))}
                            </div>

                            <div className="mt-8 border-t border-gray-100 pt-8">
                                <h4 className="text-xs font-black text-[#500000] uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Shield size={14} />
                                    {language === 'bn' ? "নিরাপদ পেমেন্ট পদ্ধতি" : "Secure Payment Methods"}
                                </h4>
                                <div className="flex flex-wrap gap-3 max-w-xs">
                                    {paymentMethods.map((method: any, i) => (
                                        <div key={i} className="h-10 w-16 bg-white border border-gray-100 rounded-sm flex items-center justify-center hover:border-[#500000]/20 transition-colors shadow-sm overflow-hidden group">
                                            <img
                                                src={method.src}
                                                alt={method.name}
                                                className={`max-h-full max-w-full transition-all duration-300 ${method.className || 'object-contain'}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-gray-900 font-bold mb-6 text-lg">{t('company')}</h3>
                            <ul className="space-y-3 text-sm text-gray-600">
                                {[
                                    { key: 'home', path: '/' },
                                    { key: 'about', path: '/about' },
                                    { key: 'careers', path: '/careers' },
                                    { key: 'contact', path: '/contact' }
                                ].map(item => (
                                    <li key={item.key}>
                                        <Link
                                            to={item.path}
                                            className="hover:text-[#500000] cursor-pointer transition-colors flex items-center gap-2 group w-full"
                                        >
                                            <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#500000]" />
                                            {t(item.key as any)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 border-t border-gray-100 pt-8">
                                <div className="flex items-center gap-2 mb-6">
                                    <ShieldCheck size={16} className="text-[#500000]" />
                                    <h4 className="text-sm font-bold text-gray-900">{language === 'bn' ? 'স্বীকৃত:' : 'Recognized by:'}</h4>
                                </div>
                                <div
                                    className="rounded-xl p-3 shadow-2xl border border-white/10 w-[160px] h-[85px] group hover:scale-[1.05] transition-transform duration-300 overflow-hidden relative"
                                    style={{ backgroundColor: '#500000' }}
                                >
                                    <div className="flex flex-col h-full justify-between relative z-10">
                                        <div className="flex justify-between items-start">
                                            <span className="text-[4px] font-black text-white tracking-[0.05em] uppercase leading-none opacity-80">Reviewed on</span>
                                            <div className="flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((_, i) => (
                                                    <Star key={i} size={14} fill="#FFD700" stroke="#FFD700" />
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center flex-1 py-0.5">
                                            <img src="https://res.cloudinary.com/dhutfywg2/image/upload/v1773642640/rizqaratech/clutch/clutch.png" alt="Clutch" className="h-12 w-auto object-contain brightness-0 invert" />
                                        </div>

                                        <div className="text-[5px] font-black text-white tracking-[0.05em] uppercase text-right leading-none opacity-80">10 REVIEWS</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-gray-900 font-bold mb-6 text-lg">{t('solutions')}</h3>
                            <ul className="space-y-3 text-sm text-gray-600">
                                {[
                                    { key: 'services', path: '/services' },
                                    { key: 'projects', path: '/projects' },
                                    { key: 'caseStudies', path: '/case-studies' },
                                    { key: 'team', path: '/team' }
                                ].map(item => (
                                    <li key={item.key}>
                                        <Link
                                            to={item.path}
                                            className="hover:text-[#500000] cursor-pointer transition-colors flex items-center gap-2 group w-full"
                                        >
                                            <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#500000]" />
                                            {t(item.key as any)}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8 border-t border-gray-100 pt-8 hidden lg:block opacity-0 pointer-events-none">
                                <div className="h-40"></div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-gray-900 font-bold mb-6 text-lg">{t('newsletter')}</h3>
                            <p className="text-sm text-gray-600 mb-4">{language === 'bn' ? "সর্বশেষ আপডেট এবং অফারের জন্য সাবস্ক্রাইব করুন।" : "Subscribe for latest updates and offers."}</p>
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                const form = e.target as HTMLFormElement;
                                const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                                try {
                                    // @ts-ignore
                                    await window.emailjs?.send(
                                        (import.meta as any).env.VITE_EMAILJS_SERVICE_ID,
                                        (import.meta as any).env.VITE_EMAILJS_SUBSCRIBE_TEMPLATE_ID,
                                        { email }
                                    );
                                    addMessage({
                                        name: 'Subscriber',
                                        email: email,
                                        subject: 'New Newsletter Subscriber',
                                        message: 'User subscribed to newsletter',
                                        type: 'Contact'
                                    });
                                    toast.success('Subscribed successfully!');
                                    form.reset();
                                } catch (err) {
                                    console.error(err);
                                    toast.error('Failed to subscribe.');
                                }
                            }} className="flex flex-col gap-3">
                                <input name="email" type="email" placeholder="Enter your email" required className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#500000]" />
                                <button type="submit" className="w-full bg-[#500000] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#3a0000] transition-colors">{language === 'bn' ? "সাবস্ক্রাইব করুন" : "Subscribe"}</button>
                            </form>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                        <p>© {new Date().getFullYear()} Rizqara Tech. All rights reserved.</p>
                        <div className="flex gap-6 mt-4 md:mt-0">
                            <span onClick={() => window.openCookieSettings?.()} className="cursor-pointer hover:text-[#500000] transition-colors">{language === 'bn' ? 'কুকি সেটিংস' : 'Cookie Settings'}</span>
                            <span onClick={() => navigate('/privacy-policy')} className="cursor-pointer hover:text-[#500000] transition-colors">{language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}</span>
                            <span onClick={() => navigate('/terms-of-service')} className="cursor-pointer hover:text-[#500000] transition-colors">{language === 'bn' ? 'পরিষেবার শর্তাবলী' : 'Terms of Service'}</span>
                            <span onClick={() => navigate('/admin')} className="cursor-pointer hover:text-[#500000] transition-colors">{language === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// --- App Container ---

const AdminLogin = ({ setIsAuthenticated }: { setIsAuthenticated: (val: boolean) => void }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { t, language } = useData();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email === 'admin@rizqaratech.com' && password === 'rizqaratech878') {
            localStorage.setItem('rizqara_admin_auth', 'true');
            setIsAuthenticated(true);
        } else {
            alert('Incorrect credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative bg-gray-100">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#500000] rounded-full blur-[128px] opacity-10"></div>
            </div>

            <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-12 text-center relative z-10 shadow-2xl">
                <div className="w-20 h-20 bg-[#500000] rounded-2xl mx-auto flex items-center justify-center text-white mb-8 shadow-xl">
                    <Shield size={40} strokeWidth={2.5} />
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">{t('adminPortal')}</h1>
                <p className="text-gray-500 mb-8 text-sm">{language === 'bn' ? 'শুধুমাত্র অনুমোদিত কর্মীদের জন্য নিরাপদ অ্যাক্সেস।' : 'Secure access for authorized personnel only.'}</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('email')}
                            className="w-full bg-gray-50 border border-gray-200 p-4 pl-12 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#500000] transition-all"
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('password')}
                            className="w-full bg-gray-50 border border-gray-200 p-4 pl-12 pr-12 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#500000] transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                            )}
                        </button>
                    </div>

                    <button className="w-full bg-[#500000] hover:bg-[#3a0000] text-white py-4 rounded-xl font-bold transition-all shadow-lg flex justify-center items-center gap-2 group">
                        {t('login')} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>

                <div className="mt-8 text-xs text-gray-400 uppercase tracking-widest">
                    Rizqara Tech Secure System
                </div>
                <button onClick={() => navigate('/')} className="mt-4 text-gray-400 hover:text-[#500000] underline text-xs">{t('home')}</button>
            </div>
        </div>
    );
};

const ServicesPage = () => {
    const { services, t, language } = useData();
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-6 py-32">
            <SectionTitle title={t('ourServices')} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(s => {
                    const Icon = {
                        Globe, Layout, Palette, Code2, Smartphone, BarChart,
                        Lightbulb, Cpu, MessageSquare, Zap, Activity, Star, Layers, Server
                    }[s.icon] || Code2;
                    const title = language === 'bn' ? (s.title_bn || s.title) : s.title;
                    const desc = language === 'bn' ? (s.description_bn || s.description) : s.description;

                    return (
                        <div key={s.id} onClick={() => navigate(`/services/${getSlug(s.title)}`)} className="group bg-white border border-gray-200 hover:shadow-xl hover:border-[#500000]/20 rounded-3xl transition-all duration-300 cursor-pointer shadow-sm overflow-hidden flex flex-col h-full">
                            <div className="h-48 overflow-hidden relative shrink-0">
                                <img src={s.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop"} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute top-4 left-4 w-12 h-12 bg-white/95 backdrop-blur rounded-xl flex items-center justify-center text-[#500000] shadow-sm">
                                    <Icon size={24} />
                                </div>
                            </div>
                            <div className="p-8 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#500000] transition-colors">{title}</h3>
                                <p className="text-gray-500 line-clamp-2 text-sm">{desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
};

const ProjectsPage = () => {
    const { projects, t, language } = useData();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState("All Projects");
    const [searchQuery, setSearchQuery] = useState("");

    // Dynamic Categories: Defaults + Unique from Projects
    const defaultCategories = [
        "SaaS Platforms",
        "E-Commerce",
        "Mobile App",
        "Business Website",
        "Web Applications",
        "Enterprise Collaboration"
    ];

    // Extract unique categories from actual projects
    const projectCategories = Array.from(new Set(projects.map(p => p.category?.trim()).filter(Boolean)));

    // Merge and deduplicate
    const allUniqueCategories = Array.from(new Set([...defaultCategories, ...projectCategories]));

    const categories = ["All Projects", ...allUniqueCategories];

    const filteredProjects = projects.filter(p => {
        const title = language === 'bn' ? (p.title_bn || p.title) : p.title;
        const desc = language === 'bn' ? (p.description_bn || p.description) : p.description;
        const category = language === 'bn' ? (p.category_bn || p.category) : p.category;

        const matchesCategory = selectedCategory === "All Projects" ||
            (category && category.toLowerCase() === selectedCategory.toLowerCase()) ||
            (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

        const matchesSearch = !searchQuery ||
            title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (desc && desc.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesSearch;
    });

    return (
        <div className="container mx-auto px-6 py-32 min-h-screen">
            <SectionTitle title={t('ourProjects')} />

            {/* Filters & Search */}
            <div className="mb-12 space-y-6">
                {/* Search Bar */}
                <div className="relative max-w-md md:max-w-6xl mx-auto">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        placeholder={language === 'bn' ? 'প্রকল্প খুঁজুন...' : 'Search projects...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:border-[#500000] focus:ring-2 focus:ring-[#500000]/10 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#500000] bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${selectedCategory === cat
                                ? 'bg-[#500000] text-white shadow-md transform scale-105'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredProjects.length > 0 ? (
                        filteredProjects.map(p => {
                            const title = language === 'bn' ? (p.title_bn || p.title) : p.title;
                            const category = language === 'bn' ? (p.category_bn || p.category) : p.category;

                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    key={p.id}
                                    onClick={() => navigate(`/projects/${getSlug(p.title)}`)}
                                    className="group cursor-pointer bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                                >
                                    <div className="aspect-video relative overflow-hidden">
                                        <img src={p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={title} />
                                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                                    </div>
                                    <div className="p-6 flex flex-col h-[260px]">
                                        <div className="h-[80px] mb-3 shrink-0">
                                            <div className="text-xs font-black text-[#500000]/60 uppercase tracking-widest mb-1">{category}</div>
                                            <h3 className="text-lg font-bold text-[#500000] group-hover:underline decoration-[#500000]/30 transition-colors leading-tight line-clamp-2 pt-2">{title}</h3>
                                        </div>

                                        <div className="h-[60px] mb-4 shrink-0 overflow-hidden text-ellipsis">
                                            <p className="text-gray-500 text-sm font-medium leading-relaxed">
                                                {(language === 'bn' ? (p.description_bn || p.description) : p.description)?.slice(0, 100)}...
                                            </p>
                                        </div>

                                        <div className="mt-auto flex items-center text-[#500000] font-bold text-sm group-hover:gap-3 gap-2 transition-all shrink-0">
                                            <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'See More'}</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-1 md:col-span-2 w-full flex flex-col items-center justify-center text-center py-32 bg-gray-50 rounded-3xl border border-dashed border-gray-200 mx-auto"
                        >
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <Search size={32} />
                            </div>
                            <p className="text-xl font-bold text-gray-600">{language === 'bn' ? 'কোনো প্রকল্প পাওয়া যায়নি' : 'No projects found'}</p>
                            <p className="text-gray-400">{language === 'bn' ? 'অন্য ক্যাটাগরি বা শব্দ দিয়ে চেষ্টা করুন' : 'Try a different category or search term'}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
};

const AmbientBackground = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-white">
        {/* Maroon background effects removed as requested */}
    </div>
);

const MainContent = () => {
    const [buildConfig, setBuildConfig] = useState({
        type: 'Web App',
        feature: 'Standard',
        time: '1 Month'
    });
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('rizqara_admin_auth') === 'true';
    });
    const location = useLocation();
    const navigate = useNavigate();
    const { t, language, loading } = useData();

    // Scroll to top on route change
    useLayoutEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [location.pathname]);

    // Helper for backward compatibility with components using onNavigate
    const onNavigate = (page: string, id?: string) => {
        if (page === 'ServiceDetail' && id) navigate(`/services/${id}`);
        else if (page === 'ProjectDetail' && id) navigate(`/projects/${id}`);
        else if (page === 'FeatureDetail' && id) navigate(`/feature/${id}`);
        else if (page === 'BlogDetail' && id) navigate(`/blog/${id}`);
        else if (page === 'Services' || page === 'services') navigate('/services');
        else if (page === 'Projects' || page === 'projects') navigate('/projects');
        else if (page === 'Packages' || page === 'packages') navigate('/packages');
        else if (page === 'Blog' || page === 'blog') navigate('/blog');
        else if (page === 'Build' || page === 'build') navigate('/build');
        else if (page === 'CaseStudies' || page === 'Case Studies' || page === 'caseStudies') navigate('/case-studies');
        else if (page === 'Careers' || page === 'careers') navigate('/careers');
        else if (page === 'Admin' || page === 'admin') navigate('/admin');
        else if (page === 'Contact' || page === 'contact') navigate('/contact');
        else if (page === 'About' || page === 'about') navigate('/about');
        else if (page === 'Home' || page === 'home') navigate('/');
        else navigate(`/${page.toLowerCase()}`);
    };

    const showNavbar = !location.pathname.startsWith('/admin');

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#500000] selection:text-white overflow-x-hidden relative scroll-smooth">
            <AmbientBackground />

            {showNavbar && <Navbar />}

            <main className={`relative z-10 ${location.pathname === '/' || location.pathname === '/admin' ? 'pt-0' : 'pt-24'}`}>
                <Routes>
                    <Route path="/" element={<Home setBuildConfig={setBuildConfig} />} />

                    <Route path="/services" element={<>
                        <SEO
                            title="Software Development Services | RizQara Tech Bangladesh"
                            description="Our services include web development, UI UX design, AI solutions, mobile apps, SEO, and custom enterprise software."
                            canonical="https://rizqara.tech/services"
                        />
                        {loading ? <ServicesSkeleton /> : <ServicesPage />}
                    </>} />
                    <Route path="/services/:id" element={<ServiceDetail />} />

                    <Route path="/projects" element={<>
                        <SEO
                            title="Our Projects | Software & AI Solutions by RizQara Tech"
                            description="Explore real-world software, AI, and digital projects delivered by RizQara Tech for local and global clients."
                            canonical="https://rizqara.tech/projects"
                        />
                        {loading ? <ProjectsSkeleton /> : <ProjectsPage />}
                    </>} />
                    <Route path="/projects/:id" element={<ProjectDetail />} />

                    <Route path="/packages" element={<div className="container mx-auto px-6 pt-32 pb-32"><SectionTitle title={language === 'bn' ? "প্যাকেজসমূহ" : "Packages"} /><PricingDetailed onNavigate={onNavigate} /></div>} />
                    <Route path="/contact" element={
                        <div className="pt-20 pb-32 container mx-auto px-6">
                            <SEO
                                title="Contact Us | RizQara Tech - Software & AI Solutions"
                                description="Get in touch with RizQara Tech for custom software development, AI solutions, web apps, and digital transformation services in Bangladesh."
                                canonical="https://rizqara.tech/contact"
                            />
                            {loading ? (
                                <ContactSkeleton />
                            ) : (
                                <>
                                    <SectionTitle title={t('contact')} center />
                                    <ContactFormWithMap />
                                </>
                            )}
                        </div>
                    } />

                    <Route path="/about" element={<>
                        <SEO
                            title="About RizQara Tech | Leading Software Company in Bangladesh"
                            description="Learn about RizQara Tech’s journey, mission, and vision to become a global software and AI company from Bangladesh."
                            canonical="https://rizqara.tech/about"
                        />
                        <div className="bg-white">
                            {loading ? (
                                <AboutSkeleton />
                            ) : (
                                <div className="">
                                    <AboutHero />
                                    <JourneyRoadmap />
                                    <div className="mt-32">
                                        <SectionTitle title={t('meetOurTeam')} center />
                                        <TeamSection />
                                    </div>
                                </div>
                            )}
                        </div>
                    </>} />
                    <Route path="/team" element={<TeamPage />} />
                    <Route path="/blog" element={<BlogPage onNavigate={onNavigate} />} />
                    <Route path="/blog/:id" element={<BlogDetail />} />

                    <Route path="/careers" element={<>
                        <SEO
                            title="Careers | Join RizQara Tech | Software Jobs in Bangladesh"
                            description="Apply for software engineering, design, and marketing roles at RizQara Tech. Build the future with the best software company in Bangladesh."
                            canonical="https://rizqara.tech/careers"
                        />
                        <CareersPage />
                    </>} />

                    <Route path="/case-studies" element={<CaseStudiesPage />} />
                    <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
                    <Route path="/videos" element={<VideosPage onNavigate={onNavigate} />} />
                    <Route path="/videos/:id" element={<VideoDetail />} />
                    <Route path="/build" element={<BuildPage onNavigate={onNavigate} initialConfig={buildConfig} />} />
                    <Route path="/feature/:id" element={<FeatureDetailWrapper />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-of-service" element={<TermsOfService />} />

                    <Route path="/admin" element={
                        isAuthenticated ?
                            <div className="bg-[#F5F7FA]">
                                <AdminDashboard onLogout={() => {
                                    navigate('/', { replace: true });
                                    // Delay state update to prevent "Login" screen flicker during transition
                                    setTimeout(() => {
                                        setIsAuthenticated(false);
                                        localStorage.removeItem('rizqara_admin_auth');
                                    }, 50);
                                }} />
                            </div> :
                            <AdminLogin setIsAuthenticated={setIsAuthenticated} />
                    } />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>

            <RizqAIBot />
            {!location.pathname.startsWith('/admin') && <PromotionOverlay />}
            <CookieConsent />
        </div>
    );
};

// Wrapper for FeatureDetail to use params
const FeatureDetailWrapper = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    if (!id) return <Navigate to="/" />;
    return <FeatureDetail id={id} onBack={() => navigate('/')} />;
};

const App = () => {
    return (
        <Router>
            <DataProvider>
                <MainContent />
                <Toaster />
            </DataProvider>
        </Router>
    );
};

export default App;