import { useDialog } from '../../utils/useDialog';
import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { SEO } from '../SEO';
import { 
    Calendar, X, ZoomIn, Heart, Share2, Check, 
    Sparkles, Tag, Search,
    ChevronLeft, ChevronRight, Eye, Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';

export const GalleryPage = () => {
    const { galleryItems, language } = useData();
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const galleryDialog = useDialog(!!selectedImage, () => setSelectedImage(null));
    const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
    const [sharedId, setSharedId] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<string>('All');
    const [favoritesOnly, setFavoritesOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Extract dynamic categories from actual gallery data
    const categories = useMemo(() => {
        const set = new Set<string>();
        galleryItems.forEach(item => {
            if (item.category) set.add(item.category);
        });
        return ['All', ...Array.from(set)];
    }, [galleryItems]);

    // Filter & search logic
    const filteredItems = useMemo(() => {
        return galleryItems.filter(item => {
            const matchesCategory = activeFilter === 'All' || item.category === activeFilter;
            const query = searchQuery.toLowerCase().trim();
            const titleEn = (item.title || '').toLowerCase();
            const titleBn = (item.title_bn || '').toLowerCase();
            const catEn = (item.category || '').toLowerCase();
            const catBn = (item.category_bn || '').toLowerCase();
            const matchesSearch = !query || 
                titleEn.includes(query) || 
                titleBn.includes(query) ||
                catEn.includes(query) ||
                catBn.includes(query);
            return matchesCategory && matchesSearch && (!favoritesOnly || likedItems.has(item.id));
        });
    }, [galleryItems, activeFilter, searchQuery, favoritesOnly, likedItems]);

    const handleLike = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setLikedItems(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
                toast.success(language === 'bn' ? 'পছন্দ করা হয়েছে! ❤️' : 'Added to favorites! ❤️');
            }
            return next;
        });
    };

    const handleShare = async (e: React.MouseEvent, item: any) => {
        e.stopPropagation();
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: language === 'bn' ? item.title_bn || item.title : item.title,
                    text: `Check out "${item.title}" at Rizqara Tech Activities Gallery!`,
                    url: url
                });
            } catch (err) {
                // Cancelled share
            }
        } else {
            navigator.clipboard.writeText(url);
            setSharedId(item.id);
            toast.success(language === 'bn' ? 'লিঙ্ক কপি করা হয়েছে!' : 'Link copied to clipboard!');
            setTimeout(() => setSharedId(null), 2000);
        }
    };

    // Modal navigation
    const navigateModal = (direction: 'prev' | 'next') => {
        if (!selectedImage) return;
        const currentIndex = filteredItems.findIndex(i => i.id === selectedImage.id);
        if (currentIndex === -1) return;
        const nextIndex = direction === 'next' 
            ? (currentIndex + 1) % filteredItems.length 
            : (currentIndex - 1 + filteredItems.length) % filteredItems.length;
        setSelectedImage(filteredItems[nextIndex]);
    };

    useEffect(() => {
        if (!selectedImage) return;
        const onKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setSelectedImage(null);
            if (event.key === 'ArrowRight') navigateModal('next');
            if (event.key === 'ArrowLeft') navigateModal('prev');
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [selectedImage, filteredItems]);
    return (
        <div className="rq-gallery min-h-screen bg-[#FDFBF9] text-gray-900 pt-28 pb-32 relative">
            <SEO 
                title={language === 'bn' ? "লাইফ ও অ্যাক্টিভিটিজ গ্যালারি | রিজকারা টেক" : "Life & Activities Gallery | RizQara Tech"}
                description={language === 'bn' 
                    ? "রিজকারা টেকের সাম্প্রতিক ইভেন্ট, কর্মশালা, হ্যাকাথন এবং টিমের প্রাণবন্ত মুহূর্তগুলো এক্সপ্লোর করুন।" 
                    : "Explore moments from RizQara Tech's recent events, workshops, hackathons, company culture, and team milestones in Dhaka, Bangladesh."}
                keywords="RizQara Tech gallery, software company events Dhaka, tech summit Bangladesh, team building workshop, software developers life"
                canonical="https://rizqara.tech/gallery"
            />

            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-gradient-to-b from-red-50/70 via-rose-50/30 to-transparent pointer-events-none -z-10" />

            <div className="container mx-auto px-6 max-w-7xl">
                
                {/* ── 1. CLEAN HEADER ── */}
                <div className="rq-gallery-heading relative text-center max-w-5xl mx-auto mb-10 pt-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#500000]/15 shadow-sm mb-4"
                    >
                        <Sparkles size={14} className="text-[#500000]" />
                        <span className="text-xs font-black uppercase tracking-widest text-[#500000]">
                            {language === 'bn' ? 'রিজকারা লাইফ ও মোমেন্টস' : 'RizQara Life & Moments'}
                        </span>
                    </motion.div>

                    {/* Single-line Hero Title on Desktop */}
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight leading-tight whitespace-normal md:whitespace-nowrap"
                    >
                        {language === 'bn' ? (
                            <>আমাদের প্রাণবন্ত <span className="text-[#500000]">কার্যক্রম ও সংস্কৃতি</span></>
                        ) : (
                            <>Stories Behind Our <span className="text-[#500000]">Culture & Code</span></>
                        )}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="text-base text-gray-600 max-w-2xl mx-auto font-normal leading-relaxed"
                    >
                        {language === 'bn'
                            ? 'আমাদের সাম্প্রতিক ইভেন্ট, কর্মশালা এবং দলের প্রাণবন্ত মুহূর্তগুলো এক্সপ্লোর করুন।'
                            : 'Explore moments from our recent events, workshops, hackathons, and team milestones.'}
                    </motion.p>
                </div>

                {/* ── 2. SEARCH & CATEGORY BAR (FIRST SECTION) ── */}
                <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-200 shadow-sm mb-12 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Category Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                        <Tag size={16} className="text-[#500000] hidden sm:block shrink-0 mr-1" />
                        {categories.map((cat) => {
                            const isActive = activeFilter === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setActiveFilter(cat)}
                                    className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all shrink-0 ${
                                        isActive
                                            ? 'text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                                    }`}
                                    style={isActive ? { backgroundColor: '#500000' } : {}}
                                >
                                    {cat === 'All' ? (language === 'bn' ? 'সব ছবি' : 'All Photos') : cat}
                                </button>
                            );
                        })}
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-80 shrink-0">
                        <Search 
                            size={18} 
                            className="absolute text-gray-400 pointer-events-none" 
                            style={{ left: 14, top: '50%', transform: 'translateY(-50%)' }}
                        />
                        <input aria-label="Search gallery"
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={language === 'bn' ? 'ছবি বা কার্যক্রম খুঁজুন...' : 'Search photos or events...'}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#500000] transition-colors font-medium text-gray-800 placeholder-gray-400 shadow-inner"
                            style={{ paddingLeft: '44px', paddingRight: '36px', paddingTop: '10px', paddingBottom: '10px' }}
                        />
                        {searchQuery && (
                            <button aria-label="Close"
                                onClick={() => setSearchQuery('')}
                                className="absolute text-gray-400 hover:text-gray-600 p-1"
                                style={{ right: 10, top: '50%', transform: 'translateY(-50%)' }}
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="rq-gallery-meta"><span aria-live="polite">{filteredItems.length} moments to explore</span><button aria-pressed={favoritesOnly} onClick={() => setFavoritesOnly(!favoritesOnly)}>{favoritesOnly ? 'Show all moments' : `Your favorites (${likedItems.size})`} ♡</button></div>
                {/* ── 3. ALL PHOTOS & CARDS (BIG SIZE COVER STYLE) ── */}
                {filteredItems.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm p-8"
                    >
                        <div className="w-16 h-16 rounded-full bg-red-50 text-[#500000] flex items-center justify-center mx-auto mb-4">
                            <ImageIcon size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {language === 'bn' ? 'কোনো ছবি পাওয়া যায়নি' : 'No photos found'}
                        </h3>
                        <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                            {language === 'bn' ? 'অনুগ্রহ করে ভিন্ন কোনো ক্যাটাগরি বা অনুসন্ধানী শব্দ দিয়ে চেষ্টা করুন।' : 'Try selecting another category pill or clearing your search keywords.'}
                        </p>
                        <button
                            onClick={() => { setActiveFilter('All'); setSearchQuery(''); setFavoritesOnly(false); }}
                            className="px-6 py-2.5 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors"
                            style={{ backgroundColor: '#500000' }}
                        >
                            {language === 'bn' ? 'রিসেট করুন' : 'Reset Filters'}
                        </button>
                    </motion.div>
                ) : (
                    <div 
                        className="rq-gallery-grid w-full"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 360px), 1fr))',
                            gap: '32px'
                        }}
                    >
                        {filteredItems.map((item, index) => {
                            const isLiked = likedItems.has(item.id);

                            return (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 25 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                    className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-500 group flex flex-col hover:-translate-y-1.5"
                                    tabIndex={0} aria-label={`Open ${item.title}`} onKeyDown={e => { if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setSelectedImage(item); } }} onClick={() => setSelectedImage(item)}
                                >
                                    {/* Big Size Cover Image Area (Aspect 16:10 / 280px minimum height) */}
                                    <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-gray-100 cursor-pointer">
                                        <img
                                            src={item.image}
                                            alt={language === 'bn' ? item.title_bn || item.title : item.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                                            loading="lazy"
                                        />

                                        {/* Hover Overlay with Zoom Lens */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                            <div className="w-14 h-14 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-all duration-300 border border-white/40 shadow-xl">
                                                <ZoomIn size={24} />
                                            </div>
                                        </div>

                                        {/* Category Badge */}
                                        <div className="absolute top-4 left-4 z-10 pointer-events-none">
                                            <span 
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: '6px 16px',
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    backdropFilter: 'blur(8px)',
                                                    WebkitBackdropFilter: 'blur(8px)',
                                                    borderRadius: '9999px',
                                                    fontSize: '11px',
                                                    fontWeight: 800,
                                                    textTransform: 'uppercase',
                                                    letterSpacing: '0.08em',
                                                    color: '#500000',
                                                    lineHeight: 1,
                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                                    border: '1px solid rgba(255, 255, 255, 0.9)',
                                                    userSelect: 'none'
                                                }}
                                            >
                                                {language === 'bn' ? item.category_bn || item.category : item.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Details Area */}
                                    <div className="p-6 flex flex-col flex-grow justify-between bg-white">
                                        <div>
                                            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-2.5">
                                                <Calendar size={14} className="text-[#500000]" />
                                                <span>
                                                    {new Date(item.date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-black text-gray-900 group-hover:text-[#500000] transition-colors leading-snug line-clamp-2 mb-2">
                                                {language === 'bn' ? item.title_bn || item.title : item.title}
                                            </h3>
                                        </div>

                                        {/* Clean Action Toolbar without numbers/digits */}
                                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-4">
                                            <button
                                                onClick={(e) => handleLike(e, item.id)}
                                                className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl transition-all ${
                                                    isLiked 
                                                        ? 'text-red-500 bg-red-50 border border-red-200' 
                                                        : 'text-gray-600 bg-gray-50 hover:text-red-500 hover:bg-red-50/50'
                                                }`}
                                            >
                                                <Heart size={16} className={isLiked ? 'fill-red-500' : ''} />
                                                <span>{isLiked ? (language === 'bn' ? 'পছন্দ হয়েছে' : 'Favorited') : (language === 'bn' ? 'পছন্দ করুন' : 'Favorite')}</span>
                                            </button>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => handleShare(e, item)}
                                                    className="p-2.5 rounded-xl bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                                    title={language === 'bn' ? 'শেয়ার করুন' : 'Share'}
                                                >
                                                    {sharedId === item.id ? <Check size={16} className="text-green-500" /> : <Share2 size={16} />}
                                                </button>
                                                <button
                                                    tabIndex={0} aria-label={`Open ${item.title}`} onKeyDown={e => { if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setSelectedImage(item); } }} onClick={() => setSelectedImage(item)}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow"
                                                    style={{ backgroundColor: '#500000' }}
                                                >
                                                    <Eye size={14} />
                                                    <span>{language === 'bn' ? 'দেখুন' : 'View'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* ── 4. BOTTOM INVITATION BANNER ── */}
                <div 
                    className="mt-32 rounded-3xl p-8 md:p-14 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
                    style={{ backgroundColor: '#500000' }}
                >
                    <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
                    <div className="relative z-10 max-w-xl">
                        <span className="text-red-200 text-xs font-black uppercase tracking-widest block mb-2">
                            {language === 'bn' ? 'আমাদের পরবর্তী কার্যক্রমে যুক্ত হোন' : 'JOIN OUR NEXT JOURNEY'}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-black mb-3 text-white">
                            {language === 'bn' ? 'রিজকারা পরিবারের অংশ হতে চান?' : 'Want to be part of our next big memory?'}
                        </h3>
                        <p className="text-red-100/80 text-sm leading-relaxed font-normal">
                            {language === 'bn' 
                                ? 'আমরা সর্বদা উচ্চাভিলাষী ডেভেলপার, ডিজাইনার ও স্বপ্নদর্শীদের সাথে কাজ করতে আগ্রহী। ক্যারিয়ার পেইজে আমাদের উন্মুক্ত সুযোগগুলো দেখুন।'
                                : 'We are always looking for passionate engineers, designers, and innovators to build the next generation of digital products with us.'}
                        </p>
                    </div>

                    <div className="relative z-10 flex flex-wrap gap-4 shrink-0">
                        <a
                            href="/careers"
                            className="px-8 py-4 bg-white text-[#500000] rounded-xl font-black text-sm hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                        >
                            {language === 'bn' ? 'ক্যারিয়ার সুযোগ দেখুন' : 'View Open Roles'}
                        </a>
                        <a
                            href="/contact"
                            className="px-8 py-4 rounded-xl font-bold text-sm transition-all shadow-md hover:bg-white/10 active:translate-y-0"
                            style={{ 
                                backgroundColor: 'transparent',
                                color: '#ffffff',
                                border: '2px solid #ffffff'
                            }}
                        >
                            {language === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us'}
                        </a>
                    </div>
                </div>

            </div>


            {/* ── 5. LIGHTBOX / MODAL VIEW — rendered via Portal on document.body to escape stacking contexts ── */}
            {createPortal(
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            key="gallery-modal" ref={galleryDialog} role="dialog" aria-modal="true" aria-label="Gallery image viewer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backgroundColor: 'rgba(15,15,20,0.55)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
                            onClick={() => setSelectedImage(null)}
                        >
                            {/* Close button */}
                            <button aria-label="Close"
                                style={{ position: 'absolute', top: 24, right: 24, zIndex: 10000, padding: 12, background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                onClick={() => setSelectedImage(null)}
                            >
                                <X size={24} />
                            </button>

                            {/* Prev Arrow */}
                            <button aria-label="Previous"
                                onClick={(e) => { e.stopPropagation(); navigateModal('prev'); }}
                                style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', zIndex: 10000, width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <ChevronLeft size={24} />
                            </button>

                            {/* Next Arrow */}
                            <button aria-label="Next"
                                onClick={(e) => { e.stopPropagation(); navigateModal('next'); }}
                                style={{ position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)', zIndex: 10000, width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <ChevronRight size={24} />
                            </button>

                            <motion.div
                                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                                animate={{ scale: 1, y: 0, opacity: 1 }}
                                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                                style={{
                                    width: '90vw',
                                    maxWidth: 900,
                                    height: '85vh',
                                    maxHeight: 580,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    borderRadius: 20,
                                    overflow: 'hidden',
                                    boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
                                    background: '#fff'
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Photo Viewer — fills its half completely */}
                                <div style={{
                                    flex: '0 0 55%',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    background: '#0d0d0d'
                                }}>
                                    <img
                                        src={selectedImage.image}
                                        alt={language === 'bn' ? selectedImage.title_bn || selectedImage.title : selectedImage.title}
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    {/* Category overlay badge on photo */}
                                    <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, pointerEvents: 'none' }}>
                                        <span 
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                padding: '6px 16px',
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                backdropFilter: 'blur(8px)',
                                                WebkitBackdropFilter: 'blur(8px)',
                                                borderRadius: '9999px',
                                                fontSize: '11px',
                                                fontWeight: 800,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.08em',
                                                color: '#500000',
                                                lineHeight: 1,
                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                                border: '1px solid rgba(255, 255, 255, 0.9)',
                                                userSelect: 'none'
                                            }}
                                        >
                                            {language === 'bn' ? selectedImage.category_bn || selectedImage.category : selectedImage.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Info Panel */}
                                <div style={{
                                    flex: '0 0 45%',
                                    background: '#fff',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    overflowY: 'auto',
                                    padding: '28px 28px 24px 28px'
                                }}>
                                    <div>
                                        {/* Brand header */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid #f3f4f6' }}>
                                            <div style={{ width: 44, height: 44, borderRadius: 14, background: '#fff', border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                                                <img
                                                    src="/rizqaratechlogo.png"
                                                    alt="RizQara Tech"
                                                    style={{ width: 36, height: 36, objectFit: 'contain' }}
                                                />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700, color: '#111827', fontSize: 15 }}>RizQara Tech</div>
                                                <div style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>Software & Innovation Studio</div>
                                            </div>
                                        </div>

                                        {/* Title */}
                                        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#111827', lineHeight: 1.3, marginBottom: 10 }}>
                                            {language === 'bn' ? selectedImage.title_bn || selectedImage.title : selectedImage.title}
                                        </h2>

                                        {/* Date */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b7280', marginBottom: 14 }}>
                                            <Calendar size={14} color="#500000" />
                                            <span>
                                                {new Date(selectedImage.date).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </span>
                                        </div>

                                        {/* Description */}
                                        <p style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.7, paddingTop: 14, borderTop: '1px solid #f3f4f6', marginBottom: 18 }}>
                                            {language === 'bn'
                                                ? (selectedImage.description_bn || selectedImage.description || 'এই মুহূর্তটি আমাদের টিমের ক্রমাগত সাধনা, সৃজনশীলতা এবং শ্রেষ্ঠত্ব অর্জনের প্রতিশ্রুতির প্রতীক।')
                                                : (selectedImage.description || 'This moment reflects our shared passion for technology, collaborative problem solving, and building memorable milestones together.')}
                                        </p>

                                        {/* Metadata */}
                                        <div style={{ background: '#f9fafb', borderRadius: 14, padding: '12px 16px', border: '1px solid #f3f4f6' }}>
                                            {[
                                                { 
                                                    label: language === 'bn' ? 'লোকেশন' : 'Location', 
                                                    value: (language === 'bn' ? (selectedImage.location_bn || selectedImage.location) : selectedImage.location) || 'Dhaka HQ, Bangladesh' 
                                                },
                                                { 
                                                    label: language === 'bn' ? 'ক্যাটাগরি' : 'Category', 
                                                    value: (language === 'bn' ? (selectedImage.category_bn || selectedImage.category) : selectedImage.category) || 'Event' 
                                                },
                                                { label: 'Item ID', value: selectedImage.id }
                                            ].map(({ label, value }) => (
                                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', marginBottom: 6 }}>
                                                    <span style={{ fontWeight: 600, color: '#9ca3af' }}>{label}:</span>
                                                    <span style={{ fontWeight: 700, color: '#111827' }}>{value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Engagement Bar */}
                                    <div style={{ paddingTop: 20, borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 10, marginTop: 18 }}>
                                        <button
                                            onClick={(e) => handleLike(e, selectedImage.id)}
                                            style={{
                                                flex: 1,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                                padding: '10px 16px', borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: 'pointer', border: '1px solid',
                                                background: likedItems.has(selectedImage.id) ? '#fff1f2' : '#f3f4f6',
                                                color: likedItems.has(selectedImage.id) ? '#ef4444' : '#374151',
                                                borderColor: likedItems.has(selectedImage.id) ? '#fecdd3' : 'transparent'
                                            }}
                                        >
                                            <Heart size={16} style={{ fill: likedItems.has(selectedImage.id) ? '#ef4444' : 'none' }} />
                                            <span>{likedItems.has(selectedImage.id) ? 'Favorited' : 'Favorite'}</span>
                                        </button>
                                        <button
                                            onClick={(e) => handleShare(e, selectedImage)}
                                            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: 'pointer', background: '#f3f4f6', color: '#374151', border: 'none' }}
                                        >
                                            {sharedId === selectedImage.id ? <Check size={16} color="#16a34a" /> : <Share2 size={16} />}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};
