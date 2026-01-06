import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, MessageCircle, ChevronDown } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { language } = useData();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: language === 'bn' ? "রিজকারা টেক কোন সেবায় বিশেষজ্ঞ?" : "What services does Rizqara Tech specialize in?",
      answer: language === 'bn' ? "আমরা কাস্টম ওয়েব ডেভেলপমেন্ট, মোবাইল অ্যাপ তৈরি, এন্টারপ্রাইজ সফটওয়্যার এবং অটোমেটেড বিল্ড সিস্টেম সহ এন্ড-টু-এন্ড ডিজিটাল সমাধানে বিশেষজ্ঞ। আমাদের দক্ষতা রিয়্যাক্ট, নোড.জেএস, পাইথন এবং ক্লাউড ইনফ্রাস্ট্রাকচার ইন্টিগ্রেশনে বিস্তৃত।" : "We specialize in end-to-end digital solutions including Custom Web Development, Mobile App Creation, Enterprise Software, and Automated Build Systems. Our expertise spans React, Node.js, Python, and cloud infrastructure integration."
    },
    {
      question: language === 'bn' ? "আপনার 'বিল্ড সিস্টেম' প্রাইসিং কীভাবে কাজ করে?" : "How does your 'Build System' pricing work?",
      answer: language === 'bn' ? "আমাদের বিল্ড সিস্টেম প্রয়োজনীয় সেটআপের জন্য বেসিক 'ফাউন্ডেশন' প্যাকেজ থেকে শুরু করে বড় আকারের অপারেশনের জন্য 'এন্টারপ্রাইজ' টায়ার পর্যন্ত নমনীয় প্রাইসিং টায়ার অফার করে। প্রতিটি টায়ার আমাদের ড্যাশবোর্ডে সম্পূর্ণরূপে কনফিগারযোগ্য।" : "Our Build System offers flexible pricing tiers starting with the Basic 'Foundation' package for essential setups, up to the 'Enterprise' tier for large-scale operations. Each tier is fully configurable in our dashboard, allowing you to pay only for the features you need."
    },
    {
      question: language === 'bn' ? "আপনারা কি পোস্ট-লঞ্চ সাপোর্ট এবং রক্ষণাবেক্ষণ অফার করেন?" : "Do you offer post-launch support and maintenance?",
      answer: language === 'bn' ? "হ্যাঁ, আমরা ব্যাপক পোস্ট-লঞ্চ সাপোর্ট প্যাকেজ প্রদান করি। এর মধ্যে রয়েছে ২৪/৭ মনিটরিং, নিয়মিত নিরাপত্তা আপডেট, পারফরম্যান্স অপ্টিমাইজেশন এবং অগ্রাধিকার বাগ ফিক্স যাতে আপনার অ্যাপ্লিকেশনটি মসৃণভাবে চলে।" : "Yes, we provide comprehensive post-launch support packages. These include 24/7 monitoring, regular security updates, performance optimization, and priority bug fixes to ensure your application runs smoothly."
    },
    {
      question: language === 'bn' ? "একটি কাস্টম প্রকল্পের জন্য সাধারণ সময়সীমা কত?" : "What is the typical timeline for a custom project?",
      answer: language === 'bn' ? "প্রকল্পের সময়সীমা জটিলতার উপর ভিত্তি করে পরিবর্তিত হয়। একটি সাধারণ ব্যবসায়িক ওয়েবসাইট সাধারণত ২-৪ সপ্তাহ নেয়, যখন জটিল ওয়েব অ্যাপ্লিকেশন বা মোবাইল অ্যাপ ৮-১২ সপ্তাহ নিতে পারে। আমরা আমাদের প্রাথমিক পরামর্শের সময় একটি বিস্তারিত রোডম্যাপ প্রদান করি।" : "Project timelines vary based on complexity. A standard business website typically takes 2-4 weeks, while complex web applications or mobile apps may take 8-12 weeks. We provide a detailed roadmap during our initial consultation."
    },
    {
      question: language === 'bn' ? "আপনি কি নতুন অ্যাপ্লিকেশনের সাথে বিদ্যমান সিস্টেমগুলি সংহত করতে পারেন?" : "Can you integrate existing systems with new applications?",
      answer: language === 'bn' ? "অবশ্যই। আমাদের এপিআই ডেভেলপমেন্ট এবং সিস্টেম ইন্টিগ্রেশনে ব্যাপক অভিজ্ঞতা রয়েছে। আমরা আপনার নতুন অ্যাপ্লিকেশনকে বিদ্যমান লিগ্যাসি সিস্টেম, সিআরএম বা তৃতীয় পক্ষের টুল যেমন Supabase, Stripe এবং AWS-এর সাথে নির্বিঘ্নে সংযুক্ত করতে পারি।" : "Absolutely. We have extensive experience in API development and system integration. We can seamlessly connect your new application with existing legacy systems, CRMs, or third-party tools like Supabase, Stripe, and AWS."
    },
    {
      question: language === 'bn' ? "রিজকারা টেকের সাথে আমার ডেটা কি নিরাপদ?" : "Is my data secure with Rizqara Tech?",
      answer: language === 'bn' ? "নিরাপত্তা আমাদের সর্বোচ্চ অগ্রাধিকার। আমরা আপনার সংবেদনশীল ডেটা এবং মেধা সম্পত্তি রক্ষা করার জন্য এন্ড-টু-এন্ড এনক্রিপশন, নিরাপদ প্রমাণীকরণ (Auth0/Supabase) এবং নিয়মিত নিরাপত্তা অডিট সহ শিল্প-মান নিরাপত্তা প্রোটোকল বাস্তবায়ন করি।" : "Security is our top priority. We implement industry-standard security protocols including end-to-end encryption, secure authentication (Auth0/Supabase), and regular security audits to protect your sensitive data and intellectual property."
    }
  ];

  return (
    <section className="container mx-auto px-6 py-24 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#500000] opacity-[0.02] rounded-full blur-3xl pointer-events-none -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        {/* Left Column: Header & Context */}
        <div className="lg:col-span-4 space-y-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div className="flex items-center gap-2 text-[#500000] font-bold uppercase tracking-widest text-sm mb-4">
                    <span className="w-8 h-[2px] bg-[#500000]"></span>
                    <span>{language === 'bn' ? 'সাপোর্ট ও তথ্য' : 'Support & Info'}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
                    {language === 'bn' ? <>প্রায়শই <br/> জিজ্ঞাসিত <span className="text-[#500000]">প্রশ্নাবলী</span></> : <>Frequently <br/> Asked <span className="text-[#500000]">Questions</span></>}
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed font-light">
                    {language === 'bn' ? 'আমাদের পরিষেবা, মূল্য এবং প্রযুক্তিগত সক্ষমতা সম্পর্কে আপনার যা জানা দরকার। আপনি যা খুঁজছেন তা খুঁজে পাচ্ছেন না?' : "Everything you need to know about our services, pricing, and technical capabilities. Can't find what you're looking for?"}
                </p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="p-8 bg-[#500000] text-white rounded-3xl shadow-xl relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                    <MessageCircle size={120} />
                </div>
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                        <HelpCircle size={24} className="text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{language === 'bn' ? 'এখনও প্রশ্ন আছে?' : 'Still have questions?'}</h3>
                    <p className="text-white/80 mb-6 text-sm">{language === 'bn' ? 'আমাদের বিশেষজ্ঞ দল আপনার নির্দিষ্ট প্রশ্নের উত্তর দিতে প্রস্তুত।' : 'Our expert team is ready to help you with any specific inquiries.'}</p>
                    <button 
                        onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="w-full py-3 bg-white text-[#500000] rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                    >
                        {language === 'bn' ? 'যোগাযোগ সাপোর্ট' : 'Contact Support'} <ChevronDown className="rotate-[-90deg]" size={16}/>
                    </button>
                </div>
            </motion.div>
        </div>

        {/* Right Column: Accordion */}
        <div className="lg:col-span-8 space-y-4">
            {faqs.map((faq, index) => (
                <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`group rounded-2xl transition-all duration-300 ${openIndex === index ? 'bg-white shadow-xl border-l-4 border-l-[#500000]' : 'bg-gray-50 hover:bg-white hover:shadow-md border border-transparent'}`}
                >
                    <button 
                        onClick={() => toggleFAQ(index)}
                        className="w-full flex items-start justify-between p-6 text-left"
                    >
                        <span className={`text-lg font-bold pr-8 transition-colors ${openIndex === index ? 'text-[#500000]' : 'text-gray-800'}`}>
                            {faq.question}
                        </span>
                        <span className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${openIndex === index ? 'bg-[#500000] text-white rotate-180' : 'bg-gray-200 text-gray-500 group-hover:bg-[#500000] group-hover:text-white'}`}>
                           {openIndex === index ? <Minus size={16} /> : <Plus size={16} />} 
                        </span>
                    </button>
                    <AnimatePresence>
                        {openIndex === index && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="p-6 pt-0 text-gray-600 leading-relaxed font-light border-t border-gray-100 mt-2">
                                    {faq.answer}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};
