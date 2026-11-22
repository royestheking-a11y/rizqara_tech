import { officialSocialLinks } from '../../data/social-links';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { ArrowRight, ArrowUpRight, BookOpen, Download, Facebook, Instagram, Search, X } from 'lucide-react';
import { useData, type Course } from '../../context/DataContext';
import { apiRequest } from '../../utils/api';
import { useDialog } from '../../utils/useDialog';
import { SEO } from '../SEO';
import '../../styles/academy.css';

type PublicCourse = Omit<Course, 'downloadUrl' | 'published' | '__v'>;

const socialPages = [
    { name: 'Facebook', url: officialSocialLinks.facebook, Icon: Facebook },
    { name: 'Instagram', url: officialSocialLinks.instagram, Icon: Instagram },
] as const;

function CourseDownload({ course, close, bn }: { course: PublicCourse; close: () => void; bn: boolean }) {
    const dialog = useDialog(true, close);
    const [opened, setOpened] = useState<string[]>([]);
    const [confirmed, setConfirmed] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [download, setDownload] = useState<{ url: string; filename?: string } | null>(null);
    useEffect(() => {
        if (download?.filename) return () => URL.revokeObjectURL(download.url);
    }, [download]);

    async function unlock(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (busy || !confirmed || opened.length !== socialPages.length) return;
        setBusy(true);
        setError('');
        try {
            const response = await apiRequest(`academy/${encodeURIComponent(course.id)}/download`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ confirmedFollow: true }),
            });
            const { url, resource } = await response.json();
            if (resource) {
                const file = new Blob([resource.content], { type: 'text/markdown;charset=utf-8' });
                setDownload({ url: URL.createObjectURL(file), filename: resource.filename });
            } else {
                setDownload({ url });
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Unable to open the resource. Try again.');
        } finally {
            setBusy(false);
        }
    }

    return createPortal(
        <div className="rq-academy-overlay">
            <div ref={dialog} className="rq-academy-dialog" role="dialog" aria-modal="true" aria-labelledby="academy-download-title" tabIndex={-1}>
                <button className="rq-academy-close" type="button" onClick={close} aria-label={bn ? 'বন্ধ করুন' : 'Close'}><X size={20} /></button>
                <h2 id="academy-download-title">{course.title}</h2>
                {download ? (
                    <div role="status">
                        <p>{bn ? 'কোর্সের লিংক প্রস্তুত।' : 'Your course link is ready.'}</p>
                        <a className="rq-academy-button" href={download.url} download={download.filename} target={download.filename ? undefined : '_blank'} rel="noopener noreferrer">
                            <Download size={17} aria-hidden="true" /> {bn ? 'ডাউনলোড লিংক খুলুন' : download.filename ? 'Download lesson pack' : 'Open course download'}
                        </a>
                    </div>
                ) : (
                    <form onSubmit={unlock}>
                        <p>{bn ? 'দুটি পেজে গিয়ে ফলো করুন, এরপর এখানে নিশ্চিত করুন।' : 'Open and follow both RizQara Tech pages, then return here to confirm.'}</p>
                        <div className="rq-academy-social">
                            {socialPages.map(({ name, url, Icon }) => (
                                <a key={name} href={url} target="_blank" rel="noopener noreferrer" onClick={() => setOpened(current => [...new Set([...current, name])])}>
                                    <Icon size={18} aria-hidden="true" /> {name} <ArrowUpRight size={15} aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                        <label className="rq-academy-confirm">
                            <input type="checkbox" checked={confirmed} disabled={opened.length !== socialPages.length || busy}
                                onChange={event => setConfirmed(event.target.checked)} />
                            {bn ? 'আমি Facebook ও Instagram-এ ফলো করেছি।' : 'I followed RizQara Tech on Facebook and Instagram.'}
                        </label>
                        {error && <p role="alert" className="rq-academy-error">{error}</p>}
                        <button className="rq-academy-button" type="submit" disabled={!confirmed || opened.length !== socialPages.length || busy}>
                            {busy ? (bn ? 'খোলা হচ্ছে…' : 'Unlocking…') : (bn ? 'কোর্সের লিংক খুলুন' : 'Unlock download')}
                        </button>
                    </form>
                )}
            </div>
        </div>,
        document.body,
    );
}

export function AcademyPage() {
    const { language } = useData();
    const bn = language === 'bn';
    const [courses, setCourses] = useState<PublicCourse[] | null>(null);
    const [error, setError] = useState(false);
    const [attempt, setAttempt] = useState(0);
    const [params] = useSearchParams();
    const sampleCourse = params.get('course') === 'responsive-website-studio';
    const [query, setQuery] = useState('');
    const [onlySampleCourse, setOnlySampleCourse] = useState(sampleCourse);
    const [category, setCategory] = useState('');
    const [selected, setSelected] = useState<PublicCourse | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        setError(false);
        apiRequest('academy/catalog', { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(12000)]), cache: 'no-store' })
            .then(response => response.json())
            .then(data => {
                if (!Array.isArray(data)) throw new Error('Invalid course catalog');
                if (!controller.signal.aborted) setCourses(data);
            })
            .catch(() => { if (!controller.signal.aborted) setError(true); });
        return () => controller.abort();
    }, [attempt]);

    useEffect(() => {
        if (sampleCourse && courses) document.getElementById('academy-catalog-title')?.scrollIntoView();
    }, [sampleCourse, courses]);

    const categories = [...new Set((courses || []).map(course => course.category))];
    const visible = (courses || []).filter(course =>
        (!onlySampleCourse || course.id === 'academy-starter-responsive-web') &&
        (!category || course.category === category) &&
        `${course.title} ${course.description} ${course.level} ${course.category}`.toLowerCase().includes(query.trim().toLowerCase()),
    );

    return (
        <div className="rq-academy">
            <SEO title="RizQara Tech Academy | Courses and Learning Resources"
                description="Explore courses and downloadable learning resources from RizQara Tech Academy."
                canonical="https://www.rizqara.tech/academy" />
            <header className="rq-academy-hero">
                <div>
                    <h1>RizQara Tech Academy</h1>
                    <p>{bn ? 'ডিজাইন, সফটওয়্যার ও প্রযুক্তি শেখার কোর্স এবং রিসোর্স।' : 'Courses and downloadable resources for students learning design, software, and technology.'}</p>
                </div>
                <BookOpen size={110} strokeWidth={1} aria-hidden="true" />
            </header>
            <Link className="rq-academy-card-action rq-academy-sample-link" to="/academy/responsive-web-sample">
                {bn ? 'একটি উন্মুক্ত পাঠ পড়ুন' : 'Try a free sample lesson'} <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <section aria-labelledby="academy-catalog-title" className="rq-academy-catalog">
                <h2 id="academy-catalog-title">{bn ? 'কোর্স ক্যাটালগ' : 'Course catalog'}</h2>
                {error ? <div className="rq-academy-state" role="alert">
                    <p>{bn ? 'কোর্স লোড করা যায়নি।' : 'The course catalog could not load.'}</p>
                    <button className="rq-academy-button" type="button" onClick={() => setAttempt(value => value + 1)}>{bn ? 'আবার চেষ্টা করুন' : 'Try again'}</button>
                </div> : !courses ? <p role="status" className="rq-academy-state">{bn ? 'কোর্স লোড হচ্ছে…' : 'Loading courses…'}</p>
                    : !courses.length ? <p className="rq-academy-state">{bn ? 'নতুন কোর্স প্রকাশ হলে এখানে দেখা যাবে।' : 'New courses will appear here when published.'}</p>
                        : <>
                            {onlySampleCourse && <button className="rq-academy-card-action" type="button" onClick={() => setOnlySampleCourse(false)}>
                                {bn ? 'সব কোর্স দেখুন' : 'Show all courses'}
                            </button>}
                            <div className="rq-academy-filters">
                                <label><Search size={17} aria-hidden="true" /><input type="search" value={query}
                                    aria-label={bn ? 'কোর্স খুঁজুন' : 'Search courses'} placeholder={bn ? 'কোর্স খুঁজুন' : 'Search courses'}
                                    onChange={event => setQuery(event.target.value)} /></label>
                                <select aria-label={bn ? 'কোর্সের বিভাগ' : 'Course category'} value={category} onChange={event => setCategory(event.target.value)}>
                                    <option value="">{bn ? 'সব বিভাগ' : 'All categories'}</option>
                                    {categories.map(item => <option key={item}>{item}</option>)}
                                </select>
                            </div>
                            {visible.length ? <ul className="rq-academy-grid">
                                {visible.map(course => (
                                    <li key={course.id} className="rq-academy-card">
                                        <div className="rq-academy-cover">
                                            {course.image ? <img src={course.image} alt="" width="640" height="360" loading="lazy" />
                                                : <BookOpen size={42} strokeWidth={1.3} aria-hidden="true" />}
                                        </div>
                                        <div className="rq-academy-card-body">
                                            <p className="rq-academy-meta">{course.category} · {course.level}</p>
                                            <h3>{course.title}</h3>
                                            <p>{course.description}</p>
                                            <button className="rq-academy-card-action" type="button" onClick={() => setSelected(course)}>
                                                {bn ? 'কোর্স ডাউনলোড করুন' : 'Get course materials'} <ArrowRight size={17} aria-hidden="true" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul> : <p role="status" className="rq-academy-state">{bn ? 'কোনো কোর্স পাওয়া যায়নি।' : 'No courses match your filters.'}</p>}
                        </>}
            </section>
            {selected && <CourseDownload key={selected.id} course={selected} bn={bn} close={() => setSelected(null)} />}
        </div>
    );
}
