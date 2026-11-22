import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { getSlug } from '../../utils/content';
import { trackGrowth } from '../../utils/growthAnalytics';
import { RESTAURANT_CASE } from '../projects/DocumentedWork';
import '../../styles/client-delivery.css';

const steps = [
    {
        title: 'Scope and milestones', bn: 'কাজের পরিধি ও মাইলস্টোন',
        text: 'The first call covers your goals, existing tools, budget, and timeline. Agree on deliverables, payment milestones, and what is included before work starts.',
        textBn: 'প্রথম কলে লক্ষ্য, বর্তমান টুল, বাজেট ও সময় নিয়ে কথা বলুন। কাজ শুরুর আগে ডেলিভারি, পেমেন্টের ধাপ এবং কাজের পরিধি ঠিক করুন।',
    },
    {
        title: 'Communication and demos', bn: 'যোগাযোগ ও ডেমো',
        text: 'Our team is based in Bangladesh (UTC+6). Agree on overlapping hours, a point of contact, and when you’ll review progress and see demos.',
        textBn: 'আমাদের টিম বাংলাদেশে (UTC+6)। উভয়ের সুবিধাজনক সময়, যোগাযোগের ব্যক্তি এবং অগ্রগতি ও ডেমো দেখার সময় ঠিক করুন।',
    },
    {
        title: 'Launch and handover', bn: 'লঞ্চ ও হস্তান্তর',
        text: 'Before launch, confirm acceptance checks, source-code and account handover, documentation, and the scope of post-launch support.',
        textBn: 'লঞ্চের আগে গ্রহণযোগ্যতার পরীক্ষা, সোর্স কোড ও অ্যাকাউন্ট হস্তান্তর, ডকুমেন্টেশন এবং লঞ্চ-পরবর্তী সহায়তার পরিধি ঠিক করুন।',
    },
];

export function ClientDelivery({ bookingUrl }: { bookingUrl: string }) {
    const { language, caseStudies } = useData();
    const bn = language === 'bn';
    const study = caseStudies.find(item => item.id === RESTAURANT_CASE);

    return (
        <section className="rq-client-delivery" aria-labelledby="rq-client-delivery-title">
            <div className="rq-client-delivery__intro">
                <div>
                    <h2 id="rq-client-delivery-title">{bn ? 'আমাদের সঙ্গে কাজ করার পদ্ধতি' : 'Working with RizQara Tech'}</h2>
                    <p>{bn
                        ? 'অনলাইন বুকিং, ইনভেন্টরি ও দৈনন্দিন কাজের জন্য কাস্টম সফটওয়্যার। প্রথম আলোচনা থেকে হস্তান্তর পর্যন্ত কীভাবে একসঙ্গে কাজ করব, দেখে নিন।'
                        : 'We build booking websites, inventory systems, and workflow automation. Here’s how we plan and deliver projects with teams in other time zones.'}</p>
                    <div className="rq-client-delivery__actions">
                        <a href={bookingUrl} target="_blank" rel="noopener noreferrer"
                            onClick={() => trackGrowth('booking_clicked')}>
                            {bn ? 'কল বুক করুন' : 'Book a discovery call'} <ArrowUpRight size={17} aria-hidden="true" />
                        </a>
                        <Link to="/estimate">{bn ? 'বাজেটের প্রাথমিক হিসাব' : 'Estimate your project'} <ArrowRight size={17} aria-hidden="true" /></Link>
                    </div>
                </div>
                {study && (
                    <Link className="rq-client-delivery__case" to={`/case-studies/${getSlug(study)}`}>
                        <img src={study.image} alt="" width="160" height="120" loading="lazy" />
                        <div>
                            <span>{bn ? 'প্রজেক্টের বিবরণ' : 'Project write-up'}</span>
                            <h3>{bn ? 'হট প্লেট রেস্তোরাঁ' : 'Hot Plate Restaurant'}</h3>
                            <p>{bn ? 'মেনু, টেবিল রিজার্ভেশন ও ক্যাটারিংয়ের ডিজাইন।' : 'Menu browsing, table reservations, and catering requests.'}</p>
                        </div>
                        <ArrowUpRight size={18} aria-hidden="true" />
                    </Link>
                )}
            </div>
            <div className="rq-client-delivery__steps">
                {steps.map(step => (
                    <div key={step.title}>
                        <h3>{bn ? step.bn : step.title}</h3>
                        <p>{bn ? step.textBn : step.text}</p>
                    </div>
                ))}
            </div>
            <div className="rq-client-delivery__links">
                <Link to="/registered-company">{bn ? 'কোম্পানির তথ্য' : 'Company registration'}</Link>
                <Link to="/team">{bn ? 'আমাদের টিম' : 'Meet the team'}</Link>
                <Link to="/contact">{bn ? 'প্রজেক্টের বিবরণ পাঠান' : 'Send a project brief'}</Link>
            </div>
        </section>
    );
}
