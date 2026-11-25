import { BlogJournal } from './BlogJournal';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Play, Pause, ArrowRight } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { getSlug } from '../../utils/content';
import { techStack } from '../../data/techStack';
import '../../styles/home-editorial.css';
export function EditorialSection({ kind }: { kind: 'videos' | 'blogs' }) {
 const { videos, language, secondaryLoading } = useData();
 const bn = language === 'bn';
 if (kind === 'blogs') return <BlogJournal preview />;

 return (
  <section className="rq-editorial rq-editorial-film container mx-auto px-6" id="latest-insights">
   <header>
    <div>
     <span className="rq-ed-eyebrow">RIZQARA / IN MOTION</span>
     <h2>{bn ? 'প্রযুক্তি, নতুন দৃষ্টিতে।' : <>Ideas worth<br/><em>seeing in action.</em></>}</h2>
     <p>{bn ? 'আমাদের কাজ, প্রযুক্তি ও প্রোডাক্টের গল্প।' : 'Latest Insights — a closer look at the products, ideas, and technology behind our work.'}</p>
    </div>
    <Link to="/videos">{bn ? 'সব দেখুন' : 'Explore the screening room'} <ArrowUpRight size={19} /></Link>
   </header>
   {videos.length ? <div className="rq-ed-grid">
    {videos.slice(0, 3).map((video, index) => {
     const title = (bn && video.title_bn) || video.title;
     return (
      <Link className={`rq-ed-card rq-ed-card-${index}`} key={video.id} to={`/videos/${getSlug(video)}`}>
       <div className="rq-ed-art">
        <img src={video.thumbnail} alt={title} width="1200" height="800" loading="lazy" />
        <span className="rq-ed-play"><Play size={22} fill="currentColor" /></span>
        <span className="rq-ed-art-arrow"><ArrowUpRight size={21} /></span>
       </div>
       <div className="rq-ed-copy">
        <div className="rq-ed-meta"><span>{(bn && video.category_bn) || video.category || 'SHOWCASE'}</span><span>WATCH THE STORY</span></div>
        <h3>{title}</h3>
        <p>{(bn && video.description_bn) || video.description}</p>
        <span className="rq-ed-read">{bn ? 'বিস্তারিত দেখুন' : 'Watch the showcase'} <ArrowRight size={15} /></span>
       </div>
      </Link>
     );
    })}
   </div> : <p role="status">{secondaryLoading ? 'Loading stories…' : 'New stories are coming soon.'}</p>}
  </section>
 );
}
const groups=[{label:'All',start:0,end:100},{label:'Design',start:0,end:4},{label:'Engineering',start:4,end:15},{label:'Cloud & AI',start:15,end:100}];
export function TechnologyExperience(){const {language}=useData();const bn=language==='bn';const [group,setGroup]=useState(0),[paused,setPaused]=useState(false),[visible,setVisible]=useState(false);const root=useRef<HTMLElement>(null);
 useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.1});if(root.current)observer.observe(root.current);return()=>observer.disconnect();},[]);
 const shown=techStack.slice(groups[group].start,groups[group].end);
 return <section ref={root} id="technology" className={`rq-tech-experience container mx-auto px-6 ${paused||!visible?'rq-tech-paused':''}`}><div className="rq-tech-panel"><div className="rq-tech-intro"><span className="rq-ed-eyebrow">RIZQARA / ENGINEERING ECOSYSTEM</span><h2>{bn?'প্রযুক্তি একসাথে। সম্ভাবনা অসীম।':<>Built with purpose.<br/><em>Connected by design.</em></>}</h2><p>{bn?'ডিজাইন থেকে ডেপ্লয়মেন্ট—আমাদের প্রযুক্তির জগৎ দেখুন।':'Our Tech Stack — explore the tools that connect design, engineering, cloud infrastructure, and intelligence.'}</p><div className="rq-tech-orbit" aria-hidden="true"><i/><i/><i/><div>RQ<span>TECH CORE</span></div><b className="rq-tech-satellite satellite-a">&lt;/&gt;</b><b className="rq-tech-satellite satellite-b">AI</b><b className="rq-tech-satellite satellite-c">UI</b></div><button className="rq-tech-pause" aria-pressed={paused} onClick={()=>setPaused(v=>!v)}>{paused?<Play size={14}/>:<Pause size={14}/>} {paused?'Resume motion':'Pause motion'}</button></div><div className="rq-tech-library"><div className="rq-tech-filters" aria-label="Filter technologies">{groups.map((g,i)=><button key={g.label} aria-pressed={group===i} onClick={()=>setGroup(i)}>{g.label}</button>)}</div><div className="rq-tech-grid">{shown.map(t=><div className="rq-tech-tile" key={t.name}><div>{t.logo}</div><span>{t.name}</span></div>)}</div><div className="rq-tech-footnote"><span>DESIGN → BUILD → CONNECT → DEPLOY</span><Link to="/services">Explore our capabilities <ArrowUpRight size={15}/></Link></div></div></div></section>;
}
