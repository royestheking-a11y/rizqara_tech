import React, { useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Check, Zap, Briefcase } from 'lucide-react';
import { useData, Project } from '../../context/DataContext';
import { SEO } from '../SEO';
import { DetailSkeleton, ButtonPremium } from '../premium/UIComponents';
import { getSlug } from '../../App';

const ServiceDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { services, projects, language, t, loading } = useData();

    const service = services.find(s =>
        s.id === id ||
        getSlug(s.title) === id
    );

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
                    <div className="h-80 bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden relative group shadow-md flex justify-center items-center">
                        <img src={demoImages[0]} alt="Service Demo" className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors pointer-events-none" />
                    </div>

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

export default ServiceDetailPage;
