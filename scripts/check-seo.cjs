// Read-only production audit: node scripts/check-seo.cjs https://www.rizqara.tech
const origin=process.argv[2]||'http://localhost:5001';
(async()=>{
 let failed=0;
 for(const path of ['/','/services','/about','/contact','/seo-check-not-a-real-page']){
  const r=await fetch(origin+path);const html=await r.text();const missing=path.includes('not-a-real');
  const checks={status:r.status===(missing?404:200),canonical:missing||html.includes(`href="https://www.rizqara.tech${path==='/'?'/':path}"`),navigation:html.includes('<a href='),noindex:!missing||/name="robots" content="noindex"/.test(html)};
  for(const [name,ok]of Object.entries(checks)){console.log(`${ok?'PASS':'FAIL'} ${path} ${name}`);if(!ok)failed++;}
 }
 const r=await fetch(origin+'/sitemap.xml');const xml=await r.text();const ok=r.ok&&xml.includes('<urlset')&&xml.includes('https://www.rizqara.tech/services/');console.log(`${ok?'PASS':'FAIL'} detail-page sitemap`);if(!ok)failed++;
 process.exitCode=failed?1:0;
})().catch(e=>{console.error(e.message);process.exitCode=1});
