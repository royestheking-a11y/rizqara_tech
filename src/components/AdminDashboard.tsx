import '../styles/admin-dashboard.css';
import { VisitorAnalytics } from './admin/VisitorAnalytics';
import serviceCatalog from '../../shared/service-catalog.json';
import { useDialog } from '../utils/useDialog';
import { apiRequest, API_URL } from '../utils/api';
import React, { useState } from 'react';
import { toast } from "sonner";
import { useData } from '../context/DataContext';
import { AdminButton, AdminInput, AdminTextArea, AdminSelect } from './AdminComponents';
import {
    LayoutDashboard, Briefcase, Users, MessageSquare,
    Plus, Trash2, Edit2, Save, X, RotateCcw,
    FileText, PlayCircle, Image, Settings, LogOut,
    ChevronRight, Search, Sliders, Globe, Inbox, Mail, FileDown, Tag, Check, Bell, Sparkles
} from 'lucide-react';
import { ImageUploader } from './admin/ImageUploader';
import { UserInteractionAnalytics } from './admin/UserInteractionAnalytics';
import { getYoutubeId } from './premium/UIComponents';
import { PromotionCard } from './premium/PromotionOverlay';

const generateId = () => Math.random().toString(36).substr(2, 9);

const PremiumStatCard = ({ icon: Icon, value, label }: {
    icon: typeof Briefcase; value: number; label: string;
}) => (
    <div className="rq-admin-stat">
        <span className="rq-admin-stat-icon"><Icon size={19} aria-hidden="true" /></span>
        <strong>{value.toLocaleString()}</strong>
        <span>{label}</span>
    </div>
);

export const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
    const { services, projects, reviews, blogs, jobs, videos, carouselSlides, buildOptions, messages, careerApplications, caseStudies, promotion, notices, galleryItems, updateData, resetData, language, deleteData, fetchAdminData, markMessageRead } = useData();

    React.useEffect(() => {
        void fetchAdminData().catch(error => toast.error(error.message));
    }, []);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [editingItem, setEditingItem] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dialogRef = useDialog(isModalOpen, () => setIsModalOpen(false));
    const [modalType, setModalType] = useState<'service' | 'project' | 'review' | 'blog' | 'job' | 'video' | 'carousel' | 'buildOption' | 'caseStudy' | 'notice' | 'galleryItem'>('service');
    const [searchTerm, setSearchTerm] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [carouselImage, setCarouselImage] = useState('');
    const [projectImage, setProjectImage] = useState('');
    const [blogImage, setBlogImage] = useState('');
    const [caseStudyImage, setCaseStudyImage] = useState('');
    const [galleryImage, setGalleryImage] = useState('');
    const [uploadingCount, setUploadingCount] = useState(0);
    const isUploadingImage = uploadingCount > 0;

    // Local state for live preview in Admin
    const [localPromotion, setLocalPromotion] = useState(promotion);

    // Sync local promotion state if global promotion changes (e.g. on initial load)
    React.useEffect(() => {
        setLocalPromotion(promotion);
    }, [promotion]);

    // --- Handlers ---

    const handleDelete = async (type: string, id: string) => {
        if (!window.confirm(language === 'bn' ? 'আপনি কি নিশ্চিত যে আপনি এই আইটেমটি মুছতে চান?' : 'Are you sure you want to delete this item?')) return;

        try {
        if (type === 'message') await deleteData('messages', id);
        if (type === 'application') await deleteData('careerApplications', id);
        if (type === 'service') await deleteData('services', id);
        if (type === 'project') await deleteData('projects', id);
        if (type === 'review') await deleteData('reviews', id);
        if (type === 'blog') await deleteData('blogs', id);
        if (type === 'job') await deleteData('jobs', id);
        if (type === 'video') await deleteData('videos', id);
        if (type === 'carousel') await deleteData('carousel', id);
        if (type === 'buildOption') await deleteData('buildOptions', id);
        if (type === 'caseStudy') await deleteData('caseStudies', id);
        if (type === 'notice') await deleteData('notice', id);
        if (type === 'galleryItem') await deleteData('galleryItems', id);
        } catch (error) { toast.error(error instanceof Error ? error.message : 'Delete failed'); }
        // Private records use authenticated versioned deletion.
        // Note: AdminDashboard usually handles main content. Messages might be handled in "messages" tab
    };

    const [saving, setSaving] = useState(false);
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (saving) return;
        setSaving(true);
        try {
        const formData = new FormData(e.target as HTMLFormElement);
        const data: any = Object.fromEntries(formData.entries());

        if (modalType === 'service') {
            for (const field of ['capabilities', 'capabilities_bn', 'process', 'process_bn']) data[field] = String(data[field] || '').split('\n').map(s => s.trim()).filter(Boolean);
        }
        if (modalType === 'project' && data.tech) {
            data.tech = data.tech.split(',').map((t: string) => t.trim());
        }
        if (modalType === 'project') {
            if (data.features) data.features = data.features.split(',').map((t: string) => t.trim());
            if (data.features_bn) data.features_bn = data.features_bn.split(',').map((t: string) => t.trim());
            // Explicitly set image from state to ensure it's not empty
            data.image = String(data.coverUrl || '').trim() || projectImage || data.image;
            delete data.coverUrl;

            if (!data.image) {
                toast.error('Upload a project image or enter its URL.');
                return;
            }
        }

        // Handle Project Gallery
        if (modalType === 'project') {
            const gallery: string[] = [];
            if (data.gallery_1) gallery.push(data.gallery_1);
            if (data.gallery_2) gallery.push(data.gallery_2);
            if (data.gallery_3) gallery.push(data.gallery_3);
            data.gallery = gallery;

            // Remove temp fields
            delete data.gallery_1;
            delete data.gallery_2;
            delete data.gallery_3;
        }

        // Handle Case Study Logic
        if (modalType === 'caseStudy') {
            if (data.tech) data.tech = data.tech.split(',').map((t: string) => t.trim());
            if (data.features) data.features = data.features.split(',').map((t: string) => t.trim());
            if (data.features_bn) data.features_bn = data.features_bn.split(',').map((t: string) => t.trim());
            
            if (caseStudyImage) data.image = caseStudyImage;
            
            const gallery: string[] = [];
            if (data.gallery_1) gallery.push(data.gallery_1);
            if (data.gallery_2) gallery.push(data.gallery_2);
            if (data.gallery_3) gallery.push(data.gallery_3);
            if (data.gallery_4) gallery.push(data.gallery_4);
            data.gallery = gallery;
            
            // Handle Growth Before/After
            if (data.growthBefore) data.growthBefore = data.growthBefore;
            if (data.growthAfter) data.growthAfter = data.growthAfter;

            // Delete temp fields
            delete data.gallery_1;
            delete data.gallery_2;
            delete data.gallery_3;
            delete data.gallery_4;
        }

        if (modalType === 'video' && data.url) {
            const videoId = getYoutubeId(data.url);
            if (videoId) {
                data.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            } else {
                data.thumbnail = 'https://via.placeholder.com/640x360?text=No+Thumbnail';
            }
            if (videoId) {
                data.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            } else {
                data.thumbnail = 'https://via.placeholder.com/640x360?text=No+Thumbnail';
            }
        }

        if (modalType === 'carousel' && carouselImage) data.image = carouselImage;
        if (modalType === 'blog' && blogImage) data.image = blogImage;
        if (modalType === 'galleryItem' && galleryImage) data.image = galleryImage;

        if (modalType === 'notice') {
            const newItem = {
                id: editingItem ? editingItem.id : generateId(),
                ...data,
                isActive: data.isActive === 'on' || data.isActive === true
            };
            const updatedNotices = editingItem 
                ? notices.map((n: any) => n.id === editingItem.id ? newItem : n) 
                : [...notices, newItem];
            await updateData('notice', updatedNotices);
            setIsModalOpen(false);
            setEditingItem(null);
            return;
        }

        const newItem = {
            id: editingItem ? editingItem.id : generateId(),
            ...data,
            rating: data.rating ? parseInt(data.rating) : undefined,
            value: data.value ? parseFloat(data.value) : undefined
        };

        if (modalType === 'service') await updateData('services', editingItem ? services.map(s => s.id === editingItem.id ? newItem : s) : [...services, newItem]);
        if (modalType === 'project') await updateData('projects', editingItem ? projects.map(p => p.id === editingItem.id ? newItem : p) : [...projects, newItem]);
        if (modalType === 'review') await updateData('reviews', editingItem ? reviews.map(r => r.id === editingItem.id ? newItem : r) : [...reviews, newItem]);
        if (modalType === 'blog') await updateData('blogs', editingItem ? blogs.map(b => b.id === editingItem.id ? newItem : b) : [...blogs, newItem]);
        if (modalType === 'job') await updateData('jobs', editingItem ? jobs.map(j => j.id === editingItem.id ? newItem : j) : [...jobs, newItem]);
        if (modalType === 'video') await updateData('videos', editingItem ? videos.map(v => v.id === editingItem.id ? newItem : v) : [...videos, newItem]);
        if (modalType === 'carousel') await updateData('carousel', editingItem ? carouselSlides.map(c => c.id === editingItem.id ? newItem : c) : [...carouselSlides, newItem]);
        if (modalType === 'buildOption') await updateData('buildOptions', editingItem ? buildOptions.map(b => b.id === editingItem.id ? newItem : b) : [...buildOptions, newItem]);
        if (modalType === 'caseStudy') await updateData('caseStudies', editingItem ? caseStudies.map(c => c.id === editingItem.id ? newItem : c) : [...caseStudies, newItem]);
        if (modalType === 'galleryItem') await updateData('galleryItems', editingItem ? galleryItems.map(g => g.id === editingItem.id ? newItem : g) : [...galleryItems, newItem]);

        setIsModalOpen(false);
        setEditingItem(null);
        } catch { /* Preserve the editor when persistence fails. */ }
        finally { setSaving(false); }
    };

    const openModal = (type: any, item: any = null) => {
        setModalType(type);
        setEditingItem(item);
        if (type === 'video') {
            setVideoUrl(item?.url || '');
        }
        setCarouselImage(item?.image || '');
        setProjectImage(item?.image || '');
        setBlogImage(item?.image || '');
        setCaseStudyImage(item?.image || '');
        setGalleryImage(item?.image || '');
        // Service uses projectImage state for convenience if not separate? No, check form.
        setIsModalOpen(true);
    };

    // --- Renderers ---

    const renderDashboard = () => (
        <div className="rq-admin-overview">
            {/* Core Solutions & Catalog */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#8c6d7a]">
                        {language === 'bn' ? "মূল কনটেন্ট ও সেবা" : "Core Solutions & Assets"}
                    </h3>
                    <span className="text-[11px] font-medium text-[#a38795]">Published catalog</span>
                </div>
                <div className="rq-admin-stat-grid">
                    <PremiumStatCard
                        icon={Briefcase}
                        value={services.length}
                        label={language === 'bn' ? "মোট সেবা" : "Total Services"}
                    />
                    <PremiumStatCard
                        icon={LayoutDashboard}
                        value={projects.length}
                        label={language === 'bn' ? "প্রজেক্ট রেকর্ড" : "Project records"}
                    />
                    <PremiumStatCard
                        icon={Globe}
                        value={caseStudies.length}
                        label={language === 'bn' ? "কেস স্টাডি" : "Case Studies"}
                    />
                    <PremiumStatCard
                        icon={MessageSquare}
                        value={reviews.length}
                        label={language === 'bn' ? "মোট পর্যালোচনা" : "Client Reviews"}
                    />
                </div>
            </div>

            {/* Inquiries & Content Operations */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#8c6d7a]">
                        {language === 'bn' ? "অপারেশনস ও পাইপলাইন" : "Operations & Communications"}
                    </h3>
                    <span className="text-[11px] font-medium text-[#a38795]">Incoming leads & media updates</span>
                </div>
                <div className="rq-admin-stat-grid">
                    <PremiumStatCard
                        icon={Inbox}
                        value={messages.filter(m => m.type === 'Contact').length}
                        label={language === 'bn' ? "বার্তা" : "Inquiries"}
                    />
                    <PremiumStatCard
                        icon={Users}
                        value={jobs.length}
                        label={language === 'bn' ? "খালি পদ" : "Open Jobs"}
                    />
                    <PremiumStatCard
                        icon={FileDown}
                        value={careerApplications.length}
                        label={language === 'bn' ? "আবেদন" : "Submissions"}
                    />
                    <PremiumStatCard
                        icon={FileText}
                        value={blogs.length}
                        label={language === 'bn' ? "ব্লগ পোস্ট" : "Blog Posts"}
                    />
                    <PremiumStatCard
                        icon={PlayCircle}
                        value={videos.length}
                        label={language === 'bn' ? "ভিডিও" : "Videos"}
                    />
                </div>
            </div>

            <VisitorAnalytics />
            <UserInteractionAnalytics />

            {/* System Preferences Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#faf4f7] via-white to-[#fdf9fb] border border-[#ebdce3] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                <div>
                    <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-2 h-2 rounded-full bg-[#500000] animate-pulse"></div>
                        <h3 className="text-base font-bold text-[#230711]">{language === 'bn' ? "সিস্টেম ও লোকাল কন্ট্রোল" : "System & Local Controls"}</h3>
                    </div>
                    <p className="text-xs text-[#8c6d7a] max-w-xl">{language === 'bn' ? "ল্যাঙ্গুয়েজ প্রেফারেন্স রিসেট করুন অথবা রিফ্রেশ করুন।" : "Reset client language cache and re-sync editorial assets with the production database."}</p>
                </div>
                <AdminButton variant="secondary" onClick={() => { if (window.confirm(language === 'bn' ? 'ভাষার পছন্দ রিসেট করবেন?'  : 'Reset your language preference?')) resetData(); }}>
                    <RotateCcw size={16} /> {language === 'bn' ? "ভাষার পছন্দ রিসেট করুন" : "Reset Language Preference"}
                </AdminButton>
            </div>
        </div>
    );

    const renderList = (title: string, data: any[], type: string, renderItem: (item: any) => React.ReactNode) => {
        const filteredData = data.filter(item =>
            JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#f0e4eb]">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-black text-[#230711] tracking-tight">{title}</h2>
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#500000]/10 text-[#500000] border border-[#500000]/15">
                                {data.length} {language === 'bn' ? 'টি আইটেম' : 'records'}
                            </span>
                        </div>
                        <p className="text-[#8c6d7a] text-xs font-medium mt-1">
                            {language === 'bn' ? 'রেকর্ড পরিচালনা ও হালনাগাদ করুন।' : 'Manage, review, and edit live catalog entries.'}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-72">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a7d8c]" size={16} />
                            <input
                                aria-label="Search records"
                                type="text"
                                placeholder={language === 'bn' ? 'অনুসন্ধান করুন...' : "Search records..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-9 py-2.5 bg-white border border-[#e5d4dc] rounded-xl text-xs font-medium text-[#230711] placeholder:text-[#9e838f] focus:outline-none focus:border-[#500000] focus:ring-2 focus:ring-[#500000]/15 transition-all"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        {!['message', 'application'].includes(type) && (
                            <AdminButton onClick={() => openModal(type)} className="whitespace-nowrap">
                                <Plus size={16} /> {language === 'bn' ? 'নতুন যোগ করুন' : 'Add New'}
                            </AdminButton>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3.5">
                    {filteredData.map(item => (
                        <div
                            key={item.id}
                            className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 border border-[#ebdce3] shadow-xs hover:border-[#500000]/30 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
                        >
                            <div className="flex-1 w-full min-w-0">
                                {renderItem(item)}
                            </div>
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                {!['message', 'application'].includes(type) && (
                                    <AdminButton
                                        aria-label="Edit record"
                                        variant="secondary"
                                        onClick={() => openModal(type, item)}
                                        className="px-3.5 py-2 text-xs"
                                    >
                                        <Edit2 size={14} />
                                        <span className="hidden md:inline">{language === 'bn' ? 'সম্পাদনা' : 'Edit'}</span>
                                    </AdminButton>
                                )}
                                <AdminButton
                                    aria-label="Delete record"
                                    variant="danger"
                                    onClick={() => handleDelete(type, item.id)}
                                    className="px-3.5 py-2 text-xs"
                                >
                                    <Trash2 size={14} />
                                    <span className="hidden md:inline">{language === 'bn' ? 'মুছুন' : 'Delete'}</span>
                                </AdminButton>
                            </div>
                        </div>
                    ))}

                    {filteredData.length === 0 && (
                        <div className="text-center py-16 px-4 bg-[#faf6f8] rounded-2xl border border-dashed border-[#e5d4dc]">
                            <div className="w-12 h-12 rounded-2xl bg-[#500000]/10 text-[#500000] flex items-center justify-center mx-auto mb-3">
                                <Search size={22} />
                            </div>
                            <h4 className="text-sm font-bold text-[#230711] mb-1">
                                {language === 'bn' ? 'কোনো রেকর্ড পাওয়া যায়নি' : 'No records found'}
                            </h4>
                            <p className="text-xs text-[#8c6d7a] max-w-sm mx-auto mb-4">
                                {searchTerm
                                    ? (language === 'bn' ? 'আপনার অনুসন্ধানের সাথে মিলছে এমন কোনো আইটেম নেই।' : 'No items match your search term. Try adjusting your filter.')
                                    : (language === 'bn' ? 'এই ক্যাটাগরিতে এখনও কোনো আইটেম যোগ করা হয়নি।' : 'No entries have been created for this category yet.')}
                            </p>
                            {!['message', 'application'].includes(type) && (
                                <AdminButton onClick={() => openModal(type)} className="mx-auto text-xs py-2 px-4">
                                    <Plus size={15} /> {language === 'bn' ? 'প্রথম আইটেম যোগ করুন' : 'Add First Entry'}
                                </AdminButton>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const handleAutoTranslate = async (e: React.MouseEvent) => {
        e.preventDefault();
        const form = document.getElementById('admin-form') as HTMLFormElement;
        if (!form) return;


        const translatePairs = [
            { src: 'title', dest: 'title_bn' },
            { src: 'subtitle', dest: 'subtitle_bn' },
            { src: 'description', dest: 'description_bn' },
            { src: 'details', dest: 'details_bn' },
            { src: 'cta', dest: 'cta_bn' },
            { src: 'category', dest: 'category_bn' },
            { src: 'excerpt', dest: 'excerpt_bn' },
            { src: 'content', dest: 'content_bn' },
            // Project select fallback
            { src: 'category', dest: 'category_bn' },
            { src: 'location', dest: 'location_bn' },
            { src: 'salary', dest: 'salary_bn' },
            { src: 'type', dest: 'type_bn' },
            { src: 'features', dest: 'features_bn' },
            { src: 'role', dest: 'role_bn' },
            { src: 'company', dest: 'company_bn' }
        ];

        const toTranslate: { text: string, destEl: HTMLInputElement | HTMLTextAreaElement }[] = [];

        for (const pair of translatePairs) {
            const srcEl = form.elements.namedItem(pair.src) as HTMLInputElement | HTMLTextAreaElement;
            const destEl = form.elements.namedItem(pair.dest) as HTMLInputElement | HTMLTextAreaElement;

            if (srcEl && destEl && srcEl.value && !destEl.value) {
                // Determine source text (if it's a select, usually value is enough, but check)
                toTranslate.push({ text: srcEl.value, destEl });
            }
        }

        if (toTranslate.length === 0) {
            toast.info(language === 'bn' ? "অনুবাদের জন্য কোনো খালি ফিল্ড নেই।" : "No empty Bengali fields to translate.");
            return;
        }

        const toastId = toast.loading(language === 'bn' ? "অনুবাদ করা হচ্ছে..." : `Translating ${toTranslate.length} fields...`);

        try {
            await Promise.all(toTranslate.map(async (item) => {
                try {
                    const res = await apiRequest('translate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: item.text })
                    });
                    const data = await res.json();
                    if (data.translatedText) {
                        item.destEl.value = data.translatedText;
                    }
                } catch (e) { throw e; }
            }));
            toast.success(language === 'bn' ? "অনুবাদ সম্পন্ন!" : "Translation complete!", { id: toastId });
        } catch (e) {
            toast.error("Translation failed", { id: toastId });
        }
    };

    const navItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: language === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard' },
        { id: 'inbox', icon: Inbox, label: language === 'bn' ? 'বার্তা' : 'Messages' },
        { id: 'promotions', icon: Tag, label: language === 'bn' ? 'প্রমোশন' : 'Promotions' },
        { id: 'buildOption', icon: Settings, label: language === 'bn' ? 'বিল্ড সিস্টেম' : 'Build System' },
        { id: 'carousel', icon: Image, label: language === 'bn' ? 'হিরো ক্যারোজেল' : 'Hero Carousel' },
        { id: 'services', icon: Briefcase, label: language === 'bn' ? 'সেবাসমূহ' : 'Services' },
        { id: 'projects', icon: LayoutDashboard, label: language === 'bn' ? 'প্রকল্প' : 'Projects' },
        { id: 'reviews', icon: MessageSquare, label: language === 'bn' ? 'পর্যালোচনা' : 'Reviews' },
        { id: 'blogs', icon: FileText, label: language === 'bn' ? 'ব্লগ পোস্ট' : 'Blog Posts' },
        { id: 'caseStudies', icon: Globe, label: language === 'bn' ? 'কেস স্টাডিজ' : 'Case Studies' },
        { id: 'jobs', icon: Users, label: language === 'bn' ? 'ক্যারিয়ার' : 'Careers (Posts)' },
        { id: 'applications', icon: FileDown, label: language === 'bn' ? 'আবেদন' : 'Applications' },
        { id: 'videos', icon: PlayCircle, label: language === 'bn' ? 'ভিডিও' : 'Videos' },
        { id: 'notice', icon: Bell, label: language === 'bn' ? 'নোটিশ' : 'Notice' },
        { id: 'gallery', icon: Image, label: language === 'bn' ? 'গ্যালারি' : 'Gallery' },
    ];

    return (
        <div className="rq-admin">

            {/* Top Header */}
            <header className="rq-admin-top">
                <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 bg-gradient-to-br from-[#500000] to-[#781b37] rounded-xl flex items-center justify-center text-white font-serif font-black shadow-md shadow-[#500000]/25">
                        R
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold text-[#230711] tracking-tight leading-none">RizQara Tech</h1>
                        </div>
                        <p className="text-[10px] font-semibold tracking-wider uppercase text-[#967484] mt-0.5">Control & Management Portal</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#500000] bg-[#faf2f5] hover:bg-[#f3e3eb] border border-[#ebdbe3] rounded-lg transition-colors cursor-pointer"
                    >
                        <span>{language === 'bn' ? 'ওয়েবসাইট দেখুন' : 'View Live Site'}</span>
                        <ChevronRight size={13} />
                    </a>
                    <div className="h-6 w-px bg-[#ebdbe3] hidden sm:block"></div>
                    <div className="text-right hidden md:block">
                        <div className="text-xs font-bold text-[#230711]">{language === 'bn' ? 'সুপার অ্যাডমিনিস্ট্রেটর' : 'Administrator'}</div>
                    </div>
                    <button
                        aria-label="Sign out"
                        onClick={onLogout}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-red-700 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-lg transition-colors cursor-pointer"
                    >
                        <LogOut size={14} />
                        <span className="hidden sm:inline">{language === 'bn' ? 'প্রস্থান' : 'Sign out'}</span>
                    </button>
                </div>
            </header>

            <div className="rq-admin-layout">

                {/* Sidebar Navigation */}
                <nav className="rq-admin-nav" aria-label="Admin sections">
                    <div className="rq-admin-nav-inner">
                        <div className="px-3 py-2 text-[10px] font-bold tracking-[0.16em] uppercase text-[#967484]">
                            Navigation
                        </div>
                        {navItems.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }}
                                className="rq-admin-nav-button"
                                aria-current={activeTab === tab.id ? "page" : undefined}
                            >
                                <div className="flex items-center gap-3">
                                    <tab.icon size={17} />
                                    <span>{tab.label}</span>
                                </div>
                                {activeTab === tab.id && <ChevronRight size={15} />}
                            </button>
                        ))}
                    </div>
                </nav>

                {/* Main Content Area */}
                <div className="rq-admin-content">
                    <h2 className="rq-admin-page-title">{navItems.find(tab => tab.id === activeTab)?.label}</h2>
                    {activeTab === 'dashboard' && renderDashboard()}

                    {activeTab === 'inbox' && renderList(language === 'bn' ? 'ইনবক্স' : 'Inbox', messages, 'message', (item) => (
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                                    item.subject === 'New Newsletter Subscriber'
                                        ? 'bg-[#781b37]/10 text-[#781b37]'
                                        : 'bg-[#500000]/10 text-[#500000]'
                                }`}>
                                    {item.subject === 'New Newsletter Subscriber' ? <Tag size={12} /> : <Mail size={12} />}
                                    <span>{item.subject === 'New Newsletter Subscriber' ? 'Newsletter' : 'Inquiry'}</span>
                                </span>
                                <h3 className="font-bold text-[#230711] text-sm">{item.subject}</h3>
                                {!item.read ? (
                                    <button
                                        type="button"
                                        className="text-[10px] font-bold text-[#500000] bg-[#500000]/10 hover:bg-[#500000]/20 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer"
                                        onClick={() => { void Promise.resolve(markMessageRead(item.id)).catch(error => toast.error(error.message)); }}
                                    >
                                        Mark as read
                                    </button>
                                ) : (
                                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                        Read
                                    </span>
                                )}
                                <span className="text-[11px] font-medium text-[#8c6d7a] ml-auto whitespace-nowrap">{item.date}</span>
                            </div>
                            <div className="text-xs font-semibold text-[#3b1e2a]">
                                <span>{item.name}</span>
                                <span className="font-normal text-[#8c6d7a] ml-2">&lt;{item.email}&gt;</span>
                            </div>
                            <p className="text-xs text-[#3b1e2a] bg-[#faf6f8] p-3 rounded-xl border border-[#eedfe6] leading-relaxed">
                                {item.message}
                            </p>
                            <p className="text-[10px] text-[#8c6d7a]">
                                Delivery status: <strong className="text-[#500000] font-semibold">{item.notificationStatus || 'Dispatched'}</strong>
                            </p>
                        </div>
                    ))}

                    {activeTab === 'promotions' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                            <div className="pb-4 border-b border-[#f0e4eb]">
                                <h2 className="text-2xl font-black text-[#230711] tracking-tight">{language === 'bn' ? 'প্রচার এবং অফার' : 'Promotions & Campaigns'}</h2>
                                <p className="text-xs text-[#8c6d7a] mt-1">{language === 'bn' ? 'গ্লোবাল ওয়েবসাইট পপআপ প্রচারাভিযান পরিচালনা করুন।' : 'Configure promotional banners, discount rates, and live overlay rules.'}</p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Settings Form */}
                                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xs border border-[#ebdce3]">
                                    <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-[#f0e4eb]">
                                        <div className="w-8 h-8 rounded-lg bg-[#500000]/10 text-[#500000] flex items-center justify-center">
                                            <Tag size={18} />
                                        </div>
                                        <h3 className="text-base font-bold text-[#230711]">Campaign Settings</h3>
                                    </div>

                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        void updateData('promotion', localPromotion).catch(() => {});
                                        // Custom Premium Toast
                                        toast.custom((t) => (
                                            <div className="flex items-center gap-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-gray-100 w-full max-w-sm animate-in slide-in-from-top-5 fade-in duration-300">
                                                <div className="w-10 h-10 rounded-full bg-[#500000] flex items-center justify-center text-white shadow-lg shrink-0">
                                                    <Check size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-gray-900 text-sm">Update Successful!</h4>
                                                    <p className="text-xs text-gray-500">Promotion is now live on the site.</p>
                                                </div>
                                                <button aria-label="Close" onClick={() => toast.dismiss(t)} className="ml-auto p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ), { duration: 4000 });

                                    }}>
                                        <div className="space-y-6">
                                            <label className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#500000]/30 transition-colors cursor-pointer">
                                                <div className="relative flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id="isActive"
                                                        name="isActive"
                                                        checked={localPromotion.isActive}
                                                        onChange={(e) => setLocalPromotion({ ...localPromotion, isActive: e.target.checked })}
                                                        className="peer sr-only"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#500000]"></div>
                                                </div>
                                                <div className="font-bold text-gray-800 select-none">
                                                    Enable Popup on Homepage
                                                    <span className="block text-xs text-gray-400 font-normal">Show this offer to all visitors automatically</span>
                                                </div>
                                            </label>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Offer Rate (%)</label>
                                                    <input aria-label="offerRate"
                                                        name="offerRate"
                                                        value={localPromotion.offerRate}
                                                        onChange={(e) => setLocalPromotion({ ...localPromotion, offerRate: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#500000] transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Expiry Date</label>
                                                    <input aria-label="date"
                                                        type="date"
                                                        name="expiryDate"
                                                        value={localPromotion.expiryDate}
                                                        onChange={(e) => setLocalPromotion({ ...localPromotion, expiryDate: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#500000] transition-colors"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Target Service</label>
                                                <div className="relative">
                                                    <select aria-label="serviceName"
                                                        name="serviceName"
                                                        value={localPromotion.serviceName}
                                                        onChange={(e) => setLocalPromotion({ ...localPromotion, serviceName: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#500000] appearance-none cursor-pointer transition-colors"
                                                    >
                                                        <option value="All Services">All Services</option>
                                                        {services.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
                                                    </select>
                                                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90" size={16} />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                                <input aria-label="description"
                                                    name="description"
                                                    value={localPromotion.description}
                                                    onChange={(e) => setLocalPromotion({ ...localPromotion, description: e.target.value })}
                                                    placeholder="Limited time offer..."
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#500000] transition-colors"
                                                />
                                            </div>

                                            <div className="pt-4 border-t border-gray-100">
                                                <AdminButton type="submit" className="w-full justify-center">
                                                    <Save size={18} /> Save & Publish Promotion
                                                </AdminButton>
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                {/* Preview Section */}
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <Globe size={18} className="text-gray-400" /> Live Preview
                                    </h3>

                                    {/* Browser Mockup */}
                                    <div className="bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
                                        {/* Browser Header */}
                                        <div className="bg-white px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                                            <div className="flex gap-1.5">
                                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                            </div>
                                            <div className="flex-1 bg-gray-100 rounded-md px-3 py-1 text-xs text-center text-gray-400 font-mono">
                                                rizqara-tech.com
                                            </div>
                                        </div>

                                        {/* Browser Content */}
                                        <div className="relative h-[500px] bg-gray-50 flex items-center justify-center overflow-hidden">
                                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-50"></div>

                                            {/* Mock Page Content Background */}
                                            <div className="absolute inset-0 opacity-20 pointer-events-none p-8">
                                                <div className="w-full h-16 bg-gray-900 mb-8 rounded-lg"></div>
                                                <div className="w-full h-64 bg-gray-300 mb-8 rounded-lg"></div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    <div className="h-32 bg-gray-300 rounded-lg"></div>
                                                    <div className="h-32 bg-gray-300 rounded-lg"></div>
                                                    <div className="h-32 bg-gray-300 rounded-lg"></div>
                                                </div>
                                            </div>

                                            {/* The Overlay Simulation */}
                                            <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-8 transition-opacity duration-300 ${localPromotion.isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                                                {/* The Actual Card Component */}
                                                <div className="scale-90 origin-center transition-all duration-300 shadow-2xl">
                                                    <PromotionCard
                                                        offerRate={localPromotion.offerRate}
                                                        serviceName={localPromotion.serviceName}
                                                        expiryDate={localPromotion.expiryDate}
                                                        // No close handler in preview to keep it visible
                                                        className="shadow-2xl"
                                                    />
                                                </div>
                                            </div>

                                            {!localPromotion.isActive && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="bg-white/90 backdrop-blur px-6 py-4 rounded-xl shadow-lg border border-gray-200 text-center">
                                                        <p className="font-bold text-gray-500">Popup Disabled</p>
                                                        <p className="text-xs text-gray-400">Toggle "Enable Popup" to preview</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-center text-xs text-gray-400 mt-2">
                                        * This is a live simulation. Changes update in real-time.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notice' && renderList(language === 'bn' ? 'ওয়েবসাইট নোটিশ' : 'Website Notices', notices, 'notice', (item) => (
                        <div className="flex items-start gap-4">
                            <div className={`p-2.5 rounded-xl shrink-0 ${item.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-400'}`}>
                                <Bell size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`px-2 py-0.5 text-[9px] font-black rounded-full uppercase tracking-wider ${
                                        item.isActive ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                        {item.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                    <span className="text-[10px] font-bold text-[#8c6d7a] uppercase tracking-wider">Announcement</span>
                                </div>
                                <h3 className="font-bold text-[#230711] text-sm leading-snug">{item.text}</h3>
                                {item.text_bn && <p className="text-xs text-[#785967] mt-1">{item.text_bn}</p>}
                            </div>
                        </div>
                    ))}

                    {activeTab === 'gallery' && renderList(language === 'bn' ? 'গ্যালারি' : 'Gallery', galleryItems, 'galleryItem', (item) => (
                        <div className="flex items-center gap-4">
                            {item.image ? (
                                <img src={item.image} alt={item.title} className="w-18 h-18 object-cover rounded-xl shadow-xs border border-[#ebdce3] shrink-0" />
                            ) : (
                                <div className="w-18 h-18 rounded-xl bg-[#faf4f7] border border-[#ebdce3] flex items-center justify-center text-[#9a7d8c] shrink-0">
                                    <Image size={22} />
                                </div>
                            )}
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 bg-[#500000]/10 text-[#500000] rounded-md text-[10px] font-bold uppercase tracking-wider">
                                        {item.category}
                                    </span>
                                    {item.date && <span className="text-[11px] text-[#8c6d7a]">• {item.date}</span>}
                                    {item.location && <span className="text-[11px] text-[#8c6d7a]">• {item.location}</span>}
                                </div>
                                <h3 className="font-bold text-[#230711] text-sm truncate">{item.title}</h3>
                                {item.description && (
                                    <p className="text-xs text-[#785967] mt-1 line-clamp-1">{item.description}</p>
                                )}
                            </div>
                        </div>
                    ))}

                    {activeTab === 'buildOption' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="pb-4 border-b border-[#f0e4eb]">
                                <h2 className="text-2xl font-black text-[#230711] tracking-tight">{language === 'bn' ? 'বিল্ড সিস্টেম কনফিগারেশন' : 'Build System Configuration'}</h2>
                                <p className="text-xs text-[#8c6d7a] mt-1">Configure interactive pricing models and feature multipliers.</p>
                            </div>

                            {['type', 'feature', 'time', 'project'].map(cat => (
                                <div key={cat} className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xs border border-[#ebdce3]">
                                    <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#f0e4eb]">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-lg bg-[#500000]/10 text-[#500000] flex items-center justify-center">
                                                {cat === 'type' && <LayoutDashboard size={16} />}
                                                {cat === 'feature' && <Sliders size={16} />}
                                                {cat === 'time' && <Globe size={16} />}
                                                {cat === 'project' && <Briefcase size={16} />}
                                            </div>
                                            <h3 className="text-base font-bold capitalize text-[#230711]">{cat} Options</h3>
                                        </div>
                                        <AdminButton variant="secondary" onClick={() => openModal('buildOption', { category: cat })} className="py-1.5 px-3.5 text-xs">
                                            <Plus size={14} /> Add Option
                                        </AdminButton>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                                        {buildOptions.filter(b => b.category === cat).map(item => (
                                            <div key={item.id} className="p-4 rounded-xl bg-[#fcf9fa] border border-[#e5d4dc] flex justify-between items-center group hover:bg-white hover:border-[#500000]/30 hover:shadow-xs transition-all">
                                                <div>
                                                    <div className="font-bold text-sm text-[#230711]">{item.label}</div>
                                                    <div className="text-xs font-mono font-semibold text-[#500000] mt-1">
                                                        {(cat === 'type' || cat === 'project') ? `${item.value}` : `x${item.value}`}
                                                    </div>
                                                </div>
                                                <div className="flex gap-1.5">
                                                    <button aria-label="Edit" onClick={() => openModal('buildOption', item)} className="p-2 bg-white rounded-lg text-gray-500 hover:text-[#500000] border border-[#e5d4dc] shadow-xs cursor-pointer"><Edit2 size={13} /></button>
                                                    <button aria-label="Delete" onClick={() => handleDelete('buildOption', item.id)} className="p-2 bg-white rounded-lg text-gray-500 hover:text-red-600 border border-[#e5d4dc] shadow-xs cursor-pointer"><Trash2 size={13} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'carousel' && renderList(language === 'bn' ? 'হিরো ক্যারোজেল' : 'Hero Carousel', carouselSlides, 'carousel', (item) => (
                        <div className="flex items-center gap-4">
                            <img src={item.image} alt="" className="w-24 h-16 rounded-xl bg-gray-100 object-cover shadow-xs border border-[#ebdce3] shrink-0" />
                            <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-[#230711] text-sm">{item.title}</h3>
                                <p className="text-xs text-[#785967] mt-0.5 line-clamp-1">{item.subtitle}</p>
                                {item.cta && (
                                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-[#faf4f7] border border-[#ecdce5] text-[10px] font-semibold text-[#500000]">
                                        CTA: {item.cta}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}

                    {activeTab === 'services' && renderList(language === 'bn' ? 'সেবাসমূহ' : 'Services', services, 'service', (item) => (
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-7 h-7 rounded-lg bg-[#500000]/10 text-[#500000] flex items-center justify-center shrink-0">
                                    <Briefcase size={14} />
                                </div>
                                <h3 className="font-bold text-[#230711] text-sm">{item.title}</h3>
                                {item.categoryId && (
                                    <span className="px-2 py-0.5 rounded-full bg-[#faf4f7] text-[#8c6d7a] text-[10px] font-semibold border border-[#ecdce5]">
                                        {item.categoryId}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-[#785967] line-clamp-2 mt-1 leading-relaxed">{item.description}</p>
                        </div>
                    ))}

                    {activeTab === 'projects' && renderList(language === 'bn' ? 'প্রকল্প' : 'Portfolio projects', projects, 'project', (item) => (
                        <div className="flex items-center gap-4">
                            <img src={item.image} alt="" className="w-16 h-16 rounded-xl bg-gray-100 object-cover shadow-xs border border-[#ebdce3] shrink-0" />
                            <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-[#230711] text-sm">{item.title}</h3>
                                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                                        item.status === 'Live' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                        item.status === 'Concept' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                                        'bg-amber-50 text-amber-700 border border-amber-200'
                                    }`}>
                                        {item.status || 'Active'}
                                    </span>
                                    <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-[#faf4f7] text-[#8c6d7a] border border-[#ecdce5]">
                                        Type: {item.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {activeTab === 'reviews' && renderList(language === 'bn' ? 'পর্যালোচনা' : 'Reviews', reviews, 'review', (item) => (
                        <div>
                            <div className="flex items-center gap-3 mb-1.5">
                                <h3 className="font-bold text-[#230711] text-sm">{item.name}</h3>
                                <div className="flex text-amber-500 text-xs gap-0.5">
                                    {Array.from({ length: item.rating || 5 }).map((_, i) => <span key={i}>★</span>)}
                                </div>
                                <span className="text-[10px] font-bold text-[#8c6d7a] uppercase tracking-wider ml-auto">
                                    {item.company}
                                </span>
                            </div>
                            <p className="text-xs text-[#785967] font-medium mb-1.5">{item.role}</p>
                            <p className="text-xs text-[#3b1e2a] italic bg-[#faf6f8] p-3 rounded-xl border border-[#eedfe6]">"{item.content}"</p>
                        </div>
                    ))}

                    {activeTab === 'blogs' && renderList(language === 'bn' ? 'ব্লগ পোস্ট' : 'Blog Posts', blogs, 'blog', (item) => (
                        <div className="flex items-center gap-4">
                            <img src={item.image} className="w-16 h-16 rounded-xl object-cover bg-gray-100 border border-[#ebdce3] shadow-xs shrink-0" alt="" />
                            <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-[#230711] text-sm">{item.title}</h3>
                                <div className="flex items-center gap-2 mt-1 text-[11px] text-[#8c6d7a]">
                                    <span>{item.date}</span>
                                    <span>•</span>
                                    <span className="px-2 py-0.5 rounded bg-[#500000]/10 text-[#500000] font-semibold text-[10px]">{item.category}</span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {activeTab === 'jobs' && renderList(language === 'bn' ? 'ক্যারিয়ার' : 'Careers', jobs, 'job', (item) => (
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-[#230711] text-sm">{item.title}</h3>
                                {item.type && (
                                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-[#faf4f7] text-[#8c6d7a] border border-[#ecdce5]">
                                        {item.type}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-[#785967] flex items-center gap-2 mt-1">
                                <span>{item.location}</span>
                                <span>•</span>
                                <span className="font-bold text-[#500000]">{item.salary}</span>
                            </p>
                        </div>
                    ))}

                    {activeTab === 'applications' && renderList(language === 'bn' ? 'চাকরির আবেদন' : 'Job Applications', careerApplications, 'application', (item) => (
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                                    <Users size={14} />
                                </div>
                                <h3 className="font-bold text-[#230711] text-sm">{item.name}</h3>
                                <span className="text-[11px] text-[#8c6d7a]">&lt;{item.email}&gt;</span>
                                <span className="text-[11px] font-medium text-[#8c6d7a] ml-auto">{item.date}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-[#634754]">
                                    Role: <strong className="text-[#230711]">{jobs.find(j => j.id === item.jobId)?.title || 'General Application'}</strong>
                                </span>
                                <div className="flex items-center gap-1.5 ml-auto">
                                    <label htmlFor={`app-status-${item.id}`} className="text-[11px] font-bold text-[#8c6d7a] uppercase">Status:</label>
                                    <select
                                        id={`app-status-${item.id}`}
                                        aria-label="Application status"
                                        value={item.status}
                                        onChange={event => { void updateData('careerApplications', [{ id: item.id, status: event.target.value }], true).catch(() => {}); }}
                                        className="bg-[#fcf9fa] border border-[#e5d4dc] rounded-lg px-2.5 py-1 text-xs font-bold text-[#422230] focus:outline-none focus:border-[#500000]"
                                    >
                                        <option>New</option>
                                        <option>Pending</option>
                                        <option>Reviewed</option>
                                        <option>Rejected</option>
                                    </select>
                                </div>
                            </div>

                            <div className="text-xs text-[#3b1e2a] bg-[#faf6f8] p-3.5 rounded-xl border border-[#eedfe6] space-y-2">
                                <div>
                                    <p className="font-bold text-[10px] text-[#8c6d7a] uppercase tracking-wider mb-0.5">Experience & Background:</p>
                                    <p className="leading-relaxed">{item.experience}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-[10px] text-[#8c6d7a] uppercase tracking-wider mb-0.5">Candidate Statement:</p>
                                    <p className="leading-relaxed">{item.reason}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                                {item.cvUrl ? (
                                    <a
                                        href={item.cvUrl.startsWith('/api/') ? `${API_URL}${item.cvUrl.slice(4)}` : undefined}
                                        download={item.cvName || 'resume.pdf'}
                                        className="inline-flex items-center gap-2 text-xs px-3.5 py-2 bg-[#500000]/10 text-[#500000] hover:bg-[#500000]/20 rounded-xl transition-colors font-bold cursor-pointer"
                                    >
                                        <FileDown size={14} /> Download CV / Resume
                                    </a>
                                ) : (
                                    <span className="text-xs text-[#9a7d8c] italic">No CV attached</span>
                                )}
                            </div>
                        </div>
                    ))}

                    {activeTab === 'videos' && renderList(language === 'bn' ? 'ভিডিও' : 'Videos', videos, 'video', (item) => (
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-12 bg-gradient-to-br from-[#500000] to-[#781b37] rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs">
                                <PlayCircle size={22} />
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-[#230711] text-sm">{item.title}</h3>
                                <span className="inline-block mt-1 px-2 py-0.5 rounded bg-[#faf4f7] border border-[#ecdce5] text-[10px] font-bold text-[#500000] uppercase tracking-wider">
                                    {item.category}
                                </span>
                            </div>
                        </div>
                    ))}

                    {activeTab === 'caseStudies' && renderList(language === 'bn' ? 'কেস স্টাডিজ' : 'Case Studies', caseStudies, 'caseStudy', (item) => (
                        <div className="flex items-center gap-4">
                            <img src={item.image} alt="" className="w-16 h-16 rounded-xl bg-gray-100 object-cover shadow-xs border border-[#ebdce3] shrink-0" />
                            <div className="min-w-0 flex-1">
                                <h3 className="font-bold text-[#230711] text-sm">{item.title}</h3>
                                <div className="flex items-center gap-2 mt-1.5">
                                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#500000]/10 text-[#500000] border border-[#500000]/15 uppercase tracking-wider">
                                        {item.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="rq-admin-modal">
                    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Edit content" tabIndex={-1} className="rq-admin-modal-panel">
                        <div className="px-6 py-4 border-b border-[#ebdce3] flex justify-between items-center bg-gradient-to-r from-[#faf4f7] via-white to-[#faf4f7]">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-[#500000]/10 text-[#500000] flex items-center justify-center">
                                    <Sparkles size={16} />
                                </div>
                                <h3 className="text-lg font-black text-[#230711] tracking-tight">
                                    {editingItem ? (language === 'bn' ? 'সম্পাদনা করুন' : 'Edit') : (language === 'bn' ? 'নতুন যোগ করুন' : 'Add New')} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
                                </h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleAutoTranslate}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#500000]/10 text-[#500000] hover:bg-[#500000]/20 text-xs font-bold transition-all cursor-pointer"
                                    title={language === 'bn' ? 'স্বয়ংক্রিয় অনুবাদ (খালি ঘর পূরণ)' : 'Auto Translate Empty Fields'}
                                >
                                    <Globe size={14} />
                                    <span className="hidden sm:inline">Auto Translate</span>
                                </button>
                                <button
                                    type="button"
                                    aria-label="Close"
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-[#8c6d7a] hover:text-[#230711] transition-colors p-2 rounded-xl hover:bg-[#faf4f7] cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="rq-admin-modal-body">
                            <form id="admin-form" onSubmit={handleSave}>
                                {modalType === 'service' && <>
                                    <AdminInput label="Title" name="title" defaultValue={editingItem?.title} required />
                                    <AdminInput label="Title (Bengali)" name="title_bn" defaultValue={editingItem?.title_bn} placeholder="বাংলা শিরোনাম" />

                                    <AdminInput label="Icon Name" name="icon" defaultValue={editingItem?.icon} />
                                    <AdminSelect label="Service category" name="categoryId" defaultValue={editingItem?.categoryId || serviceCatalog.categories[0].id}>
                                        {serviceCatalog.categories.map(c => <option value={c.id} key={c.id}>{c.title}</option>)}
                                    </AdminSelect>
                                    <AdminInput label="Image URL" name="image" defaultValue={editingItem?.image} />
                                    <AdminInput label="Image description" name="imageAlt" defaultValue={editingItem?.imageAlt} />
                                    {(['capabilities', 'capabilities_bn', 'process', 'process_bn'] as const).map(field => <AdminTextArea key={field} label={`${field.replace(/_/g, ' ')} (one per line)`} name={field} defaultValue={(editingItem?.[field] || []).join('\n')} />)}


                                    <AdminTextArea label="Short Description" name="description" defaultValue={editingItem?.description} />
                                    <AdminTextArea label="Short Description (Bengali)" name="description_bn" defaultValue={editingItem?.description_bn} placeholder="বাংলা বর্ণনা" />

                                    <AdminTextArea label="Full Details" name="details" defaultValue={editingItem?.details} />
                                    <AdminTextArea label="Full Details (Bengali)" name="details_bn" defaultValue={editingItem?.details_bn} placeholder="বাংলা বিস্তারিত" />
                                </>}

                                {modalType === 'project' && <>
                                    <AdminInput label="Project Title" name="title" defaultValue={editingItem?.title} required />
                                    <AdminInput label="Project Title (Bengali)" name="title_bn" defaultValue={editingItem?.title_bn} placeholder="বাংলা শিরোনাম" />

                                    {/* Improved Category Selector based on Build Options */}
                                    <AdminSelect label="Project type" name="category" defaultValue={editingItem?.category || 'Website'}>
                                        {[...new Set(['Website', 'Mobile App', 'Web Application', 'Business Software', 'E-commerce',
                                            ...buildOptions.filter(option => option.category === 'type').map(option => option.label),
                                            ...(editingItem?.category ? [editingItem.category] : []), 'Other'])].map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </AdminSelect>
                                    <AdminInput label="Project Type (Bengali)" name="category_bn" defaultValue={editingItem?.category_bn} placeholder="বাংলা ধরণ" />

                                    <AdminSelect label="Status" name="status" defaultValue={editingItem?.status}>
                                        <option value="Live">Live</option>
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Concept">Concept</option>
                                    </AdminSelect>

                                    <ImageUploader
                                        label="Project Preview Image"
                                        defaultValue={editingItem?.image}
                                        onImageChange={(url) => setProjectImage(url)}
                                        onUploadStart={() => setUploadingCount(p => p + 1)}
                                        onUploadEnd={() => setUploadingCount(p => p - 1)}
                                    />


                                    <AdminInput label="Project image URL (optional)" name="coverUrl" placeholder="https://example.com/project.webp" />

                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <ImageUploader
                                            label="Gallery 1"
                                            name="gallery_1"
                                            defaultValue={editingItem?.gallery?.[0]}
                                            onImageChange={() => { }}
                                            onUploadStart={() => setUploadingCount(p => p + 1)}
                                            onUploadEnd={() => setUploadingCount(p => p - 1)}
                                        />
                                        <ImageUploader
                                            label="Gallery 2"
                                            name="gallery_2"
                                            defaultValue={editingItem?.gallery?.[1]}
                                            onImageChange={() => { }}
                                            onUploadStart={() => setUploadingCount(p => p + 1)}
                                            onUploadEnd={() => setUploadingCount(p => p - 1)}
                                        />
                                        <ImageUploader
                                            label="Gallery 3"
                                            name="gallery_3"
                                            defaultValue={editingItem?.gallery?.[2]}
                                            onImageChange={() => { }}
                                            onUploadStart={() => setUploadingCount(p => p + 1)}
                                            onUploadEnd={() => setUploadingCount(p => p - 1)}
                                        />
                                    </div>

                                    <AdminTextArea label="Description" name="description" defaultValue={editingItem?.description} required />
                                    <AdminTextArea label="Description (Bengali)" name="description_bn" defaultValue={editingItem?.description_bn} placeholder="বাংলা বর্ণনা" />

                                    <AdminInput label="Project Link" name="link" defaultValue={editingItem?.link} placeholder="https://..." />
                                    <AdminInput label="Key Features (Comma separated)" name="features" defaultValue={Array.isArray(editingItem?.features) ? editingItem.features.join(', ') : (editingItem?.features || '')} placeholder="Feature 1, Feature 2" />
                                    <AdminInput label="Key Features (Bengali)" name="features_bn" defaultValue={Array.isArray(editingItem?.features_bn) ? editingItem.features_bn.join(', ') : (editingItem?.features_bn || '')} placeholder="বাংলা বৈশিষ্ট্য ১, বৈশিষ্ট্য ২" />
                                    <AdminInput label="Tech Stack" name="tech" defaultValue={Array.isArray(editingItem?.tech) ? editingItem.tech.join(', ') : (editingItem?.tech || '')} placeholder="React, Node, etc." />
                                </>}

                                {modalType === 'caseStudy' && <>
                                    <AdminInput label="Case Study Title" name="title" defaultValue={editingItem?.title} required />
                                    <AdminInput label="Title (Bengali)" name="title_bn" defaultValue={editingItem?.title_bn} placeholder="বাংলা শিরোনাম" />

                                    <AdminInput label="Category" name="category" defaultValue={editingItem?.category} required placeholder="e.g. Finance, Healthcare" />
                                    <AdminInput label="Category (Bengali)" name="category_bn" defaultValue={editingItem?.category_bn} placeholder="বাংলা ধরণ" />

                                    <ImageUploader
                                        label="Cover Image"
                                        defaultValue={editingItem?.image}
                                        onImageChange={(url) => setCaseStudyImage(url)}
                                        onUploadStart={() => setUploadingCount(p => p + 1)}
                                        onUploadEnd={() => setUploadingCount(p => p - 1)}
                                    />

                                    <AdminTextArea label="Short Summary" name="description" defaultValue={editingItem?.description} required />
                                    <AdminTextArea label="Short Summary (Bengali)" name="description_bn" defaultValue={editingItem?.description_bn} placeholder="বাংলা বর্ণনা" />

                                    <div className="space-y-4 pt-4 border-t border-gray-100 mt-4">
                                        <h4 className="font-bold text-gray-800">Section Content (Problem, Solution, Impact)</h4>
                                        <AdminTextArea label="The Problem" name="problem" defaultValue={editingItem?.problem} required />
                                        <AdminTextArea label="The Problem (Bengali)" name="problem_bn" defaultValue={editingItem?.problem_bn} />

                                        <AdminTextArea label="The Solution & Strategy" name="solution" defaultValue={editingItem?.solution} required />
                                        <AdminTextArea label="The Solution (Bengali)" name="solution_bn" defaultValue={editingItem?.solution_bn} />

                                        <AdminTextArea label="The Business Impact" name="impact" defaultValue={editingItem?.impact} required />
                                        <AdminTextArea label="The Impact (Bengali)" name="impact_bn" defaultValue={editingItem?.impact_bn} />
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 mt-4">
                                        <h4 className="font-bold text-gray-800 mb-4">Gallery Showcase (Visuals)</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <ImageUploader
                                                label="Image 1"
                                                name="gallery_1"
                                                defaultValue={editingItem?.gallery?.[0]}
                                                onImageChange={() => { }}
                                                onUploadStart={() => setUploadingCount(p => p + 1)}
                                                onUploadEnd={() => setUploadingCount(p => p - 1)}
                                            />
                                            <ImageUploader
                                                label="Image 2"
                                                name="gallery_2"
                                                defaultValue={editingItem?.gallery?.[1]}
                                                onImageChange={() => { }}
                                                onUploadStart={() => setUploadingCount(p => p + 1)}
                                                onUploadEnd={() => setUploadingCount(p => p - 1)}
                                            />
                                            <ImageUploader
                                                label="Image 3"
                                                name="gallery_3"
                                                defaultValue={editingItem?.gallery?.[2]}
                                                onImageChange={() => { }}
                                                onUploadStart={() => setUploadingCount(p => p + 1)}
                                                onUploadEnd={() => setUploadingCount(p => p - 1)}
                                            />
                                            <ImageUploader
                                                label="Image 4"
                                                name="gallery_4"
                                                defaultValue={editingItem?.gallery?.[3]}
                                                onImageChange={() => { }}
                                                onUploadStart={() => setUploadingCount(p => p + 1)}
                                                onUploadEnd={() => setUploadingCount(p => p - 1)}
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 mt-4">
                                        <h4 className="font-bold text-gray-800 mb-4">Business Growth Metrics</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <AdminInput label="Growth Before (e.g. 12% Monthly)" name="growthBefore" defaultValue={editingItem?.growthBefore} placeholder="12% Monthly" />
                                            <AdminInput label="Growth After (e.g. 85% Monthly)" name="growthAfter" defaultValue={editingItem?.growthAfter} placeholder="85% Monthly" />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 mt-4">
                                        <AdminInput label="Tech Stack (Comma separated)" name="tech" defaultValue={Array.isArray(editingItem?.tech) ? editingItem.tech.join(', ') : (editingItem?.tech || '')} placeholder="React, Node.js, AI" />
                                        <AdminInput label="Key Features (Comma separated)" name="features" defaultValue={Array.isArray(editingItem?.features) ? editingItem.features.join(', ') : (editingItem?.features || '')} placeholder="Feature 1, Feature 2" />
                                        <AdminInput label="Key Features (Bengali - Comma separated)" name="features_bn" defaultValue={Array.isArray(editingItem?.features_bn) ? editingItem.features_bn.join(', ') : (editingItem?.features_bn || '')} placeholder="বৈশিষ্ট্য ১, বৈশিষ্ট্য ২" />
                                    </div>
                                </>}

                                {modalType === 'review' && <>
                                    <AdminInput label="Client Name" name="name" defaultValue={editingItem?.name} required />

                                    <AdminInput label="Role" name="role" defaultValue={editingItem?.role} required />
                                    <AdminInput label="Role (Bengali)" name="role_bn" defaultValue={editingItem?.role_bn} placeholder="বাংলা পদবী" />

                                    <AdminInput label="Company" name="company" defaultValue={editingItem?.company} required />
                                    <AdminInput label="Company (Bengali)" name="company_bn" defaultValue={editingItem?.company_bn} placeholder="বাংলা কোম্পানি" />

                                    <AdminTextArea label="Review" name="content" defaultValue={editingItem?.content} required />
                                    <AdminTextArea label="Review (Bengali)" name="content_bn" defaultValue={editingItem?.content_bn} placeholder="বাংলা পর্যালোচনা" />

                                    <AdminInput label="Rating (1-5)" name="rating" defaultValue={editingItem?.rating} type="number" max="5" min="1" required />
                                </>}

                                {modalType === 'blog' && <>
                                    <AdminInput label="Title" name="title" defaultValue={editingItem?.title} required />
                                    <AdminInput label="Title (Bengali)" name="title_bn" defaultValue={editingItem?.title_bn} placeholder="বাংলা শিরোনাম" />

                                    <AdminInput label="Date" name="date" defaultValue={editingItem?.date} required />

                                    <AdminInput label="Category" name="category" defaultValue={editingItem?.category} required />
                                    <AdminInput label="Category (Bengali)" name="category_bn" defaultValue={editingItem?.category_bn} placeholder="বাংলা ক্যাটাগরি" />

                                    <ImageUploader
                                        label="Blog Featured Image"
                                        defaultValue={editingItem?.image}
                                        onImageChange={(url) => setBlogImage(url)}
                                        onUploadStart={() => setUploadingCount(p => p + 1)}
                                        onUploadEnd={() => setUploadingCount(p => p - 1)}
                                        aspectRatio={16 / 9}
                                    />
                                    <input aria-label="hidden" type="hidden" name="image" value={blogImage} />

                                    <AdminTextArea label="Excerpt" name="excerpt" defaultValue={editingItem?.excerpt} required />
                                    <AdminTextArea label="Excerpt (Bengali)" name="excerpt_bn" defaultValue={editingItem?.excerpt_bn} placeholder="বাংলা সারাংশ" />

                                    <AdminTextArea label="Content" name="content" defaultValue={editingItem?.content} required />
                                    <AdminTextArea label="Content (Bengali)" name="content_bn" defaultValue={editingItem?.content_bn} placeholder="বাংলা বিষয়বস্তু" />
                                </>}

                                {modalType === 'job' && <>
                                    <AdminInput label="Job Title" name="title" defaultValue={editingItem?.title} required />
                                    <AdminInput label="Job Title (Bengali)" name="title_bn" defaultValue={editingItem?.title_bn} placeholder="বাংলা শিরোনাম" />

                                    <AdminInput label="Location" name="location" defaultValue={editingItem?.location} />
                                    <AdminInput label="Location (Bengali)" name="location_bn" defaultValue={editingItem?.location_bn} placeholder="বাংলা অবস্থান" />

                                    <AdminInput label="Salary" name="salary" defaultValue={editingItem?.salary} />
                                    <AdminInput label="Salary (Bengali)" name="salary_bn" defaultValue={editingItem?.salary_bn} placeholder="বাংলা বেতন" />

                                    <AdminInput label="Type" name="type" defaultValue={editingItem?.type} />
                                    <AdminInput label="Type (Bengali)" name="type_bn" defaultValue={editingItem?.type_bn} placeholder="বাংলা ধরণ" />

                                    <AdminTextArea label="Description" name="description" defaultValue={editingItem?.description} />
                                    <AdminTextArea label="Description (Bengali)" name="description_bn" defaultValue={editingItem?.description_bn} placeholder="বাংলা বর্ণনা" />
                                </>}

                                {modalType === 'video' && <>
                                    <AdminInput label="Title" name="title" defaultValue={editingItem?.title} required />
                                    <AdminInput label="Title (Bengali)" name="title_bn" defaultValue={editingItem?.title_bn} placeholder="বাংলা শিরোনাম" />

                                    <AdminInput label="Category" name="category" defaultValue={editingItem?.category} required />
                                    <AdminInput label="Category (Bengali)" name="category_bn" defaultValue={editingItem?.category_bn} placeholder="বাংলা ক্যাটাগরি" />

                                    <AdminTextArea label="Video Description" name="description" defaultValue={editingItem?.description} placeholder="Video details..." />
                                    <AdminTextArea label="Video Description (Bengali)" name="description_bn" defaultValue={editingItem?.description_bn} placeholder="বাংলা বিস্তারিত..." />

                                    <div className="mb-4">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">YouTube Link</label>
                                        <input aria-label="url"
                                            name="url"
                                            defaultValue={editingItem?.url}
                                            onChange={(e) => setVideoUrl(e.target.value)}
                                            placeholder="https://www.youtube.com/watch?v=..."
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#500000] transition-colors"
                                            required
                                        />
                                    </div>

                                    {videoUrl && getYoutubeId(videoUrl) ? (
                                        <div className="mb-6 rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider p-2 border-b border-gray-200">Video Preview</p>
                                            <div className="aspect-video relative bg-black">
                                                <iframe
                                                    width="100%"
                                                    height="100%"
                                                    src={`https://www.youtube.com/embed/${getYoutubeId(videoUrl)}`}
                                                    title="Preview"
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                ></iframe>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mb-6 p-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-center text-gray-400 text-sm">
                                            Enter a valid YouTube URL to see a preview
                                        </div>
                                    )}
                                </>}

                                {modalType === 'carousel' && <>
                                    <AdminInput label="Headline" name="title" defaultValue={editingItem?.title} required />
                                    <AdminInput label="Headline (Bengali)" name="title_bn" defaultValue={editingItem?.title_bn} placeholder="বাংলা শিরোনাম" />
                                    <AdminInput label="Subtitle" name="subtitle" defaultValue={editingItem?.subtitle} required />
                                    <AdminInput label="Subtitle (Bengali)" name="subtitle_bn" defaultValue={editingItem?.subtitle_bn} placeholder="বাংলা সাবটাইটেল" />

                                    <ImageUploader
                                        label="Background Image"
                                        defaultValue={editingItem?.image}
                                        onImageChange={(url) => setCarouselImage(url)}
                                        onUploadStart={() => setUploadingCount(p => p + 1)}
                                        onUploadEnd={() => setUploadingCount(p => p - 1)}
                                        aspectRatio={16 / 9}
                                    />
                                    <input aria-label="hidden" type="hidden" name="image" value={carouselImage} />

                                    <AdminSelect label="Button Action" name="cta" defaultValue={editingItem?.cta || 'Contact Now'}>
                                        <option value="View Projects">View Projects</option>
                                        <option value="View Services">View Services</option>
                                        <option value="Contact Now">Contact Now</option>
                                        <option value="Appointment Now">Appointment Now</option>
                                        <option value="View Packages">View Packages</option>
                                        <option value="View Blogs">View Blogs</option>
                                    </AdminSelect>
                                    <AdminInput label="Button Label (Bengali)" name="cta_bn" defaultValue={editingItem?.cta_bn} placeholder="উদাহরণ: আমাদের সাথে কথা বলুন" />
                                </>}

                                {modalType === 'galleryItem' && <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <AdminInput name="title" label="Title" defaultValue={editingItem?.title} required />
                                        <AdminInput name="title_bn" label="Title (Bengali)" defaultValue={editingItem?.title_bn} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <AdminInput name="category" label="Category" defaultValue={editingItem?.category} required />
                                        <AdminInput name="category_bn" label="Category (Bengali)" defaultValue={editingItem?.category_bn} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <AdminInput name="location" label="Location" defaultValue={editingItem?.location || 'Dhaka HQ, Bangladesh'} placeholder="e.g. Dhaka HQ, Bangladesh" />
                                        <AdminInput name="location_bn" label="Location (Bengali)" defaultValue={editingItem?.location_bn} placeholder="বাংলা লোকেশন (যেমন: ঢাকা হেডকোয়ার্টার)" />
                                    </div>
                                    <AdminInput name="date" type="date" label="Date" defaultValue={editingItem?.date || new Date().toISOString().split('T')[0]} required />
                                    <AdminTextArea name="description" label="Story / Description" defaultValue={editingItem?.description} placeholder="Describe this moment, event, or milestone..." />
                                    <AdminTextArea name="description_bn" label="Story / Description (Bengali)" defaultValue={editingItem?.description_bn} placeholder="বাংলা বর্ণনা বা গল্প..." />
                                    <div className="mt-4">
                                        <ImageUploader 
                                            label="Gallery Image (Required)"
                                            defaultValue={editingItem?.image} 
                                            onImageChange={(url: string) => setGalleryImage(url)}
                                            onUploadStart={() => setUploadingCount(prev => prev + 1)}
                                            onUploadEnd={() => setUploadingCount(prev => Math.max(0, prev - 1))}
                                        />
                                    </div>
                                </>}

                                {modalType === 'buildOption' && <>
                                    <AdminSelect label="Option Category" name="category" defaultValue={editingItem?.category || 'type'}>
                                        <option value="type">Project Type (Base Price)</option>
                                        <option value="feature">Feature Complexity (Multiplier)</option>
                                        <option value="time">Timeline (Multiplier)</option>
                                        <option value="project">Project Selection (Base Price)</option>
                                    </AdminSelect>
                                    <AdminInput label="Label" name="label" defaultValue={editingItem?.label} placeholder="e.g. Web App or E-commerce Project" required />
                                    <AdminInput label="Value" name="value" defaultValue={editingItem?.value} type="number" step="0.1" placeholder="Price or Multiplier" required />
                                </>}

                                {modalType === 'notice' && <>
                                    <AdminTextArea label="Notice Text (English)" name="text" defaultValue={editingItem?.text} required />
                                    <AdminTextArea label="Notice Text (Bengali)" name="text_bn" defaultValue={editingItem?.text_bn} required />
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 mt-4">
                                        <input 
                                            type="checkbox" 
                                            name="isActive" 
                                            id="isActive"
                                            defaultChecked={editingItem?.isActive}
                                            className="w-5 h-5 accent-[#500000]"
                                        />
                                        <label htmlFor="isActive" className="text-sm font-bold text-gray-700">Display Notice on Website</label>
                                    </div>
                                </>}
                            </form>
                        </div>

                        <div className="px-6 py-4 border-t border-[#ebdce3] bg-[#faf6f8] flex items-center justify-end gap-3">
                            <AdminButton 
                                type="button" 
                                variant="secondary" 
                                onClick={() => setIsModalOpen(false)}
                            >
                                {language === 'bn' ? 'বাতিল' : 'Cancel'}
                            </AdminButton>
                            <AdminButton 
                                type="submit" 
                                form="admin-form" 
                                disabled={isUploadingImage || saving}
                            >
                                {isUploadingImage ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Uploading Images...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Save size={16} /> {language === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}
                                    </div>
                                )}
                            </AdminButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
