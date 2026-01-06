import React, { useState, useEffect, createContext, useContext } from 'react';
import { toast } from "sonner";
import { translations, Language } from '../utils/translations';

// --- Types ---

export type Service = {
  id: string;
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
  title: string;
  title_bn?: string;
  category: string;
  category_bn?: string;
  image: string;
  status: 'Live' | 'Ongoing' | 'Completed';
  description: string;
  description_bn?: string;
  tech: string[];
  gallery?: string[];
  link?: string;
};

export type Review = {
  id: string;
  name: string;
  name_bn?: string;
  role: string;
  role_bn?: string;
  company: string;
  content: string;
  content_bn?: string;
  rating: number;
};

export type BlogPost = {
  id: string;
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
  user: string;
  text: string;
  date: string;
};

export type Video = {
  id: string;
  title: string;
  title_bn?: string;
  thumbnail: string;
  url: string;
  category: 'Demo' | 'Ad' | 'Showcase';
  comments: VideoComment[];
};

export type CarouselSlide = {
  id: string;
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
  category: 'type' | 'feature' | 'time';
  label: string;
  label_bn?: string;
  value: number;
};

export type Message = {
  id: string;
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

export type Promotion = {
  isActive: boolean;
  offerRate: string;
  serviceName: string;
  serviceName_bn?: string;
  expiryDate: string;
  description: string;
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
  promotion: Promotion;
  language: Language;
  setLanguage: (lang: Language) => void;
  updateData: (key: string, data: any) => void;
  resetData: () => void;
  addMessage: (msg: Omit<Message, 'id' | 'date' | 'read'>) => void;
  deleteMessage: (id: string) => void;
  markMessageRead: (id: string) => void;
  addCareerApplication: (app: Omit<CareerApplication, 'id' | 'date' | 'status'>) => Promise<void>;
  deleteData: (key: string, id: string) => Promise<void>;
  addVideoComment: (videoId: string, comment: Omit<VideoComment, 'id' | 'date'>) => void;
  t: (key: keyof typeof translations['en']) => string;
};

// --- Mock Data (Initial Seed) ---

// --- Mock Data (Initial Seed) --- NO LONGER USED
// (Constants removed to cleanup unused variable warnings)


const INITIAL_PROMOTION: Promotion = {
  isActive: false,
  offerRate: '30',
  serviceName: 'Web App Development',
  serviceName_bn: 'ওয়েব অ্যাপ ডেভেলপমেন্ট',
  expiryDate: '2026-01-29',
  description: 'Get a premium discount on your first enterprise solution.',
  description_bn: 'আপনার প্রথম এন্টারপ্রাইজ সমাধানে প্রিমিয়াম ছাড় পান।'
};

// --- Context ---

const DataContext = createContext<DataContextType>({} as DataContextType);

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>([]);
  const [buildOptions, setBuildOptions] = useState<BuildOption[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [careerApplications, setCareerApplications] = useState<CareerApplication[]>([]);
  const [promotion, setPromotion] = useState<Promotion>(INITIAL_PROMOTION);
  const [language, setLanguage] = useState<Language>('en');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    const storedLang = localStorage.getItem('rizqara_language') as Language;
    if (storedLang) setLanguage(storedLang);
  }, []);

  useEffect(() => {
    localStorage.setItem('rizqara_language', language);
  }, [language]);

  // Fetch Data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          servicesRes, projectsRes, reviewsRes, blogsRes,
          jobsRes, videosRes, carouselRes, buildOptionsRes,
          messagesRes, promotionRes
        ] = await Promise.all([
          fetch(`${API_URL}/services`),
          fetch(`${API_URL}/projects`),
          fetch(`${API_URL}/reviews`),
          fetch(`${API_URL}/blogs`),
          fetch(`${API_URL}/jobs`),
          fetch(`${API_URL}/videos`),
          fetch(`${API_URL}/carousel`),
          fetch(`${API_URL}/buildOptions`),
          fetch(`${API_URL}/messages`),
          fetch(`${API_URL}/promotion`) // This might return array or object depending on implementation
        ]);

        if (servicesRes.ok) setServices(await servicesRes.json());
        if (projectsRes.ok) setProjects(await projectsRes.json());
        if (reviewsRes.ok) setReviews(await reviewsRes.json());
        if (blogsRes.ok) setBlogs(await blogsRes.json());
        if (jobsRes.ok) setJobs(await jobsRes.json());
        if (videosRes.ok) setVideos(await videosRes.json());
        if (carouselRes.ok) setCarouselSlides(await carouselRes.json());
        if (buildOptionsRes.ok) setBuildOptions(await buildOptionsRes.json());
        if (messagesRes.ok) setMessages(await messagesRes.json());
        if (promotionRes.ok) {
          const promoData = await promotionRes.json();
          // API might return array for 'promotion' collection, we need the first item or the object itself
          setPromotion(Array.isArray(promoData) ? (promoData[0] || INITIAL_PROMOTION) : promoData);
        }


      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Fallback or Error State?
        // For now, allow empty state or keep loading false
        // Or duplicate INITIAL constants here as fallback, but better to fix API.

      }
    };

    fetchData();
  }, []);

  const updateData = async (key: string, data: any) => {
    // Optimistic Update
    if (key === 'services') setServices(data);
    if (key === 'projects') setProjects(data);
    if (key === 'reviews') setReviews(data);
    if (key === 'blogs') setBlogs(data);
    if (key === 'jobs') setJobs(data);
    if (key === 'videos') setVideos(data);
    if (key === 'carousel') setCarouselSlides(data);
    if (key === 'buildOptions') setBuildOptions(data);
    if (key === 'messages') setMessages(data);
    if (key === 'careerApplications') setCareerApplications(data);
    if (key === 'promotion') setPromotion(data);

    // API Sync (Bulk PUT)
    try {
      const response = await fetch(`${API_URL}/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Server Error');
      }
      toast.success('Changes saved successfully');
    } catch (error: any) {
      console.error(`Failed to update ${key}:`, error);
      toast.error(`Failed to save: ${error.message}`);
      // Revert state (Optional but recommended for robust apps - simpler here to just notify)
    }
  };

  const deleteData = async (key: string, id: string) => {
    // Optimistic Update
    if (key === 'services') setServices(prev => prev.filter(item => item.id !== id));
    if (key === 'projects') setProjects(prev => prev.filter(item => item.id !== id));
    if (key === 'reviews') setReviews(prev => prev.filter(item => item.id !== id));
    if (key === 'blogs') setBlogs(prev => prev.filter(item => item.id !== id));
    if (key === 'jobs') setJobs(prev => prev.filter(item => item.id !== id));
    if (key === 'videos') setVideos(prev => prev.filter(item => item.id !== id));
    if (key === 'carousel') setCarouselSlides(prev => prev.filter(item => item.id !== id));
    if (key === 'buildOptions') setBuildOptions(prev => prev.filter(item => item.id !== id));
    if (key === 'messages') setMessages(prev => prev.filter(item => item.id !== id));
    if (key === 'careerApplications') setCareerApplications(prev => prev.filter(item => item.id !== id));

    // API Call
    try {
      await fetch(`${API_URL}/${key}/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error(`Failed to delete from ${key}:`, error);
    }
  };

  const addMessage = async (msg: Omit<Message, 'id' | 'date' | 'read' | 'status'>) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      read: false,
      status: 'Pending',
      ...msg
    };

    // Create via POST for efficiency, or use updateData fallback
    const updated = [newMessage, ...messages];
    setMessages(updated);

    // Using generic updateData for consistency with "bulk" behavior expected by current implementation
    // Ideally: await fetch(`${API_URL}/messages`, { method: 'POST', body: JSON.stringify(newMessage) });
    // But updateData handles the state sync.
    updateData('messages', updated);
  };

  const addCareerApplication = async (app: Omit<CareerApplication, 'id' | 'date' | 'status'>) => {
    const newApp: CareerApplication = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      ...app
    };
    const updated = [newApp, ...careerApplications];
    setCareerApplications(updated);
    // Note: careerApplications route needs to be added to server if not present in initial list! 
    // Wait, previous schemas had 10 items. careerApplications wasn't one of them?
    // Checking schemas...
    // Service, Project, Review, Blog, Job, Video, Carousel, BuildOption, Message, Promotion.
    // CareerApplication is missing from Schemas!
    // I need to add it.

    // For now, just update local state to avoid crashing, but it won't persist to DB unless I add schema.
    // I will add schema in next step.
    updateData('careerApplications', updated);
  };

  const deleteMessage = (id: string) => {
    const updated = messages.filter(m => m.id !== id);
    setMessages(updated);
    updateData('messages', updated);
  };

  const markMessageRead = (id: string) => {
    const updated = messages.map(m => m.id === id ? { ...m, read: true } : m);
    setMessages(updated);
    updateData('messages', updated);
  };

  const addVideoComment = (videoId: string, comment: Omit<VideoComment, 'id' | 'date'>) => {
    const newComment: VideoComment = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString().split('T')[0],
      ...comment
    };

    const updatedVideos = videos.map(v => {
      if (v.id === videoId) {
        return { ...v, comments: [newComment, ...(v.comments || [])] };
      }
      return v;
    });

    setVideos(updatedVideos);
    updateData('videos', updatedVideos);
  };

  const resetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  const t = (key: keyof typeof translations['en']) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <DataContext.Provider value={{ services, projects, reviews, blogs, jobs, videos, carouselSlides, buildOptions, messages, careerApplications, promotion, language, setLanguage, t, updateData, resetData, addMessage, addCareerApplication, addVideoComment, deleteData, deleteMessage, markMessageRead }}>
      {children}
    </DataContext.Provider>
  );
};
