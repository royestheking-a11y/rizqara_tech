import React, { useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Activity, TrendingUp, Check, Zap, Cpu, Image as ImageIcon, Share2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { SEO } from '../SEO';
import { DetailSkeleton, ButtonPremium } from '../premium/UIComponents';
import { getSlug } from '../../App';
import { toast } from 'sonner';

const CaseStudyDetailPage = () => {
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
                        <div className="mb-40">
                            <h3 className="text-2xl font-bold text-gray-900 mb-12 flex items-center gap-3">
                                <Activity className="text-[#500000]" size={24} />
                                {language === 'bn' ? 'প্রধান সমস্যা' : 'The Challenge'}
                            </h3>
                            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 text-lg text-gray-700 leading-relaxed shadow-sm whitespace-pre-line">
                                {problem}
                            </div>
                        </div>

                        <div className="pt-20 mb-40">
                            <h3 className="text-2xl font-bold text-gray-900 mb-12 flex items-center gap-3">
                                <Cpu className="text-[#500000]" size={24} />
                                {language === 'bn' ? 'সমাধান এবং কৌশল' : 'Our Solution'}
                            </h3>
                            <div className="p-8 bg-white rounded-2xl border border-gray-100 shadow-md text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                                {solution}
                            </div>
                        </div>

                        <div className="pt-20 mb-40">
                            <h3 className="text-2xl font-bold text-gray-900 mb-12 flex items-center gap-3">
                                <Zap className="text-[#500000]" size={24} />
                                {language === 'bn' ? 'ব্যবসায়িক প্রভাব' : 'Business Impact'}
                            </h3>
                            <div className="p-8 bg-[#500000]/5 rounded-2xl border border-[#500000]/10 text-lg text-gray-700 leading-relaxed shadow-sm whitespace-pre-line">
                                {impact}
                            </div>
                        </div>

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

export default CaseStudyDetailPage;
