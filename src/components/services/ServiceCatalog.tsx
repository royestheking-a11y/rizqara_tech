import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Search, ArrowUpRight } from 'lucide-react';
import catalog from '../../../shared/service-catalog.json';
import { useData } from '../../context/DataContext';
import { getSlug } from '../../utils/content';
import '../../styles/service-catalog.css';

function Artwork({ category, small = false }: { category: typeof catalog.categories[number]; small?: boolean }) {
  return <img src={category.image} srcSet={`${category.image.replace('.webp', '-card.webp')} 640w, ${category.image} 1200w`} sizes={small ? '(max-width: 700px) 100vw, 33vw' : '(max-width: 900px) 100vw, 40vw'} alt={category.imageAlt} width="1200" height="800" loading="lazy" decoding="async" />;
}

export function ServiceCategoryPreview() {
  const { language } = useData();
  const bn = language === 'bn';
  return <section data-rq-reveal className="rq-catalog rq-catalog-preview container mx-auto px-6">
    <div className="rq-catalog-heading"><div><span className="rq-catalog-eyebrow">{bn ? 'আমাদের দক্ষতা' : 'OUR EXPERTISE'}</span><h2>{bn ? 'আপনার পরবর্তী লক্ষ্য। আমাদের দক্ষতা।' : 'Your next ambition. Our expertise.'}</h2><p>{bn ? '৭টি বিভাগে ৪৪টি সেবা—একটি সংযুক্ত প্রযুক্তি সহযোগী।' : '44 core offerings. Seven disciplines. One connected technology partner.'}</p></div><Link className="rq-catalog-link" to="/services">{bn ? 'সব সেবা দেখুন' : 'Explore all services'} <ArrowRight size={18}/></Link></div>
    <div className="rq-category-grid">{catalog.categories.map(c => <Link to={`/services#${c.id}`} key={c.id} className="rq-category-card">
      <div className="rq-category-art"><Artwork category={c} small/><span className="rq-category-number">0{c.order}</span><span className="rq-category-arrow"><ArrowUpRight size={22}/></span></div>
      <div className="rq-category-copy"><span className="rq-catalog-eyebrow">{c.offerings.length} {bn ? 'টি সেবা' : 'CORE OFFERINGS'}</span><h3>{bn ? c.title_bn : c.title}</h3><p>{bn ? c.description_bn : c.description}</p><ul>{c.offerings.slice(0,3).map(o=><li key={o.key}>{bn ? o.title_bn : o.title}</li>)}</ul><span className="rq-category-explore">{bn ? 'বিভাগটি দেখুন' : 'Explore this discipline'} <ArrowRight size={16}/></span></div>
    </Link>)}</div>
  </section>;
}

export function ServiceCatalogPage() {
  const { services, language, loading } = useData();
  const bn = language === 'bn';
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash || loading) return;
    const id = decodeURIComponent(hash.slice(1));
    const frame = requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({block:'start'}));
    return ()=>cancelAnimationFrame(frame);
  }, [hash, loading]);
  const q = query.trim().toLocaleLowerCase();
  const groups = catalog.categories.map(category => ({category, items:services.filter(s=>s.categoryId === category.id && (!q || `${s.title} ${s.title_bn} ${s.description} ${s.description_bn} ${category.title}`.toLocaleLowerCase().includes(q))).sort((a,b)=>(a.displayOrder??9999)-(b.displayOrder??9999))})).filter(g=>(filter==='all'||g.category.id===filter)&&g.items.length);
  const ungrouped=services.filter(s=>!catalog.categories.some(c=>c.id===s.categoryId)&&(!q||`${s.title} ${s.description}`.toLowerCase().includes(q)));
  const resultCount=groups.reduce((n,g)=>n+g.items.length,0)+(filter==='all'?ungrouped.length:0);
  return <div className="rq-catalog rq-catalog-page container mx-auto px-6">
    <header className="rq-catalog-intro"><span className="rq-catalog-eyebrow">RIZQARA TECH / {bn ? 'আমাদের সেবাসমূহ' : 'OUR SERVICES'}</span><h1>{bn ? 'ভাবনা থেকে বাস্তবায়ন।' : <>From possibility<br/>to <em>what’s next.</em></>}</h1><p>{bn ? 'সফটওয়্যার, এআই, ডিজাইন ও প্রবৃদ্ধির জন্য একটি সমন্বিত দল। আপনার প্রয়োজনের সমাধানটি বেছে নিন।' : 'Software, intelligence, design, and growth—built around your business. Find the expertise to move your next idea forward.'}</p><div className="rq-catalog-stats"><span><strong>07</strong> {bn ? 'সেবা বিভাগ' : 'service disciplines'}</span><span><strong>44</strong> {bn ? 'মূল সেবা' : 'core offerings'}</span></div></header>
    <div className="rq-catalog-tools"><label className="rq-service-search"><Search size={19}/><input aria-label={bn?'সেবা খুঁজুন':'Search services'} placeholder={bn?'কোন সেবাটি প্রয়োজন?':'What would you like to build?'} value={query} onChange={e=>setQuery(e.target.value)}/></label><label className="rq-category-select"><span className="sr-only">{bn?'সেবার বিভাগ':'Service category'}</span><select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">{bn?'সব বিভাগ':'All disciplines'}</option>{catalog.categories.map(c=><option key={c.id} value={c.id}>{bn?c.title_bn:c.title}</option>)}</select></label></div>
    {loading && !services.length ? <p role="status">{bn?'সেবাসমূহ লোড হচ্ছে…':'Loading services…'}</p> : <>
      <p className="rq-catalog-result" aria-live="polite">{resultCount} {bn?'টি সেবা পাওয়া গেছে':resultCount===1?'service available':'services available'}</p>
      {groups.map(({category:c,items})=><section id={c.id} key={c.id} className="rq-service-discipline"><div className="rq-discipline-visual"><div className="rq-discipline-image"><Artwork category={c}/><span className="rq-category-number">0{c.order} / 07</span></div><span className="rq-catalog-eyebrow">{bn?'আমাদের দক্ষতা':'THE DISCIPLINE'}</span><h2>{bn?c.title_bn:c.title}</h2><p>{bn?c.description_bn:c.description}</p><Link to="/contact" className="rq-catalog-link">{bn?'প্রজেক্ট নিয়ে আলোচনা করুন':'Discuss your project'} <ArrowUpRight size={18}/></Link></div><div className="rq-offering-list">{items.map((s,i)=><Link key={s.id} to={`/services/${getSlug(s)}`} className="rq-offering"><span className="rq-offering-index">{String(i+1).padStart(2,'0')}</span><div><h3>{bn?(s.title_bn||s.title):s.title}</h3><p>{bn?(s.description_bn||s.description):s.description}</p>{!s.catalogKey&&<span className="rq-specialist">{bn?'বিশেষায়িত সেবা':'Specialist capability'}</span>}</div><ArrowUpRight size={20}/></Link>)}</div></section>)}
      {filter==='all'&&ungrouped.length>0&&<section className="rq-other-services"><h2>{bn?'আরও সেবা':'More services'}</h2>{ungrouped.map(s=><Link className="rq-offering" key={s.id} to={`/services/${getSlug(s)}`}>{bn?(s.title_bn||s.title):s.title}<ArrowUpRight size={18}/></Link>)}</section>}
      {!groups.length&&!(filter==='all'&&ungrouped.length)&&<div className="rq-catalog-empty"><h2>{bn?'কোনো সেবা পাওয়া যায়নি':'No matching services'}</h2><p>{bn?'অন্য শব্দ বা বিভাগ দিয়ে খুঁজুন।':'Try another search term or discipline.'}</p><button onClick={()=>{setQuery('');setFilter('all');}}>{bn?'সব সেবা দেখুন':'Show all services'}</button></div>}
    </>}
    <div className="rq-catalog-cta"><span className="rq-catalog-eyebrow">{bn?'একসাথে তৈরি করি':'LET’S BUILD SOMETHING THAT MATTERS'}</span><h2>{bn?'আপনার লক্ষ্য। আমাদের পরবর্তী আলোচনা।':'Your ambition deserves a conversation.'}</h2><Link to="/contact">{bn?'আলোচনা শুরু করুন':'Start a conversation'} <ArrowUpRight size={19}/></Link></div>
  </div>;
}
