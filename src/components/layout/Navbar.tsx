import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, ChevronRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { t, language, setLanguage, services } = useData();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: t('home'), path: '/' },
        { 
            name: t('services'), 
            path: '/services',
            dropdown: services.slice(0, 5).map(s => ({ 
                name: language === 'bn' ? (s.title_bn || s.title) : s.title, 
                path: `/services/${s.title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}` 
            }))
        },
        { name: t('projects'), path: '/projects' },
        { name: t('caseStudies'), path: '/case-studies' },
        { name: t('blog'), path: '/blog' },
        { name: t('contact'), path: '/contact' },
    ];

    const handleNavigate = (path: string) => {
        navigate(path);
        setMobileMenuOpen(false);
        setActiveDropdown(null);
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-4 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm' : 'py-8 bg-transparent'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div 
                    className="flex items-center gap-3 cursor-pointer group" 
                    onClick={() => handleNavigate('/')}
                    aria-label="RizQara Tech Home"
                >
                    <div className="w-10 h-10 bg-[#500000] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-500">
                        <span className="text-xl font-black">R</span>
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-gray-900">RIZQARA<span className="text-[#500000]">TECH</span></span>
                </div>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <div 
                            key={link.name} 
                            className="relative group"
                            onMouseEnter={() => link.dropdown && setActiveDropdown(link.name)}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button
                                onClick={() => handleNavigate(link.path)}
                                className={`text-sm font-bold uppercase tracking-widest transition-colors flex items-center gap-1 ${location.pathname === link.path ? 'text-[#500000]' : 'text-gray-500 hover:text-[#500000]'}`}
                            >
                                {link.name}
                                {link.dropdown && <ChevronRight size={14} className={`rotate-90 transition-transform ${activeDropdown === link.name ? 'rotate-[270deg]' : ''}`} />}
                            </button>

                            {link.dropdown && (
                                <AnimatePresence>
                                    {activeDropdown === link.name && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4"
                                        >
                                            {link.dropdown.map((item) => (
                                                <button
                                                    key={item.name}
                                                    onClick={() => handleNavigate(item.path)}
                                                    className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:text-[#500000] hover:bg-gray-50 rounded-xl transition-all flex items-center justify-between group/item"
                                                >
                                                    {item.name}
                                                    <ArrowRight size={14} className="opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all" />
                                                </button>
                                            ))}
                                            <div className="mt-2 pt-2 border-t border-gray-50">
                                                <button 
                                                    onClick={() => handleNavigate(link.path)}
                                                    className="w-full text-center py-2 text-xs font-black text-[#500000] uppercase tracking-widest hover:underline"
                                                >
                                                    View All
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}

                    <div className="h-6 w-px bg-gray-200 mx-2"></div>

                    <button
                        onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                        className="px-4 py-2 rounded-full border border-gray-200 text-xs font-black uppercase tracking-widest hover:bg-[#500000] hover:text-white transition-all shadow-sm active:scale-95"
                    >
                        {language === 'en' ? 'বাংলা' : 'EN'}
                    </button>

                    <button
                        onClick={() => handleNavigate('/contact')}
                        className="px-8 py-3 bg-[#500000] text-white rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(80,0,0,0.2)] hover:shadow-[0_15px_30px_rgba(80,0,0,0.3)] hover:-translate-y-1 transition-all active:scale-95"
                    >
                        {t('getStarted')}
                    </button>
                </div>

                {/* Mobile Menu Toggle */}
                <button 
                    className="lg:hidden p-2 text-gray-900" 
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle mobile menu"
                >
                    {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="fixed inset-0 z-[110] bg-white lg:hidden"
                    >
                        <div className="p-6 flex justify-between items-center border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#500000] rounded-lg flex items-center justify-center text-white">
                                    <span className="text-lg font-black">R</span>
                                </div>
                                <span className="text-xl font-black tracking-tighter text-gray-900">RIZQARA<span className="text-[#500000]">TECH</span></span>
                            </div>
                            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-gray-900">
                                <X size={28} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8 overflow-y-auto max-h-[80vh]">
                            {navLinks.map((link) => (
                                <div key={link.name} className="space-y-4">
                                    <button
                                        onClick={() => handleNavigate(link.path)}
                                        className="text-3xl font-black text-gray-900 hover:text-[#500000] transition-colors"
                                    >
                                        {link.name}
                                    </button>
                                    {link.dropdown && (
                                        <div className="pl-6 space-y-4 border-l-2 border-gray-100">
                                            {link.dropdown.map(item => (
                                                <button
                                                    key={item.name}
                                                    onClick={() => handleNavigate(item.path)}
                                                    className="block text-lg font-bold text-gray-500 hover:text-[#500000]"
                                                >
                                                    {item.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div className="pt-8 border-t border-gray-100 flex flex-col gap-6">
                                <button
                                    onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                                    className="w-full py-4 rounded-2xl bg-gray-50 text-gray-900 font-bold flex items-center justify-center gap-2"
                                >
                                    {language === 'en' ? 'Switch to বাংলা' : 'Switch to English'}
                                </button>
                                <button
                                    onClick={() => handleNavigate('/contact')}
                                    className="w-full py-5 bg-[#500000] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl"
                                >
                                    {t('getStarted')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
