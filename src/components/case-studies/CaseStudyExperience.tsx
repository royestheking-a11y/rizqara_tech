import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { useData, CaseStudy } from '../../context/DataContext';
import initialCaseStudies from '../../data/case-studies.json';
import { selectedConcepts } from '../../data/selected-concepts';
import { getSlug } from '../../utils/content';
import { SEO } from '../SEO';
import '../../styles/case-study-experience.css';

export function CaseStudyExperience({page=false}:{page?:boolean}) {
  const { caseStudies, projects, language, secondaryLoading } = useData();
  const [active, setActive] = useState(0);
  const bn = language === 'bn';
  const list = caseStudies && caseStudies.length > 0 ? caseStudies : (initialCaseStudies as CaseStudy[]);
  const study = list[active] || list[0];
  const Heading = page ? 'h1' : 'h2';
  const local = (en: string, bengali?: string) => bn ? (bengali || en) : en;

  if (!study) {
    return secondaryLoading ? (
      <section className="rq-studies container mx-auto px-6" role="status">
        {bn ? 'কেস স্টাডি লোড হচ্ছে…' : 'Loading case studies…'}
      </section>
    ) : page ? (
      <section className="rq-studies container mx-auto px-6">
        <h1>{bn ? 'কেস স্টাডি' : 'Case studies'}</h1>
        <p>{bn ? 'শীঘ্রই নতুন কেস স্টাডি আসছে।' : 'New case studies are coming soon.'}</p>
      </section>
    ) : null;
  }

  const title = local(study.title, study.title_bn);

  return (
    <section id={page ? undefined : 'case-studies'} className={`rq-studies container mx-auto px-6 ${page ? 'rq-studies-page' : ''}`}>
      {page && (
        <SEO
          title="Case Studies | RizQara Tech"
          description="Read project case studies and independent design walkthroughs from RizQara Tech."
          canonical="https://www.rizqara.tech/case-studies"
        />
      )}
      <header className="rq-studies-header">
        <div>
          <span className="rq-studies-eyebrow">RIZQARA / {bn ? 'কাজের গল্প' : 'BEHIND THE WORK'}</span>
          <Heading>{bn ? 'কেস স্টাডি' : 'Case studies'}</Heading>
          <p>{bn ? 'চ্যালেঞ্জ থেকে সমাধান—আমাদের কাজের সিদ্ধান্ত ও ফলাফল দেখুন।' : 'Read about the problem, the design decisions, and what was checked.'}</p>
        </div>
        {!page && (
          <Link className="rq-studies-all" to="/case-studies">
            {bn ? 'সব কেস স্টাডি' : 'All case studies'} <ArrowUpRight size={18} />
          </Link>
        )}
      </header>

      <div className="rq-study-picker" aria-label={bn ? 'কেস স্টাডি বেছে নিন' : 'Choose a case study'}>
        {list.map((s, i) => (
          <button key={s.id} aria-pressed={study.id === s.id} onClick={() => setActive(i)}>
            <span>{String(i + 1).padStart(2, '0')}</span>
            <img src={s.image} alt="" loading="lazy" />
            <strong>{local(s.title, s.title_bn).split(':')[0]}</strong>
            <ArrowUpRight size={16} />
          </button>
        ))}
      </div>

      <div className="rq-study-feature" key={study.id}>
        <Link to={`/case-studies/${getSlug(study)}`} className="rq-study-cover">
          <img src={study.image} alt={title} width="1200" height="900" />
          <span className="rq-study-cover-caption">
            <span>RIZQARA TECH / CASE STUDY</span>
            <ArrowUpRight size={23} />
          </span>
        </Link>
        <div className="rq-study-story">
          <span className="rq-studies-eyebrow">{local(study.category, study.category_bn)}</span>
          <h3>{title}</h3>
          <p>{local(study.description, study.description_bn)}</p>
          <div className="rq-study-tech">
            {study.tech?.slice(0, 5).map(t => <span key={t}>{t}</span>)}
          </div>
          <Link className="rq-study-read" to={`/case-studies/${getSlug(study)}`}>
            {bn ? 'সম্পূর্ণ কেস স্টাডি পড়ুন' : 'Read the full story'} <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>

      <div className="rq-study-chapters">
        {[
          { label: bn ? 'চ্যালেঞ্জ' : 'The challenge', text: local(study.problem, study.problem_bn) },
          { label: bn ? 'সমাধান' : 'Our approach', text: local(study.solution, study.solution_bn) },
          { label: bn ? 'প্রভাব' : 'The outcome', text: local(study.impact, study.impact_bn) }
        ].filter(c => c.text).map((c, i) => (
          <div key={c.label}>
            <span>0{i + 1} / {c.label}</span>
            <p>{c.text}</p>
          </div>
        ))}
      </div>

      <div className="rq-study-navigation">
        <span>{String(list.indexOf(study) + 1).padStart(2, '0')} <i>/ {String(list.length).padStart(2, '0')}</i></span>
        <p>{bn ? 'আরও কাজের গল্প দেখুন' : 'Every project brings a new perspective.'}</p>
        <div>
          <button aria-label={bn ? 'আগের কেস স্টাডি' : 'Previous case study'} onClick={() => setActive((list.indexOf(study) - 1 + list.length) % list.length)}>
            <ArrowLeft size={18} />
          </button>
          <button aria-label={bn ? 'পরের কেস স্টাডি' : 'Next case study'} onClick={() => setActive((list.indexOf(study) + 1) % list.length)}>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {page && (
        <div className="rq-study-grid-section">
          <div className="rq-study-grid-header">
            <h2>{bn ? 'প্রজেক্ট কেস স্টাডি' : 'Project case studies'}</h2>
          </div>
          <div className="rq-study-cards-grid">
            {list.map((s, i) => (
              <Link key={s.id} to={`/case-studies/${getSlug(s)}`} className="rq-study-card group">
                <div className="rq-study-card-image">
                  <img src={s.image} alt={local(s.title, s.title_bn)} loading="lazy" />
                  <span className="rq-study-card-num">0{i + 1}</span>
                </div>
                <div className="rq-study-card-body">
                  <span className="rq-study-card-cat">{local(s.category, s.category_bn)?.split(',')[0]}</span>
                  <h3 className="rq-study-card-title">{local(s.title, s.title_bn)}</h3>
                  <p className="rq-study-card-desc">{local(s.description, s.description_bn)}</p>
                  <div className="rq-study-card-footer">
                    <span>{bn ? 'সম্পূর্ণ স্টোরি পড়ুন' : 'Read Case Study'}</span>
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      {page && (
        <div className="rq-study-grid-section">
          <div className="rq-study-grid-header">
            <h2>{bn ? 'স্বাধীন ডিজাইন কনসেপ্ট' : 'Independent design studies'}</h2>
            <p>{bn ? 'প্রস্তাবিত কাজের ধাপ ও পরীক্ষার পরিকল্পনা।' : 'Proposed workflows and what we would test with users.'}</p>
          </div>
          <div className="rq-study-cards-grid">
            {selectedConcepts.flatMap(selected => projects.filter(project => project.id === selected.id && project.status === 'Concept')).map(concept => (
              <Link key={concept.id} to={`/projects/${getSlug(concept)}`} className="rq-study-card group">
                <div className="rq-study-card-image">
                  <img src={concept.image} alt={selectedConcepts.find(selected => selected.id === concept.id && selected.image === concept.image)?.imageAlt || ''} width="1200" height="800" loading="lazy" />
                </div>
                <div className="rq-study-card-body">
                  <span className="rq-study-card-cat">{concept.category}</span>
                  <h3 className="rq-study-card-title">{concept.title}</h3>
                  <p className="rq-study-card-desc">{concept.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
