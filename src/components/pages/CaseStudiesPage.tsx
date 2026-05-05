import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { SEO } from '../SEO';
import { SectionTitle, ProjectsSkeleton } from '../premium/UIComponents';
import { getSlug } from '../../App';

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
                                
                                {study.growthBefore && study.growthAfter && (
                                    <div className="flex gap-3 mb-6">
                                        <div className="flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100 group/item">
                                            <div className="text-[8px] font-black uppercase text-gray-400 mb-1 tracking-widest">{language === 'bn' ? 'আগে' : 'Before'}</div>
                                            <div className="text-sm font-black text-gray-300 group-hover/item:text-gray-400 transition-colors">{study.growthBefore}</div>
                                        </div>
                                        <div className="flex-1 bg-[#500000]/5 rounded-2xl p-4 border border-[#500000]/10 group/item">
                                            <div className="text-[8px] font-black uppercase text-[#500000]/60 mb-1 tracking-widest">{language === 'bn' ? 'পরে' : 'After'}</div>
                                            <div className="text-sm font-black text-[#500000]">{study.growthAfter}</div>
                                        </div>
                                    </div>
                                )}

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

export default CaseStudiesPage;
