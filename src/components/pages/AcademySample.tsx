import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { trackGrowth } from '../../utils/growthAnalytics';
import { SEO } from '../SEO';
import '../../styles/academy.css';

export function AcademySample() {
    const bn = useData().language === 'bn';

    return (
        <article className="rq-academy rq-academy-sample">
            <SEO title="Build a Responsive Card Grid | RizQara Tech Academy"
                description="A free sample lesson from Responsive Website Studio. Build a CSS Grid layout and test it at three screen widths."
                canonical="https://www.rizqara.tech/academy/responsive-web-sample" image="https://www.rizqara.tech/images/academy/responsive-web-sample.jpg" />
            <Link className="rq-academy-card-action" to="/academy"><ArrowLeft size={17} aria-hidden="true" /> {bn ? 'একাডেমিতে ফিরে যান' : 'Back to Academy'}</Link>
            <header className="rq-academy-hero">
                <div>
                    <h1>{bn ? 'রেসপনসিভ কার্ড গ্রিড তৈরি করুন' : 'Build a responsive card grid'}</h1>
                    <p>{bn ? 'Responsive Website Studio কোর্সের একটি উন্মুক্ত পাঠ।' : 'A free sample lesson from Responsive Website Studio.'}</p>
                </div>
            </header>
            <div className="rq-academy-lesson">
                <h2>{bn ? 'এক কলামে শুরু করুন' : 'Start with one column'}</h2>
                <p>{bn
                    ? 'একটি সেকশনে তিনটি সার্ভিস কার্ড লিখুন। প্রতিটি কার্ডে একটি শিরোনাম ও ছোট বিবরণ দিন। বেশি জায়গা থাকলে CSS Grid স্বয়ংক্রিয়ভাবে আরও কলাম তৈরি করবে।'
                    : 'Put three service cards in a section, each with a heading and a short description. This CSS lets the cards sit side by side when there’s enough room.'}</p>
                <pre><code>{`.services {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(min(100%, 16rem), 1fr));
  gap: 1rem;
}`}</code></pre>
                <h2>{bn ? 'তিনটি প্রস্থে পরীক্ষা করুন' : 'Test at three widths'}</h2>
                <ol>
                    <li>{bn ? '৩২০ পিক্সেলে দেখুন যে কোনো কার্ড পাশের দিকে স্ক্রল তৈরি করছে কি না।' : 'At 320 px, check that the cards fit without horizontal scrolling.'}</li>
                    <li>{bn ? '৭৬৮ ও ১২৮০ পিক্সেলে কার্ডগুলো কেমন সাজে দেখুন। দীর্ঘ একটি শিরোনাম দিয়ে আবার পরীক্ষা করুন।' : 'At 768 and 1280 px, check the layout again with a long heading in one card.'}</li>
                    <li>{bn ? 'কার্ডে লিংক থাকলে Tab দিয়ে দেখুন ফোকাস স্পষ্ট কি না।' : 'If a card includes a link, use Tab to check that the focus outline is visible.'}</li>
                </ol>
                <Link className="rq-academy-button" to="/academy?course=responsive-website-studio#academy-catalog-title"
                    onClick={() => trackGrowth('academy_sample_click')}>
                    {bn ? 'সম্পূর্ণ কোর্স দেখুন' : 'Find the full course'} <ArrowRight size={17} aria-hidden="true" />
                </Link>
            </div>
        </article>
    );
}
