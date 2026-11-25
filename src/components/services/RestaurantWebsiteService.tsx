import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import restaurant from '../../../shared/restaurant-service.json';
import { useData } from '../../context/DataContext';
import { trackGrowth } from '../../utils/growthAnalytics';
import { SEO } from '../SEO';
import '../../styles/restaurant-service.css';

export function RestaurantWebsiteService() {
    const bn = useData().language === 'bn';
    const title = bn ? restaurant.titleBn : restaurant.title;
    const description = bn ? restaurant.descriptionBn : restaurant.description;
    const quoteLabel = bn ? 'রেস্তোরাঁর ওয়েবসাইটের কোট নিন' : 'Get a quote for your restaurant website';
    const quoteLink = <Link className="rq-restaurant-quote" to={restaurant.quotePath} onClick={() => trackGrowth('restaurant_quote_clicked')}>
        {quoteLabel} <ArrowRight size={18} aria-hidden="true" />
    </Link>;

    return (
        <div className="rq-restaurant container mx-auto px-6">
            <SEO title={`${title} | RizQara Tech`} description={description}
                canonical={`https://www.rizqara.tech${restaurant.path}`} image={restaurant.cover} />
            <Link to="/services" className="rq-restaurant-back">{bn ? 'সব সেবা' : 'All services'}</Link>
            <header className="rq-restaurant-hero">
                <div>
                    <h1>{title}</h1>
                    <p>{description}</p>
                    {quoteLink}
                </div>
                <figure>
                    <img src={restaurant.cover} alt={bn ? 'হট প্লেট রেস্তোরাঁর ওয়েবসাইটের স্ক্রিনশট' : 'Screenshot of the Hot Plate Restaurant website'} fetchPriority="high" />
                    <figcaption>{bn ? 'হট প্লেট রেস্তোরাঁ' : 'Hot Plate Restaurant'} <Link to={restaurant.casePath}>{bn ? 'কেস স্টাডি দেখুন' : 'View case study'} <ArrowUpRight size={16} aria-hidden="true" /></Link></figcaption>
                </figure>
            </header>
            <section aria-labelledby="restaurant-deliverables">
                <h2 id="restaurant-deliverables">{bn ? 'আপনার ওয়েবসাইটে যা থাকতে পারে' : 'What your restaurant website can include'}</h2>
                <div className="rq-restaurant-deliverables">
                    {restaurant.deliverables.map(item => <article key={item.title}>
                        <h3>{bn ? item.titleBn : item.title}</h3>
                        <p>{bn ? item.textBn : item.text}</p>
                    </article>)}
                </div>
            </section>
            <section className="rq-restaurant-delivery" aria-labelledby="restaurant-delivery">
                <div>
                    <h2 id="restaurant-delivery">{bn ? 'স্কোপ থেকে হস্তান্তর' : 'From project scope to handover'}</h2>
                    <p>{bn ? 'মেনু, আসন বিন্যাস ও বর্তমান বুকিং প্রক্রিয়া দিয়ে শুরু করুন। আমরা কাজের পরিধি, ডেমো এবং লঞ্চের পরীক্ষাগুলো ঠিক করব।' : 'Start with your menu, seating setup, and current booking process. We’ll agree on the scope, when to review a working demo, and what your team needs to test before launch.'}</p>
                    <p>{bn ? 'আমাদের টিম বাংলাদেশে (UTC+6)। দুই পক্ষের সুবিধাজনক সময়, ওয়েবসাইটের অ্যাক্সেস এবং হস্তান্তরের শর্ত আগে নিশ্চিত করুন।' : 'Our team works from Bangladesh (UTC+6). We’ll agree on overlapping hours, who will manage site access and content, and what documentation and support are included.'}</p>
                </div>
                <div>
                    <h3>{bn ? 'কোটের জন্য যা জানাবেন' : 'What to include in your quote request'}</h3>
                    <p>{bn ? 'রেস্তোরাঁর নাম ও অবস্থান, বর্তমান ওয়েবসাইট থাকলে তার লিংক, বুকিংয়ের পদ্ধতি এবং কাঙ্ক্ষিত লঞ্চের সময়।' : 'Tell us your restaurant name and location, your current website if you have one, how you take bookings, and when you’d like to launch.'}</p>
                    {quoteLink}
                </div>
            </section>
        </div>
    );
}
