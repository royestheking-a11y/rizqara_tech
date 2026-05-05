import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { SEO } from '../SEO';
import { getSlug } from '../../App';
import { SectionTitle } from '../premium/UIComponents';

export const ProjectsPage = () => {
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
            <SEO 
                title="Our Projects | RizQara Tech"
                description="Explore our portfolio of successful projects."
                canonical="https://rizqara.tech/projects"
            />
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
                        className="w-full pl-12 pr-10 py-3 bg-white border border-gray-200 rounded-full shadow-sm focus:outline-none focus:border-[#500000] focus:ring-2 focus:ring-[#500000]/10 transition-all text-gray-900"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#500000] bg-gray-100 rounded-full transition-colors"
                            aria-label="Clear search"
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
                            className="col-span-1 md:col-span-2 lg:col-span-3 w-full flex flex-col items-center justify-center text-center py-32 bg-gray-50 rounded-3xl border border-dashed border-gray-200 mx-auto"
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
