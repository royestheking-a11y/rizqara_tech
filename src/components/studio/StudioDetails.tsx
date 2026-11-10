import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/studio-experience.css';

export function AssistantCharacter() {
 return <span className="rq-mascot" aria-hidden="true"><i className="rq-antenna"/><span className="rq-robot-face"><i/><i/><b/></span><span className="rq-robot-hand"/></span>;
}
const chapters = [
 ['Discover', 'First, we listen.', 'We explore your customers, business goals, and existing systems to define the right problem before starting development.', 'Goals · User journeys · Product scope'],
 ['Design', 'Make every interaction count.', 'We shape clear user journeys and interactive prototypes so you can review the experience before it becomes software.', 'Research · Prototypes · Visual direction'],
 ['Engineer', 'Turn clarity into capability.', 'We connect interfaces, business logic, and integrations through a structured build process with visible progress.', 'Development · Integrations · Testing'],
 ['Evolve', 'Launch is a beginning.', 'We help plan deployment, handover, and future improvements around the needs of your business.', 'Deployment · Handover · Improvements']
];
export function StudioProcess() {
 const [active,setActive]=useState(0);
 return <section className="rq-studio-process container mx-auto px-6 max-w-7xl"><header><span className="rq-ed-eyebrow">THE PEOPLE BEHIND THE PRODUCT</span><h2>Thoughtful by nature.<br/><em>Collaborative by design.</em></h2><p>A closer look at how an idea moves through our studio.</p></header><div className="rq-process-shell"><div className="rq-process-tabs" role="tablist" aria-label="Our process">{chapters.map((c,i)=><button key={c[0]} id={`process-tab-${i}`} role="tab" aria-selected={active===i} aria-controls="process-panel" onClick={()=>setActive(i)}><span>0{i+1}</span>{c[0]}<b>↗</b></button>)}</div><article id="process-panel" role="tabpanel" aria-labelledby={`process-tab-${active}`} key={active}><span className="rq-process-number">0{active+1}</span><div><h3>{chapters[active][1]}</h3><p>{chapters[active][2]}</p><small>{chapters[active][3]}</small><Link to="/contact">Let’s build something meaningful <span>↗</span></Link></div></article></div></section>;
}
export function ContactDetails() {
 return <div className="rq-contact-details"><span className="rq-ed-eyebrow">WHAT HAPPENS NEXT</span><ol><li><b>01 / Share your idea</b><p>Tell us what you want to build, who it serves, and any timeline or budget you have in mind.</p></li><li><b>02 / Explore the fit</b><p>Our team reviews your needs and discusses scope, priorities, and the right next step.</p></li><li><b>03 / Shape a plan</b><p>Agree on deliverables, milestones, and a practical approach before work begins.</p></li></ol><p className="rq-contact-note">Based in Dhaka & Barisal · Working with businesses worldwide<br/>For existing projects, include your project name so we can direct your message.</p></div>;
}
