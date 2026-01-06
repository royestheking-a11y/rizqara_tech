import React, { useState, useEffect, createContext, useContext } from 'react';
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

const INITIAL_SERVICES: Service[] = [
  {
    id: '1',
    title: 'Website Development',
    title_bn: 'ওয়েবসাইট ডেভেলপমেন্ট',
    description: 'High-performance responsive websites.',
    description_bn: 'উচ্চ-ক্ষমতাসম্পন্ন রেসপন্সিভ ওয়েবসাইট।',
    icon: 'Globe',
    details: 'High-performance responsive layouts.',
    details_bn: 'উচ্চ-ক্ষমতাসম্পন্ন রেসপন্সিভ লেআউট।',
    capabilities: ['High-performance responsive layouts', 'SEO-optimized architecture', 'CMS & custom admin integration', 'Speed & Core Web Vitals optimization', 'Secure hosting & deployment'],
    capabilities_bn: ['উচ্চ-ক্ষমতাসম্পন্ন রেসপন্সিভ লেআউট', 'এসইও-অপ্টিমাইজড আর্কিটেকচার', 'সিএমএস এবং কাস্টম অ্যাডমিন ইন্টিগ্রেশন', 'গতি এবং কোর ওয়েব ভাইটালস অপ্টিমাইজেশন', 'নিরাপদ হোস্টিং এবং ডিপ্লয়মেন্ট'],
    process: ['Requirement & business goal analysis', 'Sitemap & content structure planning', 'UI design & responsive layout', 'Frontend & backend development', 'Performance & SEO optimization', 'Cross-device testing', 'Deployment & maintenance'],
    process_bn: ['প্রয়োজনীয়তা এবং ব্যবসায়িক লক্ষ্য বিশ্লেষণ', 'সাইটম্যাপ এবং বিষয়বস্তু কাঠামো পরিকল্পনা', 'ইউআই ডিজাইন এবং রেসপন্সিভ লেআউট', 'ফ্রন্টএন্ড এবং ব্যাকএন্ড ডেভেলপমেন্ট', 'পারফরম্যান্স এবং এসইও অপ্টিমাইজেশন', 'ক্রস-ডিভাইস টেস্টিং', 'ডিপ্লয়মেন্ট এবং রক্ষণাবেক্ষণ'],
    image: '/images/services/website_dev.png'
  },
  {
    id: '2',
    title: 'Web App Development',
    title_bn: 'ওয়েব অ্যাপ ডেভেলপমেন্ট',
    description: 'Complex functionality in the browser.',
    description_bn: 'ব্রাউজারে জটিল কার্যকারিতা।',
    icon: 'Layout',
    details: 'Complex browser-based functionality.',
    details_bn: 'জটিল ব্রাউজার-ভিত্তিক কার্যকারিতা।',
    capabilities: ['Complex browser-based functionality', 'Secure authentication & roles', 'API & database integration', 'Scalable architecture', 'Real-time features'],
    capabilities_bn: ['জটিল ব্রাউজার-ভিত্তিক কার্যকারিতা', 'নিরাপদ প্রমাণীকরণ এবং ভূমিকা', 'এপিআই এবং ডাটাবেস ইন্টিগ্রেশন', 'স্কেলেবল আর্কিটেকচার', 'রিয়েল-টাইম ফিচার'],
    process: ['Problem analysis & feature definition', 'System architecture & data flow', 'UX flows & wireframing', 'Frontend + backend development', 'API & third-party integrations', 'Load, security & QA testing', 'Deployment & scaling support'],
    process_bn: ['সমস্যা বিশ্লেষণ এবং ফিচার সংজ্ঞা', 'সিস্টেম আর্কিটেকচার এবং ডেটা ফ্লো', 'ইউএক্স ফ্লো এবং ওয়্যারফ্রেমিং', 'ফ্রন্টএন্ড + ব্যাকএন্ড ডেভেলপমেন্ট', 'এপিআই এবং থার্ড-পার্টি ইন্টিগ্রেশন', 'লোড, নিরাপত্তা এবং কিউএ টেস্টিং', 'ডিপ্লয়মেন্ট এবং স্কেলিং সাপোর্ট'],
    image: '/images/services/web_app_dev.png'
  },
  {
    id: '3',
    title: 'UI/UX Design',
    title_bn: 'ইউআই/ইউএক্স ডিজাইন',
    description: 'User-centric design that converts.',
    description_bn: 'ব্যবহারকারী-কেন্দ্রিক ডিজাইন যা কনভার্ট করে।',
    icon: 'Palette',
    details: 'User research & personas.',
    details_bn: 'ব্যবহারকারী গবেষণা এবং পারসোনা।',
    capabilities: ['User research & personas', 'Design systems & components', 'Conversion-focused UX', 'Accessibility standards', 'Prototyping & usability testing'],
    capabilities_bn: ['ব্যবহারকারী গবেষণা এবং পারসোনা', 'ডিজাইন সিস্টেম এবং উপাদান', 'কনভারশন-ফোকাসড ইউএক্স', 'অ্যাক্সেসিবিলিটি স্ট্যান্ডার্ড', 'প্রোটোটাইপিং এবং ইউজার টেস্টিং'],
    process: ['User research & discovery', 'User journey & flow mapping', 'Wireframing', 'Visual UI design', 'Interactive prototyping', 'Usability testing', 'Design handoff & documentation'],
    process_bn: ['ব্যবহারকারী গবেষণা এবং আবিষ্কার', 'ইউজার জার্নি এবং ফ্লো ম্যাপিং', 'ওয়্যারফ্রেমিং', 'ভিজ্যুয়াল ইউআই ডিজাইন', 'ইন্টারঅ্যাক্টিভ প্রোটোটাইপিং', 'ইউজার টেস্টিং', 'ডিজাইন হ্যান্ডঅফ এবং ডকুমেন্টেশন'],
    image: '/images/services/ui_ux.png'
  },
  {
    id: '4',
    title: 'Custom Software Development',
    title_bn: 'কাস্টম সফটওয়্যার ডেভেলপমেন্ট',
    description: 'Business-specific software solutions.',
    description_bn: 'ব্যবসায়িক নির্দিষ্ট সফটওয়্যার সমাধান।',
    icon: 'Code2',
    details: 'Business-specific software solutions.',
    details_bn: 'ব্যবসায়িক নির্দিষ্ট সফটওয়্যার সমাধান।',
    capabilities: ['Business-specific software solutions', 'Secure data handling', 'Modular & scalable systems', 'Role-based access', 'Enterprise-grade performance'],
    capabilities_bn: ['ব্যবসায়িক নির্দিষ্ট সফটওয়্যার সমাধান', 'নিরাপদ ডেটা হ্যান্ডলিং', 'মডুলার এবং স্কেলেবল সিস্টেম', 'রোল-ভিত্তিক অ্যাক্সেস', 'এন্টারপ্রাইজ-গ্রেড পারফরম্যান্স'],
    process: ['Business logic analysis', 'System architecture planning', 'Database & workflow design', 'Core software development', 'Security & performance testing', 'Deployment & onboarding', 'Ongoing optimization'],
    process_bn: ['ব্যবসায়িক লজিক বিশ্লেষণ', 'সিস্টেম আর্কিটেকচার পরিকল্পনা', 'ডাটাবেস এবং ওয়ার্কফ্লো ডিজাইন', 'কোর সফটওয়্যার ডেভেলপমেন্ট', 'নিরাপত্তা এবং পারফরম্যান্স টেস্টিং', 'ডিপ্লয়মেন্ট এবং অনবোর্ডিং', 'চলমান অপ্টিমাইজেশন'],
    image: '/images/services/custom_software.png'
  },
  {
    id: '5',
    title: 'App Development (iOS & Android)',
    title_bn: 'অ্যাপ ডেভেলপমেন্ট (iOS ও Android)',
    description: 'Cross-platform & native apps.',
    description_bn: 'ক্রস-প্ল্যাটফর্ম এবং নেটিভ অ্যাপ।',
    icon: 'Smartphone',
    details: 'Cross-platform & native apps.',
    details_bn: 'ক্রস-প্ল্যাটফর্ম এবং নেটিভ অ্যাপ।',
    capabilities: ['Cross-platform & native apps', 'API-driven architecture', 'Push notifications', 'Offline & sync support', 'App Store optimization'],
    capabilities_bn: ['ক্রস-প্ল্যাটফর্ম এবং নেটিভ অ্যাপ', 'এপিআই-চালিত আর্কিটেকচার', 'পুশ নোটিফিকেশন', 'অফলাইন এবং সিঙ্ক সাপোর্ট', 'অ্যাপ স্টোর অপ্টিমাইজেশন'],
    process: ['App strategy & feature planning', 'UX flow & wireframe design', 'UI design for mobile', 'App development', 'API & backend integration', 'Testing & store compliance', 'Launch & updates'],
    process_bn: ['অ্যাপ কৌশল এবং ফিচার পরিকল্পনা', 'ইউএক্স ফ্লো এবং ওয়্যারফ্রেম ডিজাইন', 'মোবাইলের জন্য ইউআই ডিজাইন', 'অ্যাপ ডেভেলপমেন্ট', 'এপিআই এবং ব্যাকএন্ড ইন্টিগ্রেশন', 'টেস্টিং এবং স্টোর কমপ্লায়েন্স', 'লঞ্চ এবং আপডেট'],
    image: '/images/services/app_dev.png'
  },
  {
    id: '6',
    title: 'SEO & Digital Marketing',
    title_bn: 'এসইও এবং ডিজিটাল মার্কেটিং',
    description: 'Grow your digital presence.',
    description_bn: 'আপনার ডিজিটাল উপস্থিতি বাড়ান।',
    icon: 'BarChart',
    details: 'On-page & technical SEO.',
    details_bn: 'অন-পেজ এবং টেকনিক্যাল এসইও।',
    capabilities: ['On-page & technical SEO', 'Keyword & competitor research', 'Analytics & tracking', 'Conversion optimization', 'Content strategy'],
    capabilities_bn: ['অন-পেজ এবং টেকনিক্যাল এসইও', 'কীওয়ার্ড এবং প্রতিযোগী গবেষণা', 'অ্যানালিটিক্স এবং ট্র্যাকিং', 'কনভারশন অপ্টিমাইজেশন', 'কন্টেন্ট কৌশল'],
    process: ['Website & market audit', 'Keyword & audience research', 'SEO structure optimization', 'Content & link strategy', 'Campaign execution', 'Performance tracking', 'Continuous improvement'],
    process_bn: ['ওয়েবসাইট এবং মার্কেট অডিট', 'কীওয়ার্ড এবং অডিয়েন্স গবেষণা', 'এসইও কাঠামো অপ্টিমাইজেশন', 'কন্টেন্ট এবং লিঙ্ক কৌশল', 'ক্যাম্পেইন এক্সিকিউশন', 'পারফরম্যান্স ট্র্যাকিং', 'ক্রমাগত উন্নতি'],
    image: '/images/services/seo.png'
  },
  {
    id: '7',
    title: 'AI Strategy & Consulting',
    title_bn: 'এআই কৌশল এবং পরামর্শ',
    description: 'High-impact roadmaps to align AI initiatives with your core business goals.',
    description_bn: 'আপনার মূল ব্যবসায়িক লক্ষ্যগুলির সাথে এআই উদ্যোগগুলি সারিবদ্ধ করার জন্য উচ্চ-প্রভাবশালী রোডম্যাপ।',
    icon: 'Lightbulb',
    details: 'AI roadmap planning.',
    details_bn: 'এআই রোডম্যাপ পরিকল্পনা।',
    capabilities: ['AI roadmap planning', 'Business process mapping', 'AI feasibility analysis', 'Cost & ROI estimation', 'Risk & compliance review'],
    capabilities_bn: ['এআই রোডম্যাপ পরিকল্পনা', 'ব্যবসায়িক প্রক্রিয়া ম্যাপিং', 'এআই সম্ভাব্যতা বিশ্লেষণ', 'খরচ এবং ROI অনুমান', 'ঝুঁকি এবং সম্মতি পর্যালোচনা'],
    process: ['Business goal assessment', 'AI opportunity identification', 'Data readiness evaluation', 'Strategy & roadmap creation', 'Tool & model selection', 'Pilot planning', 'Execution guidance'],
    process_bn: ['ব্যবসায়িক লক্ষ্য মূল্যায়ন', 'এআই সুযোগ সনাক্তকরণ', 'ডেটা প্রস্তুতির মূল্যায়ন', 'কৌশল এবং রোডম্যাপ তৈরি', 'টুল এবং মডেল নির্বাচন', 'পাইলট পরিকল্পনা', 'এক্সিকিউশন নির্দেশিকা'],
    image: '/images/services/ai_consulting.png'
  },
  {
    id: '8',
    title: 'Generative AI & LLM',
    title_bn: 'জেনারেটিভ এআই এবং এলএলএম',
    description: 'Embedding advanced language models to automate and scale content creation.',
    description_bn: 'কন্টেন্ট তৈরি স্বয়ংক্রিয় এবং স্কেল করার জন্য উন্নত ভাষা মডেল এম্বেড করা।',
    icon: 'Star',
    details: 'LLM integration.',
    details_bn: 'এলএলএম ইন্টিগ্রেশন।',
    capabilities: ['LLM integration', 'Content automation', 'Fine-tuning & prompt design', 'Secure AI pipelines', 'Scalable deployment'],
    capabilities_bn: ['এলএলএম ইন্টিগ্রেশন', 'কন্টেন্ট অটোমেশন', 'ফাইন-টিউনিং এবং প্রম্পট ডিজাইন', 'নিরাপদ এআই পাইপলাইন', 'স্কেলেবল ডিপ্লয়মেন্ট'],
    process: ['Use-case definition', 'Data & prompt strategy', 'Model selection', 'Integration & testing', 'Accuracy & bias evaluation', 'Performance optimization', 'Deployment & monitoring'],
    process_bn: ['ইউজ-কেস সংজ্ঞা', 'ডেটা এবং প্রম্পট কৌশল', 'মডেল নির্বাচন', 'ইন্টিগ্রেশন এবং টেস্টিং', 'নির্ভুলতা এবং পক্ষপাত মূল্যায়ন', 'পারফরম্যান্স অপ্টিমাইজেশন', 'ডিপ্লয়মেন্ট এবং মনিটরিং'],
    image: '/images/services/gen_ai.png'
  },
  {
    id: '9',
    title: 'Machine Learning & MLOps',
    title_bn: 'মেশিন লার্নিং এবং এমএলঅপস',
    description: 'Deploying robust, scalable ML models with seamless operational workflows.',
    description_bn: 'বিরামহীন অপারেশনাল ওয়ার্কফ্লো সহ শক্তিশালী, স্কেলেবল এমএল মডেল ডিপ্লয় করা।',
    icon: 'Cpu',
    details: 'Model training & deployment.',
    details_bn: 'মডেল ট্রেনিং এবং ডিপ্লয়মেন্ট।',
    capabilities: ['Model training & deployment', 'Automated pipelines', 'Monitoring & retraining', 'Cloud-scale ML systems', 'Secure data workflows'],
    capabilities_bn: ['মডেল ট্রেনিং এবং ডিপ্লয়মেন্ট', 'স্বয়ংক্রিয় পাইপলাইন', 'মনিটরিং এবং রি-ট্রেনিং', 'ক্লাউড-স্কেল এমএল সিস্টেম', 'নিরাপদ ডেটা ওয়ার্কফ্লো'],
    process: ['Data collection & preparation', 'Model development', 'Training & validation', 'Deployment pipeline setup', 'Monitoring & logging', 'Optimization & retraining', 'Scaling & maintenance'],
    process_bn: ['ডেটা সংগ্রহ এবং প্রস্তুতি', 'মডেল ডেভেলপমেন্ট', 'ট্রেনিং এবং ভ্যালিডেশন', 'ডিপ্লয়মেন্ট পাইপলাইন সেটআপ', 'মনিটরিং এবং লগিং', 'অপ্টিমাইজেশন এবং রি-ট্রেনিং', 'স্কেলিং এবং রক্ষণাবেক্ষণ'],
    image: '/images/services/ml_ops.png'
  },
  {
    id: '10',
    title: 'AI Chatbots & Assistants',
    title_bn: 'এআই চ্যাটবট এবং সহকারী',
    description: 'Intelligent agents built to elevate customer support and internal efficiency.',
    description_bn: 'গ্রাহক সহায়তা এবং অভ্যন্তরীণ দক্ষতা উন্নত করতে তৈরি বুদ্ধিমান এজেন্ট।',
    icon: 'MessageSquare',
    details: 'NLP-based conversations.',
    details_bn: 'এনএলপি-ভিত্তিক কথোপকথন।',
    capabilities: ['NLP-based conversations', 'Multi-platform integration', 'CRM & tool connections', 'Context awareness', 'Analytics & insights'],
    capabilities_bn: ['এনএলপি-ভিত্তিক কথোপকথন', 'মাল্টি-প্ল্যাটফর্ম ইন্টিগ্রেশন', 'সিআরএম এবং টুল সংযোগ', 'প্রসঙ্গ সচেতনতা', 'অ্যানালিটিক্স এবং অন্তর্দৃষ্টি'],
    process: ['Conversation flow design', 'Intent & data mapping', 'Bot development', 'Platform integration', 'Testing & training', 'Deployment', 'Continuous learning'],
    process_bn: ['কথপোকথন প্রবাহ ডিজাইন', 'ইনটেন্ট এবং ডেটা ম্যাপিং', 'বট ডেভেলপমেন্ট', 'প্ল্যাটফর্ম ইন্টিগ্রেশন', 'টেস্টিং এবং ট্রেনিং', 'ডিপ্লয়মেন্ট', 'ক্রমাগত শিক্ষা'],
    image: '/images/services/ai_chatbot.png'
  },
  {
    id: '11',
    title: 'Intelligent Automation',
    title_bn: 'ইন্টেলিজেন্ট অটোমেশন',
    description: 'Optimizing complex tasks with AI to boost productivity and reduce errors.',
    description_bn: 'উৎপাদনশীলতা বাড়াতে এবং ত্রুটি কমাতে এআই দিয়ে জটিল কাজ অপ্টিমাইজ করা।',
    icon: 'Zap',
    details: 'Workflow automation.',
    details_bn: 'ওয়ার্কফ্লো অটোমেশন।',
    capabilities: ['Workflow automation', 'AI-driven task handling', 'Error reduction systems', 'System integration', 'Performance optimization'],
    capabilities_bn: ['ওয়ার্কফ্লো অটোমেশন', 'এআই-চালিত টাস্ক হ্যান্ডলিং', 'ত্রুটি কমানোর সিস্টেম', 'সিস্টেম ইন্টিগ্রেশন', 'পারফরম্যান্স অপ্টিমাইজেশন'],
    process: ['Process analysis', 'Automation planning', 'Tool & AI selection', 'Automation development', 'Testing & validation', 'Deployment', 'Optimization'],
    process_bn: ['প্রক্রিয়া বিশ্লেষণ', 'অটোমেশন পরিকল্পনা', 'টুল এবং এআই নির্বাচন', 'অটোমেশন ডেভেলপমেন্ট', 'টেস্টিং এবং ভ্যালিডেশন', 'ডিপ্লয়মেন্ট', 'অপ্টিমাইজেশন'],
    image: '/images/services/automation.png'
  },
  {
    id: '12',
    title: 'Real-Time Analytics',
    title_bn: 'রিয়েল-টাইম অ্যানালিটিক্স',
    description: 'Processing live data feeds to enable instant, informed decision-making.',
    description_bn: 'তাৎক্ষণিক, সচেতন সিদ্ধান্ত গ্রহণের জন্য লাইভ ডেটা ফিড প্রক্রিয়া করা।',
    icon: 'Activity',
    details: 'Live data pipelines.',
    details_bn: 'লাইভ ডেটা পাইপলাইন।',
    capabilities: ['Live data pipelines', 'Dashboards & reporting', 'Data visualization', 'Alerts & monitoring', 'Scalable analytics systems'],
    capabilities_bn: ['লাইভ ডেটা পাইপলাইন', 'ড্যাশবোর্ড এবং রিপোর্টিং', 'ডেটা ভিজ্যুয়ালাইজেশন', 'সতর্কতা এবং মনিটরিং', 'স্কেলেবল অ্যানালিটিক্স সিস্টেম'],
    process: ['Data source mapping', 'Pipeline design', 'Dashboard UX design', 'Analytics development', 'Testing & validation', 'Deployment', 'Insight optimization'],
    process_bn: ['ডেটা সোর্স ম্যাপিং', 'পাইপলাইন ডিজাইন', 'ড্যাশবোর্ড ইউএক্স ডিজাইন', 'অ্যানালিটিক্স ডেভেলপমেন্ট', 'টেস্টিং এবং ভ্যালিডেশন', 'ডিপ্লয়মেন্ট', 'ইনসাইট অপ্টিমাইজেশন'],
    image: '/images/services/analytics.png'
  },
  {
    id: '13',
    title: 'API & Platform Dev',
    title_bn: 'এপিআই এবং প্ল্যাটফর্ম ডেভেলপমেন্ট',
    description: 'Building the connective tissue for scalable, integrated digital ecosystems.',
    description_bn: 'স্কেলেবল, ইন্টিগ্রেটেড ডিজিটাল ইকোসিস্টেমের জন্য সংযোগকারী টিস্যু তৈরি করা।',
    icon: 'Server',
    details: 'Secure API design.',
    details_bn: 'নিরাপদ এপিআই ডিজাইন।',
    capabilities: ['Secure API design', 'Microservices architecture', 'Third-party integrations', 'Scalable platforms', 'Documentation & versioning'],
    capabilities_bn: ['নিরাপদ এপিআই ডিজাইন', 'মাইক্রোসার্ভিস আর্কিটেকচার', 'থার্ড-পার্টি ইন্টিগ্রেশন', 'স্কেলেবল প্ল্যাটফর্ম', 'ডকুমেন্টেশন এবং ভার্সনিং'],
    process: ['Requirement analysis', 'API architecture planning', 'Endpoint development', 'Security implementation', 'Testing & documentation', 'Deployment', 'Maintenance'],
    process_bn: ['প্রয়োজনীয়তা বিশ্লেষণ', 'এপিআই আর্কিটেকচার পরিকল্পনা', 'এন্ডপয়েন্ট ডেভেলপমেন্ট', 'নিরাপত্তা বাস্তবায়ন', 'টেস্টিং এবং ডকুমেন্টেশন', 'ডিপ্লয়মেন্ট', 'রক্ষণাবেক্ষণ'],
    image: '/images/services/api_dev.png'
  },
  {
    id: '14',
    title: 'Brand Identity Systems',
    title_bn: 'ব্র্যান্ড আইডেন্টিটি সিস্টেম',
    description: 'Creating cohesive visual languages that resonate with your target market.',
    description_bn: 'আপনার টার্গেট মার্কেটের সাথে অনুরণিত সমন্বিত ভিজ্যুয়াল ভাষা তৈরি করা।',
    icon: 'Layers',
    details: 'Logo & visual identity.',
    details_bn: 'লোগো এবং ভিজ্যুয়াল আইডেন্টিটি।',
    capabilities: ['Logo & visual identity', 'Brand guidelines', 'Typography & color systems', 'Digital brand assets', 'Consistent brand experience'],
    capabilities_bn: ['লোগো এবং ভিজ্যুয়াল আইডেন্টিটি', 'ব্র্যান্ড নির্দেশিকা', 'টাইপোগ্রাফি এবং কালার সিস্টেম', 'ডিজিটাল ব্র্যান্ড সম্পদ', 'ধারাবাহিক ব্র্যান্ড অভিজ্ঞতা'],
    process: ['Brand discovery', 'Market & competitor research', 'Visual concept creation', 'Brand system design', 'Asset development', 'Guidelines documentation', 'Brand rollout'],
    process_bn: ['ব্র্যান্ড আবিষ্কার', 'মার্কেট এবং প্রতিযোগী গবেষণা', 'ভিজ্যুয়াল কনসেপ্ট তৈরি', 'ব্র্যান্ড সিস্টেম ডিজাইন', 'অ্যাসেট ডেভেলপমেন্ট', 'নির্দেশিকা ডকুমেন্টেশন', 'ব্র্যান্ড রোলআউট'],
    image: '/images/services/branding.png'
  },
];

const INITIAL_PROJECTS: Project[] = [
  { id: '1', title: 'FinTech Dashboard', title_bn: 'ফিনটেক ড্যাশবোর্ড', category: 'Web App', category_bn: 'ওয়েব অ্যাপ', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80', status: 'Live', description: 'Financial analytics platform.', description_bn: 'আর্থিক বিশ্লেষণ প্ল্যাটফর্ম।', tech: ['React', 'Node.js'], link: 'https://example.com/fintech' },
  { id: '2', title: 'E-Commerce Giant', title_bn: 'ই-কমার্স জায়ান্ট', category: 'Website', category_bn: 'ওয়েবসাইট', image: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80', status: 'Completed', description: 'Global shopping platform.', description_bn: 'গ্লোবাল শপিং প্ল্যাটফর্ম।', tech: ['Next.js', 'Stripe'], link: 'https://example.com/ecommerce' },
  { id: '3', title: 'HealthTracker App', title_bn: 'হেলথ ট্র্যাকার অ্যাপ', category: 'Mobile App', category_bn: 'মোবাইল অ্যাপ', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80', status: 'Ongoing', description: 'Patient monitoring system.', description_bn: 'রোগী মনিটরিং সিস্টেম।', tech: ['React Native', 'Firebase'] },
  { id: '4', title: 'Corp Landing', title_bn: 'কর্পোরেট ল্যান্ডিং', category: 'Website', category_bn: 'ওয়েবসাইট', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80', status: 'Live', description: 'Corporate identity site.', description_bn: 'কর্পোরেট আইডেন্টিটি সাইট।', tech: ['React', 'Tailwind'], link: 'https://example.com/corp' },
  { id: '5', title: 'Real Estate CRM', title_bn: 'রিয়েল এস্টেট সিআরএম', category: 'Web App', category_bn: 'ওয়েব অ্যাপ', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80', status: 'Live', description: 'Property management system.', description_bn: 'সম্পত্তি ব্যবস্থাপনা সিস্টেম।', tech: ['Vue', 'Laravel'], link: 'https://example.com/realestate' },
];

const INITIAL_REVIEWS: Review[] = [
  { id: '1', name: 'Sarah Jenkins', name_bn: 'সারাহ জেনকিন্স', role: 'CTO', role_bn: 'সিটিও', company: 'TechFlow', content: 'Rizqara Tech delivered our platform ahead of schedule. The glass UI is stunning.', content_bn: 'রিজকারা টেক আমাদের প্ল্যাটফর্মটি সময়ের আগেই ডেলিভার করেছে। গ্লাস ইউআই অসাধারণ।', rating: 5 },
  { id: '2', name: 'Michael Chen', name_bn: 'মাইকেল চেন', role: 'Founder', role_bn: 'প্রতিষ্ঠাতা', company: 'StartUp Inc', content: 'Incredible attention to detail. The admin panel is exactly what we needed.', content_bn: 'বিস্তারিত বিষয়ে অবিশ্বাস্য মনোযোগ। অ্যাডমিন প্যানেলটি ঠিক আমাদের যা প্রয়োজন ছিল তাই।', rating: 5 },
  { id: '3', name: 'Amara Diop', name_bn: 'আমারা দিওপ', role: 'Director', role_bn: 'পরিচালক', company: 'Global Solutions', content: 'Top tier development team. Highly recommended for enterprise software.', content_bn: 'শীর্ষ স্তরের ডেভেলপমেন্ট টিম। এন্টারপ্রাইজ সফটওয়্যারের জন্য অত্যন্ত সুপারিশকৃত।', rating: 4 },
];

const INITIAL_BLOGS: BlogPost[] = [
  { id: '1', title: 'The Future of Glassmorphism in 2025', title_bn: '২০২৫ সালে গ্লাস মরফিজমের ভবিষ্যৎ', excerpt: 'Why translucent interfaces are taking over enterprise software.', excerpt_bn: 'কেন স্বচ্ছ ইন্টারফেস এন্টারপ্রাইজ সফটওয়্যার দখল করছে।', content: 'Full content here...', content_bn: 'সম্পূর্ণ কন্টেন্ট এখানে...', date: 'Oct 12, 2024', image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80', category: 'Design', category_bn: 'ডিজাইন' },
  { id: '2', title: 'Scaling Node.js Applications', title_bn: 'নোড.জেএস অ্যাপ্লিকেশন স্কেলিং', excerpt: 'Best practices for handling high concurrency.', excerpt_bn: 'উচ্চ কনকারেন্সি হ্যান্ডল করার জন্য সেরা অনুশীলন।', content: 'Full content here...', content_bn: 'সম্পূর্ণ কন্টেন্ট এখানে...', date: 'Nov 01, 2024', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80', category: 'Tech', category_bn: 'টেক' },
];

const INITIAL_JOBS: Job[] = [
  { id: '1', title: 'Senior React Developer', title_bn: 'সিনিয়র রিয়্যাক্ট ডেভেলপার', type: 'Full-time', location: 'Remote', location_bn: 'রিমোট', salary: '$80k - $120k', description: 'We are looking for a React expert...', description_bn: 'আমরা একজন রিয়্যাক্ট বিশেষজ্ঞ খুঁজছি...' },
  { id: '2', title: 'UI/UX Designer', title_bn: 'ইউআই/ইউএক্স ডিজাইনার', type: 'Contract', location: 'Hybrid', location_bn: 'হাইব্রিড', salary: '$60/hr', description: 'Design beautiful glass interfaces...', description_bn: 'সুন্দর গ্লাস ইন্টারফেস ডিজাইন করুন...' },
];

const INITIAL_VIDEOS: Video[] = [
  {
    id: '1',
    title: 'Rizqara Tech Showreel 2024',
    title_bn: 'রিজকারা টেক শোরিল ২০২৪',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&q=80',
    url: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    category: 'Showcase',
    comments: [
      { id: 'c1', user: 'Alex M.', text: 'This looks amazing! The glassmorphism is on point.', date: '2024-12-20' },
      { id: 'c2', user: 'Sarah J.', text: 'Is this built with React?', date: '2024-12-22' }
    ]
  },
  {
    id: '2',
    title: 'Client Success: TechFlow',
    title_bn: 'ক্লায়েন্ট সাফল্য: টেকফ্লো',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80',
    url: 'https://www.youtube.com/watch?v=ysz5S6P_bs4',
    category: 'Ad',
    comments: []
  },
];

const INITIAL_CAROUSEL: CarouselSlide[] = [
  {
    id: '1',
    title: "We Build Digital Excellence",
    title_bn: "আমরা ডিজিটাল শ্রেষ্ঠত্ব তৈরি করি",
    subtitle: "Premium software solutions tailored for the modern enterprise.",
    subtitle_bn: "আধুনিক এন্টারপ্রাইজের জন্য তৈরি প্রিমিয়াম সফটওয়্যার সমাধান।",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop",
    cta: "Start Your Build",
    cta_bn: "আপনার বিল্ড শুরু করুন"
  },
  {
    id: '2',
    title: "Enterprise Grade Security",
    title_bn: "এন্টারপ্রাইজ গ্রেড নিরাপত্তা",
    subtitle: "Bank-level encryption and robust architecture for your data.",
    subtitle_bn: "আপনার ডেটার জন্য ব্যাংক-লেভেল এনক্রিপশন এবং শক্তিশালী আর্কিটেকচার।",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop",
    cta: "View Services",
    cta_bn: "সেবাসমূহ দেখুন"
  },
  {
    id: '3',
    title: "Mobile First Experience",
    title_bn: "মোবাইল ফার্স্ট অভিজ্ঞতা",
    subtitle: "Native performance on iOS and Android devices.",
    subtitle_bn: "iOS এবং Android ডিভাইসে নেটিভ পারফরম্যান্স।",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop",
    cta: "See Portfolio",
    cta_bn: "পোর্টফোলিও দেখুন"
  }
];

const INITIAL_BUILD_OPTIONS: BuildOption[] = [
  // Types (Base Price)
  { id: '1', category: 'type', label: 'Web App', label_bn: 'ওয়েব অ্যাপ', value: 5000 },
  { id: '2', category: 'type', label: 'Mobile App', label_bn: 'মোবাইল অ্যাপ', value: 8000 },
  { id: '3', category: 'type', label: 'Website', label_bn: 'ওয়েবসাইট', value: 2000 },
  { id: '4', category: 'type', label: 'UI/UX Design', label_bn: 'UI/UX ডিজাইন', value: 1500 },
  { id: '5', category: 'type', label: 'SEO', label_bn: 'এসইও', value: 1000 },
  { id: '6', category: 'type', label: 'Graphics Design', label_bn: 'গ্রাফিক্স ডিজাইন', value: 800 },
  // Features (Multiplier)
  { id: '7', category: 'feature', label: 'Standard', label_bn: 'স্ট্যান্ডার্ড', value: 1.0 },
  { id: '8', category: 'feature', label: 'Advanced', label_bn: 'অ্যাডভান্সড', value: 1.5 },
  { id: '9', category: 'feature', label: 'E-commerce', label_bn: 'ই-কমার্স', value: 1.3 },
  { id: '10', category: 'feature', label: 'AI Integration', label_bn: 'এআই ইন্টিগ্রেশন', value: 2.0 },
  { id: '11', category: 'feature', label: 'Custom Branding', label_bn: 'কাস্টম ব্র্যান্ডিং', value: 1.2 },
  // Time (Multiplier)
  { id: '12', category: 'time', label: '1 Week', label_bn: '১ সপ্তাহ', value: 1.5 },
  { id: '13', category: 'time', label: '2 Weeks', label_bn: '২ সপ্তাহ', value: 1.2 },
  { id: '14', category: 'time', label: '1 Month', label_bn: '১ মাস', value: 1.0 },
  { id: '15', category: 'time', label: '2 Months', label_bn: '২ মাস', value: 0.9 },
  { id: '16', category: 'time', label: '3 Months', label_bn: '৩ মাস', value: 0.85 },
];

const INITIAL_MESSAGES: Message[] = [
  { id: '1', type: 'Contact', name: 'John Doe', email: 'john@example.com', subject: 'Project Inquiry', message: 'Hello, I need a website.', date: '2024-12-28', read: false, status: 'Pending' }
];

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
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [videos, setVideos] = useState<Video[]>(INITIAL_VIDEOS);
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>(INITIAL_CAROUSEL);
  const [buildOptions, setBuildOptions] = useState<BuildOption[]>(INITIAL_BUILD_OPTIONS);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
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
      await fetch(`${API_URL}/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error(`Failed to update ${key}:`, error);
      // toast.error('Failed to save changes to server.'); // Assuming toast is defined elsewhere
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
