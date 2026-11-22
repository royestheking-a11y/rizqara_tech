import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Search } from 'lucide-react';
import { useData } from '../../context/DataContext';
import concepts from '../../data/project-concepts.json';
import { selectedConcepts } from '../../data/selected-concepts';
import { DocumentedWork } from './DocumentedWork';
import { getSlug } from '../../utils/content';
import '../../styles/project-showcase.css';

const archiveIds = new Set(concepts.map(project => project.id));
const categoryLabels: Record<string, string> = {
  'Mobile App': 'মোবাইল অ্যাপ', Website: 'ওয়েবসাইট', 'Business Software': 'ব্যবসায়িক সফটওয়্যার',
  'Web Application': 'ওয়েব অ্যাপ্লিকেশন', 'E-commerce': 'ই-কমার্স', 'Tablet App': 'ট্যাবলেট অ্যাপ',
  'AI Automation': 'এআই অটোমেশন', 'UI/UX Design': 'ইউআই/ইউএক্স ডিজাইন', 'Analytics Dashboard': 'অ্যানালিটিক্স ড্যাশবোর্ড',

};

export function ProjectShowcase({ preview = false }: { preview?: boolean }) {
  const { projects, language } = useData();
  const bn = language === 'bn';
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [filter, setFilter] = useState('');
  const [limit, setLimit] = useState(12);
  const Heading = preview ? 'h2' : 'h1';

  const curatedIds = new Set(selectedConcepts.map(concept => concept.id));
  const curated = selectedConcepts.flatMap(concept => projects.filter(project => project.id === concept.id));
  const work = projects.filter(project => !curatedIds.has(project.id) &&
    (!archiveIds.has(project.id) || project.status !== 'Concept' || (project.__v ?? 0) > 0));
  const all = [...work, ...curated];
  const categories = [...new Set(all.map(project => project.category))];
  const filtered = all.filter(project =>
    (!filter || project.category === filter) &&
    [project.title, project.title_bn, project.description, project.description_bn, project.category, categoryLabels[project.category]]
      .join(' ').toLowerCase().includes(query.trim().toLowerCase()),
  );
  const shown = preview ? all.slice(0, 9) : filtered.slice(0, limit);

  return (
    <section className={`rq-work rq-portfolio ${preview ? 'rq-work-preview' : 'rq-work-page'} container mx-auto px-6`}>
      <header className="rq-work-heading">
        <div>
          <Heading>{bn ? 'নির্বাচিত প্রজেক্ট' : 'Selected projects'}</Heading>
          <p>{bn
            ? 'মোবাইল অ্যাপ, ওয়েবসাইট এবং দৈনন্দিন কাজের সফটওয়্যারের ডিজাইন দেখুন।'
            : 'Explore the interfaces and workflows behind mobile apps, websites, and software for everyday operations.'}</p>
        </div>
        <Link className="rq-work-button" to={preview ? '/projects' : '/case-studies'}>
          {preview ? (bn ? 'সব প্রজেক্ট' : 'All projects') : (bn ? 'কেস স্টাডি' : 'Case studies')} <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </header>
      <DocumentedWork />
      <h2 className="rq-portfolio-gallery-heading">{bn ? 'ডিজাইন কনসেপ্ট ও অন্যান্য প্রজেক্ট' : 'Design concepts and other projects'}</h2>
      {!preview && (
        <div className="rq-work-tools">
          <div className="rq-work-tabs" aria-label={bn ? 'প্রজেক্টের ধরন' : 'Project categories'}>
            {['', ...categories].map(category => (
              <button type="button" aria-pressed={filter === category} key={category} onClick={() => {
                setFilter(category);
                setLimit(12);
              }}>
                {category ? (bn ? categoryLabels[category] || category : category) : (bn ? 'সব' : 'All')}
              </button>
            ))}
          </div>
          <label className="rq-work-search">
            <Search size={17} aria-hidden="true" />
            <input aria-label={bn ? 'প্রজেক্ট খুঁজুন' : 'Search projects'} placeholder={bn ? 'প্রজেক্ট খুঁজুন' : 'Search projects'}
              value={query} onChange={event => { setQuery(event.target.value); setLimit(12); }} />
          </label>
        </div>
      )}
      <div className="rq-work-grid">
        {shown.map(project => {
          const concept = selectedConcepts.find(item => item.id === project.id);
          const category = bn ? categoryLabels[project.category] || project.category : project.category;
          return (
            <Link className="rq-work-card" key={project.id} to={`/projects/${getSlug(project)}`}>
              <div className="rq-work-art">
                <img src={project.image} alt={concept?.imageAlt || ''} width="1200" height="800" loading="lazy" decoding="async" />
              </div>
              <div className="rq-work-copy">
                <div>
                  <span className="rq-portfolio-type">{category}{project.status === 'Concept' && (
                    <> · {bn ? 'ডিজাইন কনসেপ্ট' : 'Design concept'}</>
                  )}</span>
                  <h3>{bn ? project.title_bn || project.title : project.title}</h3>
                  <p>{bn ? project.description_bn || project.description : project.description}</p>
                </div>
                <ArrowUpRight size={20} aria-hidden="true" />
              </div>
            </Link>
          );
        })}
      </div>
      {!shown.length && <div className="rq-work-empty" role="status">{bn ? 'কোনো প্রজেক্ট পাওয়া যায়নি।' : 'No matching projects.'}</div>}
      {!preview && filtered.length > limit && (
        <button type="button" className="rq-work-more" onClick={() => setLimit(previous => previous + 12)}>
          {bn ? 'আরও প্রজেক্ট দেখুন' : 'Show more projects'}
        </button>
      )}
    </section>
  );
}
