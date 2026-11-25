const fs = require('node:fs/promises');
const { Service, Project, Blog, CaseStudy, Video } = require('./models/Schemas');
const selectedConcepts = require('../src/data/selected-concepts.json');
const caseStudies = require('../src/data/case-studies.json');
const catalog = require('../shared/service-catalog.json');
const serviceEntries = catalog.categories.flatMap(category => category.offerings.map(offering => ({
    id: 'svc-' + offering.key, slug: offering.key, title: offering.title, description: offering.summary,
    image: category.image, capabilities: offering.deliverables, process: catalog.process,
})));
const editorialFallback = { blog: require('../src/data/blogs.json'), videos: require('../src/data/videos.json') };
const bundled = { services: serviceEntries, projects: selectedConcepts, 'case-studies': caseStudies };
const teamMembers = require('../src/data/team-members.json');
const SITE_URL = 'https://www.rizqara.tech';
const pages = {
    '/': ['RizQara Tech | Software & AI Solutions', 'Custom web, mobile and AI software built by RizQara Tech in Bangladesh.'],
    '/about': ['About RizQara Tech', 'Meet our software team and learn about our engineering approach.'],
    '/contact': ['Contact RizQara Tech', 'Contact RizQara Tech about your software, web, mobile or AI project.'],
    '/services': ['Our Services | RizQara Tech', 'Explore 44 core offerings across software, business systems, AI, mobile, design, digital marketing and enterprise solutions.'],
    '/projects': ['Our Projects', 'Explore software projects delivered by RizQara Tech.'],
    '/case-studies': ['Case Studies', 'Read about our engineering process and project outcomes.'],
    '/careers': ['Careers at RizQara Tech', 'Explore open roles and submit your application.'],
    '/blog': ['RizQara Journal | Software Guides and Project Stories', 'Practical software planning guides, website checklists, and behind-the-scenes stories from RizQara Tech.'],
    '/videos': ['RizQara Tech Videos', 'Project showcases, technology videos and tutorials.'],
    '/academy/responsive-web-sample': ['Build a Responsive Card Grid | RizQara Tech Academy', 'A free Responsive Website Studio sample lesson on CSS Grid and testing layouts at three screen widths.'],
    '/academy': ['RizQara Tech Academy | Courses and Learning Resources', 'Explore courses and downloadable learning resources from RizQara Tech Academy.'],
    '/team': ['Our Team', 'Meet the RizQara Tech team.'],
    '/gallery': ['Gallery', 'Team activities and events at RizQara Tech.'],
    '/founder': ['Founder of RizQara Tech', 'Learn about the founder of RizQara Tech.'],
    '/vision-2030': ['Vision 2030', 'Explore the future vision of RizQara Tech.'],
    '/registered-company': ['Company Information', 'Company information for RizQara Tech.'],
    '/estimate': ['Software Project Estimator', 'Get a planning range and suggested first-release scope for a website, app, or business software project.'],
    '/build': ['Plan Your Project', 'Configure your project and contact our team for a quote.'],
    '/packages': ['Software Packages', 'Compare software development packages.'],
    '/privacy-policy': ['Privacy Policy', 'Read our privacy policy.'],
    '/terms-of-service': ['Terms of Service', 'Read our terms of service.'],
    '/admin': ['Administrator Sign In', 'Sign in to manage RizQara Tech.'],
    '/blog/top-software-companies-in-bangladesh': ['Software Companies in Bangladesh', 'Explore software companies in Bangladesh.'],
};
const escapeHTML = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
const slug = title => title.toLowerCase().normalize('NFKC').trim().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '') || 'item';
async function renderPage(file, pathname, ready) {
    let detail = null;
    let page = pages[pathname], status = 200, canonicalPath = pathname, image = `${SITE_URL}/og-image.png`;
    const member = teamMembers.find(item => pathname === '/' + item.slug);
    if (member && !page) {
        page = [member.name + ' — ' + member.role + ' | RizQara Tech', member.bio];
        if (member.image) image = SITE_URL + member.image;
    }
    if (pathname === '/estimate') image = SITE_URL + '/images/projects/selected/pocketstock.webp';
    if (pathname === '/academy/responsive-web-sample') image = SITE_URL + '/images/academy/responsive-web-sample.jpg';

    if (!page) {
        const [, collection, encoded] = pathname.split('/');
        const model = { services: Service, projects: Project, blog: Blog, 'case-studies': CaseStudy, videos: Video }[collection];
        if (model && encoded) {
            let candidate = encoded;
            try { candidate = decodeURIComponent(encoded); } catch { /* Invalid URL encoding cannot match a content slug. */ }
            // Existing title links are accepted alongside persisted slugs and IDs.
            const defaults = collection === 'projects' ? [...require('../src/data/project-concepts.json'), ...selectedConcepts] : (bundled[collection] || []);
            const recordsById = new Map(defaults.map(item => [item.id, item]));
            if (ready) {
                const saved = await model.find().select('id title description excerpt content date image slug previousSlugs details capabilities process archived').limit(1000).lean();
                for (const item of saved) recordsById.set(item.id, item);
            }
            const records = recordsById.size ? [...recordsById.values()].filter(item => !item.archived) : (editorialFallback[collection] || []);
            const item = records.find(record => [record.id, record.slug, `${slug(record.title)}-${record.id}`, `${slug(record.title)}-${record.id.slice(0, 8)}-${record.id}`, `${slug(record.title)}-${record.id.slice(0, 8)}`, slug(record.title), record.title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, ''), ...(record.previousSlugs || [])].includes(candidate));
            if (item) { detail = item; page = [item.title, item.description || item.excerpt || item.title]; canonicalPath = `/${collection}/${item.slug || `${slug(item.title)}-${item.id.slice(0, 8)}`}`; if (item.image?.startsWith('https://')) image = item.image; else if (item.image?.startsWith('/images/') && !item.image.startsWith('//')) image = `${SITE_URL}${item.image}`; }
        }
    }
    if (!page && pathname.startsWith('/feature/')) page = ['Project feature', 'Learn about the selected project capability.'];
    if (!page) { status = ready ? 404 : 503; page = [status === 404 ? 'Page not found' : 'Content temporarily unavailable', 'Please try again or return to the homepage.']; }
    const [title, description] = page;
    const canonical = `${SITE_URL}${canonicalPath}`;
    const tags = `<title>${escapeHTML(title)}</title>\n<meta data-rh="true" name="description" content="${escapeHTML(description)}">\n<link data-rh="true" rel="canonical" href="${escapeHTML(canonical)}">\n<meta data-rh="true" property="og:title" content="${escapeHTML(title)}">\n<meta data-rh="true" property="og:description" content="${escapeHTML(description)}">\n<meta data-rh="true" property="og:url" content="${escapeHTML(canonical)}">\n<meta data-rh="true" property="og:image" content="${escapeHTML(image)}">\n<meta data-rh="true" name="twitter:card" content="summary_large_image">\n${pathname === '/admin' || status !== 200 ? '<meta data-rh="true" name="robots" content="noindex">' : ''}`;
    let html = await fs.readFile(file, 'utf8');
    html = html.replace(/<title>[\s\S]*?<\/title>/, tags);
    const navigation = Object.entries(pages).filter(([url]) => !['/admin','/build','/packages'].includes(url)).map(([url, info]) => `<a href="${url}">${escapeHTML(info[0])}</a>`).join(' · ');
    const serviceContent = ['/', '/services'].includes(pathname) ? `<section><h2>Software, mobile applications and digital services</h2>${catalog.categories.map(category => `<article><h3><a href="/services#${category.id}">${escapeHTML(category.title || category.name)}</a></h3><p>${escapeHTML(category.description || category.summary || '')}</p></article>`).join('')}</section>` : '';
    const detailContent = detail ? `${detail.details ? `<section><h2>About this service or project</h2><p>${escapeHTML(detail.details)}</p></section>` : ''}${['capabilities','process'].map(key => Array.isArray(detail[key]) && detail[key].length ? `<section><h2>${key === 'capabilities' ? 'Capabilities' : 'Our process'}</h2><ul>${detail[key].map(value=>`<li>${escapeHTML(value)}</li>`).join('')}</ul></section>` : '').join('')}` : '';
    const isArticle = pathname.startsWith('/blog/') && detail?.content;
    const articleBody = isArticle ? detail.content.split(/\r?\n/).filter(line => line.trim()).map(line => {
        if (line.startsWith('## ')) return `<h2>${escapeHTML(line.slice(3))}</h2>`;
        const paragraph = escapeHTML(line).replace(/\[([^\]\n]+)\]\((\/[a-z0-9][a-z0-9/-]*)\)/gi, '<a href="$2">$1</a>');
        return `<p>${paragraph}</p>`;
    }).join('') : '';
    if (isArticle) {
        const articleSchema = {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: title,
            description,
            image,
            mainEntityOfPage: canonical,
            author: { '@type': 'Organization', name: 'RizQara Tech', url: SITE_URL + '/about' },
            ...(/^\d{4}-\d{2}-\d{2}$/.test(detail.date) ? { datePublished: detail.date } : {}),
        };
        html = html.replace('</head>', () => `<meta data-rh="true" property="og:type" content="article"><script data-rh="true" type="application/ld+json">${JSON.stringify(articleSchema).replace(/</g, '\\u003c')}</script></head>`);
    }
    let directory = '';
    const listModel = {'/services':Service,'/projects':Project,'/blog':Blog,'/case-studies':CaseStudy,'/videos':Video}[pathname];
    if (listModel) {
        const collection = pathname.slice(1);
        const entriesById = new Map((bundled[collection] || []).map(item => [item.id, item]));
        if (ready) {
            const records = await listModel.find().select('id title slug description excerpt archived').limit(1000).lean();
            for (const item of records) entriesById.set(item.id, item);
        }
        const entries = entriesById.size ? [...entriesById.values()].filter(item => !item.archived) : (editorialFallback[collection] || []);
        directory = `<section><h2>Explore ${escapeHTML(pathname.slice(1))}</h2><ul>${entries.map(item=>`<li><a href="${pathname}/${escapeHTML(item.slug || `${slug(item.title)}-${item.id.slice(0,8)}`)}">${escapeHTML(item.title)}</a><p>${escapeHTML(item.description || item.excerpt || '')}</p></li>`).join('')}</ul></section>`;
    }
    const brandLoader = `<div class="rq-brand-loader" role="status" aria-label="Loading website"><div class="rq-loader-symbol"><img src="/images/brand/rizqara-official.png" alt="" width="104" height="104"/><i></i><i></i><i></i></div></div>`;
    const fallback = `<main class="sr-only" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0"><h1>${escapeHTML(title)}</h1><p>${escapeHTML(description)}</p>${serviceContent}${detailContent}${articleBody}${directory}<nav aria-label="Site navigation">${navigation}</nav></main>`;
    const adminBoot = `<div style="min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#0e0407;color:#fff;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased">
        <div style="width:58px;height:58px;border-radius:18px;background:linear-gradient(135deg,#500000,#7e1735);display:flex;align-items:center;justify-content:center;box-shadow:0 14px 34px rgba(80,0,0,0.55);margin-bottom:20px;border:1px solid rgba(255,255,255,0.12)">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fce4ec" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div style="font-size:10px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;color:#d2869d;margin-bottom:6px">RizQara Tech</div>
        <div style="font-size:16px;font-weight:600;color:#fdf2f6;letter-spacing:-0.02em;margin-bottom:24px">Administrator Console</div>
        <div style="width:130px;height:3px;background:rgba(255,255,255,0.08);border-radius:99px;overflow:hidden;position:relative">
            <div style="position:absolute;top:0;left:0;height:100%;width:45%;background:linear-gradient(90deg,#500000,#e89bb1);border-radius:99px;animation:rq-admin-boot 1.1s cubic-bezier(0.4,0,0.2,1) infinite alternate"></div>
        </div>
        <style>@keyframes rq-admin-boot{0%{transform:translateX(-60%)}100%{transform:translateX(180%)}}</style>
    </div>`;
    const appRootContent = pathname === '/admin' ? adminBoot : `${brandLoader}${fallback}`;
    html = html.replace(/<!--app-root-start-->[\s\S]*?<!--app-root-end-->/, `<div id="root">${appRootContent}</div>`);

    return { html, status };
}
module.exports = { renderPage };
