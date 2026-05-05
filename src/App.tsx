import React, { useState, useLayoutEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, useParams, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Context & Tools
import { DataProvider, useData } from './context/DataContext';
import { getProxiedImage } from './utils/imageProxy';

// Shared Components (Synchronous)
import { SEO } from './components/SEO';
import { RizqAIBot, SectionTitle, PricingDetailed, ContactFormWithMap, AboutHero, JourneyRoadmap, TeamSection } from './components/premium/UIComponents';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { PromotionOverlay } from './components/premium/PromotionOverlay';
import { CookieConsent } from './components/premium/CookieConsent';

// Lazy Loaded Pages
const Home = lazy(() => import('./components/pages/HomePage'));
const Vision2030Page = lazy(() => import('./components/pages/Vision2030Page').then(m => ({ default: m.Vision2030Page })));
const ServicesPage = lazy(() => import('./components/pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('./components/pages/ServiceDetailPage'));
const ProjectsPage = lazy(() => import('./components/pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./components/pages/ProjectDetailPage'));
const CaseStudiesPage = lazy(() => import('./components/pages/CaseStudiesPage'));
const CaseStudyDetailPage = lazy(() => import('./components/pages/CaseStudyDetailPage'));
const BlogPage = lazy(() => import('./components/pages/ExtraPages').then(m => ({ default: m.BlogPage })));
const BlogDetail = lazy(() => import('./components/pages/ExtraPages').then(m => ({ default: m.BlogDetail })));
const CareersPage = lazy(() => import('./components/pages/ExtraPages').then(m => ({ default: m.CareersPage })));
const TeamPage = lazy(() => import('./components/pages/ExtraPages').then(m => ({ default: m.TeamPage })));
const VideosPage = lazy(() => import('./components/pages/ExtraPages').then(m => ({ default: m.VideosPage })));
const VideoDetail = lazy(() => import('./components/pages/ExtraPages').then(m => ({ default: m.VideoDetail })));
const PrivacyPolicy = lazy(() => import('./components/LegalPages').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./components/LegalPages').then(m => ({ default: m.TermsOfService })));
const BuildPage = lazy(() => import('./components/premium/UIComponents').then(m => ({ default: m.BuildPage })));
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminLogin = lazy(() => import('./components/AdminLogin').then(m => ({ default: m.AdminLogin })));

// Utils
export const getSlug = (title: string) => title?.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-[#500000]/20 border-t-[#500000] rounded-full animate-spin"></div>
    </div>
);

const AmbientBackground = () => (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-white">
        {/* Ambient effects can go here */}
    </div>
);

const MainContent = () => {
    const [buildConfig, setBuildConfig] = useState({
        type: 'Web App',
        feature: 'Standard',
        time: '1 Month'
    });
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('rizqara_admin_auth') === 'true';
    });
    const location = useLocation();
    const navigate = useNavigate();
    const { t, language, loading } = useData();

    // Scroll to top on route change
    useLayoutEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [location.pathname]);

    // Helper for backward compatibility with components using onNavigate
    const onNavigate = (page: string, id?: string) => {
        if (page === 'ServiceDetail' && id) navigate(`/services/${id}`);
        else if (page === 'ProjectDetail' && id) navigate(`/projects/${id}`);
        else if (page === 'FeatureDetail' && id) navigate(`/feature/${id}`);
        else if (page === 'BlogDetail' && id) navigate(`/blog/${id}`);
        else if (page === 'Services' || page === 'services') navigate('/services');
        else if (page === 'Projects' || page === 'projects') navigate('/projects');
        else if (page === 'Packages' || page === 'packages') navigate('/packages');
        else if (page === 'Blog' || page === 'blog') navigate('/blog');
        else if (page === 'Build' || page === 'build') navigate('/build');
        else if (page === 'CaseStudies' || page === 'Case Studies' || page === 'caseStudies') navigate('/case-studies');
        else if (page === 'Careers' || page === 'careers') navigate('/careers');
        else if (page === 'Admin' || page === 'admin') navigate('/admin');
        else if (page === 'Contact' || page === 'contact') navigate('/contact');
        else if (page === 'About' || page === 'about') navigate('/about');
        else if (page === 'Home' || page === 'home') navigate('/');
        else navigate(`/${page.toLowerCase()}`);
    };

    const showNavbar = !location.pathname.startsWith('/admin');

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-[#500000] selection:text-white overflow-x-hidden relative scroll-smooth">
            <AmbientBackground />

            {showNavbar && <Navbar />}

            <main className={`relative z-10 ${location.pathname === '/' || location.pathname === '/admin' ? 'pt-0' : 'pt-24'}`}>
                <Suspense fallback={<PageLoader />}>
                    <Routes>
                        <Route path="/" element={<Home setBuildConfig={setBuildConfig} />} />
                        <Route path="/vision-2030" element={<Vision2030Page />} />

                        <Route path="/services" element={<>
                            <SEO
                                title="Software Development Services | RizQara Tech Bangladesh"
                                description="Our services include web development, UI UX design, AI solutions, mobile apps, SEO, and custom enterprise software."
                                canonical="https://rizqara.tech/services"
                            />
                            <ServicesPage />
                        </>} />
                        <Route path="/services/:id" element={<ServiceDetailPage />} />

                        <Route path="/projects" element={<>
                            <SEO
                                title="Our Projects | Software & AI Solutions by RizQara Tech"
                                description="Explore real-world software, AI, and digital projects delivered by RizQara Tech for local and global clients."
                                canonical="https://rizqara.tech/projects"
                            />
                            <ProjectsPage />
                        </>} />
                        <Route path="/projects/:id" element={<ProjectDetailPage />} />

                        <Route path="/packages" element={<div className="container mx-auto px-6 pt-32 pb-32"><SectionTitle title={language === 'bn' ? "প্যাকেজসমূহ" : "Packages"} /><PricingDetailed onNavigate={onNavigate} /></div>} />
                        
                        <Route path="/contact" element={
                            <div className="pt-20 pb-32 container mx-auto px-6">
                                <SEO
                                    title="Contact Us | RizQara Tech - Software & AI Solutions"
                                    description="Get in touch with RizQara Tech for custom software development, AI solutions, web apps, and digital transformation services in Bangladesh."
                                    canonical="https://rizqara.tech/contact"
                                />
                                <SectionTitle title={t('contact')} center />
                                <ContactFormWithMap />
                            </div>
                        } />

                        <Route path="/about" element={<>
                            <SEO
                                title="About RizQara Tech | Leading Software Company in Bangladesh"
                                description="Learn about RizQara Tech’s journey, mission, and vision to become a global software and AI company from Bangladesh."
                                canonical="https://rizqara.tech/about"
                            />
                            <div className="bg-white">
                                <AboutHero />
                                <JourneyRoadmap />
                                <div className="mt-32">
                                    <SectionTitle title={t('meetOurTeam')} center />
                                    <TeamSection />
                                </div>
                            </div>
                        </>} />
                        
                        <Route path="/team" element={<TeamPage />} />
                        <Route path="/blog" element={<BlogPage onNavigate={onNavigate} />} />
                        <Route path="/blog/:id" element={<BlogDetail />} />

                        <Route path="/careers" element={<>
                            <SEO
                                title="Careers | Join RizQara Tech | Software Jobs in Bangladesh"
                                description="Apply for software engineering, design, and marketing roles at RizQara Tech. Build the future with the best software company in Bangladesh."
                                canonical="https://rizqara.tech/careers"
                            />
                            <CareersPage />
                        </>} />

                        <Route path="/case-studies" element={<CaseStudiesPage />} />
                        <Route path="/case-studies/:id" element={<CaseStudyDetailPage />} />
                        
                        <Route path="/videos" element={<VideosPage onNavigate={onNavigate} />} />
                        <Route path="/videos/:id" element={<VideoDetail />} />
                        
                        <Route path="/build" element={<BuildPage onNavigate={onNavigate} initialConfig={buildConfig} />} />
                        <Route path="/feature/:id" element={<FeatureDetailWrapper />} />
                        
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-of-service" element={<TermsOfService />} />

                        <Route path="/admin" element={
                            isAuthenticated ?
                                <div className="bg-[#F5F7FA]">
                                    <AdminDashboard onLogout={() => {
                                        navigate('/', { replace: true });
                                        setTimeout(() => {
                                            setIsAuthenticated(false);
                                            localStorage.removeItem('rizqara_admin_auth');
                                        }, 50);
                                    }} />
                                </div> :
                                <AdminLogin setIsAuthenticated={setIsAuthenticated} />
                        } />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </main>

            {!location.pathname.startsWith('/admin') && <Footer />}

            <RizqAIBot />
            {!location.pathname.startsWith('/admin') && <PromotionOverlay />}
            <CookieConsent />
        </div>
    );
};

const FeatureDetail = lazy(() => import('./components/premium/UIComponents').then(m => ({ default: m.FeatureDetail })));

// Wrapper for FeatureDetail to use params
const FeatureDetailWrapper = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    if (!id) return <Navigate to="/" />;
    
    return (
        <FeatureDetail id={id} onBack={() => navigate('/')} />
    );
};

const App = () => {
    return (
        <Router>
            <DataProvider>
                <MainContent />
                <Toaster />
            </DataProvider>
        </Router>
    );
};

export default App;