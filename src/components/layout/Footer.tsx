import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Linkedin, Instagram, Facebook, Youtube, ShieldCheck, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

const XLogo = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
);

const MediumLogo = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
        <path d="M13.54 12a6.8 6.8 0 11-6.77-6.82A6.77 6.77 0 0113.54 12zM20.96 12c0 3.54-1.51 6.41-3.38 6.41S14.2 15.54 14.2 12s1.51-6.41 3.38-6.41 3.38 2.87 3.38 6.41zM24 12c0 3.17-.53 5.75-1.19 5.75s-1.19-2.58-1.19-5.75.53-5.75 1.19-5.75S24 8.83 24 12z" />
    </svg>
);

const paymentMethods = [
    { name: 'Visa', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642634/rizqaratech/payment_methods/Visa-Logo.png', className: 'p-1' },
    { name: 'Mastercard', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642636/rizqaratech/payment_methods/mastercard-featured-image-1080x628.jpg', className: 'p-1' },
    { name: 'Amex', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642635/rizqaratech/payment_methods/amex.jpg', className: 'p-1' },
    { name: 'Payoneer', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642638/rizqaratech/payment_methods/payoneer-logo-payoneer-icon-transparent-free-png.webp', className: 'p-1' },
    { name: 'Google Pay', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642631/rizqaratech/payment_methods/GooglePayLogo.width-500.format-webp.webp', className: 'p-1' },
    { name: 'Redot Pay', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642639/rizqaratech/payment_methods/redot_pay.png', className: 'p-1' },
    { name: 'Bkash', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642630/rizqaratech/payment_methods/Bkash.jpg', className: 'p-1.5 object-contain' },
    { name: 'Nagad', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642632/rizqaratech/payment_methods/Nagad.jpg', className: 'p-3 object-contain' },
    { name: 'Rocket', src: 'https://res.cloudinary.com/dhutfywg2/image/upload/v1773642633/rizqaratech/payment_methods/Rocket.png', className: 'object-cover w-full h-full' },
];

export const Footer = () => {
    const navigate = useNavigate();
    const { t, language } = useData();

    return (
        <footer className="bg-white border-t border-gray-100 pt-24 pb-12 overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#500000] rounded-xl flex items-center justify-center text-white shadow-lg">
                                <span className="text-xl font-black">R</span>
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase">RizQara <span className="text-[#500000]">Tech</span></span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            {language === 'bn' 
                                ? 'রিজকারা টেক আপনার ডিজিটাল রূপান্তরের সহযোগী। আমরা উদ্ভাবনী সফটওয়্যার এবং এআই সমাধান প্রদান করি।' 
                                : 'Pioneering the future of digital excellence with bespoke software and AI-driven solutions tailored for global impact.'}
                        </p>
                        <div className="flex gap-4">
                            {[
                                { Icon: Linkedin, href: 'https://linkedin.com/company/rizqara-tech', label: 'LinkedIn' },
                                { Icon: XLogo, href: 'https://x.com/rizqara_tech', label: 'X (formerly Twitter)' },
                                { Icon: Facebook, href: 'https://facebook.com/rizqara.tech', label: 'Facebook' },
                                { Icon: Instagram, href: 'https://instagram.com/rizqara.tech', label: 'Instagram' },
                                { Icon: Youtube, href: 'https://youtube.com/@rizqara.tech', label: 'YouTube' },
                                { Icon: MediumLogo, href: 'https://medium.com/@rizqara.tech', label: 'Medium' }
                            ].map(({ Icon, href, label }) => (
                                <a 
                                    key={label} 
                                    href={href} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#500000] hover:border-[#500000] hover:shadow-lg transition-all active:scale-90"
                                    aria-label={label}
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] mb-8">{t('services')}</h4>
                        <ul className="space-y-4">
                            {[
                                { name: 'Web Development', path: '/services/web-development' },
                                { name: 'Mobile Apps', path: '/services/mobile-app-development' },
                                { name: 'AI Solutions', path: '/services/ai-solutions' },
                                { name: 'UI/UX Design', path: '/services/ui-ux-design' },
                                { name: 'SEO Optimization', path: '/services/seo-optimization' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <button onClick={() => navigate(item.path)} className="text-gray-500 hover:text-[#500000] transition-colors text-sm font-medium">{item.name}</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] mb-8">{t('company')}</h4>
                        <ul className="space-y-4">
                            {[
                                { name: t('about'), path: '/about' },
                                { name: t('projects'), path: '/projects' },
                                { name: t('caseStudies'), path: '/case-studies' },
                                { name: t('careers'), path: '/careers' },
                                { name: t('blog'), path: '/blog' },
                                { name: t('contact'), path: '/contact' }
                            ].map((item) => (
                                <li key={item.name}>
                                    <button onClick={() => navigate(item.path)} className="text-gray-500 hover:text-[#500000] transition-colors text-sm font-medium">{item.name}</button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] mb-8">Newsletter</h4>
                        <p className="text-gray-500 text-sm mb-6">Stay updated with our latest insights and tech news.</p>
                        <div className="relative">
                            <label htmlFor="newsletter-email" className="sr-only">Newsletter Email</label>
                            <input 
                                id="newsletter-email"
                                type="email" 
                                placeholder="Enter email" 
                                className="w-full bg-gray-50 border border-gray-100 rounded-full py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-[#500000] transition-all"
                            />
                            <button className="absolute right-2 top-2 w-10 h-10 bg-[#500000] text-white rounded-full flex items-center justify-center hover:bg-[#3a0000] transition-all" aria-label="Subscribe to newsletter">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                        
                        <div className="mt-8 pt-8 border-t border-gray-50">
                            <div className="flex items-center gap-3 text-gray-500 group">
                                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-[#500000]/10 transition-colors">
                                    <ShieldCheck size={20} className="group-hover:text-[#500000]" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest">ISO Certified</p>
                                    <p className="text-xs font-bold text-gray-900">Standard Excellence</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Locations and Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12 border-y border-gray-50 mb-12">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                            <MapPin size={20} className="text-[#500000]" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Office (Bangladesh)</p>
                            <p className="text-sm font-bold text-gray-900 leading-relaxed">Level 4, Plot 10, Road 2, Block D, Nikunja-2, Khilkhet, Dhaka-1229</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                            <Phone size={20} className="text-[#500000]" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Call Us</p>
                            <p className="text-sm font-bold text-gray-900 leading-relaxed">+880 1629 111878</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                            <Mail size={20} className="text-[#500000]" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Email Us</p>
                            <p className="text-sm font-bold text-gray-900 leading-relaxed">contact@rizqara.tech</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest order-2 md:order-1">
                        &copy; {new Date().getFullYear()} RizQara Tech Ltd. All Rights Reserved.
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-4 order-1 md:order-2">
                        {paymentMethods.map((method) => (
                            <div key={method.name} className="h-8 w-12 bg-gray-50 rounded-md border border-gray-100 flex items-center justify-center overflow-hidden" title={method.name}>
                                <img src={method.src} alt={method.name} className={`max-w-full max-h-full object-contain filter grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all ${method.className}`} />
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-6 order-3">
                        <button onClick={() => navigate('/privacy-policy')} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#500000] transition-colors">{t('privacyPolicy')}</button>
                        <button onClick={() => navigate('/terms-of-service')} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#500000] transition-colors">{t('termsOfService')}</button>
                    </div>
                </div>
            </div>
        </footer>
    );
};
