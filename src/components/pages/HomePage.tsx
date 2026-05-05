import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, TrendingUp, Search, ExternalLink } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { SEO } from '../SEO';
import { getSlug } from '../../App';
import { 
    HeroCarousel, 
    BuildPreviewTeaser, 
    AutoScrollCarousel, 
    SectionTitle, 
    HomeSkeleton,
    Carousel,
    PremiumComparison,
    LatestVideos,
    PricingDetailed,
    LatestBlogs,
    FAQSection
} from '../premium/UIComponents';
import { partners } from '../../data/partners';
import { techStack } from '../../data/techStack';

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
                        className="px-6 py-3 font-bold rounded-full transition-all text-sm shadow-lg hover:shadow-xl active:scale-95 whitespace-nowrap bg-[#500000] text-white"
                    >
                        {language === 'bn' ? 'সবগুলো কেস স্টাডি দেখুন' : 'See all Case Studies'}
                    </button>
                </div>

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
                                src={getProxiedImage(study.image, 200)}
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start pb-12">
                    <motion.div
                        key={activeStudy.id + 'img'}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative rounded-[40px] overflow-hidden shadow-2xl aspect-[1.1/1]"
                    >
                        <img
                            src={getProxiedImage(activeStudy.image, 800)}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            loading="lazy"
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

                        {activeStudy.growthBefore && activeStudy.growthAfter && (
                            <div className="flex gap-4 mb-10">
                                <motion.div 
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="flex-1 bg-white border border-gray-100 rounded-3xl p-6 relative overflow-hidden group shadow-xl shadow-gray-200/50 transition-all duration-300"
                                >
                                    <div className="absolute -right-8 -bottom-8 opacity-[0.03] rotate-12 transition-transform group-hover:scale-110 duration-700 text-gray-900 z-0 pointer-events-none font-bold">
                                        <Activity size={140} strokeWidth={1} />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
                                            {language === 'bn' ? 'আগে বৃদ্ধি' : 'Growth Before'}
                                        </div>
                                        <div className="text-3xl font-black text-gray-900">
                                            {activeStudy.growthBefore}
                                        </div>
                                    </div>
                                </motion.div>
                                <motion.div 
                                    whileHover={{ y: -5, scale: 1.02 }}
                                    className="flex-1 bg-gradient-to-br from-[#500000] to-[#2a0000] border border-white/10 rounded-3xl p-6 relative overflow-hidden group shadow-2xl shadow-red-900/30 transition-all duration-300"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    <div className="absolute -right-8 -bottom-8 opacity-10 rotate-12 transition-transform group-hover:scale-110 duration-700 text-white z-0 pointer-events-none">
                                        <TrendingUp size={140} strokeWidth={1} />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-2">
                                            {language === 'bn' ? 'আমাদের কাজের পরে' : 'After Our Work'}
                                        </div>
                                        <div className="text-3xl font-black text-white">
                                            {activeStudy.growthAfter}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}

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

const HomePage = ({ setBuildConfig }: { setBuildConfig: any }) => {
    const navigate = useNavigate();
    const { services, projects, loading, language, t } = useData();

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
            <SEO
                title="RizQara Tech | Best Software & AI Solutions Company in Bangladesh"
                description="RizQara Tech: The best software company in Bangladesh. Premium web development, AI solutions, mobile apps, and UI/UX design engineered for performance."
                keywords="RizQara Tech, Rizq, Rizq Tech, Rizq Ara, software company Bangladesh, software development company in Dhaka, best software company in Bangladesh, AI software solutions BD, mobile app development Bangladesh"
                canonical="https://rizqara.tech/"
            />
            <HeroCarousel onNavigate={onNavigate} />

            <BuildPreviewTeaser onNavigate={onNavigate} setBuildConfig={setBuildConfig} />

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

            <section className="container mx-auto px-6">
                <div className="flex justify-between items-end mb-12">
                    <SectionTitle title={t('ourServices')} subtitle={language === 'bn' ? 'ব্যাপক ডিজিটাল সমাধান।' : 'Comprehensive digital solutions.'} />
                    <button 
                        onClick={() => onNavigate('Services')} 
                        className="text-gray-500 hover:text-[#500000] flex items-center gap-2 font-bold mb-16"
                        aria-label="View all services"
                    >
                        {t('readMore')} <ArrowRight size={16} />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.slice(0, 6).map((service) => {
                        const title = language === 'bn' ? (service.title_bn || service.title) : service.title;
                        const desc = language === 'bn' ? (service.description_bn || service.description) : service.description;

                        return (
                            <div key={service.id} onClick={() => onNavigate('ServiceDetail', getSlug(service.title))} className="group bg-white border border-gray-200 hover:shadow-xl hover:border-[#500000]/20 rounded-3xl transition-all duration-300 cursor-pointer shadow-sm overflow-hidden flex flex-col h-full">
                                <div className="h-48 overflow-hidden relative shrink-0">
                                    <img
                                        src={getProxiedImage(service.image, 400)}
                                        alt={title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        loading="lazy"
                                    />
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

            <section className="w-full py-24 bg-gray-50 border-y border-gray-200">
                <div className="container mx-auto px-6 mb-12">
                    <SectionTitle
                        title={t('ourProjects')}
                        subtitle={language === 'bn' ? "আমাদের সাম্প্রতিক কাজ এবং সাফল্যের গল্প দেখুন।" : "Explore our latest work and success stories delivering impact."}
                    />
                </div>
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
                                    <img 
                                        src={getProxiedImage(project.image, 400)} 
                                        alt={title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                        loading="lazy"
                                    />
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
                                                    aria-label={`View live site for ${title}`}
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

            <CaseStudyShowcase />

            <section className="container mx-auto px-6">
                <SectionTitle
                    title={language === 'bn' ? "কেন আমাদের নির্বাচন করবেন" : "Why Choose Us"}
                    subtitle={language === 'bn' ? "আমরা আপনার ব্যবসার জন্য সর্বোত্তম সমাধান প্রদান করি।" : "We deliver tailored excellence to drive your business forward."}
                />
                <PremiumComparison onNavigate={onNavigate} />
            </section>

            <section className="container mx-auto px-6">
                <div className="flex justify-between items-end mb-4">
                    <SectionTitle title={t('latestInsights')} subtitle={language === 'bn' ? "আমাদের সর্বশেষ প্রযুক্তি শোকেস এবং টিউটোরিয়াল দেখুন।" : "Watch our latest tech showcases and tutorials."} />
                    <button onClick={() => onNavigate('Videos')} className="text-gray-500 hover:text-[#500000] flex items-center gap-2 font-bold mb-16">{t('readMore')} <ArrowRight size={16} /></button>
                </div>
                <LatestVideos onNavigate={onNavigate} />
            </section>

            <section className="container mx-auto px-6">
                <SectionTitle
                    title={language === 'bn' ? "প্যাকেজসমূহ" : "Packages"}
                    subtitle={language === 'bn' ? "আপনার ব্যবসার জন্য সেরা পরিকল্পনা চয়ন করুন।" : "Choose the perfect plan for your business growth."}
                    center
                />
                <PricingDetailed onNavigate={onNavigate} />
            </section>

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

            <FAQSection />
        </div>
    );
};

export default HomePage;
