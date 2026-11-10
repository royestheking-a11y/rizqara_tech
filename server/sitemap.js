const {Service,Project,Blog,CaseStudy,Video}=require('./models/Schemas');
const origin='https://www.rizqara.tech';
const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const slug=title=>title.toLowerCase().normalize('NFKC').trim().replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-|-$/g,'')||'item';
async function sitemap(){
 const paths=['/','/about','/services','/projects','/case-studies','/blog','/videos','/contact','/team','/gallery','/careers','/founder','/vision-2030','/registered-company','/privacy-policy','/terms-of-service'];
 for(const [route,model] of Object.entries({services:Service,projects:Project,blog:Blog,'case-studies':CaseStudy,videos:Video})){
  const records=await model.find().select('id title slug').lean();
  for(const item of records) if(item.id&&item.title)paths.push(`/${route}/${item.slug||`${slug(item.title)}-${item.id.slice(0,8)}`}`);
 }
 return '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+[...new Set(paths)].map(p=>`<url><loc>${escape(origin+p)}</loc></url>`).join('')+'</urlset>';
}
module.exports={sitemap};
