import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import type { Project } from '../../context/DataContext';
import { ConceptPreview } from './ConceptPreview';
import { selectedConcepts } from '../../data/selected-concepts';
import { getSlug } from '../../utils/content';
import { SEO } from '../SEO';
export function ConceptDetail({project}:{project:Project}) {
 const selected = selectedConcepts.find(concept => concept.id === project.id);
 if (selected) {
   const name = project.title.split(' — ')[0];
   return (
     <article className="rq-concept-detail container mx-auto px-6">
       <SEO title={`${project.title} | RizQara Tech`} description={project.description} canonical={`https://www.rizqara.tech/projects/${getSlug(project)}`} image={project.image.startsWith('/') ? `https://www.rizqara.tech${project.image}` : project.image} />
       <Link to="/projects" className="rq-concept-back"><ArrowLeft size={16} aria-hidden="true" /> All projects</Link>
       <header>
         <span className="rq-work-kicker">{project.category} · Independent design concept</span>
         <h1>{name}</h1>
         <div className="rq-concept-intro"><p>{project.description}</p></div>
       </header>
       <figure>
         <img className="rq-concept-cover" src={project.image} alt={project.image === selected.image ? selected.imageAlt : project.title} width="1200" height="800" />
         <figcaption className="rq-portfolio-type mt-3">Illustrative interface mockup with sample data</figcaption>
       </figure>
       <section className="rq-concept-brief">
         <h2>The challenge</h2>
         <p>{selected.challenge}</p>
       </section>
       <section aria-labelledby="concept-workflow">
         <h2 id="concept-workflow">Proposed workflow</h2>
         <div className="rq-concept-flow">
           {selected.workflow.map(step => (
             <div key={step.title}><h3>{step.title}</h3><p>{step.detail}</p></div>
           ))}
         </div>
       </section>
       <section className="rq-concept-brief">
         <h2>What to test next</h2>
         <p>{selected.validation}</p>
       </section>
       <div className="rq-concept-end">
         <h2>Have a similar project?</h2>
         <Link to="/contact">Discuss your project <ArrowUpRight size={20} aria-hidden="true" /></Link>
       </div>
     </article>
   );
 }
 const name=project.title.split(' — ')[0],industry=project.title.split(' — ')[1];const features=project.features?.slice(0,3)||[];
 return <article className="rq-concept-detail container mx-auto px-6"><SEO title={`${project.title} — Design concept | RizQara Tech`} description={project.description}/><Link to="/projects" className="rq-concept-back"><ArrowLeft size={16}/> Back to the collection</Link><header><span className="rq-work-kicker">RIZQARA DESIGN LAB / INDEPENDENT CONCEPT</span><h1>{name}</h1><div className="rq-concept-intro"><p>{project.description.split('. An independent')[0]}.</p><div><span>{industry}</span><span>{project.category}</span><span>Visual concept</span></div></div></header><ConceptPreview project={project} large/><div className="rq-concept-brief"><span className="rq-work-kicker">01 / THE OPPORTUNITY</span><div><h2>A clearer experience.<br/>A stronger first impression.</h2><p>{name} explores how a focused {project.category.toLowerCase()} could simplify {industry?.toLowerCase()} for everyday users. The direction brings discovery, decision-making, and personal organisation into a consistent visual system.</p><p>This is an independent design exploration. The screens illustrate a proposed product direction; they are not a live application or completed client commission.</p></div></div><div className="rq-concept-flow">{features.map((f,i)=><div key={f}><span>0{i+1} / PROPOSED EXPERIENCE</span><h3>{f}</h3><p>{['Help users find relevant options with a clear starting point, readable information, and focused navigation.','Bring important details together so users can compare options and understand their next step.','Keep the experience connected with saved context, clear status, and a predictable return journey.'][i]}</p></div>)}</div><div className="rq-concept-brief"><span className="rq-work-kicker">02 / DESIGN DIRECTION</span><div><h2>Every detail has a purpose.</h2><p>Clear hierarchy, generous spacing, tactile surfaces, and restrained colour establish a recognisable product identity. Device previews show how this visual direction translates into a connected set of screens.</p><div className="rq-concept-spec"><div><b>Scope</b><span>Visual identity direction<br/>Interface exploration<br/>Proposed user journey</span></div><div><b>Proposed technology</b><span>{project.tech.join(' / ')}</span></div><div><b>Next steps</b><span>User research, usability testing, accessibility review, and implementation.</span></div></div></div></div><div className="rq-concept-end"><span className="rq-work-kicker">YOUR NEXT CHAPTER</span><h2>Imagine what we could<br/>build for your business.</h2><Link to="/contact">Discuss your project <ArrowUpRight size={20}/></Link></div></article>;
}
