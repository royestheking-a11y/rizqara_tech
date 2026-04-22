import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useData, BlogPost } from '../../context/DataContext';

import { Calendar, MapPin, ArrowRight, PlayCircle, X, Upload, Check, FileText, Linkedin, Twitter, Mail, MessageSquare, Play, Share2, MessageCircle, Send } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

import { getYoutubeId } from '../premium/UIComponents';
import { useNavigate, useParams } from 'react-router-dom';
import { SEO } from '../SEO';
import { getSlug } from '../../App';

const PageHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
    <div className="mb-16">
        <h1 className="text-3xl md:text-4xl font-black text-[#500000] mb-6 leading-tight">{title}</h1>
        <p className="text-lg text-gray-600 max-w-2xl font-light leading-relaxed">{subtitle}</p>
    </div>
);

const ApplicationModal = ({ job, onClose, onSubmit }: any) => {
    const [status, setStatus] = useState('idle'); // idle, sending, success
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = useState('');
    const { language } = useData();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('sending');

        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const file = fileInputRef.current?.files?.[0];
        let cvUrl = '';
        if (file) {
            cvUrl = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(file);
            });
        }

        const appData = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            experience: formData.get('experience') as string,
            reason: formData.get('reason') as string,
            cvName: file?.name || 'No CV',
            cvUrl, // Cloudinary URL
            jobId: job.id
        };

        // Simulate network delay
        setTimeout(() => {
            onSubmit(appData);
            setStatus('success');
            // Toast removed to avoid redundancy (Modal has success UI)
            setTimeout(onClose, 2000);
        }, 1500);
    };

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 top-0 left-0 h-screen w-screen">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white border border-gray-200 rounded-3xl p-8 w-full max-w-lg relative z-10 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
                <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 bg-gray-100 rounded-full p-2 transition-colors"><X size={20} /></button>

                {status === 'success' ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white">
                            <Check size={40} strokeWidth={4} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{language === 'bn' ? 'আবেদন পাঠানো হয়েছে!' : 'Application Sent!'}</h3>
                        <p className="text-gray-500">{language === 'bn' ? 'আমরা আপনার প্রোফাইল পর্যালোচনা করব এবং শীঘ্রই আপনার সাথে যোগাযোগ করব।' : 'We will review your profile and get back to you shortly.'}</p>
                    </div>
                ) : (
                    <>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{language === 'bn' ? `${job.title}-এর জন্য আবেদন করুন` : `Apply for ${job.title}`}</h2>
                        <p className="text-gray-500 text-sm mb-6">{language === 'bn' ? 'আপনার আবেদন জমা দিতে নিচের ফর্মটি পূরণ করুন।' : 'Complete the form below to submit your application.'}</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{language === 'bn' ? 'পুরো নাম' : 'Full Name'}</label>
                                <input name="name" required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:border-[#500000] outline-none transition-colors" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{language === 'bn' ? 'ইমেইল ঠিকানা' : 'Email Address'}</label>
                                <input name="email" type="email" required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:border-[#500000] outline-none transition-colors" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{language === 'bn' ? 'অভিজ্ঞতার বছর' : 'Years of Experience'}</label>
                                <input name="experience" required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:border-[#500000] outline-none transition-colors" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{language === 'bn' ? 'কেন আপনি এই পদের জন্য উপযুক্ত?' : 'Why are you perfect for this role?'}</label>
                                <textarea name="reason" rows={3} required className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-gray-900 focus:border-[#500000] outline-none transition-colors" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{language === 'bn' ? 'জীবনবৃত্তান্ত / সিভি' : 'Resume / CV'}</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors group"
                                >
                                    <input ref={fileInputRef} type="file" hidden accept=".pdf,.doc,.docx" onChange={(e) => setFileName(e.target.files?.[0]?.name || '')} />
                                    {fileName ? (
                                        <div className="flex items-center justify-center gap-2 text-green-600 font-bold">
                                            <FileText size={20} /> {fileName}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-gray-600 transition-colors">
                                            <Upload size={24} />
                                            <span className="text-sm">{language === 'bn' ? 'সিভি আপলোড করতে ক্লিক করুন (পিডিএফ)' : 'Click to upload CV (PDF)'}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button disabled={status === 'sending'} className="w-full bg-[#500000] text-white font-bold py-4 rounded-xl mt-4 hover:bg-[#3a0000] transition-colors flex items-center justify-center gap-2 shadow-lg">
                                {status === 'sending' ? (language === 'bn' ? 'জমা দেওয়া হচ্ছে...' : 'Submitting...') : (language === 'bn' ? 'আবেদন জমা দিন' : 'Submit Application')}
                            </button>
                        </form>
                    </>
                )}
            </motion.div>
        </div>,
        document.body
    );
};

export const BlogPage = ({ onNavigate }: { onNavigate: (page: string, id?: string) => void }) => {
    const { blogs, language } = useData();

    return (
        <div className="container mx-auto px-6 py-32">
            <SEO 
                title="Tech Blog | RizQara Tech - Insights on Software & AI"
                description="Explore our latest blog posts on software development, AI, UI/UX design, and digital business trends. Stay updated with RizQara Tech."
                canonical="https://rizqara.tech/blog"
            />
            <PageHeader
                title={language === 'bn' ? 'সর্বশেষ অন্তর্দৃষ্টি' : "Latest Insights"}
                subtitle={language === 'bn' ? 'প্রযুক্তি, ডিজাইন এবং ডিজিটাল ব্যবসার ভবিষ্যৎ নিয়ে চিন্তা-ভাবনা।' : "Thoughts on technology, design, and the future of digital business."}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map(post => {
                    const title = language === 'bn' ? (post.title_bn || post.title) : post.title;
                    const excerpt = language === 'bn' ? (post.excerpt_bn || post.excerpt) : post.excerpt;
                    const category = language === 'bn' ? (post.category_bn || post.category) : post.category;

                    return (
                        <div key={post.id} className="group cursor-pointer" onClick={() => onNavigate('BlogDetail', getSlug(post.title))}>
                            <div className="aspect-[16/10] overflow-hidden rounded-2xl mb-6 relative shadow-md">
                                <img src={post.image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute top-4 left-4 bg-white text-[#500000] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">{category}</div>
                            </div>
                            <div className="flex items-center gap-3 text-gray-400 text-xs mb-3 font-medium uppercase tracking-widest">
                                <Calendar size={12} /> {post.date}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-[#500000] transition-colors leading-tight">{title}</h3>
                            <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">{excerpt}</p>
                            <div className="flex items-center text-[#500000] font-bold text-sm uppercase tracking-wider group-hover:gap-2 transition-all">
                                {language === 'bn' ? 'নিবন্ধ পড়ুন' : 'Read Article'} <ArrowRight size={16} className="ml-2" />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export const BlogDetail = () => {
    const { id } = useParams();
    const { blogs, language, loading } = useData();
    const navigate = useNavigate();
    
    const blog = blogs.find(b => getSlug(b.title) === id || String(b.id) === id);

    // Redirect from ID to Slug for SEO
    React.useLayoutEffect(() => {
        if (!loading && blog && String(blog.id) === id) {
            const slug = getSlug(blog.title);
            if (slug && slug !== id) {
                navigate(`/blog/${slug}`, { replace: true });
            }
        }
    }, [blog, id, navigate, loading]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#500000]"></div>
            </div>
        );
    }

    if (!blog) return <div className="text-gray-900 pt-32 text-center text-xl font-light">Blog post not found</div>;

    const title = language === 'bn' ? (blog.title_bn || blog.title) : blog.title;
    const content = language === 'bn' ? (blog.content_bn || blog.content) : blog.content;
    const category = language === 'bn' ? (blog.category_bn || blog.category) : blog.category;
    const excerpt = language === 'bn' ? (blog.excerpt_bn || blog.excerpt) : blog.excerpt;

    const handleShare = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: excerpt,
                    url: url,
                });
            } catch (error) {
                console.log('Error sharing', error);
            }
        } else {
            try {
                await navigator.clipboard.writeText(url);
                toast.success('Link copied to clipboard!');
            } catch (err) {
                // Fallback for copy
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
                } catch (e) {
                    prompt("Copy this link:", url);
                }
                document.body.removeChild(textArea);
            }
        }
    };

    const relatedBlogs = (blogs as BlogPost[]).filter((b: BlogPost) => b.id !== blog.id && b.category === blog.category).slice(0, 3);

    const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": title,
        "description": excerpt,
        "image": blog.image,
        "datePublished": blog.date,
        "author": {
            "@type": "Organization",
            "name": "RizQara Tech"
        }
    };

    return (
        <div className="container mx-auto px-6 py-32 min-h-screen">
            <SEO 
                title={`${title} | Tech Blog | RizQara Tech`}
                description={excerpt}
                canonical={`https://rizqara.tech/blog/${getSlug(blog.title)}`}
                schema={schema}
                type="article"
                image={blog.image}
            />
            <div className="flex justify-between items-center mb-12">
                <button onClick={() => navigate('/blog')} className="flex items-center text-gray-500 hover:text-[#500000] transition-colors group">
                    <div className="p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 mr-4 transition-colors">
                        <ArrowRight className="rotate-180" size={20} />
                    </div>
                    <span className="text-sm uppercase tracking-widest font-bold">{language === 'bn' ? 'ব্লগে ফিরে যান' : 'Back to Blog'}</span>
                </button>
                <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 hover:bg-[#500000] hover:text-white hover:border-[#500000] transition-all text-sm font-bold text-gray-600">
                    <Share2 size={16} /> {language === 'bn' ? 'শেয়ার করুন' : 'Share'}
                </button>
            </div>

            <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="aspect-video rounded-3xl overflow-hidden mb-12 border border-gray-200 shadow-2xl">
                        <img src={blog.image} alt={title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center gap-6 mb-8">
                        <span className="bg-[#500000] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">{category}</span>
                        <span className="text-gray-500 flex items-center gap-2 text-sm"><Calendar size={16} /> {blog.date}</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">{title}</h1>
                    <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed whitespace-pre-line border-l border-gray-200 pl-6 mb-24">
                        {content}
                    </div>
                </motion.div>

                {/* Related Blogs - Internal Linking System */}
                {relatedBlogs.length > 0 && (
                    <div className="mt-24 pt-24 border-t border-gray-100">
                        <h3 className="text-3xl font-black text-[#500000] mb-12 uppercase tracking-tight">
                            {language === 'bn' ? 'সম্পর্কিত নিবন্ধ' : 'Related Articles'}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedBlogs.map(post => (
                                <div 
                                    key={post.id} 
                                    className="group cursor-pointer" 
                                    onClick={() => {
                                        navigate(`/blog/${getSlug(post.title)}`);
                                        window.scrollTo(0, 0);
                                    }}
                                >
                                    <div className="aspect-[16/10] overflow-hidden rounded-xl mb-4 relative shadow-sm border border-gray-100">
                                        <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-[#500000] transition-colors line-clamp-2">
                                        {language === 'bn' ? (post.title_bn || post.title) : post.title}
                                    </h4>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const CareersPage: React.FC<{ onNavigate?: (page: string, id?: string) => void }> = () => {
    const { jobs, addCareerApplication, language } = useData();
    const [selectedJob, setSelectedJob] = useState<any>(null);

    return (
        <div className="container mx-auto px-6 py-32">
            <PageHeader
                title={language === 'bn' ? 'টিমে যোগ দিন' : "Join Our Team"}
                subtitle={language === 'bn' ? 'আমরা ভবিষ্যৎ গড়তে আমাদের সাহায্য করার জন্য উৎসাহী ব্যক্তিদের খুঁজছি।' : "We are looking for passionate individuals to help us build the future."}
            />

            <AnimatePresence>
                {selectedJob && (
                    <ApplicationModal
                        job={selectedJob}
                        onClose={() => setSelectedJob(null)}
                        onSubmit={addCareerApplication}
                    />
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-6 max-w-4xl">
                {jobs.map(job => {
                    const title = language === 'bn' ? (job.title_bn || job.title) : job.title;
                    const location = language === 'bn' ? (job.location_bn || job.location) : job.location;
                    const type = language === 'bn' && job.type === 'Full-time' ? 'ফুল-টাইম' : job.type; // Simple mapping, could be extended

                    return (
                        <div key={job.id} className="group p-8 bg-white border border-gray-200 hover:shadow-lg rounded-3xl transition-all duration-300 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#500000] mb-2 transition-colors">{title}</h3>
                                <div className="flex gap-4 text-gray-500 text-sm">
                                    <span className="flex items-center gap-1"><MapPin size={14} /> {location}</span>
                                    <span>•</span>
                                    <span>{type}</span>
                                    <span>•</span>
                                    <span className="font-bold text-[#500000]">{job.salary}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedJob(job)}
                                className="px-6 py-3 rounded-full border border-gray-200 text-gray-700 hover:bg-[#500000] hover:text-white hover:border-[#500000] transition-all font-medium shadow-sm"
                            >
                                {language === 'bn' ? 'আবেদন করুন' : 'Apply Now'}
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export const VideoDetail = () => {
    const { id } = useParams();
    const { videos, language, addVideoComment, loading } = useData();
    const navigate = useNavigate();
    const [commentText, setCommentText] = useState('');
    const [userName, setUserName] = useState('');

    const video = videos.find(v => {
        const videoSlug = `${getSlug(v.title)}-${v.id}`;
        return videoSlug === id || String(v.id) === id;
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#500000]"></div>
            </div>
        );
    }

    if (!video) return <div className="text-gray-900 pt-32 text-center text-xl font-light">Video not found</div>;

    const videoId = getYoutubeId(video.url);
    const title = language === 'bn' ? (video.title_bn || video.title) : video.title;
    const category = language === 'bn' ? (video.category_bn || video.category) : video.category;
    const description = language === 'bn' ? (video.description_bn || video.description) : video.description;

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !userName.trim()) return;

        addVideoComment(video.id, {
            user: userName,
            text: commentText
        });
        setCommentText('');
        toast.success(language === 'bn' ? "মন্তব্য যোগ করা হয়েছে!" : "Comment added!");
    };

    return (
        <div className="bg-white min-h-screen pb-24">
            <SEO 
                title={`${title} | Watch Video | RizQara Tech`}
                description={description || title}
                image={videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : video.thumbnail}
                type="video.other"
                canonical={`https://rizqara.tech/videos/${id}`}
            />
            {/* Header / Back Navigation */}
            <div className="container mx-auto px-6 py-8 pt-32">
                <button onClick={() => navigate('/videos')} className="flex items-center text-gray-500 hover:text-[#500000] transition-colors group mb-8">
                    <div className="p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 mr-4 transition-colors">
                        <ArrowRight className="rotate-180" size={20} />
                    </div>
                    <span className="text-sm uppercase tracking-widest font-bold">{language === 'bn' ? 'ভিডিওতে ফিরে যান' : 'Back to Videos'}</span>
                </button>
            </div>

            <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Main Content: Video Player & Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Large Video Player */}
                    <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-100 relative group">
                        {videoId ? (
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
                                title={title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="w-full h-full"
                            ></iframe>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-white/40">
                                <PlayCircle size={64} className="mb-4 opacity-20" />
                                <p className="text-lg font-bold">Video unavailable</p>
                            </div>
                        )}
                    </div>

                    {/* Meta Info */}
                    <div className="p-8 md:p-10 bg-gray-50/50 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <span className="px-4 py-1.5 bg-[#500000] text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-md">
                                {category}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                            {title}
                        </h1>
                        <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed whitespace-pre-line border-l-4 border-[#500000]/20 pl-6 py-2">
                            {description || (language === 'bn' ? 'কোন বিবরণ উপলব্ধ নেই।' : 'No description available.')}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Comments */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden flex flex-col h-[700px] sticky top-32">
                        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                <MessageSquare size={24} className="text-[#500000]" />
                                {language === 'bn' ? 'মন্তব্যসমূহ' : 'Comments'}
                                <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full">{video.comments?.length || 0}</span>
                            </h3>
                        </div>

                        {/* Comments List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            {video.comments && video.comments.length > 0 ? (
                                video.comments.map((c: any) => (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={c.id} 
                                        className="bg-gray-50/80 p-5 rounded-lg border border-gray-100"
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-gray-900">{c.user}</span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{c.date}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed">{c.text}</p>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50 space-y-4">
                                    <MessageCircle size={48} />
                                    <p className="font-medium">{language === 'bn' ? 'প্রথম মন্তব্য করুন!' : 'No comments yet. Start the conversation!'}</p>
                                </div>
                            )}
                        </div>

                        {/* Comment Form */}
                        <div className="p-8 bg-gray-50 border-t border-gray-100">
                            <form onSubmit={handleCommentSubmit} className="space-y-4">
                                <input
                                    placeholder={language === 'bn' ? "আপনার নাম" : "Your Name"}
                                    value={userName}
                                    onChange={e => setUserName(e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#500000]/20 focus:border-[#500000] shadow-sm transition-all"
                                    required
                                />
                                <div className="relative">
                                    <textarea
                                        placeholder={language === 'bn' ? "একটি মন্তব্য যোগ করুন..." : "Add your thoughts..."}
                                        value={commentText}
                                        onChange={e => setCommentText(e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#500000]/20 focus:border-[#500000] shadow-sm transition-all min-h-[100px] resize-none pr-12"
                                        required
                                    />
                                    <button 
                                        type="submit" 
                                        className="absolute bottom-4 right-4 p-2 bg-[#500000] text-white rounded-lg hover:bg-[#3a0000] hover:scale-105 transition-all shadow-md group"
                                    >
                                        <Send size={18} className="group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const VideosPage: React.FC<{ onNavigate?: (page: string, id?: string) => void }> = () => {
    const { videos, language } = useData();
    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-6 py-32">
            <SEO 
                title={language === 'bn' ? 'ফিচার্ড কন্টেন্ট | রিজকারা টেক' : 'Featured Content | Latest Insights | RizQara Tech'}
                description={language === 'bn' ? 'আমাদের সর্বশেষ শোরিল, টিউটোরিয়াল এবং সাফল্যের গল্প দেখুন।' : 'Watch our latest showreels, tutorials, and success stories at RizQara Tech.'}
                canonical="https://rizqara.tech/videos"
            />
            <PageHeader
                title={language === 'bn' ? 'ফিচার্ড কন্টেন্ট' : "Featured Content"}
                subtitle={language === 'bn' ? 'আমাদের সর্বশেষ শোরিল, টিউটোরিয়াল এবং সাফল্যের গল্প দেখুন।' : "Watch our latest showreels, tutorials, and success stories."}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map(video => {
                    const title = language === 'bn' ? (video.title_bn || video.title) : video.title;
                    return (
                        <div
                            key={video.id}
                            className="group relative cursor-pointer rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all"
                            onClick={() => navigate(`/videos/${getSlug(video.title)}-${video.id}`)}
                        >
                            <div className="aspect-video relative overflow-hidden">
                                {/* Use YouTube Thumbnail if available, else fallback to stored thumbnail */}
                                <img
                                    src={getYoutubeId(video.url) ? `https://img.youtube.com/vi/${getYoutubeId(video.url)}/maxresdefault.jpg` : video.thumbnail}
                                    alt={title}
                                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform border border-white/50 group-hover:bg-[#500000] shadow-lg">
                                        <Play size={32} className="text-white ml-1 fill-current" />
                                    </div>
                                </div>
                                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                    <PlayCircle size={12} /> {language === 'bn' ? 'দেখতে ক্লিক করুন' : 'Click to View'}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#500000] transition-colors line-clamp-1">{title}</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded-md border border-gray-200">{video.category}</span>
                                    <span className="text-xs text-gray-400 flex items-center gap-1"><MessageSquare size={14} /> {video.comments?.length || 0} {language === 'bn' ? 'মন্তব্য' : 'Comments'}</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export const TeamSection = () => {
    const { language } = useData();

    type TeamMember = {
        name: string;
        position: string;
        image: string;
        bio?: string;
    };

    const team: { role: string; members: TeamMember[] }[] = [
        {
            role: "Chairman",
            members: [
                { name: "Aurangzeb Sunny", position: language === 'bn' ? "চেয়ারম্যান" : "Chairman", image: "/aurangzeb.jpeg", bio: language === 'bn' ? "টেক উদ্ভাবনে ৫+ বছরের অভিজ্ঞতা সম্পন্ন দূরদর্শী নেতা।" : "Visionary leader with 5+ years in tech innovation." }
            ]
        },
        {
            role: "Executive Leadership",
            members: [
                { name: "Pritom Sarker", position: language === 'bn' ? "প্রধান নির্বাহী কর্মকর্তা" : "Chief Executive Officer", image: "https://res.cloudinary.com/dhutfywg2/image/upload/v1775457382/rizqara/team/pritom_v2.jpg", bio: language === 'bn' ? "গ্লোবাল স্ট্র্যাটেজি এবং অপারেশনাল এক্সেলেন্স পরিচালনা করছেন।" : "Driving global strategy and operational excellence." }
            ]
        },
        {
            role: "Management",
            members: [
                { name: "Sanju Monowara", position: language === 'bn' ? "ম্যানেজমেন্ট হেড" : "Management Head", image: "https://res.cloudinary.com/dhutfywg2/image/upload/v1775457384/rizqara/team/sanju_v2.jpg", bio: language === 'bn' ? "সমস্ত প্রজেক্টে নির্বিঘ্ন ডেলিভারি নিশ্চিত করছেন।" : "Ensuring seamless delivery across all projects." },
                { name: "Afrin Rahman Omi", position: language === 'bn' ? "জেনারেল ম্যানেজার" : "General Manager", image: "/afrin.jpg", bio: language === 'bn' ? "অপারেশন পরিচালনা এবং প্রাতিষ্ঠানিক সাফল্য নিশ্চিত করছেন।" : "Overseeing operations and ensuring organizational success." }
            ]
        },
        {
            role: "Engineering & Design",
            members: [
                { name: "Safayat Hossen Alif", position: language === 'bn' ? "লিড ডেভেলপার" : "Lead Developer", image: "/alif.jpeg", bio: language === 'bn' ? "শক্তিশালী এবং স্কেলেবল সফটওয়্যার সলিউশন তৈরি করছেন।" : "Architecting robust and scalable software solutions." },
                { name: "Muhammad Sami", position: language === 'bn' ? "সিনিয়র ইউআই/ইউএক্স ডিজাইনার" : "Senior UI/UX Designer", image: "https://res.cloudinary.com/dhutfywg2/image/upload/v1775457386/rizqara/team/sami_v2.jpg", bio: language === 'bn' ? "সহজ এবং দৃষ্টিনন্দন ইউজার এক্সপেরিয়েন্স তৈরি করছেন।" : "Crafting intuitive and aesthetically pleasing user experiences." },
                { name: "Tamzid Islam Rafat", position: language === 'bn' ? "গ্রাফিক্স ডিজাইনার" : "Graphics Designer", image: "/Rafat.jpeg", bio: language === 'bn' ? "সৃজনশীল ভিজ্যুয়াল স্টোরিটেলিংয়ের মাধ্যমে আইডিয়ায় প্রাণ দিচ্ছেন।" : "Bringing ideas to life through creative visual storytelling." }
            ]
        },
        {
            role: "Growth & Marketing",
            members: [
                { name: "GM Moshiur", position: language === 'bn' ? "মার্কেটিং হেড" : "Marketing Head", image: "/gm mosiur.jpeg", bio: language === 'bn' ? "ব্র্যান্ডের বৃদ্ধি এবং উপস্থিতি বাড়াতে মার্কেটিং স্ট্র্যাটেজি পরিচালনা করছেন।" : "Leading marketing strategies to drive brand growth and presence." },
                { name: "Mafuz Ahmed", position: language === 'bn' ? "কন্টেন্ট রাইটার" : "Content Writer", image: "/mafuz.jpeg", bio: language === 'bn' ? "দর্শকদের আকৃষ্ট এবং অনুপ্রাণিত করতে চমৎকার কনটেন্ট তৈরি করছেন।" : "Creating compelling narratives to engage and inspire audiences." },
                { name: "Sourob Hawlader", position: language === 'bn' ? "ডিজিটাল মার্কেটার" : "Digital Marketer", image: "/sourob.jpeg", bio: language === 'bn' ? "সর্বোচ্চ রিচ পেতে ডেটা-নির্ভর ডিজিটাল ক্যাম্পেইন পরিচালনা করছেন।" : "Executing data-driven digital campaigns for maximum reach." }
            ]
        }
    ];

    // Flatten all members into a single array
    const allMembers = team.flatMap(group => group.members);

    return (
        <div className="flex flex-wrap justify-center gap-8">
            {allMembers.map((member, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative w-full max-w-[320px]"
                >
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-6 border border-gray-200 bg-gray-100 relative shadow-md">
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div className="absolute bottom-0 left-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform">
                            <div className="flex gap-3 mb-4 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                <button className="p-2 bg-white text-[#500000] rounded-full hover:bg-gray-200 shadow-lg"><Linkedin size={16} /></button>
                                <button className="p-2 bg-white text-[#500000] rounded-full hover:bg-gray-200 shadow-lg"><Twitter size={16} /></button>
                                <button className="p-2 bg-white text-[#500000] rounded-full hover:bg-gray-200 shadow-lg"><Mail size={16} /></button>
                            </div>
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                        <p className="text-white bg-[#500000] text-xs font-bold px-2 py-0.5 rounded inline-block uppercase tracking-wider mb-2 shadow-sm">{member.position}</p>
                        {member.bio && <p className="text-gray-500 text-sm max-w-xs mx-auto line-clamp-2">{member.bio}</p>}
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export const TeamPage = () => {
    const { language } = useData();
    return (
        <div className="container mx-auto px-6 py-32 min-h-screen">
            <PageHeader
                title={language === 'bn' ? 'আমাদের টিম' : "Our Team"}
                subtitle={language === 'bn' ? 'রিজকারা টেকের উদ্ভাবনের পিছনে থাকা মেধাবী মন।' : "The brilliant minds behind Rizqara Tech's innovations."}
            />
            <TeamSection />
        </div>
    );
};
