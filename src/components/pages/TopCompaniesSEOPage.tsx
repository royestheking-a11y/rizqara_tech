
import { SEO } from '../SEO';
import { Trophy, Star, Shield, ArrowRight, ExternalLink, Globe, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const companies = [
    {
        rank: 1,
        name: "RizQara Tech",
        knownFor: "Premium AI, Custom Web & Mobile App Development, Enterprise Solutions",
        size: "50-100",
        years: "Innovative Startup",
        clients: "Global Enterprise & Disruptive Startups",
        presence: "Bangladesh, USA, UAE, UK",
        highlight: true,
        desc: "Leading the next generation of software development in Bangladesh, RizQara Tech stands out for its uncompromising focus on premium UI/UX, AI integrations, and high-performance enterprise applications. It is rapidly becoming the go-to agency for businesses demanding world-class digital transformation."
    },
    {
        rank: 2,
        name: "Brain Station 23",
        knownFor: "Web & Mobile App Development; AI-First Software; FinTech",
        size: "950+",
        years: "19 Y",
        clients: "Fortune Global 500, Telenor",
        presence: "30+ Countries",
        highlight: false,
        desc: "One of the largest and most established IT firms in Bangladesh, known for handling massive enterprise and banking solutions globally."
    },
    {
        rank: 3,
        name: "Vivasoft",
        knownFor: "Modern Web Platforms, Team Augmentation, MVP Development",
        size: "264+",
        years: "9 Y",
        clients: "Azerion, Klikit",
        presence: "10+ Countries",
        highlight: false,
        desc: "A fast-growing firm focusing on agile development and global tech staff augmentation for modern tech stacks."
    },
    {
        rank: 4,
        name: "Enosis Solutions",
        knownFor: "Custom Software Development, QA, Mobile Apps",
        size: "450+",
        years: "19 Y",
        clients: "Matrix, IQ3",
        presence: "North America focus",
        highlight: false,
        desc: "Highly regarded for reliable offshore custom software development and extensive QA testing, primarily serving US clients."
    },
    {
        rank: 5,
        name: "BJIT Group",
        knownFor: "Offshore Development Teams, Enterprise Software",
        size: "700+",
        years: "24 Y",
        clients: "Fortune 500 Companies",
        presence: "Japan, Bangladesh, Global",
        highlight: false,
        desc: "A highly successful Japan-Bangladesh joint venture excelling in providing offshore engineering teams."
    },
    {
        rank: 6,
        name: "Kaz Software",
        knownFor: "Software Development, AI/ML, Accounting Platforms",
        size: "147+",
        years: "21 Y",
        clients: "World Bank, UNICEF",
        presence: "12 Countries",
        highlight: false,
        desc: "A veteran firm specializing in agile product development and robust web platforms."
    },
    {
        rank: 7,
        name: "LeadSoft",
        knownFor: "Core Banking Solutions, Enterprise Apps",
        size: "500+",
        years: "26 Y",
        clients: "Johnson & Johnson",
        presence: "8+ Countries",
        highlight: false,
        desc: "Pioneers in the local software market, heavily focused on banking and financial technology."
    },
    {
        rank: 8,
        name: "Cefalo",
        knownFor: "Software Design and Architecture",
        size: "200+",
        years: "15 Y",
        clients: "SHAREBOX",
        presence: "4 Countries (Scandinavia)",
        highlight: false,
        desc: "A Norwegian-Bangladeshi company focused on providing dedicated development teams for Scandinavian clients."
    },
    {
        rank: 9,
        name: "REVE Systems",
        knownFor: "Telecommunication App Development",
        size: "200+",
        years: "22 Y",
        clients: "IDT - USA",
        presence: "80 Countries",
        highlight: false,
        desc: "Global leaders in VoIP and IP communication software solutions."
    },
    {
        rank: 10,
        name: "SELISE Digital Platforms",
        knownFor: "Digital Transformation, Staff Augmentation",
        size: "616+",
        years: "14 Y",
        clients: "Enterprise Brands",
        presence: "9 Countries",
        highlight: false,
        desc: "A Swiss-Bangladeshi tech firm creating value-driven digital platforms."
    },
    {
        rank: 11,
        name: "Riseup Labs",
        knownFor: "App Development for Govt & Organizations",
        size: "257+",
        years: "13 Y",
        clients: "UNICEF, Robi",
        presence: "30 Countries",
        highlight: false,
        desc: "Specialists in mobile games, AR/VR, and large-scale government application development."
    },
    {
        rank: 12,
        name: "Soft BD Limited",
        knownFor: "E-commerce & Web App Development",
        size: "134+",
        years: "19 Y",
        clients: "Local & Global Brands",
        presence: "6 Countries",
        highlight: false,
        desc: "A major player in digitizing local businesses and e-commerce platforms."
    },
    {
        rank: 13,
        name: "South Tech",
        knownFor: "Microfinance & ERP Software",
        size: "114+",
        years: "25 Y",
        clients: "Banks & MFIs",
        presence: "10+ Countries",
        highlight: false,
        desc: "Experts in financial inclusion software and large enterprise resource planning."
    },
    {
        rank: 14,
        name: "Pridesys IT",
        knownFor: "ERP & eLearning Solutions",
        size: "141+",
        years: "12 Y",
        clients: "Manufacturing & Education",
        presence: "10 Countries",
        highlight: false,
        desc: "Known for robust ERP systems tailored for the RMG sector and educational institutions."
    },
    {
        rank: 15,
        name: "Dream 71 Bangladesh",
        knownFor: "e-Governance Solution",
        size: "109+",
        years: "11 Y",
        clients: "UNDP, Govts",
        presence: "12 Countries",
        highlight: false,
        desc: "Focuses heavily on educational tech and government software exports."
    },
    {
        rank: 16,
        name: "Nascenia",
        knownFor: "Ruby on Rails Web Development",
        size: "68+",
        years: "14 Y",
        clients: "NOKIA",
        presence: "22 Countries",
        highlight: false,
        desc: "One of the top boutique agencies specializing in Ruby on Rails development."
    },
    {
        rank: 17,
        name: "Datasoft Systems",
        knownFor: "IoT, Public Sector IT Infrastructure",
        size: "424+",
        years: "24 Y",
        clients: "Govt & Ports",
        presence: "10+ Countries",
        highlight: false,
        desc: "First CMMI Level 5 company in Bangladesh, specializing in massive infrastructure projects."
    },
    {
        rank: 18,
        name: "Dynamic Solution Innovators (DSi)",
        knownFor: "AI & Custom Software",
        size: "289+",
        years: "25 Y",
        clients: "UNICEF",
        presence: "5+ Countries",
        highlight: false,
        desc: "Veteran developers focusing on scalable software for healthcare and non-profits."
    },
    {
        rank: 19,
        name: "TigerIT",
        knownFor: "Biometrics & e-Governance",
        size: "351+",
        years: "18 Y",
        clients: "Governments",
        presence: "18+ Countries",
        highlight: false,
        desc: "Global leader in Automated Fingerprint Identification Systems (AFIS) and National ID projects."
    },
    {
        rank: 20,
        name: "BD Task Ltd",
        knownFor: "Ready-made Scripts & Custom Software",
        size: "155+",
        years: "10 Y",
        clients: "Global SMEs",
        presence: "50+ Countries",
        highlight: false,
        desc: "Highly popular on Envato market for ready-made ERP, POS, and hospital management software."
    }
];

export const TopCompaniesSEOPage = () => {
    const navigate = useNavigate();

    // Generate ItemList schema for SEO
    const schema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "Top 20 Best Software Companies in Bangladesh (2026 Latest Ranking)",
        "description": "Discover the ultimate list of the best software development companies in Bangladesh, featuring industry leaders in AI, Web, Mobile Apps, and Enterprise Solutions.",
        "author": {
            "@type": "Organization",
            "name": "RizQara Tech"
        },
        "publisher": {
            "@type": "Organization",
            "name": "RizQara Tech",
            "logo": {
                "@type": "ImageObject",
                "url": "https://rizqara.tech/logo.png"
            }
        },
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": companies.map((c, idx) => ({
                "@type": "ListItem",
                "position": idx + 1,
                "item": {
                    "@type": "Organization",
                    "name": c.name,
                    "description": c.desc
                }
            }))
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-24">
            <SEO 
                title="Top 20 Best Software Companies in Bangladesh (2026) | RizQara Tech"
                description="Looking for the best software company in Bangladesh? Here is the latest 2026 ranking of the top 20 IT firms for Web, Mobile App, and AI Development."
                keywords="best software company in bangladesh, top 20 software companies in bangladesh, IT companies in Dhaka, top tech firms bangladesh, RizQara Tech, Brain Station 23, Vivasoft"
                schema={schema}
            />

            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <span className="inline-block px-4 py-2 rounded-full bg-[#500000]/10 text-[#500000] font-bold text-sm tracking-widest uppercase mb-6">
                        2026 Industry Report
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-tight">
                        Top 20 Best Software Companies in <span className="text-[#500000]">Bangladesh</span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed font-light">
                        Choosing the "best" software company depends entirely on your specific needs. Bangladesh's IT sector has grown significantly. Whether you need custom web platforms, AI integrations, or enterprise offshore teams, here is the definitive ranking of the top software development companies for 2026.
                    </p>
                </div>

                {/* List Container */}
                <div className="max-w-5xl mx-auto space-y-6 mb-24 relative z-10">
                    {companies.map((company) => (
                        <div 
                            key={company.rank}
                            className={`p-8 rounded-3xl border transition-all duration-300 ${company.highlight ? 'bg-white shadow-2xl border-[#500000]/20 ring-4 ring-[#500000]/5 scale-[1.02] relative overflow-hidden' : 'bg-white shadow-sm hover:shadow-md border-gray-100'}`}
                        >
                            {company.highlight && (
                                <div className="absolute top-0 right-0 bg-[#500000] text-white px-6 py-2 rounded-bl-2xl font-bold text-sm flex items-center gap-2 shadow-lg">
                                    <Star size={16} className="fill-current" /> Editor's Choice
                                </div>
                            )}

                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black ${company.highlight ? 'bg-[#500000] text-white shadow-lg shadow-[#500000]/30' : 'bg-gray-100 text-gray-400'}`}>
                                    #{company.rank}
                                </div>
                                
                                <div className="flex-grow">
                                    <h2 className={`text-2xl font-black mb-3 ${company.highlight ? 'text-[#500000]' : 'text-gray-900'}`}>
                                        {company.name}
                                    </h2>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {company.desc}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                        <div className="flex items-center gap-2 text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <Trophy size={16} className="text-[#500000]" />
                                            <span className="font-semibold">{company.knownFor}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <Users size={16} className="text-[#500000]" />
                                            <span>Size: <span className="font-semibold">{company.size}</span></span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <Shield size={16} className="text-[#500000]" />
                                            <span>Est: <span className="font-semibold">{company.years}</span></span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <Globe size={16} className="text-[#500000]" />
                                            <span>Presence: <span className="font-semibold">{company.presence}</span></span>
                                        </div>
                                    </div>

                                    {company.highlight && (
                                        <div className="mt-8">
                                            <button 
                                                onClick={() => navigate('/contact')}
                                                className="bg-[#500000] text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-[#3a0000] transition-colors shadow-lg shadow-[#500000]/20"
                                            >
                                                Start Your Project with RizQara <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Explicit Spacer */}
                <div className="h-32 w-full clear-both"></div>

                {/* Conclusion */}
                <div className="max-w-4xl mx-auto text-center bg-gray-900 rounded-3xl p-12 shadow-2xl relative z-20">
                    <h3 className="text-3xl font-black text-white mb-6">Need help choosing the perfect tech partner?</h3>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        To help narrow down your options and ensure a perfect fit, consider what type of service you are looking for (custom web app, AI integration, SaaS), whether you want to outsource a project or hire a dedicated team, and your specific industry.
                    </p>
                    <button 
                        onClick={() => navigate('/contact')}
                        className="bg-white text-[#500000] px-8 py-4 rounded-full font-black flex items-center gap-2 hover:bg-gray-100 mx-auto transition-transform hover:scale-105"
                    >
                        Get a Free Tech Consultation <ExternalLink size={18} />
                    </button>
                </div>

            </div>
        </div>
    );
};
