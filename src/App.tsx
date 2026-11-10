import { VisitorTracker } from './components/VisitorTracker';
import { useDialog } from './utils/useDialog';
import './styles/mobile-navigation.css';
import { ProjectPathfinder } from './components/studio/ProjectPathfinder';
import { EditorialSection, TechnologyExperience } from './components/editorial/HomeEditorial';
import './styles/footer-experience.css';
import { CaseStudyExperience } from './components/case-studies/CaseStudyExperience';
import { ConceptDetail } from './components/projects/ConceptDetail';
import { ProjectShowcase, projectConcepts } from './components/projects/ProjectShowcase';
import { ServiceCategoryPreview, ServiceCatalogPage } from './components/services/ServiceCatalog';
import { PremiumExperience, EngineeringExperience } from './components/experience/PremiumExperience';
import React, { useState, useEffect, useLayoutEffect, lazy, Suspense } from 'react';
import {
    X, ChevronRight, Check,
    Code2, Globe,
    ArrowRight, Star,
    Linkedin, Instagram, Facebook, Youtube,
    Shield, Zap, Briefcase,
    ShieldCheck,
    Lock, User, ExternalLink, Share2,
    TrendingUp, Cpu, Activity, Image as ImageIcon,
    FileSignature, Scale, Building2
} from 'lucide-react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';

// Imports
import { Toaster, toast } from 'sonner';
import { DataProvider, useData, Project } from './context/DataContext';
import { apiRequest } from './utils/api';
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(module => ({ default: module.AdminDashboard })));
import { GalleryPage } from './components/pages/GalleryPage';

import { SEO } from './components/SEO';
import { partners } from './data/partners';
import {
    AutoScrollCarousel, StatsCounter,
    JourneyRoadmap,
    HeroCarousel, BuildPage,
    PricingDetailed,
    TestimonialSlider, PremiumComparison, ContactFormWithMap,
    RizqAIBot, FeatureDetail, HomeSkeleton,
    AboutSkeleton, ContactSkeleton,
    ServicesSkeleton, ProjectsSkeleton, AboutHero,
    SectionTitle, XLogo, MediumLogo, WhatsAppLogo
} from './components/premium/UIComponents';
import { BlogPage, VideosPage, VideoDetail, TeamPage, BlogDetail, TeamSection, CareersPage } from './components/pages/ExtraPages';
import FounderPage from './components/pages/FounderPage';
import { Vision2030Page } from './components/pages/Vision2030Page';
import { PrivacyPolicy, TermsOfService } from './components/LegalPages';
import { PromotionOverlay } from './components/premium/PromotionOverlay';
import { CookieConsent } from './components/premium/CookieConsent';
import { FAQSection } from './components/premium/FAQSection';
import { NoticeBar } from './components/premium/NoticeBar';
import { TopCompaniesSEOPage } from './components/pages/TopCompaniesSEOPage';
import { RegisteredCompanyPage } from './components/pages/RegisteredCompanyPage';
import { GoogleTranslate } from './components/premium/GoogleTranslate';

// --- Utils ---
import { getSlug, matchesContent } from './utils/content';
export { getSlug } from './utils/content';

const paymentMethods = [
    { name: 'Visa', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642634/rizqaratech/payment_methods/Visa-Logo.png', className: 'p-1' },
    { name: 'Mastercard', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642636/rizqaratech/payment_methods/mastercard-featured-image-1080x628.jpg', className: 'p-1' },
    { name: 'Amex', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642635/rizqaratech/payment_methods/amex.jpg', className: 'p-1' },
    { name: 'Payoneer', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642638/rizqaratech/payment_methods/payoneer-logo-payoneer-icon-transparent-free-png.webp', className: 'p-1' },
    { name: 'Google Pay', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642631/rizqaratech/payment_methods/GooglePayLogo.width-500.format-webp.webp', className: 'p-1' },
    { name: 'Redot Pay', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642639/rizqaratech/payment_methods/redot_pay.png', className: 'p-1' },
    { name: 'Bkash', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642630/rizqaratech/payment_methods/Bkash.jpg', className: 'p-1.5 object-contain' },
    { name: 'Nagad', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642632/rizqaratech/payment_methods/Nagad.jpg', className: 'p-3 object-contain' },
    { name: 'Rocket', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642633/rizqaratech/payment_methods/Rocket.png', className: 'object-cover w-full h-full' },
];

// --- Premium UI Components (Internal) ---

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

const CaseStudiesPage = () => <CaseStudyExperience page />;

const CaseStudyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { caseStudies, language, t, secondaryLoading: loading } = useData();

    const study = caseStudies.find(s =>
        matchesContent(s, id)
    );

    useLayoutEffect(() => {
        if (!loading && study && String(study.id) === id) {
            const slug = getSlug(study);
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
                canonical={`https://www.rizqara.tech/case-studies/${getSlug(study)}`}
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

                    {study.growthBefore && study.growthAfter && (
                        <div className="flex gap-6 mb-16">
                            <motion.div 
                                whileHover={{ scale: 1.02, y: -5 }}
                                className="flex-1 bg-white border border-gray-100 rounded-[32px] p-8 relative overflow-hidden group shadow-2xl shadow-black/5 transition-all duration-300"
                            >
                                <div className="absolute -right-10 -bottom-10 opacity-[0.03] rotate-12 transition-transform group-hover:scale-110 duration-1000 text-gray-900 z-0 pointer-events-none font-bold">
                                    <Activity size={180} strokeWidth={1} />
                                </div>
                                <div className="relative z-10">
                                    <div className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">
                                        {language === 'bn' ? 'শুরুর অবস্থা' : 'Initial Status'}
                                    </div>
                                    <div className="text-5xl font-black text-gray-900">
                                        {study.growthBefore}
                                    </div>
                                    <div className="mt-4 text-sm font-bold text-gray-400 uppercase tracking-widest opacity-60">
                                        {language === 'bn' ? 'বেসলাইন মেট্রিক্স' : 'Baseline Metrics'}
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div 
                                whileHover={{ scale: 1.02, y: -5 }}
                                className="flex-1 bg-gradient-to-br from-[#500000] to-[#1a0000] rounded-[32px] p-8 relative overflow-hidden group shadow-2xl shadow-red-900/30 border border-white/10 transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12 transition-transform group-hover:scale-110 duration-1000 text-white z-0 pointer-events-none">
                                    <TrendingUp size={180} strokeWidth={1} />
                                </div>
                                <div className="relative z-10">
                                    <div className="text-xs font-black uppercase tracking-[0.2em] text-white/50 mb-4">
                                        {language === 'bn' ? 'রিজকারা টেক প্রয়োগের পর' : 'Post Implementation'}
                                    </div>
                                    <div className="text-5xl font-black text-white">
                                        {study.growthAfter}
                                    </div>
                                    <div className="mt-4 text-sm font-bold text-white/80 uppercase tracking-widest flex items-center gap-2">
                                        <Check size={16} className="text-white" /> {language === 'bn' ? 'প্রমাণিত বৃদ্ধি' : 'Proven Growth'}
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}

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
        matchesContent(s, id)
    );

    // Redirect to slug if currently using number ID
    useLayoutEffect(() => {
        if (!loading && service && service.id === id) {
            const slug = getSlug(service);
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
            "url": "https://www.rizqara.tech"
        }
    };

    return (
        <div className="container mx-auto px-6 py-24 min-h-screen">
            <SEO
                title={`${title} | RizQara Tech`}
                description={description}
                keywords={`${title}, software company Bangladesh, ${title} service Dhaka, best ${title} company`}
                canonical={`https://www.rizqara.tech/services/${getSlug(service)}`}
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
                        <img src={demoImages[0]} alt={service.imageAlt || title} className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105" />
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
                            <div role="button" tabIndex={0} onKeyDown={event => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); event.currentTarget.click(); } }}
                                key={project.id}
                                className="group cursor-pointer bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                                onClick={() => {
                                    navigate(`/projects/${getSlug(project)}`);
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

    const project = [...projects, ...projectConcepts].find(p =>
        matchesContent(p, id)
    );

    // Redirect to slug if currently using number ID
    useLayoutEffect(() => {
        if (!loading && project && String(project.id) === id) {
            const slug = getSlug(project);
            if (slug) navigate(`/projects/${slug}`, { replace: true });
        }
    }, [id, project, loading, navigate]);

    if (loading && !project) return <DetailSkeleton />;

    if (!project) return <div className="pt-32 text-center text-gray-900 min-h-screen">Project not found</div>;
    if (project.status === 'Concept') return <ConceptDetail project={project} />;

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
                canonical={`https://www.rizqara.tech/projects/${getSlug(project)}`}
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
                            <div role="button" tabIndex={0} onKeyDown={event => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); event.currentTarget.click(); } }}
                                key={p.id}
                                className="group cursor-pointer bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                                onClick={() => {
                                    navigate(`/projects/${getSlug(p)}`);
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
    const mobileDialog = useDialog(mobileMenuOpen, () => setMobileMenuOpen(false));
    useEffect(() => {
        if (!mobileMenuOpen) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onResize = () => { if (window.innerWidth >= 1024) setMobileMenuOpen(false); };
        window.addEventListener('resize', onResize);
        return () => { document.body.style.overflow = previous; window.removeEventListener('resize', onResize); };
    }, [mobileMenuOpen]);
    const location = useLocation();
    useEffect(() => { setMobileMenuOpen(false); }, [location.pathname]);
    const { t, language } = useData();

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
        { name: language === 'bn' ? 'গ্যালারি' : 'Gallery', path: '/gallery' },
        { name: t('contact'), path: '/contact' }
    ];

    const isActive = (path: string) => {
        if (path === '/' && location.pathname !== '/') return false;
        return location.pathname.startsWith(path);
    };

    return (
        <>
            <nav data-scrolled={scrolled} className={`rq-navigation fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-4 ${scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm' : 'bg-white/80 backdrop-blur-md border-b border-gray-50'}`}>
            <div className="rq-nav-inner container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="rq-brand text-2xl font-black tracking-tighter cursor-pointer flex items-center gap-2 text-[#500000]">
                    <span>RIZQARA TECH</span>
                </Link>

                <div className="rq-nav-links hidden lg:flex items-center rounded-full px-2 py-1 border bg-gray-100/50 border-gray-200">
                    {links.map(link => (
                        <Link
                            key={link.name}
                            aria-current={isActive(link.path) ? "page" : undefined}
                            to={link.path}
                            className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${isActive(link.path) ? 'bg-[#500000] text-white shadow-md' : 'text-gray-600 hover:text-[#500000] hover:bg-white'}`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="hidden lg:flex items-center gap-4">
                    <button
                        onClick={() => window.open('https://cal.com/rizqara-tech-a8z6yt', '_blank')}
                        className="rq-nav-cta px-6 py-3 bg-[#500000] text-white rounded-full font-bold text-sm hover:bg-[#3a0000] transition-colors shadow-[0_5px_15px_rgba(80,0,0,0.3)] flex items-center gap-2"
                    >
                        {t('freeAudit')}
                    </button>
                </div>

                <div className="lg:hidden flex items-center gap-4">
                    <button type="button" aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileMenuOpen} aria-controls="rq-mobile-navigation" className="rq-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        <span className="rq-menu-lines" aria-hidden="true"><i/><i/></span>
                    </button>
                </div>
            </div>
            </nav>

            <AnimatePresence>
                {mobileMenuOpen && <motion.div className="rq-mobile-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={() => setMobileMenuOpen(false)}>
                    <motion.div ref={mobileDialog} role="dialog" aria-modal="true" aria-label="Navigation menu" id="rq-mobile-navigation" className="rq-mobile-panel" initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.2}} onClick={e=>e.stopPropagation()}>
                        <header><Link to="/" onClick={()=>setMobileMenuOpen(false)}>RIZQARA TECH</Link><button className="rq-menu-close" aria-label="Close navigation" onClick={()=>setMobileMenuOpen(false)}><X size={20}/></button></header>
                        <div className="rq-mobile-menu-body"><div className="rq-mobile-caption"><span>{language==='bn'?'এক্সপ্লোর করুন':'EXPLORE RIZQARA'}</span><span>01 — 07</span></div>
                        <nav aria-label="Mobile navigation">{links.map((link,i)=><Link key={link.path} to={link.path} aria-current={isActive(link.path)?'page':undefined} onClick={()=>setMobileMenuOpen(false)}><span className="rq-mobile-index">0{i+1}</span><span>{link.name}</span><span className="rq-mobile-arrow"><ArrowRight size={17}/></span></Link>)}</nav>
                        <div className="rq-mobile-contact"><span>{language==='bn'?'নতুন কিছু তৈরি করি':'LET’S MAKE SOMETHING GREAT'}</span><a href="https://cal.com/rizqara-tech-a8z6yt" target="_blank" rel="noopener noreferrer" onClick={()=>setMobileMenuOpen(false)}>{t('freeAudit')}<ArrowRight size={18}/></a><a className="rq-mobile-email" href="mailto:rizqaratech@gmail.com">rizqaratech@gmail.com</a></div>
                        </div><footer><span>Dhaka · Barisal</span><span>Ideas beyond borders ↗</span></footer>
                    </motion.div>
                </motion.div>}
            </AnimatePresence>
        </>
    );
};

// --- Home Page Components ---

const CaseStudyShowcase = () => <CaseStudyExperience />;

// --- Footer ---

const Footer = () => {
    const { language, t, addMessage } = useData();


    return (
        <footer className="rq-footer rq-footer-premium bg-gray-50 text-gray-900 pt-20 pb-8 mt-32 border-t border-gray-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#500000] via-red-600 to-[#500000]"></div>

            <div className="container mx-auto px-6">
                <div className="rq-footer-intro"><span>RIZQARA TECH / {language === 'bn' ? 'পরবর্তী অধ্যায়' : 'YOUR NEXT CHAPTER'}</span><a href="mailto:rizqaratech@gmail.com">rizqaratech@gmail.com ↗</a></div>
                {/* CTA Banner */}
                <div className="mb-16">
                    <div className="rq-footer-cta bg-gradient-to-r from-[#500000] to-[#3a0000] rounded-2xl p-8 md:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
                        <div>
                            <span className="text-red-200 text-xs font-black uppercase tracking-widest block mb-2">
                                {language === 'bn' ? 'রিজকারা টেক-এর সাথে কাজ করুন' : 'HAVE SOMETHING IN MIND?'}
                            </span>
                            <h3 className="text-2xl md:text-3xl font-black tracking-tight">
                                {language === 'bn' ? 'আজই আপনার প্রজেক্ট শুরু করুন' : "Great ideas deserve extraordinary execution."}
                            </h3>
                        </div>
                        <a
                            href="https://wa.me/message/CSYKXUISDAIVI1"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 flex items-center justify-center gap-3 px-8 py-4 text-white rounded-xl font-black text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                            style={{ backgroundColor: '#ffffff', color: '#500000' }}
                        >
                            <WhatsAppLogo size={22} />
                            {language === 'bn' ? 'মার্কেটিং টিমের সাথে কথা বলুন' : 'Let’s talk about it'}
                        </a>
                    </div>
                </div>

                <div className="rq-footer-columns grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-4 mb-6 flex-wrap">
                            <h2 className="text-3xl font-black tracking-tighter text-[#500000]">RIZQARA TECH</h2>
                            <Link
                                to="/vision-2030"
                                className="relative px-3 py-1 rounded-full overflow-hidden group border border-[#500000]/20 inline-flex items-center justify-center shadow-sm bg-white hover:bg-red-50/50 transition-colors"
                            >
                                <span className="relative z-10 text-[#500000] font-black text-[10px] uppercase tracking-[0.1em] flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                    Vision 2030
                                </span>
                            </Link>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-sm">
                            {language === 'bn' ? "রিজকারা টেক একটি প্রিমিয়ার সফটওয়্যার ডেভেলপমেন্ট এজেন্সি যা এন্টারপ্রাইজ-গ্রেড সমাধান প্রদান করে।" : "Rizqara Tech is a premier software development company delivering enterprise-grade solutions."}
                        </p>
                        
                        {/* Social Icons */}
                        <div className="flex gap-4 flex-wrap items-center">
                            {[
                                { name: 'X', Icon: XLogo, link: 'https://x.com/Rizqaratech' },
                                { name: 'Facebook', Icon: Facebook, link: 'https://www.facebook.com/rizqaratechology/' },
                                { name: 'LinkedIn', Icon: Linkedin, link: 'https://www.linkedin.com/company/rizqara-tech' },
                                { name: 'Instagram', Icon: Instagram, link: 'https://www.instagram.com/rizqaratech/' },
                                { name: 'Medium', Icon: MediumLogo, link: 'https://medium.com/@rizqaratech' },
                                { name: 'YouTube', Icon: Youtube, link: 'https://www.youtube.com/@rizqaratech' }
                            ].map(({ name, Icon, link }, i) => (
                                <a
                                    key={i}
                                    aria-label={name}
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 bg-white border border-gray-200 rounded-full text-gray-500 hover:bg-[#500000] hover:text-white hover:border-[#500000] transition-colors cursor-pointer group shadow-sm flex items-center justify-center"
                                >
                                    <Icon size={18} className="group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>

                        <Link to="/registered-company" className="mt-6 flex items-center gap-2 text-gray-600 hover:text-[#500000] transition-colors inline-flex w-fit group">
                            <Building2 size={16} className="text-[#500000] group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-semibold tracking-wide">
                                {language === 'bn' ? 'নিবন্ধিত কোম্পানি' : 'Registered Company'}
                            </span>
                        </Link>

                        <div className="mt-8 border-t border-gray-200 pt-6">
                            <h4 className="text-xs font-black text-[#500000] uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Shield size={14} />
                                {language === 'bn' ? "নিরাপদ পেমেন্ট পদ্ধতি" : "Secure Payment Methods"}
                            </h4>
                            <div className="flex flex-wrap gap-3 max-w-xs">
                                {paymentMethods.map((method: any, i) => (
                                    <div
                                        key={i}
                                        className="h-10 w-16 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:border-[#500000]/40 hover:shadow-md transition-all shadow-sm overflow-hidden p-1.5"
                                    >
                                        <img
                                            src={method.src}
                                            alt={method.name}
                                            className={`max-h-full max-w-full ${method.className || 'object-contain'}`}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6">
                                <h4 className="text-xs font-black text-[#500000] uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <Globe size={14} />
                                    {language === 'bn' ? "ভাষা নির্বাচন করুন" : "Select Language"}
                                </h4>
                                <div className="inline-flex">
                                    <GoogleTranslate />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Company Column */}
                    <div className="self-start">
                        <h3 className="text-gray-900 font-bold mb-6 text-base uppercase tracking-wider">{t('company')}</h3>
                        <ul className="space-y-3 text-sm text-gray-600">
                            {[
                                { key: 'home', path: '/' },
                                { key: 'about', path: '/about' },
                                { key: 'careers', path: '/careers' },
                                { key: 'contact', path: '/contact' },
                                { key: 'Top 20 IT Firms', path: '/blog/top-software-companies-in-bangladesh' }
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
                        <div className="rq-footer-extra">
                            <h4>{language === 'bn' ? 'যোগাযোগ করুন' : 'Direct contact'}</h4>
                            <a href="tel:+8801343042761">+880 1343-042761 <span>↗</span></a>
                            <a href="mailto:rizqaratech@gmail.com">{language === 'bn' ? 'ইমেইল করুন' : 'Email our team'} <span>↗</span></a>
                            <div className="rq-footer-location"><span>{language === 'bn' ? 'আমাদের অবস্থান' : 'OUR LOCATIONS'}</span><p>{language === 'bn' ? 'ঢাকা ও বরিশাল, বাংলাদেশ' : 'Dhaka & Barisal, Bangladesh'}</p></div>
                        </div>
                    </div>

                    {/* Solutions Column */}
                    <div className="self-start">
                        <h3 className="text-gray-900 font-bold mb-6 text-base uppercase tracking-wider">{t('solutions')}</h3>
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
                        <div className="rq-footer-extra">
                            <h4>{language === 'bn' ? 'আমাদের দক্ষতা' : 'Our expertise'}</h4>
                            {[
                                ['software-web-development', 'Software & Web', 'সফটওয়্যার ও ওয়েব'],
                                ['business-management-solutions', 'Business systems', 'ব্যবসা পরিচালনা'],
                                ['ai-automation', 'AI & Automation', 'AI ও অটোমেশন'],
                                ['mobile-application-development', 'Mobile applications', 'মোবাইল অ্যাপ'],
                                ['uiux-creative-design', 'UI/UX & Branding', 'UI/UX ও ব্র্যান্ডিং'],
                                ['digital-marketing-growth', 'Marketing & Growth', 'মার্কেটিং ও প্রবৃদ্ধি'],
                                ['enterprise-custom-solutions', 'Enterprise solutions', 'এন্টারপ্রাইজ সমাধান']
                            ].map(([id,en,bn]) => <Link key={id} to={`/services#${id}`}>{language === 'bn' ? bn : en}<span>↗</span></Link>)}
                        </div>


                    </div>

                    <div className="lg:col-span-1 rq-newsletter-card">
                        <div className="rq-newsletter-emblem" aria-hidden="true">✉<span>↗</span></div>
                        <h3 className="text-gray-900 font-bold mb-6 text-base uppercase tracking-wider">{t('newsletter')}</h3>
                        <h4 className="rq-newsletter-title">{language === 'bn' ? 'আগামীর খবর, আপনার ইনবক্সে।' : <>A little insight.<br/>A lot of possibility.</>}</h4>
                        <p className="text-sm text-gray-600 mb-4">{language === 'bn' ? "সর্বশেষ আপডেট এবং অফারের জন্য সাবস্ক্রাইব করুন।" : "Subscribe for latest updates and offers."}</p>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const form = e.target as HTMLFormElement;
                            const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                            try {
                                await addMessage({
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
                            <input aria-label="Newsletter email address" name="email" type="email" placeholder={language === 'bn' ? "আপনার ইমেইল দিন" : "Enter your email"} required className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#500000] transition-colors" />
                            <button type="submit" className="w-full bg-[#500000] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#3a0000] transition-colors shadow-md hover:shadow-lg">{language === 'bn' ? "সাবস্ক্রাইব করুন" : "Subscribe"}</button>
                        </form>
                    </div>
                </div>

                                        {/* Recognized & Certified — sits under Solutions, flowing naturally */}
                        <div className="rq-footer-recognition">
                            <div className="flex items-center gap-1.5 mb-4">
                                <ShieldCheck size={13} className="text-[#500000]" />
                                <span className="text-[10px] font-black text-[#500000] uppercase tracking-widest">
                                    {language === 'bn' ? 'স্বীকৃত ও প্রত্যয়িত' : 'Recognized & Certified'}
                                </span>
                            </div>

                            {/* Clutch + 3 cert badges in one row, all same height */}
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>

                                {/* Clutch – maroon card */}
                                <a
                                    href="https://clutch.co/profile/rizqara-tech"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        width: '120px', minWidth: '120px', height: '68px',
                                        flexShrink: 0, textDecoration: 'none',
                                        background: '#500000', borderRadius: '12px',
                                        display: 'flex', flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        padding: '8px 10px',
                                        boxShadow: '0 2px 8px rgba(80,0,0,0.18)',
                                        transition: 'transform 0.2s, box-shadow 0.2s'
                                    }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '6px', fontWeight: 700, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Reviewed on</span>
                                        <div style={{ display: 'flex', gap: '1px' }}>
                                            {[1,2,3,4,5].map((_,i) => <Star key={i} size={7} fill="#FFD700" stroke="#FFD700" />)}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <img
                                            src="https://res.cloudinary.com/dhutfywg2/image/upload/v1773642640/rizqaratech/clutch/clutch.png"
                                            alt="Clutch"
                                            style={{ height: '22px', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
                                        />
                                    </div>
                                    <div style={{ fontSize: '7px', fontWeight: 900, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', textAlign: 'right', letterSpacing: '0.05em' }}>10 Reviews</div>
                                </a>

                                {/* GDPR */}
                                <div
                                    style={{
                                        width: '68px', minWidth: '68px', height: '68px',
                                        flexShrink: 0, background: '#fff',
                                        border: '1px solid #e5e7eb', borderRadius: '12px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        padding: '6px',
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                                        cursor: 'default'
                                    }}
                                    title="GDPR Compliant"
                                >
                                    <img src="/gdpr-2.webp" alt="GDPR" style={{ width: '52px', height: '52px', objectFit: 'contain' }} />
                                </div>

                                {/* ISO 27001 */}
                                <div
                                    style={{
                                        width: '68px', minWidth: '68px', height: '68px',
                                        flexShrink: 0, background: '#fff',
                                        border: '1px solid #e5e7eb', borderRadius: '12px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        padding: '6px',
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                                        cursor: 'default'
                                    }}
                                    title="ISO 27001 Certified"
                                >
                                    <img src="/iso2-2.webp" alt="ISO 27001" style={{ width: '52px', height: '52px', objectFit: 'contain' }} />
                                </div>

                                {/* ISO 9001 */}
                                <div
                                    style={{
                                        width: '68px', minWidth: '68px', height: '68px',
                                        flexShrink: 0, background: '#fff',
                                        border: '1px solid #e5e7eb', borderRadius: '12px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        padding: '6px',
                                        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                                        cursor: 'default'
                                    }}
                                    title="ISO 9001 Certified"
                                >
                                    <img src="/iso9001-2.webp" alt="ISO 9001" style={{ width: '52px', height: '52px', objectFit: 'contain' }} />
                                </div>

                            </div>
                        </div>
                <div className="rq-footer-capabilities" aria-label="Our expertise">
                    <span>{language === 'bn' ? 'আমাদের দক্ষতা' : 'OUR EXPERTISE'}</span>
                    <div>
                        <Link to="/services#software-web-development"><Code2 size={19}/><span>{language === 'bn' ? 'সফটওয়্যার ডেভেলপমেন্ট' : 'Software development'}</span></Link>
                        <Link to="/services#ai-automation"><Cpu size={19}/><span>{language === 'bn' ? 'AI ও অটোমেশন' : 'AI & automation'}</span></Link>
                        <Link to="/services#mobile-application-development"><Code2 size={19}/><span>{language === 'bn' ? 'মোবাইল অ্যাপ' : 'Mobile applications'}</span></Link>
                        <Link to="/services#uiux-creative-design"><Globe size={19}/><span>{language === 'bn' ? 'UI/UX ও ডিজাইন' : 'UI/UX & creative design'}</span></Link>
                    </div>
                </div>
                <div className="rq-footer-wordmark" aria-label="Rizqara Tech trademark"><span className="rq-wordmark-text">RIZQARA TECH</span><sup>™</sup></div>
                <div className="rq-footer-bottom border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} <span className="font-semibold text-gray-700">Rizqara Tech</span>. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <button type="button" onClick={() => window.openCookieSettings?.()} className="cursor-pointer hover:text-[#500000] transition-colors">{language === 'bn' ? 'কুকি সেটিংস' : 'Cookie Settings'}</button>
                        <Link to="/privacy-policy" className="cursor-pointer hover:text-[#500000] transition-colors">{language === 'bn' ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}</Link>
                        <Link to="/terms-of-service" className="cursor-pointer hover:text-[#500000] transition-colors">{language === 'bn' ? 'পরিষেবার শর্তাবলী' : 'Terms of Service'}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
const Home = () => {
    const navigate = useNavigate();
    const { projects, loading, language, t } = useData();

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
        <div className="rq-home space-y-32 pb-0 overflow-x-hidden">

            {/* 1. HERO CAROUSEL */}
            <SEO
                title="RizQara Tech | Best Software & AI Solutions Company in Bangladesh"
                description="RizQara Tech: The best software company in Bangladesh. Premium web development, AI solutions, mobile apps, and UI/UX design engineered for performance."
                keywords="RizQara Tech, Rizq, Rizq Tech, Rizq Ara, software company Bangladesh, software development company in Dhaka, best software company in Bangladesh, AI software solutions BD, mobile app development Bangladesh"
                canonical="https://www.rizqara.tech/"
            />
            <h1 className="sr-only">RizQara Tech — Software and AI solutions</h1>
                <HeroCarousel onNavigate={onNavigate} />

            {/* 2. BUILD PROJECT TEASER */}
            <ProjectPathfinder />



            {/* 3. TRUSTED COMPANIES */}
            <section data-rq-reveal className="container mx-auto px-6">
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




            {/* NEW: 3.7. OUR PROCESS */}
            <section data-rq-reveal className="w-full py-24 bg-white mt-16">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <SectionTitle title={t('ourProcess')} subtitle={t('processSubtitle')} center />
                    </div>
                    <EngineeringExperience />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {[
                            { 
                                step: '01', 
                                title: language==='bn'?'ডিফাইন এবং আর্কিটেক্ট':'Define & Architect', 
                                desc: language==='bn'?'লক্ষ্য নির্ধারণ করুন, সিস্টেম ম্যাপ করুন এবং স্কেলেবল কোডের ভিত্তি স্থাপন করুন।':'Define goals, map systems, and set the foundation for scalable code.' 
                            },
                            { 
                                step: '02', 
                                title: language==='bn'?'বিল্ড এবং ডেভেলপ':'Build & Develop', 
                                desc: language==='bn'?'নিখুঁত UI এবং শক্তিশালী API-এর সাথে পরিষ্কার, মডুলার কোড লিখুন।':'Write clean, modular code with seamless UI and robust APIs.' 
                            },
                            { 
                                step: '03', 
                                title: language==='bn'?'ডিপ্লয় এবং সাপোর্ট':'Deploy & Support', 
                                desc: language==='bn'?'প্রোডাক্ট দ্রুত এবং নির্ভরযোগ্য রাখতে ডিপ্লয়, মনিটর এবং অপ্টিমাইজ করুন।':'Deploy, monitor, and optimize to keep products fast and reliable.' 
                            },
                        ].map((item, idx) => (
                            <div key={idx} data-rq-tilt className="rq-process-card bg-[#500000] rounded-3xl p-8 md:p-10 relative overflow-hidden flex flex-col justify-end min-h-[360px] shadow-2xl hover:-translate-y-2 transition-transform duration-500 group">
                                <div style={{ fontSize: '12rem', lineHeight: 0.8 }} className="absolute -top-4 -left-4 font-black text-white opacity-10 group-hover:opacity-20 transition-opacity tracking-tighter select-none pointer-events-none">
                                    {item.step}
                                </div>
                                <div className="relative z-10 mt-auto pt-32">
                                    <h4 className="text-2xl font-bold text-white mb-4">{item.title}</h4>
                                    <p className="text-white/80 leading-relaxed text-sm md:text-base">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                        
                        {/* Bottom CTA Bar */}
                        <div className="col-span-1 md:col-span-3 mt-4 border-2 border-[#500000]/10 bg-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-sm hover:shadow-md transition-shadow gap-4">
                            <p className="text-[#500000] text-lg font-bold flex-1 text-center md:text-left">
                                {language === 'bn' ? 'বিশেষজ্ঞ কোড দিয়ে নির্ভরযোগ্য, ব্যবহারকারী-কেন্দ্রিক পণ্য তৈরি করুন।' : 'Build reliable, user-focused products with expert code.'}
                            </p>
                            <button onClick={() => onNavigate('Contact')} className="bg-[#500000] text-white px-8 py-3 rounded-full font-bold hover:bg-[#6a0000] transition-colors shadow-lg shrink-0 text-center w-full md:w-auto break-words">
                                {language === 'bn' ? 'কল বুক করুন' : 'Book a call'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <ServiceCategoryPreview />

            <ProjectShowcase preview />

            {/* 7. CASE STUDIES SHOWCASE */}
            <CaseStudyShowcase />

            {/* NEW: 3.6. TRUST & GUARANTEE */}
            <section data-rq-reveal className="container mx-auto px-6 mt-32">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <SectionTitle title={t('trustGuarantee')} subtitle={t('trustSubtitle')} center />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div data-rq-tilt className="rq-guarantee-card bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2">
                        <div className="w-16 h-16 bg-red-50 text-[#500000] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <FileSignature size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('nda')}</h3>
                        <p className="text-gray-600 leading-relaxed">{t('ndaDesc')}</p>
                    </div>
                    <div data-rq-tilt className="rq-guarantee-card bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-2xl transition-all duration-300 group hover:-translate-y-2">
                        <div className="w-16 h-16 bg-red-50 text-[#500000] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Scale size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('milestones')}</h3>
                        <p className="text-gray-600 leading-relaxed">{t('milestonesDesc')}</p>
                    </div>
                    <div data-rq-tilt className="rq-guarantee-card rq-dark-card bg-[#500000] rounded-3xl p-8 shadow-2xl transition-all duration-300 group hover:-translate-y-2 text-white">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Code2 size={32} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">{t('customCode')}</h3>
                        <p className="text-white/80 leading-relaxed">{t('customCodeDesc')}</p>
                    </div>
                </div>
            </section>

            {/* 7. WHY RIZQARA (Redesigned) */}
            <section data-rq-reveal className="container mx-auto px-6">
                <SectionTitle
                    title={language === 'bn' ? "কেন আমাদের নির্বাচন করবেন" : "Why Choose Us"}
                    subtitle={language === 'bn' ? "আমরা আপনার ব্যবসার জন্য সর্বোত্তম সমাধান প্রদান করি।" : "We deliver tailored excellence to drive your business forward."}
                />
                <PremiumComparison onNavigate={onNavigate} />
            </section>

            <EditorialSection kind="videos" />
            <EditorialSection kind="blogs" />

            {/* 11. IMPACT (Stats) - Separated */}
            <section data-rq-reveal className="bg-gradient-to-br from-white to-gray-50 py-24 relative overflow-hidden border-t border-gray-200">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] invert"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-[#500000] mb-4">{language === 'bn' ? "আমাদের গ্লোবাল প্রভাব" : "Our Global Impact"}</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">{language === 'bn' ? "মহাদেশ এবং শিল্প জুড়ে শ্রেষ্ঠত্ব প্রদান।" : "Delivering excellence across continents and industries."}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        <div data-rq-tilt className="rq-stat-card p-8 bg-white border border-gray-200 rounded-3xl shadow-lg hover:-translate-y-2 group transition-all duration-500">
                            <StatsCounter value={120 + projects.length} label={language === 'bn' ? "প্রকল্প বিতরণ" : "Projects Delivered"} />
                        </div>
                        <div data-rq-tilt className="rq-stat-card p-8 bg-white border border-gray-200 rounded-3xl shadow-lg hover:-translate-y-2 group transition-all duration-500">
                            <StatsCounter value={100} label={language === 'bn' ? "গ্রাহক সন্তুষ্টি" : "Client Satisfaction"} suffix="%" />
                        </div>
                        <div data-rq-tilt className="rq-stat-card p-8 bg-white border border-gray-200 rounded-3xl shadow-lg hover:-translate-y-2 group transition-all duration-500">
                            <StatsCounter value={10} label={language === 'bn' ? "দেশ সেবা করা হয়েছে" : "Countries Served"} suffix="+" />
                        </div>
                        <div data-rq-tilt className="rq-stat-card p-8 bg-white border border-gray-200 rounded-3xl shadow-lg hover:-translate-y-2 group transition-all duration-500">
                            <StatsCounter value={5} label={language === 'bn' ? "বছরের শ্রেষ্ঠত্ব" : "Years Excellence"} suffix="+" />
                        </div>
                    </div>
                </div>
            </section>

            <TechnologyExperience />

            {/* 12. FEEDBACK (Testimonials) - Separated & Carousel */}
            <section data-rq-reveal className="container mx-auto px-6">
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
            <section data-rq-reveal className="container mx-auto px-6 mb-32" id="contact-section">
                <SectionTitle title={t('contact')} />
                <ContactFormWithMap />
            </section>

            <NoticeBar />

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

    const [busy, setBusy] = useState(false);
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        try {
            await apiRequest('auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
            setPassword('');
            setIsAuthenticated(true);
        } catch (error) { toast.error(error instanceof Error ? error.message : 'Sign in failed'); }
        finally { setBusy(false); }
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
                            aria-label="Administrator email" autoComplete="username" required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t('email')}
                            className="w-full bg-gray-50 border border-gray-200 p-4 pl-12 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#500000] transition-all"
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            aria-label="Administrator password" autoComplete="current-password" required
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={t('password')}
                            className="w-full bg-gray-50 border border-gray-200 p-4 pl-12 pr-12 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#500000] transition-all"
                        />
                        <button
                            type="button"
                            aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                            )}
                        </button>
                    </div>

                    <button disabled={busy} className="w-full bg-[#500000] hover:bg-[#3a0000] text-white py-4 rounded-xl font-bold transition-all shadow-lg flex justify-center items-center gap-2 group">
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

const ServicesPage = ServiceCatalogPage;

const ProjectsPage = () => <ProjectShowcase />;

const AmbientBackground = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-white">
        {/* Maroon background effects removed as requested */}
    </div>
);

const MainContent = () => {
    const [buildConfig] = useState({
        type: 'Web App',
        feature: 'Standard',
        time: '1 Month'
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);
    useEffect(() => {
        localStorage.removeItem('rizqara_admin_auth');
        apiRequest('auth/session').then(() => setIsAuthenticated(true)).catch(() => setIsAuthenticated(false)).finally(() => setCheckingSession(false));
    }, []);
    const location = useLocation();
    const navigate = useNavigate();
    const { t, language, loading, services } = useData();

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
        else if (page === 'Gallery' || page === 'gallery') navigate('/gallery');
        else if (page === 'Careers' || page === 'careers') navigate('/careers');
        else if (page === 'Admin' || page === 'admin') navigate('/admin');
        else if (page === 'Contact' || page === 'contact') navigate('/contact');
        else if (page === 'About' || page === 'about') navigate('/about');
        else if (page === 'Home' || page === 'home') navigate('/');
        else navigate(`/${page.toLowerCase()}`);
    };

    const showNavbar = !location.pathname.startsWith('/admin');

    return (
        <div className={`${showNavbar ? 'rq-premium' : ''} min-h-screen bg-white text-gray-900 font-sans selection:bg-[#500000] selection:text-white overflow-x-hidden relative scroll-smooth`}>
            <VisitorTracker />
            <AmbientBackground />
            {showNavbar && <PremiumExperience />}

            {showNavbar && <Navbar />}

            {location.pathname.startsWith('/admin') && <SEO title="Administrator sign in" description="Private administration area." noIndex />}
            {loading && <div className="rq-brand-loader" role="status" aria-label="Loading website"><div className="rq-loader-symbol"><img src="/images/brand/rizqara-official.png" alt="" width="104" height="104"/><i/><i/><i/></div></div>}
            <main className={`relative z-10 ${location.pathname === '/' || location.pathname === '/admin' ? 'pt-0' : 'pt-24'}`}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/vision-2030" element={<Vision2030Page />} />
                    <Route path="/registered-company" element={<RegisteredCompanyPage />} />

                    <Route path="/services" element={<>
                        <SEO
                            title="Software Development Services | RizQara Tech Bangladesh"
                            description="Our services include web development, UI UX design, AI solutions, mobile apps, SEO, and custom enterprise software."
                            canonical="https://www.rizqara.tech/services"
                        />
                        {loading && !services.length ? <ServicesSkeleton /> : <ServicesPage />}
                    </>} />
                    <Route path="/services/:id" element={<ServiceDetail />} />

                    <Route path="/projects" element={<>
                        <SEO
                            title="Our Projects | Software & AI Solutions by RizQara Tech"
                            description="Explore real-world software, AI, and digital projects delivered by RizQara Tech for local and global clients."
                            canonical="https://www.rizqara.tech/projects"
                        />
                        {loading ? <ProjectsSkeleton /> : <ProjectsPage />}
                    </>} />
                    <Route path="/projects/:id" element={<ProjectDetail />} />

                    <Route path="/packages" element={<div className="container mx-auto px-6 pt-32 pb-32"><SectionTitle title={language === 'bn' ? "প্যাকেজসমূহ" : "Packages"} /><PricingDetailed onNavigate={onNavigate} /></div>} />
                    <Route path="/contact" element={
                        <div className="pt-20 pb-32 container mx-auto px-6">
                            <h1 className="sr-only">Contact RizQara Tech</h1>
                        <SEO
                                title="Contact Us | RizQara Tech - Software & AI Solutions"
                                description="Get in touch with RizQara Tech for custom software development, AI solutions, web apps, and digital transformation services in Bangladesh."
                                canonical="https://www.rizqara.tech/contact"
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
                            canonical="https://www.rizqara.tech/about"
                        />
                        <div className="bg-white">
                            {loading ? (
                                <AboutSkeleton />
                            ) : (
                                <div className="">
                                     <AboutHero />
                                     
                                     {/* Founder Link Banner */}
                                     <div className="container mx-auto px-6 pt-32 pb-16 text-center max-w-4xl border-b border-gray-100 mb-16">
                                         <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 tracking-tight">Built by a Visionary</h3>
                                         <p className="text-xl text-gray-500 font-light mb-8 leading-relaxed">RizQara Tech wasn't just built on code; it was built on a singular vision to change a million lives. Discover the story, the struggle, and the relentless drive behind our founder.</p>
                                         <Link to="/founder" className="inline-flex items-center gap-3 px-8 py-4 bg-[#500000] text-white font-black rounded-full hover:bg-red-900 transition-colors shadow-xl shadow-red-900/20 text-sm tracking-widest uppercase">
                                             Meet Aurangzeb Sunny <span className="font-bold text-lg leading-none">&rarr;</span>
                                         </Link>
                                     </div>

                                    <JourneyRoadmap />
                                    <div className="mt-32">
                                        <SectionTitle title={t('meetOurTeam')} center />
                                        <TeamSection />
                                    </div>
                                </div>
                            )}
                        </div>
                    </>} />
                    <Route path="/founder" element={<FounderPage />} />
                    <Route path="/team" element={<TeamPage />} />
                    <Route path="/blog" element={<BlogPage onNavigate={onNavigate} />} />
                    <Route path="/blog/:id" element={<BlogDetail />} />
                    <Route path="/blog/top-software-companies-in-bangladesh" element={<TopCompaniesSEOPage />} />

                    <Route path="/careers" element={<>
                        <SEO
                            title="Careers | Join RizQara Tech | Software Jobs in Bangladesh"
                            description="Apply for software engineering, design, and marketing roles at RizQara Tech. Build the future with the best software company in Bangladesh."
                            canonical="https://www.rizqara.tech/careers"
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
                    <Route path="/gallery" element={<>
                        <SEO 
                            title="Gallery | RizQara Tech Bangladesh" 
                            description="Explore our recent activities, team moments, and events in our gallery." 
                            canonical="https://www.rizqara.tech/gallery"
                        />
                        <GalleryPage />
                    </>} />

                    <Route path="/admin" element={
                        checkingSession ? <DetailSkeleton /> : isAuthenticated ?
                            <div className="bg-[#F5F7FA]">
                                <Suspense fallback={<DetailSkeleton />}><AdminDashboard onLogout={async () => {
                                    try {
                                        await apiRequest('auth/logout', { method: 'POST' });
                                        setIsAuthenticated(false);
                                        navigate('/', { replace: true });
                                    } catch { toast.error('Unable to sign out. Please try again.'); }
                                }} /></Suspense>
                            </div> :
                            <AdminLogin setIsAuthenticated={setIsAuthenticated} />
                    } />

                    <Route path="*" element={<div className="container mx-auto p-12"><SEO title="Page not found" description="The requested page could not be found." /><h1 className="text-3xl font-bold">Page not found</h1><Link to="/">Return home</Link></div>} />
                </Routes>
            </main>

            {!location.pathname.startsWith('/admin') && <Footer />}

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
        <MotionConfig reducedMotion="user"><Router>
            <DataProvider>
                <MainContent />
                <Toaster />
            </DataProvider>
        </Router></MotionConfig>
    );
};

export default App;