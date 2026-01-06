import React, { useState } from 'react';
import { toast } from "sonner";
import { useData } from '../context/DataContext';
import { AdminCard, AdminButton, AdminInput, AdminTextArea, AdminSelect } from './AdminComponents';
import {
    LayoutDashboard, Briefcase, Users, MessageSquare,
    Plus, Trash2, Edit2, Save, X, RotateCcw,
    FileText, PlayCircle, Image, Settings, LogOut,
    ChevronRight, Search, Sliders, Globe, Inbox, Mail, FileDown, Tag, Check
} from 'lucide-react';
import { ImageUploader } from './admin/ImageUploader';
import { UserInteractionAnalytics } from './admin/UserInteractionAnalytics';
import { getYoutubeId } from './premium/UIComponents';
import { PromotionCard } from './premium/PromotionOverlay';

const generateId = () => Math.random().toString(36).substr(2, 9);

const PremiumStatCard = ({ icon: Icon, value, label, color, bg }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className={`absolute -right-6 -top-6 p-4 opacity-[0.05] group-hover:opacity-10 transition-opacity ${color} rotate-12`}>
            <Icon size={120} />
        </div>
        <div className="relative z-10 flex flex-col h-full justify-between">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${bg} ${color} shadow-inner`}>
                <Icon size={28} />
            </div>
            <div>
                <h3 className="text-4xl font-black text-gray-800 tracking-tight mb-1">{value}</h3>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{label}</p>
            </div>
        </div>
    </div>
);

export const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
    const { services, projects, reviews, blogs, jobs, videos, carouselSlides, buildOptions, messages, careerApplications, promotion, updateData, resetData, language, deleteData } = useData();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [editingItem, setEditingItem] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'service' | 'project' | 'review' | 'blog' | 'job' | 'video' | 'carousel' | 'buildOption'>('service');
    const [searchTerm, setSearchTerm] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    // Local state for live preview in Admin
    const [localPromotion, setLocalPromotion] = useState(promotion);

    // Sync local promotion state if global promotion changes (e.g. on initial load)
    React.useEffect(() => {
        setLocalPromotion(promotion);
    }, [promotion]);

    // --- Handlers ---

    const handleDelete = async (type: string, id: string) => {
        if (!window.confirm(language === 'bn' ? 'আপনি কি নিশ্চিত যে আপনি এই আইটেমটি মুছতে চান?' : 'Are you sure you want to delete this item?')) return;

        if (type === 'service') await deleteData('services', id);
        if (type === 'project') await deleteData('projects', id);
        if (type === 'review') await deleteData('reviews', id);
        if (type === 'blog') await deleteData('blogs', id);
        if (type === 'job') await deleteData('jobs', id);
        if (type === 'video') await deleteData('videos', id);
        if (type === 'carousel') await deleteData('carousel', id);
        if (type === 'buildOption') await deleteData('buildOptions', id);
        // Message and Application handling might be different in UI (check tabs)
        // Note: AdminDashboard usually handles main content. Messages might be handled in "messages" tab
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const data: any = Object.fromEntries(formData.entries());

        if (modalType === 'project' && data.tech) {
            data.tech = data.tech.split(',').map((t: string) => t.trim());
        }

        // Handle Project Gallery
        if (modalType === 'project') {
            const gallery: string[] = [];
            if (data.gallery_1) gallery.push(data.gallery_1);
            if (data.gallery_2) gallery.push(data.gallery_2);
            if (data.gallery_3) gallery.push(data.gallery_3);
            if (gallery.length > 0) data.gallery = gallery;

            // Remove temp fields
            delete data.gallery_1;
            delete data.gallery_2;
            delete data.gallery_3;
        }

        if (modalType === 'video' && data.url) {
            const videoId = getYoutubeId(data.url);
            if (videoId) {
                data.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            } else {
                data.thumbnail = 'https://via.placeholder.com/640x360?text=No+Thumbnail';
            }
        }

        const newItem = {
            id: editingItem ? editingItem.id : generateId(),
            ...data,
            rating: data.rating ? parseInt(data.rating) : undefined,
            value: data.value ? parseFloat(data.value) : undefined
        };

        if (modalType === 'service') updateData('services', editingItem ? services.map(s => s.id === editingItem.id ? newItem : s) : [...services, newItem]);
        if (modalType === 'project') updateData('projects', editingItem ? projects.map(p => p.id === editingItem.id ? newItem : p) : [...projects, newItem]);
        if (modalType === 'review') updateData('reviews', editingItem ? reviews.map(r => r.id === editingItem.id ? newItem : r) : [...reviews, newItem]);
        if (modalType === 'blog') updateData('blogs', editingItem ? blogs.map(b => b.id === editingItem.id ? newItem : b) : [...blogs, newItem]);
        if (modalType === 'job') updateData('jobs', editingItem ? jobs.map(j => j.id === editingItem.id ? newItem : j) : [...jobs, newItem]);
        if (modalType === 'video') updateData('videos', editingItem ? videos.map(v => v.id === editingItem.id ? newItem : v) : [...videos, newItem]);
        if (modalType === 'carousel') updateData('carousel', editingItem ? carouselSlides.map(c => c.id === editingItem.id ? newItem : c) : [...carouselSlides, newItem]);
        if (modalType === 'buildOption') updateData('buildOptions', editingItem ? buildOptions.map(b => b.id === editingItem.id ? newItem : b) : [...buildOptions, newItem]);

        setIsModalOpen(false);
        setEditingItem(null);
    };

    const openModal = (type: any, item: any = null) => {
        setModalType(type);
        setEditingItem(item);
        if (type === 'video') {
            setVideoUrl(item?.url || '');
        }
        setIsModalOpen(true);
    };

    // --- Renderers ---

    const renderDashboard = () => (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <PremiumStatCard icon={Briefcase} value={services.length} label={language === 'bn' ? "মোট সেবা" : "Total Services"} color="text-red-600" bg="bg-red-50" />
                <PremiumStatCard icon={LayoutDashboard} value={projects.length} label={language === 'bn' ? "সক্রিয় প্রকল্প" : "Active Projects"} color="text-blue-600" bg="bg-blue-50" />
                <PremiumStatCard icon={Inbox} value={messages.filter(m => m.type === 'Contact').length} label={language === 'bn' ? "বার্তা" : "Messages"} color="text-green-600" bg="bg-green-50" />
                <PremiumStatCard icon={Users} value={jobs.length} label={language === 'bn' ? "খালি পদ" : "Open Jobs"} color="text-yellow-600" bg="bg-yellow-50" />
                <PremiumStatCard icon={PlayCircle} value={videos.length} label={language === 'bn' ? "ভিডিও" : "Videos"} color="text-pink-600" bg="bg-pink-50" />
                <PremiumStatCard icon={MessageSquare} value={reviews.length} label={language === 'bn' ? "মোট পর্যালোচনা" : "Total Reviews"} color="text-purple-600" bg="bg-purple-50" />
                <PremiumStatCard icon={FileDown} value={careerApplications.length} label={language === 'bn' ? "আবেদন" : "Applications"} color="text-teal-600" bg="bg-teal-50" />
                <PremiumStatCard icon={FileText} value={blogs.length} label={language === 'bn' ? "ব্লগ পোস্ট" : "Blog Posts"} color="text-orange-600" bg="bg-orange-50" />
            </div>

            <UserInteractionAnalytics />

            <AdminCard className="flex items-center justify-between p-8 bg-gradient-to-r from-gray-50 to-white border-gray-100">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{language === 'bn' ? "সিস্টেম নিয়ন্ত্রণ" : "System Controls"}</h3>
                    <p className="text-gray-500">{language === 'bn' ? "গ্লোবাল সেটিংস এবং ডেটা পরিচালনা করুন।" : "Manage global settings and data persistence."}</p>
                </div>
                <AdminButton variant="danger" onClick={() => { if (window.confirm(language === 'bn' ? 'সব ডেটা রিসেট করবেন? এটি পূর্বাবস্থায় ফিরিয়ে আনা যাবে না।' : 'Reset all data to default? This cannot be undone.')) resetData(); }}>
                    <RotateCcw size={18} /> {language === 'bn' ? "সিস্টেম ডেটা রিসেট করুন" : "Reset System Data"}
                </AdminButton>
            </AdminCard>
        </div>
    );

    const renderList = (title: string, data: any[], type: string, renderItem: (item: any) => React.ReactNode) => {
        const filteredData = data.filter(item =>
            JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                        <p className="text-gray-400 text-sm mt-1">{data.length} {language === 'bn' ? 'মোট আইটেম' : 'items total'}</p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder={language === 'bn' ? 'অনুসন্ধান...' : "Search..."}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#500000] focus:ring-1 focus:ring-[#500000] transition-all"
                            />
                        </div>
                        {type !== 'message' && <AdminButton onClick={() => openModal(type)}><Plus size={18} /> {language === 'bn' ? 'নতুন যোগ করুন' : 'Add New'}</AdminButton>}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {filteredData.map(item => (
                        <AdminCard key={item.id} className="flex justify-between items-center group hover:border-[#500000]/20 transition-all">
                            <div className="flex-1 mr-4">
                                {renderItem(item)}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {type !== 'message' && <AdminButton variant="secondary" onClick={() => openModal(type, item)} className="px-3 py-2"><Edit2 size={16} /></AdminButton>}
                                <AdminButton variant="danger" onClick={() => handleDelete(type, item.id)} className="px-3 py-2"><Trash2 size={16} /></AdminButton>
                            </div>
                        </AdminCard>
                    ))}
                    {filteredData.length === 0 && (
                        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            {language === 'bn' ? 'কোনো আইটেম পাওয়া যায়নি।' : 'No items found matching your search.'}
                        </div>
                    )}
                </div>
            </div>
        );
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
        { id: 'jobs', icon: Users, label: language === 'bn' ? 'ক্যারিয়ার' : 'Careers (Posts)' },
        { id: 'applications', icon: FileDown, label: language === 'bn' ? 'আবেদন' : 'Applications' },
        { id: 'videos', icon: PlayCircle, label: language === 'bn' ? 'ভিডিও' : 'Videos' },
    ];

    return (
        <div className="min-h-screen bg-[#F5F7FA] font-sans text-gray-800">

            {/* Top Header */}
            <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#500000] rounded-lg flex items-center justify-center text-white font-serif font-bold">R</div>
                    <h1 className="text-xl font-bold text-[#500000]">Rizqara Admin</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-sm text-right hidden md:block">
                        <div className="font-bold text-gray-800">{language === 'bn' ? 'অ্যাডমিন ব্যবহারকারী' : 'Admin User'}</div>
                        <div className="text-xs text-gray-400">{language === 'bn' ? 'সুপার অ্যাডমিনিস্ট্রেটর' : 'Super Administrator'}</div>
                    </div>
                    <button onClick={onLogout} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                        <LogOut size={20} />
                    </button>
                </div>
            </div>

            <div className="container mx-auto p-6 max-w-7xl flex flex-col md:flex-row gap-8">

                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 shrink-0 space-y-2">
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 sticky top-24">
                        {navItems.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setSearchTerm(''); }}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl mb-1 transition-all ${activeTab === tab.id ? 'bg-[#500000] text-white shadow-lg shadow-red-900/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <tab.icon size={18} />
                                    <span className="font-medium">{tab.label}</span>
                                </div>
                                {activeTab === tab.id && <ChevronRight size={16} />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 min-h-[80vh]">
                    {activeTab === 'dashboard' && renderDashboard()}

                    {activeTab === 'inbox' && renderList(language === 'bn' ? 'ইনবক্স' : 'Inbox', messages.filter(m => m.type === 'Contact'), 'message', (item) => (
                        <div className="relative group">
                            <div className="flex items-center gap-2 mb-1">
                                <div className={`p-1.5 rounded-md ${item.subject === 'New Newsletter Subscriber' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {item.subject === 'New Newsletter Subscriber' ? <Tag size={14} /> : <Mail size={14} />}
                                </div>
                                <h3 className="font-bold text-gray-800">{item.subject}</h3>
                                <span className="text-xs text-gray-400 ml-auto whitespace-nowrap">{item.date}</span>
                            </div>
                            <p className="text-sm text-gray-800 font-medium mb-1">{item.name} <span className="font-normal text-gray-500 text-xs ml-1">&lt;{item.email}&gt;</span></p>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 group-hover:bg-white group-hover:shadow-sm transition-all">{item.message}</p>
                        </div>
                    ))}

                    {activeTab === 'promotions' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">{language === 'bn' ? 'প্রচার এবং অফার' : 'Promotions & Offers'}</h2>
                                    <p className="text-gray-400 text-sm mt-1">{language === 'bn' ? 'গ্লোবাল ওয়েবসাইট পপআপ প্রচারাভিযান পরিচালনা করুন।' : 'Manage global website popup campaigns.'}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Settings Form */}
                                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
                                            <Tag size={20} />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800">Campaign Settings</h3>
                                    </div>

                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        updateData('promotion', localPromotion);
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
                                                <button onClick={() => toast.dismiss(t)} className="ml-auto p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
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
                                                    <input
                                                        name="offerRate"
                                                        value={localPromotion.offerRate}
                                                        onChange={(e) => setLocalPromotion({ ...localPromotion, offerRate: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#500000] transition-colors"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Expiry Date</label>
                                                    <input
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
                                                    <select
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
                                                <input
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

                    {activeTab === 'buildOption' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-800">{language === 'bn' ? 'বিল্ড সিস্টেম কনফিগারেশন' : 'Build System Configuration'}</h2>
                            </div>

                            {['type', 'feature', 'time', 'project'].map(cat => (
                                <div key={cat} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                        <div className="flex items-center gap-2">
                                            {cat === 'type' && <LayoutDashboard className="text-blue-500" />}
                                            {cat === 'feature' && <Sliders className="text-purple-500" />}
                                            {cat === 'time' && <Globe className="text-green-500" />}
                                            {cat === 'project' && <Briefcase className="text-[#500000]" />}
                                            <h3 className="text-lg font-bold capitalize text-gray-800">{cat} Options</h3>
                                        </div>
                                        <AdminButton variant="secondary" onClick={() => openModal('buildOption', { category: cat })} className="py-2 px-4 text-sm">
                                            <Plus size={16} /> Add Option
                                        </AdminButton>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {buildOptions.filter(b => b.category === cat).map(item => (
                                            <div key={item.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex justify-between items-center group hover:bg-white hover:shadow-md transition-all">
                                                <div>
                                                    <div className="font-bold text-gray-800">{item.label}</div>
                                                    <div className="text-xs font-mono text-gray-400 mt-1">
                                                        {(cat === 'type' || cat === 'project') ? `$${item.value}` : `x${item.value}`}
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => openModal('buildOption', item)} className="p-2 bg-white rounded-lg text-gray-500 hover:text-blue-600 shadow-sm"><Edit2 size={14} /></button>
                                                    <button onClick={() => handleDelete('buildOption', item.id)} className="p-2 bg-white rounded-lg text-gray-500 hover:text-red-600 shadow-sm"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'carousel' && renderList(language === 'bn' ? 'হিরো ক্যারোজেল' : 'Hero Carousel', carouselSlides, 'carousel', (item) => (
                        <div className="flex items-center gap-6">
                            <img src={item.image} alt="" className="w-24 h-16 rounded-lg bg-gray-200 object-cover shadow-sm" />
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">{item.title}</h3>
                                <p className="text-sm text-gray-500">{item.subtitle}</p>
                            </div>
                        </div>
                    ))}

                    {activeTab === 'services' && renderList(language === 'bn' ? 'সেবাসমূহ' : 'Services', services, 'service', (item) => (
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="p-1.5 bg-gray-100 rounded-md text-[#500000]"><Briefcase size={14} /></div>
                                <h3 className="font-bold text-gray-800">{item.title}</h3>
                            </div>
                            <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>
                        </div>
                    ))}

                    {activeTab === 'projects' && renderList(language === 'bn' ? 'প্রকল্প (বিল্ডার প্রিভিউ)' : 'Projects (Builder Previews)', projects, 'project', (item) => (
                        <div className="flex items-center gap-6">
                            <img src={item.image} alt="" className="w-16 h-16 rounded-xl bg-gray-200 object-cover shadow-sm" />
                            <div>
                                <h3 className="font-bold text-gray-800">{item.title}</h3>
                                <div className="flex gap-2 mt-1">
                                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${item.status === 'Live' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {item.status}
                                    </span>
                                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                                        Type: {item.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {activeTab === 'reviews' && renderList(language === 'bn' ? 'পর্যালোচনা' : 'Reviews', reviews, 'review', (item) => (
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-gray-800">{item.name}</h3>
                                <div className="flex text-yellow-400 text-xs">
                                    {Array.from({ length: item.rating }).map((_, i) => <span key={i}>★</span>)}
                                </div>
                            </div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{item.company}</p>
                            <p className="text-sm text-gray-600 italic">"{item.content}"</p>
                        </div>
                    ))}

                    {activeTab === 'blogs' && renderList(language === 'bn' ? 'ব্লগ পোস্ট' : 'Blog Posts', blogs, 'blog', (item) => (
                        <div className="flex gap-4">
                            <img src={item.image} className="w-16 h-16 rounded-lg object-cover bg-gray-200" alt="" />
                            <div>
                                <h3 className="font-bold text-gray-800">{item.title}</h3>
                                <p className="text-xs text-gray-500">{item.date} • {item.category}</p>
                            </div>
                        </div>
                    ))}

                    {activeTab === 'jobs' && renderList(language === 'bn' ? 'ক্যারিয়ার' : 'Careers', jobs, 'job', (item) => (
                        <div>
                            <h3 className="font-bold text-gray-800">{item.title}</h3>
                            <p className="text-sm text-gray-500">{item.location} • <span className="font-medium text-[#500000]">{item.salary}</span></p>
                        </div>
                    ))}

                    {activeTab === 'applications' && renderList(language === 'bn' ? 'চাকরির আবেদন' : 'Job Applications', careerApplications, 'application', (item) => (
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <div className="p-1.5 bg-green-100 rounded-md text-green-600"><Briefcase size={14} /></div>
                                <h3 className="font-bold text-gray-800">{item.name}</h3>
                                <span className="text-xs text-gray-400 ml-auto">{item.date}</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-2">Applied for: {jobs.find(j => j.id === item.jobId)?.title || 'Unknown Role'} ({item.email})</p>
                            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 mb-2">
                                <p className="font-bold text-xs uppercase mb-1">Experience:</p>
                                <p className="mb-2">{item.experience}</p>
                                <p className="font-bold text-xs uppercase mb-1">Why them:</p>
                                <p>{item.reason}</p>
                            </div>
                            {item.cvUrl ? (
                                <a href={item.cvUrl} download={item.cvName || 'resume.pdf'} className="inline-flex items-center gap-2 text-sm px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-bold">
                                    <FileDown size={14} /> Download CV
                                </a>
                            ) : (
                                <span className="text-xs text-gray-400">No CV attached</span>
                            )}
                        </div>
                    ))}

                    {activeTab === 'videos' && renderList(language === 'bn' ? 'ভিডিও' : 'Videos', videos, 'video', (item) => (
                        <div className="flex gap-4 items-center">
                            <div className="w-16 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-white shrink-0">
                                <PlayCircle size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800">{item.title}</h3>
                                <p className="text-xs text-gray-500 uppercase">{item.category}</p>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-800">
                                {editingItem ? (language === 'bn' ? 'সম্পাদনা করুন' : 'Edit') : (language === 'bn' ? 'নতুন যোগ করুন' : 'Add New')} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800 transition-colors bg-white p-2 rounded-full shadow-sm hover:shadow-md">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto">
                            <form id="admin-form" onSubmit={handleSave}>
                                {modalType === 'service' && <><AdminInput label="Title" name="title" defaultValue={editingItem?.title} required /><AdminInput label="Icon Name" name="icon" defaultValue={editingItem?.icon} /><AdminTextArea label="Short Description" name="description" defaultValue={editingItem?.description} /><AdminTextArea label="Full Details" name="details" defaultValue={editingItem?.details} /></>}

                                {modalType === 'project' && <>
                                    <AdminInput label="Project Title" name="title" defaultValue={editingItem?.title} required />

                                    {/* Improved Category Selector based on Build Options */}
                                    <AdminSelect label="Project Type (For Builder Preview)" name="category" defaultValue={editingItem?.category || 'Web App'}>
                                        {buildOptions.filter(b => b.category === 'type').map(opt => (
                                            <option key={opt.id} value={opt.label}>{opt.label}</option>
                                        ))}
                                        <option value="Other">Other</option>
                                    </AdminSelect>

                                    <AdminSelect label="Status" name="status" defaultValue={editingItem?.status}>
                                        <option value="Live">Live</option>
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Completed">Completed</option>
                                    </AdminSelect>

                                    <ImageUploader
                                        label="Project Preview Image"
                                        defaultValue={editingItem?.image}
                                        onImageChange={() => {
                                            // Since ImageUploader updates a hidden input, we don't strictly need this callback 
                                            // if we rely on formData, but for preview/state sync it's good.
                                            // However, AdminDashboard handles form via FormData, so we need to ensure 
                                            // the hidden input inside ImageUploader has the name="image" which it does.
                                        }}
                                        aspectRatio={4 / 5}
                                    />

                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <ImageUploader
                                            label="Gallery 1"
                                            name="gallery_1"
                                            defaultValue={editingItem?.gallery?.[0]}
                                            onImageChange={() => { }}
                                            aspectRatio={16 / 9}
                                        />
                                        <ImageUploader
                                            label="Gallery 2"
                                            name="gallery_2"
                                            defaultValue={editingItem?.gallery?.[1]}
                                            onImageChange={() => { }}
                                            aspectRatio={16 / 9}
                                        />
                                        <ImageUploader
                                            label="Gallery 3"
                                            name="gallery_3"
                                            defaultValue={editingItem?.gallery?.[2]}
                                            onImageChange={() => { }}
                                            aspectRatio={16 / 9}
                                        />
                                    </div>

                                    <AdminTextArea label="Description" name="description" defaultValue={editingItem?.description} required />
                                    <AdminInput label="Project Link" name="link" defaultValue={editingItem?.link} placeholder="https://..." />
                                    <AdminInput label="Tech Stack" name="tech" defaultValue={editingItem?.tech?.join(', ')} placeholder="React, Node, etc." />
                                </>}

                                {modalType === 'review' && <><AdminInput label="Client Name" name="name" defaultValue={editingItem?.name} required /><AdminInput label="Company" name="company" defaultValue={editingItem?.company} /><AdminTextArea label="Review" name="content" defaultValue={editingItem?.content} /><AdminInput label="Rating (1-5)" name="rating" defaultValue={editingItem?.rating} type="number" max="5" min="1" /></>}

                                {modalType === 'blog' && <>
                                    <AdminInput label="Title" name="title" defaultValue={editingItem?.title} required />
                                    <AdminInput label="Date" name="date" defaultValue={editingItem?.date} required />
                                    <AdminInput label="Category" name="category" defaultValue={editingItem?.category} required />

                                    <ImageUploader
                                        label="Blog Featured Image"
                                        defaultValue={editingItem?.image}
                                        onImageChange={() => { }}
                                        aspectRatio={16 / 9}
                                    />

                                    <AdminTextArea label="Excerpt" name="excerpt" defaultValue={editingItem?.excerpt} required />
                                    <AdminTextArea label="Content" name="content" defaultValue={editingItem?.content} required />
                                </>}

                                {modalType === 'job' && <><AdminInput label="Job Title" name="title" defaultValue={editingItem?.title} required /><AdminInput label="Location" name="location" defaultValue={editingItem?.location} /><AdminInput label="Salary" name="salary" defaultValue={editingItem?.salary} /><AdminInput label="Type" name="type" defaultValue={editingItem?.type} /><AdminTextArea label="Description" name="description" defaultValue={editingItem?.description} /></>}

                                {modalType === 'video' && <>
                                    <AdminInput label="Title" name="title" defaultValue={editingItem?.title} required />
                                    <AdminInput label="Category" name="category" defaultValue={editingItem?.category} required />

                                    <div className="mb-4">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">YouTube Link</label>
                                        <input
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
                                    <AdminInput label="Subtitle" name="subtitle" defaultValue={editingItem?.subtitle} required />

                                    <ImageUploader
                                        label="Background Image"
                                        defaultValue={editingItem?.image}
                                        onImageChange={() => { }}
                                        aspectRatio={16 / 9}
                                    />

                                    <AdminSelect label="Button Action" name="cta" defaultValue={editingItem?.cta || 'Contact Now'}>
                                        <option value="View Projects">View Projects</option>
                                        <option value="View Services">View Services</option>
                                        <option value="Contact Now">Contact Now</option>
                                        <option value="Appointment Now">Appointment Now</option>
                                        <option value="View Packages">View Packages</option>
                                        <option value="View Blogs">View Blogs</option>
                                    </AdminSelect>
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
                            </form>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50">
                            <AdminButton type="submit" form="admin-form" className="w-full">
                                <Save size={18} /> {language === 'bn' ? 'পরিবর্তন সংরক্ষণ করুন' : 'Save Changes'}
                            </AdminButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
