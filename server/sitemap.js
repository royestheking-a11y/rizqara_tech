const {Service,Project,Blog,CaseStudy,Video}=require('./models/Schemas');
const selectedConcepts=require('../src/data/selected-concepts.json');
const archivedConcepts=new Set(require('../src/data/project-concepts.json').map(item=>item.id));
const caseStudies=require('../src/data/case-studies.json');
const catalog=require('../shared/service-catalog.json');
const editorialFallback={blog:require('../src/data/blogs.json'),videos:require('../src/data/videos.json')};
const teamMembers=require('../src/data/team-members.json');
const origin='https://www.rizqara.tech';
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const slug=title=>title.toLowerCase().normalize('NFKC').trim().replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-|-$/g,'')||'item';
async function sitemap(){
 const paths=['/','/about','/services','/projects','/case-studies','/blog','/videos','/contact','/team','/gallery','/careers','/founder','/vision-2030','/registered-company','/privacy-policy','/terms-of-service','/estimate','/academy','/academy/responsive-web-sample'];
 paths.push(...teamMembers.map(member=>'/'+member.slug));
 paths.push(...caseStudies.map(item=>'/case-studies/'+item.slug));
 paths.push(...catalog.categories.flatMap(category=>category.offerings.map(item=>'/services/'+item.key)));
 for(const [route,model] of Object.entries({services:Service,projects:Project,blog:Blog,'case-studies':CaseStudy,videos:Video})){
  const records=await model.find().select('id title slug archived status __v').lean();
  const byId = new Map((route === 'projects' ? selectedConcepts : []).map(item => [item.id, item]));
  for (const item of (records.length ? records : editorialFallback[route] || [])) {
   if (route !== 'projects' || byId.has(item.id) || !archivedConcepts.has(item.id) || item.status !== 'Concept' || item.__v > 0) byId.set(item.id, item);
  }
  for(const item of byId.values()) if(item.id&&item.title&&!item.archived)paths.push(`/${route}/${item.slug||`${slug(item.title)}-${item.id.slice(0,8)}`}`);
 }
 return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+[...new Set(paths)].map(p=>`<url><loc>${escape(origin+p)}</loc></url>`).join('')+'</urlset>';
}
module.exports={sitemap};
