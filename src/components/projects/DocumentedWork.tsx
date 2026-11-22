import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { getSlug } from '../../utils/content';

export const ADMIN_CASE = 'rizqara-admin-sign-in';
export const RESTAURANT_CASE = 'st2usv9cb';

export function DocumentedWork({ ids = [ADMIN_CASE, RESTAURANT_CASE] }: { ids?: string[] }) {
  const { caseStudies, language } = useData();
  const bn = language === 'bn';
  const studies = ids.flatMap(id => caseStudies.filter(study => study.id === id));
  if (!studies.length) return null;

  return (
    <section className="rq-portfolio-evidence" aria-label={bn ? 'প্রজেক্টের প্রমাণ' : 'Documented work'}>
      <h2>{bn ? 'প্রজেক্টের প্রমাণ' : 'Documented work'}</h2>
      <div className="rq-work-grid">
        {studies.map(study => {
          const internal = study.id === ADMIN_CASE;
          const title = internal
            ? (bn ? 'রিজকারা টেক অ্যাডমিন সাইন-ইন' : 'RizQara Tech admin sign-in')
            : (bn ? 'হট প্লেট রেস্তোরাঁ' : 'Hot Plate Restaurant');
          const evidence = internal
            ? (bn ? 'ডেস্কটপ ও মোবাইল স্ক্রিনশট এবং ব্রাউজার পরীক্ষার বিবরণ।' : 'Desktop and mobile screenshots with a summary of the browser checks.')
            : (bn ? 'মেনু, রিজার্ভেশন এবং ক্যাটারিংয়ের ডিজাইন ও প্রজেক্ট গ্যালারি।' : 'A project gallery and write-up covering menu browsing, table reservations, and catering.');
          return (
            <Link className="rq-work-card" key={study.id} to={`/case-studies/${getSlug(study)}`}>
              <div className="rq-work-art">
                <img src={study.image} alt="" width="1200" height="800" loading="lazy" decoding="async" />
              </div>
              <div className="rq-work-copy">
                <div>
                  <span className="rq-portfolio-type">{internal ? (bn ? 'নিজস্ব প্রজেক্ট' : 'In-house project') : (bn ? 'রেস্তোরাঁর ওয়েবসাইট' : 'Restaurant website')}</span>
                  <h3>{title}</h3>
                  <p>{evidence}</p>
                </div>
                <ArrowUpRight size={20} aria-hidden="true" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
