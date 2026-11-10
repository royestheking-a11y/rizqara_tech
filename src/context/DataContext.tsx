import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { toast } from "sonner";
import { translations, Language } from '../utils/translations';

import { apiRequest, getCollection } from '../utils/api';
import catalog from '../../shared/service-catalog.json';
import initialCaseStudies from '../data/case-studies.json';
import initialCarouselSlides from '../data/carousel.json';
import initialProjectConcepts from '../data/project-concepts.json';
import initialReviews from '../data/reviews.json';
import initialBlogs from '../data/blogs.json';
import initialVideos from '../data/videos.json';

// --- Types ---

export type Service = {
  categoryId?: string;
  catalogKey?: string;
  displayOrder?: number;
  imageAlt?: string;
  id: string;
  slug?: string;
  previousSlugs?: string[];
  __v?: number;
  title: string;
  title_bn?: string;
  description: string;
  description_bn?: string;
  icon: string;
  details: string;
  details_bn?: string;
  capabilities: string[];
  capabilities_bn?: string[];
  process: string[];
  process_bn?: string[];
  image?: string;
  gallery?: string[];
};

export type Project = {
  id: string;
  slug?: string;
  previousSlugs?: string[];
  __v?: number;
  title: string;
  title_bn?: string;
  category: string;
  category_bn?: string;
  image: string;
  status: 'Live' | 'Ongoing' | 'Completed' | 'Concept';
  description: string;
  description_bn?: string;
  tech: string[];
  features?: string[];
  features_bn?: string[];
  gallery?: string[];
  link?: string;
};

export type Review = {
  id: string;
  slug?: string;
  previousSlugs?: string[];
  __v?: number;
  name: string;
  name_bn?: string;
  role: string;
  role_bn?: string;
  company: string;
  content: string;
  content_bn?: string;
  image?: string;
  rating: number;
};

export type BlogPost = {
  id: string;
  slug?: string;
  previousSlugs?: string[];
  __v?: number;
  title: string;
  title_bn?: string;
  excerpt: string;
  excerpt_bn?: string;
  content: string;
  content_bn?: string;
  date: string;
  image: string;
  category: string;
  category_bn?: string;
};

export type Job = {
  id: string;
  slug?: string;
  previousSlugs?: string[];
  __v?: number;
  title: string;
  title_bn?: string;
  type: 'Full-time' | 'Contract' | 'Part-time';
  location: string;
  location_bn?: string;
  salary: string;
  description: string;
  description_bn?: string;
};

export type VideoComment = {
  id: string;
  slug?: string;
  previousSlugs?: string[];
  __v?: number;
  user: string;
  text: string;
  date: string;
};

export type Video = {
  id: string;
  slug?: string;
  previousSlugs?: string[];
  __v?: number;
  title: string;
  title_bn?: string;
  thumbnail: string;
  url: string;
  category: 'Demo' | 'Ad' | 'Showcase';
  category_bn?: string;
  description?: string;
  description_bn?: string;
  comments: VideoComment[];
};

export type CarouselSlide = {
  id: string;
  slug?: string;
  previousSlugs?: string[];
  __v?: number;
  title: string;
  title_bn?: string;
  subtitle: string;
  subtitle_bn?: string;
  image: string;
  cta: string;
  cta_bn?: string;
};

export type BuildOption = {
  id: string;
  slug?: string;
  previousSlugs?: string[];
  __v?: number;
  category: 'type' | 'feature' | 'time' | 'project';
  label: string;
  label_bn?: string;
  value: number;
};

export type Message = {
  id: string;
  slug?: string;
  previousSlugs?: string[];
  __v?: number;
  type: 'Contact' | 'Order';
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
  status?: 'Pending' | 'Replied' | 'Archived';
};

export type CareerApplication = {
  id: string;
  slug?: string;
  previousSlugs?: string[];
  __v?: number;
  name: string;
  email: string;
  experience: string;
  reason: string;
  cvUrl: string;
  cvName: string;
  jobId?: string;
  date: string;
  status: 'New' | 'Reviewed' | 'Rejected' | 'Pending';
};

export type CaseStudy = {
  id: string;
  slug?: string;
  previousSlugs?: string[];
  __v?: number;
  title: string;
  title_bn?: string;
  category: string;
  category_bn?: string;
  image: string; // Cover photo
  description: string;
  description_bn?: string;
  problem: string;
  problem_bn?: string;
  solution: string;
  solution_bn?: string;
  impact: string;
  impact_bn?: string;
  features?: string[];
  features_bn?: string[];
  tech: string[];
  gallery?: string[];
  growthBefore?: string; // e.g. "12% Monthly"
  growthAfter?: string;  // e.g. "85% Monthly"
};

export type Promotion = {
  isActive: boolean;
  offerRate: string;
  serviceName: string;
  serviceName_bn?: string;
  expiryDate: string;
  description: string;
  description_bn?: string;
};

export type Notice = {
  id: string;
  slug?: string;
  previousSlugs?: string[];
  __v?: number;
  text: string;
  text_bn: string;
  isActive: boolean;
};

export type GalleryItem = {
  id: string;
  slug?: string;
  previousSlugs?: string[];
  __v?: number;
  title: string;
  title_bn?: string;
  image: string;
  date: string;
  category: string;
  category_bn?: string;
  location?: string;
  location_bn?: string;
  description?: string;
  description_bn?: string;
};

export type DataContextType = {
  services: Service[];
  projects: Project[];
  reviews: Review[];
  blogs: BlogPost[];
  jobs: Job[];
  videos: Video[];
  carouselSlides: CarouselSlide[];
  buildOptions: BuildOption[];
  messages: Message[];
  careerApplications: CareerApplication[];
  caseStudies: CaseStudy[];
  promotion: Promotion;
  notices: Notice[];
  galleryItems: GalleryItem[];
  language: Language;
  setLanguage: (lang: Language) => void;
  updateData: (key: string, data: any, silent?: boolean) => Promise<void>;
  resetData: () => void;
  addMessage: (msg: Omit<Message, 'id' | 'date' | 'read' | 'status'>) => Promise<void>;
  deleteMessage: (id: string) => void;
  markMessageRead: (id: string) => void;
  addCareerApplication: (app: FormData) => Promise<void>;
  deleteData: (key: string, id: string) => Promise<void>;
  addVideoComment: (videoId: string, comment: Omit<VideoComment, 'id' | 'date'>) => Promise<void>;
  t: (key: keyof typeof translations['en']) => string;
  loading: boolean;
  secondaryLoading: boolean;
  loadErrors: string[];
  retryLoad: () => void;
  fetchAdminData: () => Promise<void>;
};

// --- Initial Data Generators & Normalizers ---

export const legacyServiceMap: Record<string, string> = {
  'Website Development': 'custom-website-development',
  'Web App Development': 'web-applications',
  'UI/UX Design': 'uiux-research-design',
  'App Development': 'cross-platform-applications',
  'SEO & Marketing': 'digital-marketing',
  'AI Chatbot': 'ai-agents-chatbots',
  'Automation': 'business-workflow-automation',
  'Analytics': 'business-intelligence-dashboards',
  'API Platform': 'api-integrations-webhooks',
  'Brand Identity': 'logo-visual-identity'
};

export function getInitialCatalogServices(): Service[] {
  const list: Service[] = [];
  for (const category of catalog.categories) {
    for (const offering of category.offerings) {
      list.push({
        id: `svc-${offering.key}`,
        slug: offering.key,
        title: offering.title,
        title_bn: offering.title_bn,
        description: offering.summary,
        description_bn: offering.summary_bn,
        details: `${offering.summary} ${category.description}`,
        details_bn: `${offering.summary_bn} ${category.description_bn}`,
        icon: category.icon,
        capabilities: offering.deliverables,
        capabilities_bn: offering.deliverables,
        process: catalog.process,
        process_bn: catalog.process_bn,
        categoryId: category.id,
        catalogKey: offering.key,
        displayOrder: category.order * 100 + offering.order,
        image: category.image,
        imageAlt: category.imageAlt,
        gallery: []
      });
    }
  }
  return list;
}

export function mergeServices(baseline: Service[], dbServices: any[]): Service[] {
  if (!Array.isArray(dbServices) || dbServices.length === 0) return baseline;
  const catalogMap = new Map<string, Service>();
  baseline.forEach(s => {
    if (s.catalogKey) catalogMap.set(s.catalogKey, { ...s });
  });

  const matchedDbIds = new Set<string>();

  for (const dbService of dbServices) {
    let matchedKey = dbService.catalogKey;
    if (!matchedKey && dbService.slug && catalogMap.has(dbService.slug)) {
      matchedKey = dbService.slug;
    }
    if (!matchedKey && dbService.title) {
      if (legacyServiceMap[dbService.title]) {
        matchedKey = legacyServiceMap[dbService.title];
      } else {
        const found = baseline.find(b => b.title.toLowerCase() === dbService.title.toLowerCase());
        if (found) matchedKey = found.catalogKey;
      }
    }

    if (matchedKey && catalogMap.has(matchedKey)) {
      const dbId = dbService.id || dbService._id;
      if (dbId) matchedDbIds.add(String(dbId));
      const existing = catalogMap.get(matchedKey)!;
      catalogMap.set(matchedKey, {
        ...existing,
        ...dbService,
        id: dbService.id || existing.id,
        slug: dbService.slug || existing.slug,
        title: dbService.title || existing.title,
        title_bn: dbService.title_bn || existing.title_bn,
        description: dbService.description || existing.description,
        description_bn: dbService.description_bn || existing.description_bn,
        details: dbService.details || existing.details,
        details_bn: dbService.details_bn || existing.details_bn,
        categoryId: existing.categoryId,
        catalogKey: matchedKey,
        displayOrder: existing.displayOrder,
        image: dbService.image || existing.image,
        gallery: Array.isArray(dbService.gallery) && dbService.gallery.length > 0 ? dbService.gallery : existing.gallery,
        capabilities: Array.isArray(dbService.capabilities) && dbService.capabilities.length > 0 ? dbService.capabilities : existing.capabilities,
        process: Array.isArray(dbService.process) && dbService.process.length > 0 ? dbService.process : existing.process,
      });
    }
  }

  const specialists: Service[] = [];
  for (const dbService of dbServices) {
    const dbId = String(dbService.id || dbService._id);
    if (!matchedDbIds.has(dbId) && !dbService.catalogKey) {
      const catId = dbService.categoryId || 
        (['AI Strategy', 'Generative AI', 'MLOps'].includes(dbService.title) ? 'ai-automation' : 'enterprise-custom-solutions');
      const category = catalog.categories.find(c => c.id === catId);
      specialists.push({
        ...dbService,
        id: dbId || `spec-${dbService.title?.toLowerCase().replace(/\s+/g, '-')}`,
        categoryId: catId,
        image: dbService.image || category?.image || '/images/services/premium/enterprise.webp',
        displayOrder: 9999
      });
    }
  }

  return [...catalogMap.values(), ...specialists];
}

export function mergeCaseStudies(baseline: CaseStudy[], dbStudies: any[]): CaseStudy[] {
  if (!Array.isArray(dbStudies) || dbStudies.length === 0) return baseline;
  const map = new Map<string, CaseStudy>();
  baseline.forEach(s => map.set(s.id, { ...s }));
  for (const dbItem of dbStudies) {
    if (dbItem.id) {
      const existing = map.get(dbItem.id);
      map.set(dbItem.id, existing ? { ...existing, ...dbItem } : dbItem);
    }
  }
  return [...map.values()];
}

export function mergeProjects(baseline: Project[], dbProjects: any[]): Project[] {
  if (!Array.isArray(dbProjects) || dbProjects.length === 0) return baseline;
  const map = new Map<string, Project>();
  baseline.forEach(p => map.set(p.id, { ...p }));
  for (const dbItem of dbProjects) {
    if (dbItem.id) {
      const existing = map.get(dbItem.id);
      map.set(dbItem.id, existing ? { ...existing, ...dbItem } : dbItem);
    }
  }
  return [...map.values()];
}

const INITIAL_PROMOTION: Promotion = {
  isActive: false,
  offerRate: '30',
  serviceName: 'Web App Development',
  serviceName_bn: 'ওয়েব অ্যাপ ডেভেলপমেন্ট',
  expiryDate: '2026-01-29',
  description: 'Get a premium discount on your first enterprise solution.',
  description_bn: 'আপনার প্রথম এন্টারপ্রাইজ সমাধানে প্রিমিয়াম ছাড় পান।'
};

const INITIAL_NOTICES: Notice[] = [];

const DEFAULT_BUILD_OPTIONS: BuildOption[] = [
  { id: '1', category: 'type', label: 'Web Application', label_bn: 'ওয়েব অ্যাপ্লিকেশন', value: 1000 },
  { id: '2', category: 'type', label: 'Mobile App', label_bn: 'মোবাইল অ্যাপ', value: 1500 },
  { id: '3', category: 'type', label: 'E-Commerce', label_bn: 'ই-কমার্স', value: 1200 },
  { id: '4', category: 'feature', label: 'Standard', label_bn: 'সাধারণ', value: 0 },
  { id: '5', category: 'feature', label: 'Premium', label_bn: 'প্রিমিয়াম', value: 500 },
  { id: '6', category: 'feature', label: 'Enterprise', label_bn: 'এন্টারপ্রাইজ', value: 1000 },
  { id: '7', category: 'time', label: '1 Month', label_bn: '১ মাস', value: 1 },
  { id: '8', category: 'time', label: '2 Months', label_bn: '২ মাস', value: 0.9 },
  { id: '9', category: 'time', label: '3+ Months', label_bn: '৩+ মাস', value: 0.8 },
];

export // --- Context ---

const DataContext = createContext<DataContextType>({} as DataContextType);

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialCatalogServices = getInitialCatalogServices();
  const [services, setServices] = useState<Service[]>(initialCatalogServices);
  const [projects, setProjects] = useState<Project[]>(initialProjectConcepts as Project[]);
  const [reviews, setReviews] = useState<Review[]>(initialReviews as Review[]);
  const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs as unknown as BlogPost[]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [videos, setVideos] = useState<Video[]>(initialVideos as Video[]);
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>(initialCarouselSlides as CarouselSlide[]);
  const [buildOptions, setBuildOptions] = useState<BuildOption[]>(DEFAULT_BUILD_OPTIONS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [careerApplications, setCareerApplications] = useState<CareerApplication[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(initialCaseStudies as CaseStudy[]);
  const [promotion, setPromotion] = useState<Promotion>(INITIAL_PROMOTION);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [language, setLanguage] = useState<Language>('en');
  const [loading, setLoading] = useState(true);

  const [secondaryLoading, setSecondaryLoading] = useState(false);
  const [loadErrors, setLoadErrors] = useState<string[]>([]);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const snapshots = useRef<Record<string, any[]>>({
    services: initialCatalogServices,
    caseStudies: initialCaseStudies as CaseStudy[],
    carousel: initialCarouselSlides as CarouselSlide[],
    projects: initialProjectConcepts as Project[],
    reviews: initialReviews as Review[],
    blogs: initialBlogs as unknown as BlogPost[],
    videos: initialVideos as Video[],
  });
  const pendingWrites = useRef(new Set<string>());
  const setters: Record<string, (data: any) => void> = {
    services: data => {
      const merged = mergeServices(initialCatalogServices, data);
      snapshots.current.services = merged;
      setServices(merged);
    },
    projects: data => {
      const merged = mergeProjects(initialProjectConcepts as Project[], data);
      snapshots.current.projects = merged;
      setProjects(merged);
    },
    reviews: data => {
      const items = Array.isArray(data) && data.length > 0 ? data : (initialReviews as Review[]);
      snapshots.current.reviews = items;
      setReviews(items);
    },
    blogs: data => {
      const items = Array.isArray(data) && data.length > 0 ? data : (initialBlogs as unknown as BlogPost[]);
      snapshots.current.blogs = items;
      setBlogs(items);
    },
    jobs: setJobs,
    videos: data => {
      const items = Array.isArray(data) && data.length > 0 ? data : (initialVideos as Video[]);
      snapshots.current.videos = items;
      setVideos(items);
    },
    carousel: data => {
      const items = Array.isArray(data) && data.length > 0 ? data : (initialCarouselSlides as CarouselSlide[]);
      snapshots.current.carousel = items;
      setCarouselSlides(items);
    },
    buildOptions: setBuildOptions,
    messages: setMessages,
    careerApplications: setCareerApplications,
    caseStudies: data => {
      const merged = mergeCaseStudies(initialCaseStudies as CaseStudy[], data);
      snapshots.current.caseStudies = merged;
      setCaseStudies(merged);
    },
    promotion: data => setPromotion(data[0] || INITIAL_PROMOTION),
    notice: setNotices,
    galleryItems: setGalleryItems,
  };
  const commit = (key: string, items: any[]) => { snapshots.current[key] = items; setters[key]?.(items); };
  const retryLoad = () => setLoadAttempt(value => value + 1);
  useEffect(() => {
    const storedLang = localStorage.getItem('rizqara_language');
    if (storedLang === 'bn' || storedLang === 'en') setLanguage(storedLang);
  }, []);
  useEffect(() => {
    localStorage.setItem('rizqara_language', language);
    document.documentElement.lang = language;
  }, [language]);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    
    // Only show the loading state on the initial mount, never during background retries
    if (loadAttempt === 0) {
      setLoading(true);
      setSecondaryLoading(true);
    }
    setLoadErrors([]);
    const currentErrors: string[] = [];

    const loadGroup = async (keys: string[], done: () => void) => {
      await Promise.allSettled(keys.map(async key => {
        try {
          const data = await getCollection(key, controller.signal);
          if (active) commit(key, data);
        } catch {
          if (active) {
            currentErrors.push(key);
            setLoadErrors(previous => [...new Set([...previous, key])]);
          }
        }
      }));
      if (active) done();
    };

    const critical = loadGroup(['services', 'projects', 'carousel', 'promotion', 'notice', 'buildOptions'], () => setLoading(false));
    const secondary = loadGroup(['reviews', 'blogs', 'jobs', 'videos', 'caseStudies', 'galleryItems'], () => setSecondaryLoading(false));
    
    // Fast dismissal safeguard: never block user for more than 1.5s if server takes time to respond
    const initialDismissTimer = setTimeout(() => {
      if (active) {
        setLoading(false);
        setSecondaryLoading(false);
      }
    }, 1500);

    const timeout = setTimeout(() => controller.abort(), 15000);

    controller.signal.addEventListener('abort', () => { if (active) { setLoading(false); setSecondaryLoading(false); } });
    void Promise.all([critical, secondary]).then(() => {
      // Auto-retry in background up to 2 times without ever re-triggering full-screen loading
      if (active && currentErrors.length > 0 && loadAttempt < 2) {
        retryTimer = setTimeout(() => {
          if (active) setLoadAttempt(v => v + 1);
        }, 5000);
      }
    }).finally(() => {
      clearTimeout(timeout);
      clearTimeout(initialDismissTimer);
    });

    return () => {
      active = false;
      if (retryTimer) clearTimeout(retryTimer);
      clearTimeout(initialDismissTimer);
      clearTimeout(timeout);
      controller.abort();
    };
  }, [loadAttempt]);
  const fetchAdminData = async () => {
    const results = await Promise.allSettled(['messages', 'careerApplications'].map(async key => commit(key, await getCollection(key))));
    if (results.some(result => result.status === 'rejected')) throw new Error('Unable to load private documents. Please sign in again.');
  };
  const updateData = async (key: string, data: any, silent = false) => {
    if (pendingWrites.current.has(key)) throw new Error('A save is already in progress');
    pendingWrites.current.add(key);
    try {
      const before = snapshots.current[key] || [];
      const requested = Array.isArray(data) ? data : [data];
      // A normal save may update or create records. Deletes use their own explicit operation.
      for (const item of requested) {
        const previous = before.find(row => row.id === item.id);
        if (previous && Object.keys(item).every(field => JSON.stringify(item[field]) === JSON.stringify(previous[field]))) continue;
        const response = await apiRequest(previous ? `${key}/${encodeURIComponent(item.id)}` : key, {
          method: previous ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...item, __v: previous?.__v ?? 0 }),
        });
        const saved = await response.json();
        const current = snapshots.current[key] || [];
        commit(key, previous ? current.map(row => row.id === saved.id ? saved : row) : [...current, saved]);
      }
      if (!silent) toast.success('Changes saved successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to save');
      throw error;
    } finally { pendingWrites.current.delete(key); }
  };
  const deleteData = async (key: string, id: string) => {
    const previous = (snapshots.current[key] || []).find(row => row.id === id);
    if (!previous) throw new Error('Reload this collection before deleting');
    await apiRequest(`${key}/${encodeURIComponent(id)}`, { method: 'DELETE', headers: { 'If-Match': String(previous.__v ?? 0) } });
    commit(key, (snapshots.current[key] || []).filter(row => row.id !== id));
  };
  const addMessage = async (msg: Omit<Message, 'id' | 'date' | 'read' | 'status'>) => {
    await apiRequest('messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(msg) });
  };
  const addCareerApplication = async (form: FormData) => {
    await apiRequest('careerApplications', { method: 'POST', body: form });
  };
  const deleteMessage = async (id: string) => { await deleteData('messages', id); };
  const markMessageRead = async (id: string) => {
    const item = (snapshots.current.messages || []).find(row => row.id === id);
    if (item) await updateData('messages', [{ id: item.id, read: true }], true);
  };
  const addVideoComment = async (videoId: string, comment: Omit<VideoComment, 'id' | 'date'>) => {
    const response = await apiRequest(`videos/${encodeURIComponent(videoId)}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(comment) });
    const saved = await response.json();
    commit('videos', (snapshots.current.videos || []).map(row => row.id === videoId ? { ...row, __v: (row.__v || 0) + 1, comments: [saved, ...(row.comments || [])] } : row));
  };
  const resetData = () => {
    localStorage.removeItem('rizqara_language');
    setLanguage('en');
    toast.success('Language preference reset');
  };

  const t = (key: keyof typeof translations['en']) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <DataContext.Provider value={{ services, projects, reviews, blogs, jobs, videos, carouselSlides, buildOptions, messages, careerApplications, caseStudies, promotion, notices, galleryItems, language, setLanguage, t, updateData, resetData, addMessage, addCareerApplication, addVideoComment, deleteData, deleteMessage, markMessageRead, loading, secondaryLoading, loadErrors, retryLoad, fetchAdminData }}>
      {children}
    </DataContext.Provider>
  );
};
