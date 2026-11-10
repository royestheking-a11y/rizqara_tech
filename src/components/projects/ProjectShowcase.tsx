import { ConceptPreview } from './ConceptPreview';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Search } from 'lucide-react';
import { useData, Project } from '../../context/DataContext';
import concepts from '../../data/project-concepts.json';
import { getSlug } from '../../utils/content';
import '../../styles/project-showcase.css';
export const projectConcepts = concepts as Project[];
export function ProjectShowcase({preview=false}:{preview?:boolean}) {
 const {projects,language}=useData(); const bn=language==='bn'; const [params]=useSearchParams(); const [query,setQuery]=useState(params.get('q')||''); const [filter,setFilter]=useState('All'); const [limit,setLimit]=useState(12); const [active,setActive]=useState(0);
 const Heading = preview ? 'h2' : 'h1';
 const all=[...projects,...projectConcepts.filter(c=>!projects.some(p=>p.id===c.id))];
 const filtered=all.filter(p=>(filter==='All'||(filter==='Existing work'?p.status!=='Concept':p.status==='Concept'&&p.category===(filter==='Mobile concepts'?'Mobile App':'Website')))&&`${p.title} ${p.description} ${p.category}`.toLowerCase().includes(query.toLowerCase()));
 const spotlight=projects.slice(0,4); const selected=spotlight[active] || projectConcepts[0];
 const shown=preview?[...projects.slice(0,2),...projectConcepts.slice(0,2),...projectConcepts.slice(30,32)]:filtered.slice(0,limit);
 return <section className={`rq-work ${preview?'rq-work-preview':'rq-work-page'} container mx-auto px-6`}>
 <header className="rq-work-heading"><div><span className="rq-work-kicker">RIZQARA / SELECTED WORK & IDEAS</span><Heading>{bn?'ভাবনা। অভিজ্ঞতা। সম্ভাবনা।':<>Digital experiences.<br/><em>Made to stand out.</em></>}</Heading><p>{bn?'আমাদের বর্তমান কাজ এবং স্বাধীন ডিজাইন কনসেপ্ট দেখুন।':'Explore our existing portfolio alongside 50 independent concepts for mobile and the web.'}</p></div>{preview?<Link className="rq-work-button" to="/projects">{bn?'সব প্রজেক্ট দেখুন':'Explore the collection'} <ArrowUpRight size={18}/></Link>:<div className="rq-work-count"><strong>30 / 20</strong><span>MOBILE / WEBSITE CONCEPTS</span></div>}</header>
 <div className="rq-spotlight"><div className="rq-spotlight-story"><span className="rq-work-kicker">IN FOCUS / {String(active+1).padStart(2,'0')}</span><span className="rq-spotlight-category">{selected.category}</span><h3>{selected.title}</h3><p>{selected.description}</p><div className="rq-spotlight-stack">{selected.tech?.slice(0,3).map(t=><span key={t}>{t}</span>)}</div><Link to={`/projects/${getSlug(selected)}`} className="rq-spotlight-cta">Explore the project <ArrowUpRight size={19}/></Link><div className="rq-spotlight-controls">{spotlight.map((p,i)=><button key={p.id} aria-label={`Show featured project ${i+1}: ${p.title}`} aria-pressed={active===i} onClick={()=>setActive(i)}>0{i+1}</button>)}</div></div><Link className="rq-spotlight-visual" to={`/projects/${getSlug(selected)}`}><img key={selected.id} src={selected.image} alt={selected.title}/><span>SELECTED WORK <ArrowUpRight size={20}/></span></Link></div>
 <div className="rq-collection-title"><span>THE COLLECTION</span><p>Explore the craft behind every experience.</p><span>↓</span></div>
 {!preview&&<><div className="rq-work-tools"><div className="rq-work-tabs">{['All','Existing work','Mobile concepts','Website concepts'].map(f=><button aria-pressed={filter===f} key={f} onClick={()=>{setFilter(f);setLimit(12);}}>{f}</button>)}</div><label className="rq-work-search"><Search size={17}/><input aria-label="Search projects" placeholder="Search the collection" value={query} onChange={e=>{setQuery(e.target.value);setLimit(12);}}/></label></div><p className="rq-work-note">{filtered.length} projects · Concept entries are independent visual studies, not completed client commissions.</p></>}
 <div className="rq-work-grid">{shown.map((p,i)=><Link className={`rq-work-card ${i%5===0?'rq-work-featured':''}`} key={p.id} to={`/projects/${getSlug(p)}`}><div className="rq-work-art"><>{p.status==='Concept'?<ConceptPreview project={p}/>:<img src={p.image} alt={p.title} width="1200" height="900" loading="lazy"/>}</><div className="rq-work-labels"><span>{p.category}</span><span>{p.status==='Concept'?'DESIGN CONCEPT':p.status}</span></div><span className="rq-work-open"><ArrowUpRight/></span></div><div className="rq-work-copy"><div><span className="rq-work-index">{String(i+1).padStart(2,'0')} / {p.status==='Concept'?'EXPLORATION':'PORTFOLIO'}</span><h3>{bn?(p.title_bn||p.title):p.title}</h3><p>{(bn?(p.description_bn||p.description):p.description).split(' An independent')[0]}</p><div className="rq-card-features">{p.features?.slice(0,3).map(f=><span key={f}>{f}</span>)}</div></div><span className="rq-work-detail">{bn?'বিস্তারিত':'View project'} ↗</span></div></Link>)}</div>
 {!shown.length&&<div className="rq-work-empty"><h3>No matching projects</h3><button onClick={()=>{setQuery('');setFilter('All');}}>Reset filters</button></div>}
 {!preview&&filtered.length>limit&&<button className="rq-work-more" onClick={()=>setLimit(n=>n+12)}>Show more projects ({filtered.length-limit} remaining)</button>}
 </section>;
}
