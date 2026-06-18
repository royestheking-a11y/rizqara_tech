import { Service, Project, CaseStudy, Review, BlogPost, Job, DataContextType } from '../context/DataContext';

export type ChatbotState = 'idle' | 'collecting_name' | 'collecting_email' | 'collecting_phone' | 'collecting_reqs' | 'complete';

export type BotResponse = {
    text: string;
    type?: 'text' | 'button' | 'link' | 'summary' | 'whatsapp_btn';
    actionLink?: string;
    actionLabel?: string;
    newState?: ChatbotState;
};

// A highly aggressive, conversion-focused NLP simulator
export class RizqAIEngine {
    private data: DataContextType;
    private language: 'en' | 'bn';

    constructor(data: DataContextType) {
        this.data = data;
        this.language = data.language || 'en';
    }

    private isBengali(text: string): boolean {
        const bengaliRange = /[\u0980-\u09FF]/;
        return bengaliRange.test(text);
    }

    private searchItems<T extends { title?: string; title_bn?: string; description?: string; description_bn?: string; category?: string; category_bn?: string }>(items: T[], query: string): T[] {
        const lowerQuery = query.toLowerCase();
        const keywords = lowerQuery.split(/\s+/).filter(w => w.length > 2);

        return items.filter(item => {
            let score = 0;
            const searchString = `${item.title || ''} ${item.title_bn || ''} ${item.description || ''} ${item.description_bn || ''} ${item.category || ''} ${item.category_bn || ''}`.toLowerCase();
            
            keywords.forEach(kw => {
                if (searchString.includes(kw)) score++;
            });
            
            return score > 0; // Return anything that matches at least one strong keyword
        });
    }

    public processMessage(userText: string, currentState: ChatbotState, leadData: any): BotResponse {
        const lowerText = userText.toLowerCase();
        const isBn = this.language === 'bn' || this.isBengali(lowerText);
        
        // 1. LEAD COLLECTION FLOW (Aggressive Funnel)
        if (currentState === 'collecting_name') {
            return {
                text: isBn 
                    ? `দারুণ, ${userText}! আপনার ইমেল ঠিকানাটি কী হবে যাতে আমরা আপনাকে প্রপোজাল পাঠাতে পারি?`
                    : `Nice to meet you, ${userText}! What is your best email address so I can send you a detailed proposal?`,
                newState: 'collecting_email'
            };
        }
        if (currentState === 'collecting_email') {
            // Very aggressive hook: don't let them bounce
            return {
                text: isBn
                    ? "ধন্যবাদ। আমাদের সিনিয়র স্পেশালিস্ট আপনার সাথে সরাসরি কথা বলবেন। আপনার ফোন নম্বরটি দিন:"
                    : "Got it! Our senior digital specialist needs to hop on a quick 5-min call to understand your vision perfectly. What is your phone number?",
                newState: 'collecting_phone'
            };
        }
        if (currentState === 'collecting_phone') {
            return {
                text: isBn
                    ? "চমৎকার! শেষ প্রশ্ন—আপনি কি ধরণের ওয়েবসাইট বা অ্যাপ্লিকেশন চাচ্ছেন? (যেমন: ই-কমার্স, ল্যান্ডিং পেজ, সিআরএম ইত্যাদি)"
                    : "Perfect! Last question to lock in your 20% DISCOUNT—what exactly are we building for you? (e.g., E-commerce site, Mobile App, Business Dashboard)",
                newState: 'collecting_reqs'
            };
        }
        if (currentState === 'collecting_reqs') {
            return {
                text: isBn
                    ? "সব তথ্যের জন্য ধন্যবাদ! আমি আপনার জন্য সবকিছু প্রস্তুত করেছি। আমাদের প্রথমবার সেবা গ্রহণকারী হিসেবে আপনি ২০% ডিসকাউন্ট পাচ্ছেন! আপনি কি তথ্যগুলো সাবমিট করবেন নাকি সরাসরি WhatsApp-এ কথা বলবেন?"
                    : "Incredible! I've logged all your details. As a VIP lead, you've unlocked a 20% DISCOUNT! Would you like to submit this right now or chat directly with our founder on WhatsApp?",
                newState: 'complete',
                type: 'summary'
            };
        }

        // 2. INTENT MATCHING & KNOWLEDGE GRAPH
        // WhatsApp Intent
        if (lowerText.match(/\b(whatsapp|wa\.me|হোয়াটসঅ্যাপ)\b/)) {
            return {
                text: isBn 
                    ? "সরাসরি আমাদের কোর টিমের সাথে WhatsApp-এ যোগাযোগ করুন। আমরা এখনই উত্তর দেবো!" 
                    : "Skip the line! Chat directly with our core team on WhatsApp right now.",
                type: 'whatsapp_btn'
            };
        }

        // Project / Portfolio Intent
        if (lowerText.match(/\b(project|portfolio|work|built|made|examples|কাজ|প্রকল্প)\b/)) {
            const matchedProjects = this.searchItems(this.data.projects, lowerText);
            const displayProjects = matchedProjects.length > 0 ? matchedProjects : this.data.projects;
            const topProjects = displayProjects.slice(0, 3).map(p => `• ${isBn && p.title_bn ? p.title_bn : p.title} (${isBn && p.category_bn ? p.category_bn : p.category})`).join('\n');
            
            return {
                text: isBn
                    ? `আমরা অনেকগুলো সফল প্রকল্প সম্পন্ন করেছি:\n\n${topProjects}\n\nআপনিও কি এমন কিছু তৈরি করতে চান? আপনার নাম কি?`
                    : `We've built some incredible platforms recently:\n\n${topProjects}\n\nWant us to build something even better for you? Let's get started. What's your name?`,
                type: 'link',
                actionLabel: isBn ? "সব প্রজেক্ট দেখুন" : "View All Projects",
                actionLink: "/projects",
                newState: 'collecting_name' // Aggressive pivot to lead gen
            };
        }

        // Service / Need Intent
        if (lowerText.match(/\b(service|need|want|build|make|create|develop|app|website|software|ai|ecommerce|ইকমার্স|সফটওয়্যার|ওয়েবসাইট|অ্যাপ)\b/)) {
            const matchedServices = this.searchItems(this.data.services, lowerText);
            
            if (matchedServices.length > 0) {
                const service = matchedServices[0];
                return {
                    text: isBn
                        ? `হ্যাঁ! আমরা **${service.title_bn || service.title}** নিয়ে কাজ করি। ${service.description_bn || service.description}\n\nআমরা আপনাকে সাহায্য করতে প্রস্তুত! আপনার নাম দিয়ে শুরু করতে পারি?`
                        : `Yes! We specialize in **${service.title}**. ${service.description}\n\nWe are ready to start building this for you right now. May I have your name to begin?`,
                    newState: 'collecting_name' // Aggressive pivot
                };
            } else {
                return {
                    text: isBn
                        ? "অবশ্যই! আমরা আপনার জন্য সেরা কাস্টম ডিজিটাল সমাধান তৈরি করতে পারি। এবং সুখবর হলো—প্রথম অর্ডারে আপনি ২০% ছাড় পাবেন! শুরু করার জন্য, আপনার নাম কি?"
                        : "Absolutely! We build custom, premium digital solutions for growing businesses. Plus, you get 20% OFF your first project! To claim this, what is your name?",
                    newState: 'collecting_name'
                };
            }
        }

        // Case Studies Intent
        if (lowerText.match(/\b(case study|case studies|success|results|impact|কেস স্টাডি)\b/)) {
            const topCases = this.data.caseStudies.slice(0, 2).map(c => `• ${isBn && c.title_bn ? c.title_bn : c.title}: ${isBn && c.impact_bn ? c.impact_bn : c.impact}`).join('\n');
            return {
                text: isBn
                    ? `আমাদের কেস স্টাডিগুলো দেখুন যেখানে আমরা ক্লায়েন্টের ব্যবসার বৃদ্ধি করেছি:\n\n${topCases}\n\nআপনার ব্যবসারও কি এই ধরনের বৃদ্ধি প্রয়োজন? আপনার নাম কি?`
                    : `We don't just build software; we generate results. Check out these impacts:\n\n${topCases}\n\nWant similar results for your business? Let's chat. What's your name?`,
                type: 'link',
                actionLabel: isBn ? "সব কেস স্টাডি দেখুন" : "Read Case Studies",
                actionLink: "/case-studies",
                newState: 'collecting_name' // Aggressive pivot
            };
        }

        // Team / Founder Intent
        if (lowerText.match(/\b(team|founder|who|ceo|md|sunny|টিম|প্রতিষ্ঠাতা)\b/)) {
            return {
                text: isBn
                    ? "আমাদের একটি দারুণ এক্সপার্ট টিম আছে, যারা সেরা প্রিমিয়াম সলিউশন তৈরি করে। আপনি কি আমাদের সাথে একটি কল শিডিউল করতে চান? আপনার নাম কি?"
                    : "We are a team of elite developers and designers led by our visionary founder. We treat every project like our own startup. Ready to work with the best? What's your name?",
                newState: 'collecting_name' // Aggressive pivot
            };
        }

        // Price / Cost Intent
        if (lowerText.match(/\b(cost|price|budget|much|pay|pricing|খরচ|দাম)\b/)) {
            return {
                text: isBn
                    ? "আমাদের মূল্যমান নির্ভর করে আপনার প্রজেক্টের ধরনের উপর, তবে আমরা সর্বদা প্রিমিয়াম কোয়ালিটি নিশ্চিত করি। আপনার প্রজেক্টের সঠিক খরচের জন্য, আমরা কি আপনার নাম জানতে পারি?"
                    : "Our pricing is highly competitive for the premium, enterprise-grade quality we deliver. To give you an exact quote, I just need a few details. What's your name?",
                newState: 'collecting_name' // Aggressive pivot
            };
        }

        // Generic Greeting
        if (lowerText.match(/\b(hi|hello|hey|greetings|start|hola|হ্যালো|হাই)\b/)) {
            return {
                text: isBn
                    ? "হ্যালো! RizqAI-এ স্বাগতম। আপনি কি আপনার ব্যবসার জন্য একটি হাই-এন্ড ওয়েবসাইট বা অ্যাপ তৈরির কথা ভাবছেন? আমি আপনাকে সাহায্য করতে পারি।"
                    : "Welcome to Rizqara Tech! I'm RizqAI. Are you ready to scale your business with a premium website or application?",
            };
        }

        // Fallback / Catch-all (Smart pivot)
        return {
            text: isBn
                ? "আমি সব বুঝতে পারছি না, তবে আমি নিশ্চিত আমরা আপনাকে ডিজিটাল সলিউশনে সাহায্য করতে পারবো। আপনি কি একটি কাস্টম কোট পেতে চান? আপনার নাম কি?"
                : "I want to make sure I get you the best answer. Our human specialists can handle this perfectly! Let me connect you. What is your name?",
            newState: 'collecting_name'
        };
    }
}
