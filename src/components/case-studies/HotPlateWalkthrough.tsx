import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import restaurant from '../../../shared/restaurant-service.json';

export function HotPlateWalkthrough({ bn }: { bn: boolean }) {
    return (
        <section className="my-10 grid gap-6 rounded-2xl border border-[#e8d7df] bg-[#fbf5f7] p-4 sm:p-6 md:grid-cols-[minmax(0,230px)_1fr]"
            aria-labelledby="hot-plate-walkthrough">
            <video controls playsInline preload="none" width="720" height="1280"
                poster="/media/hot-plate-reservation-poster.webp" className="mx-auto aspect-[9/16] w-full max-w-[245px] rounded-xl bg-[#251014]"
                aria-label={bn ? 'হট প্লেট রিজার্ভেশন ভিডিও' : 'Hot Plate reservation walkthrough'}>
                <source src="/media/hot-plate-reservation-walkthrough.mp4" type="video/mp4" />
            </video>
            <div className="self-center">
                <h2 id="hot-plate-walkthrough" className="text-2xl font-bold text-[#361928]">
                    {bn ? 'হট প্লেটের মেনু ও রিজার্ভেশন' : 'From menu to table request'}
                </h2>
                <p className="my-3 leading-relaxed text-[#604552]">{bn
                    ? 'হট প্লেটের মূল স্ক্রিনশট দিয়ে তৈরি ৪৫ সেকেন্ডের ওয়াকথ্রু।'
                    : 'A 45-second walkthrough of the original Hot Plate menu and reservation screens.'}</p>
                <details className="mb-4 text-sm leading-relaxed text-[#604552]">
                    <summary className="cursor-pointer font-semibold">{bn ? 'ভিডিওর সারাংশ' : 'Read the walkthrough'}</summary>
                    <ol className="mt-2 list-decimal space-y-1 pl-5">
                        <li>{bn ? 'অতিথিরা বিভাগ অনুযায়ী মেনু দেখতে পারেন।' : 'Guests can browse dishes by category.'}</li>
                        <li>{bn ? 'রিজার্ভেশন ফর্মে যোগাযোগের তথ্য, তারিখ, সময় ও অতিথির সংখ্যা দেওয়া যায়।' : 'The form asks for contact details, preferred date and time, and party size.'}</li>
                        <li>{bn ? 'কর্মীরা অনুরোধ পর্যালোচনা করলে অতিথিকে জানান কখন উত্তর পাবেন।' : 'If staff review requests, tell guests when and how they’ll hear back.'}</li>
                    </ol>
                </details>
                <Link to={`${restaurant.path}?utm_source=case_study&utm_medium=website&utm_campaign=hot_plate_walkthrough#restaurant-scorecard`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#631c37] px-4 py-3 text-sm font-semibold text-white">
                    {bn ? 'বিনামূল্যে স্কোরকার্ড ব্যবহার করুন' : 'Run the free six-point check'} <ArrowRight size={17} aria-hidden="true" />
                </Link>
            </div>
        </section>
    );
}
