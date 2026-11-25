import { useEffect, useRef, useState } from 'react';
import { Clipboard, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import restaurant from '../../../shared/restaurant-service.json';
import { readConsent } from '../../utils/consent';
import { rememberScorecardCampaign, trackGrowth } from '../../utils/growthAnalytics';

const checks = [
    { en: 'Guests can find the menu from the homepage in one tap.', bn: 'হোমপেজ থেকে এক ট্যাপেই মেনু পাওয়া যায়।', fix: 'Add a clearly labeled Menu link near the top of the homepage.', fixBn: 'হোমপেজের ওপরে স্পষ্ট একটি মেনু লিংক দিন।' },
    { en: 'The menu is readable on a phone without zooming.', bn: 'জুম ছাড়াই ফোনে মেনু পড়া যায়।', fix: 'Publish the menu as readable page content with prices alongside each dish.', fixBn: 'খাবারের নাম ও দামসহ মেনু ওয়েবপেজে পড়ার উপযোগী করে দিন।' },
    { en: 'Opening hours and directions are easy to find.', bn: 'খোলার সময় ও যাওয়ার পথ সহজে পাওয়া যায়।', fix: 'Put current hours and a directions link beside the restaurant address.', fixBn: 'ঠিকানার পাশে বর্তমান সময়সূচি ও দিকনির্দেশনার লিংক দিন।' },
    { en: 'Guests can request a table on a phone.', bn: 'অতিথিরা ফোন থেকে টেবিলের জন্য অনুরোধ করতে পারেন।', fix: 'Give guests a clear reservation link that works on a narrow screen.', fixBn: 'ছোট স্ক্রিনেও ব্যবহার করা যায় এমন রিজার্ভেশন লিংক দিন।' },
    { en: 'Guests know whether a table is confirmed or pending.', bn: 'টেবিল নিশ্চিত হয়েছে নাকি অপেক্ষমাণ, অতিথিরা বুঝতে পারেন।', fix: 'Show the request status and what guests should expect after submitting.', fixBn: 'অনুরোধের অবস্থা ও পরবর্তী ধাপ জানিয়ে দিন।' },
    { en: 'Staff can receive and answer a test request.', bn: 'কর্মীরা পরীক্ষামূলক অনুরোধ গ্রহণ ও উত্তর দিতে পারেন।', fix: 'Send a test reservation and check that the right person receives it.', fixBn: 'একটি পরীক্ষামূলক রিজার্ভেশন পাঠিয়ে দেখুন সঠিক ব্যক্তি পান কি না।' },
];

const scorecardUrl = `https://www.rizqara.tech${restaurant.path}#restaurant-scorecard`;

export function RestaurantScorecard({ bn }: { bn: boolean }) {
    const [passed, setPassed] = useState<Set<number>>(new Set());
    const [shareStatus, setShareStatus] = useState('');
    const section = useRef<HTMLElement>(null);

    useEffect(() => {
        if (window.location.hash === '#restaurant-scorecard') section.current?.scrollIntoView();
    }, []);

    const tracked = useRef(false);
    useEffect(() => {
        const element = section.current;
        if (!element) return;
        let visible = false;
        const record = () => {
            if (!visible || tracked.current || !readConsent().analytics) return;
            tracked.current = true;
            rememberScorecardCampaign();
            trackGrowth('restaurant_scorecard_view');
        };
        // Capture tagged arrivals even if they choose a quote before scrolling to the tool.
        if (readConsent().analytics) rememberScorecardCampaign();
        const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; record(); });
        observer.observe(element);
        window.addEventListener('rizqara-consent-change', record);
        return () => {
            observer.disconnect();
            window.removeEventListener('rizqara-consent-change', record);
        };
    }, []);

    const next = checks.find((_, index) => !passed.has(index));

    async function share() {
        try {
            if (navigator.share) {
                await navigator.share({ title: 'Restaurant website scorecard', url: scorecardUrl });
                return;
            }
            await navigator.clipboard.writeText(scorecardUrl);
            setShareStatus(bn ? 'স্কোরকার্ডের লিংক কপি হয়েছে।' : 'Scorecard link copied.');
        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') return;
            setShareStatus(bn ? 'লিংক কপি করা যায়নি। নিচের লিংকটি ব্যবহার করুন।' : 'Could not copy the link. Use the scorecard link below.');
        }
    }

    return (
        <section ref={section} id="restaurant-scorecard" aria-labelledby="scorecard-title" className="mt-12 scroll-mt-28 rounded-[22px] border border-[#e8d7df] bg-[#fbf5f7] p-5 sm:p-8">
            <div className="max-w-2xl">
                <h2 id="scorecard-title">{bn ? 'রেস্তোরাঁর ওয়েবসাইট স্কোরকার্ড' : 'Restaurant website scorecard'}</h2>
                <p>{bn ? 'ফোনে আপনার সাইট খুলুন এবং যে পরীক্ষাগুলোতে পাস করেছে সেগুলো চিহ্নিত করুন। কোনো অ্যাকাউন্ট লাগবে না।'
                    : 'Open your site on a phone and tick each check it passes. No account required.'}</p>
            </div>
            <div className="grid gap-5 md:grid-cols-[1.35fr_1fr]">
                <fieldset className="grid min-w-0 gap-2">
                    <legend className="sr-only">{bn ? 'ওয়েবসাইটের পরীক্ষা' : 'Website checks'}</legend>
                    {checks.map((check, index) => (
                        <label key={check.en} className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#e8d7df] bg-white px-4 py-3 text-sm leading-relaxed">
                            <input type="checkbox" checked={passed.has(index)} className="mt-0.5 size-5 shrink-0 accent-[#701b32]"
                                onChange={event => {
                                    const checked = event.currentTarget.checked;
                                    setPassed(current => {
                                        const updated = new Set(current);
                                        if (checked) updated.add(index);
                                        else updated.delete(index);
                                        return updated;
                                    });
                                }} />
                            <span>{bn ? check.bn : check.en}</span>
                        </label>
                    ))}
                </fieldset>
                <div className="min-w-0 rounded-2xl border border-[#e8d7df] bg-white p-5">
                    <p className="!mb-2 text-sm font-semibold" aria-live="polite">
                        <strong className="mr-2 text-3xl text-[#631c37]">{passed.size}/{checks.length}</strong>
                        {bn ? 'টি পরীক্ষায় পাস' : 'checks passing'}
                    </p>
                    <progress className="w-full accent-[#701b32]" value={passed.size} max={checks.length}
                        aria-label={bn ? 'পরীক্ষার ফলাফল' : 'Checks passing'} />
                    <h3 className="mt-4">{next ? (bn ? 'পরবর্তী করণীয়' : 'What to check next') : (bn ? 'সব পরীক্ষায় পাস' : 'All checks passing')}</h3>
                    <p>{next ? (bn ? next.fixBn : next.fix) : (bn ? 'ব্যস্ত সময়ে আবার পরীক্ষা করুন।' : 'Repeat the exercise during a busy service to check the staff handoff.')}</p>
                    <div className="flex flex-wrap items-center gap-3">
                        <button type="button" className="rq-restaurant-quote" onClick={() => void share()}>
                            <Share2 size={16} aria-hidden="true" />
                            {bn ? 'স্কোরকার্ড শেয়ার করুন' : 'Share scorecard'}
                        </button>
                        <Link className="font-semibold text-[#742b48] underline" to={restaurant.quotePath} onClick={() => trackGrowth('restaurant_quote_clicked')}>
                            {bn ? 'কোট নিন' : 'Get a quote'}
                        </Link>
                    </div>
                    <p role="status" className="!mb-0 mt-2 text-sm">{shareStatus}</p>
                    <a className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#742b48] underline" href={scorecardUrl}>
                        <Clipboard size={14} aria-hidden="true" /> {bn ? 'স্কোরকার্ড লিংক' : 'Scorecard link'}
                    </a>
                </div>
            </div>
        </section>
    );
}
