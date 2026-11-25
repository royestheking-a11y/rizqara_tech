import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData, type BlogPost } from '../../context/DataContext';
import { getSlug } from '../../utils/content';
import '../../styles/home-editorial.css';
import '../../styles/journal.css';

function BlogCard({ post, bn, featured = false }: { post: BlogPost; bn: boolean; featured?: boolean }) {
    const date = /^\d{4}-\d{2}-\d{2}$/.test(post.date)
        ? new Intl.DateTimeFormat(bn ? 'bn-BD' : 'en', { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(post.date))
        : post.date;

    return (
        <Link className={`rq-ed-card rq-journal-card${featured ? ' rq-journal-feature' : ''}`} to={`/blog/${getSlug(post)}`}>
            <div className="rq-ed-art">
                <img src={post.image} alt="" width="1200" height="800" loading="lazy" decoding="async" />
            </div>
            <div className="rq-ed-copy">
                <div className="rq-ed-meta">
                    <span>{(bn && post.category_bn) || post.category}</span>
                    <time dateTime={/^\d{4}-\d{2}-\d{2}$/.test(post.date) ? post.date : undefined}>{date}</time>
                </div>
                <h3>{(bn && post.title_bn) || post.title}</h3>
                <p>{(bn && post.excerpt_bn) || post.excerpt}</p>
                <span className="rq-ed-read">{bn ? 'নিবন্ধ পড়ুন' : 'Read article'} <ArrowRight size={16} aria-hidden="true" /></span>
            </div>
        </Link>
    );
}

export function BlogJournal({ preview = false }: { preview?: boolean }) {
    const { blogs, language, secondaryLoading } = useData();
    const [filter, setFilter] = useState('all');
    const [query, setQuery] = useState('');
    const bn = language === 'bn';
    const Heading = preview ? 'h2' : 'h1';
    const isoDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : '';
    const sorted = [...blogs].sort((a, b) => isoDate(b.date).localeCompare(isoDate(a.date)));
    const lead = sorted.find(post => post.slug === 'restaurant-website-checklist') || sorted[0];
    const academy = sorted.find(post => post.slug === 'rizqara-academy-free-courses');
    const highlights = [lead, academy, ...sorted.filter(post => post !== lead && post !== academy)].filter((post): post is BlogPost => Boolean(post));
    const items = preview ? highlights.slice(0, 4) : sorted.filter(post => {
        const story = post.category === 'RizQara Stories';
        return (filter === 'all' || (filter === 'stories' ? story : !story)) &&
            [post.title, post.title_bn, post.excerpt, post.excerpt_bn, post.category, post.category_bn]
                .join(' ').toLowerCase().includes(query.trim().toLowerCase());
    });

    return (
        <section className={`rq-editorial rq-journal container mx-auto px-6${preview ? '' : ' rq-journal-page'}`} id={preview ? 'tech-blog' : undefined}>
            <header>
                <div>
                    <Heading>{bn ? 'রিজকারা জার্নাল' : 'RizQara Journal'}</Heading>
                    <p>{bn ? 'সফটওয়্যার পরিকল্পনা, ওয়েব ডিজাইন ও আমাদের কাজের গল্প।' : 'Practical guides for planning software, improving websites, and learning from projects we’ve documented.'}</p>
                </div>
                {preview && <Link to="/blog">{bn ? 'সব নিবন্ধ' : 'All articles'} <ArrowUpRight size={18} aria-hidden="true" /></Link>}
            </header>
            {!preview && (
                <div className="rq-journal-tools">
                    <div className="rq-journal-tabs" aria-label={bn ? 'নিবন্ধের ধরন' : 'Article type'}>
                        {[
                            ['all', bn ? 'সব নিবন্ধ' : 'All articles'],
                            ['guides', bn ? 'গাইড' : 'Guides'],
                            ['stories', bn ? 'রিজকারার গল্প' : 'RizQara stories'],
                        ].map(([id, label]) => <button key={id} type="button" aria-pressed={filter === id} onClick={() => setFilter(id)}>{label}</button>)}
                    </div>
                    <label className="rq-journal-search">
                        <Search size={17} aria-hidden="true" />
                        <input value={query} onChange={event => setQuery(event.target.value)}
                            aria-label={bn ? 'নিবন্ধ খুঁজুন' : 'Search articles'} placeholder={bn ? 'নিবন্ধ খুঁজুন' : 'Search articles'} />
                    </label>
                </div>
            )}
            {items.length > 0 ? (
                <div className="rq-journal-grid">
                    {items.map((post, index) => <BlogCard key={post.id} post={post} bn={bn} featured={preview && index === 0} />)}
                </div>
            ) : <p role="status">{secondaryLoading ? (bn ? 'লোড হচ্ছে…' : 'Loading articles…') : (bn ? 'কোনো নিবন্ধ পাওয়া যায়নি।' : 'No matching articles.')}</p>}
        </section>
    );
}
