import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Layout, Palette, Code2, Smartphone, BarChart, Lightbulb, Cpu, MessageSquare, Zap, Activity, Star, Layers, Server } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { SEO } from '../SEO';
import { getSlug } from '../../App';
import { getProxiedImage } from '../../utils/imageProxy';
import { SectionTitle } from '../premium/UIComponents';

export const ServicesPage = () => {
    const { services, t, language } = useData();
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-6 py-32">
            <SEO 
                title="Our Services | RizQara Tech"
                description="Explore our range of software and AI services."
                canonical="https://rizqara.tech/services"
            />
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
                                <img 
                                    src={getProxiedImage(s.image || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop", 400)} 
                                    alt={title} 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                    loading="lazy"
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
        </div>
    )
};
