import React, { useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Check, ExternalLink, Share2 } from 'lucide-react';
import { useData, Project } from '../../context/DataContext';
import { SEO } from '../SEO';
import { DetailSkeleton, ButtonPremium } from '../premium/UIComponents';
import { getSlug } from '../../App';
import { toast } from 'sonner';

const ProjectDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { projects, language, t, loading } = useData();

    const project = projects.find(p =>
        String(p.id) === id ||
        getSlug(p.title) === id
    );

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
                title={`${title} | RizQara Tech`}
                description={description}
                canonical={`https://rizqara.tech/projects/${id}`}
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
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailPage;
