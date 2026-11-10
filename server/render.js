const fs = require('node:fs/promises');
const { Service, Project, Blog, CaseStudy, Video } = require('./models/Schemas');
const SITE_URL = 'https://rizqara.tech';
const pages = {
    '/': ['RizQara Tech | Software & AI Solutions', 'Custom web, mobile and AI software built by RizQara Tech in Bangladesh.'],
    '/about': ['About RizQara Tech', 'Meet our software team and learn about our engineering approach.'],
    '/contact': ['Contact RizQara Tech', 'Contact RizQara Tech about your software, web, mobile or AI project.'],
    '/services': ['Our Services | RizQara Tech', 'Explore 44 core offerings across software, business systems, AI, mobile, design, digital marketing and enterprise solutions.'],
    '/projects': ['Our Projects', 'Explore software projects delivered by RizQara Tech.'],
    '/case-studies': ['Case Studies', 'Read about our engineering process and project outcomes.'],
    '/careers': ['Careers at RizQara Tech', 'Explore open roles and submit your application.'],
    '/blog': ['RizQara Tech Blog', 'Software engineering and technology insights.'],
    '/videos': ['RizQara Tech Videos', 'Project showcases, technology videos and tutorials.'],
    '/team': ['Our Team', 'Meet the RizQara Tech team.'],
    '/gallery': ['Gallery', 'Team activities and events at RizQara Tech.'],
    '/founder': ['Founder of RizQara Tech', 'Learn about the founder of RizQara Tech.'],
    '/vision-2030': ['Vision 2030', 'Explore the future vision of RizQara Tech.'],
    '/registered-company': ['Company Information', 'Company information for RizQara Tech.'],
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
    let page = pages[pathname], status = 200, canonicalPath = pathname, image = `${SITE_URL}/og-image.png`;
    if (!page && ready) {
        const [, collection, encoded] = pathname.split('/');
        const model = { services: Service, projects: Project, blog: Blog, 'case-studies': CaseStudy, videos: Video }[collection];
        if (model && encoded) {
            const candidate = decodeURIComponent(encoded);
            // Existing title links are accepted alongside persisted slugs and IDs.
            const records = await model.find().select('id title description excerpt image slug previousSlugs').limit(1000).lean();
            if (collection === 'projects') records.push(...require('../src/data/project-concepts.json'));
            const item = records.find(record => [record.id, record.slug, `${slug(record.title)}-${record.id}`, `${slug(record.title)}-${record.id.slice(0, 8)}-${record.id}`, `${slug(record.title)}-${record.id.slice(0, 8)}`, slug(record.title), record.title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, ''), ...(record.previousSlugs || [])].includes(candidate));
            if (item) { page = [item.title, item.description || item.excerpt || item.title]; canonicalPath = `/${collection}/${item.slug || `${slug(item.title)}-${item.id.slice(0, 8)}`}`; if (item.image?.startsWith('https://')) image = item.image; else if (item.image?.startsWith('/images/') && !item.image.startsWith('//')) image = `${SITE_URL}${item.image}`; }
        }
    }
    if (!page && pathname.startsWith('/feature/')) page = ['Project feature', 'Learn about the selected project capability.'];
    if (!page) { status = ready ? 404 : 503; page = [status === 404 ? 'Page not found' : 'Content temporarily unavailable', 'Please try again or return to the homepage.']; }
    const [title, description] = page;
    const canonical = `${SITE_URL}${canonicalPath}`;
    const tags = `<title>${escapeHTML(title)}</title>\n<meta data-rh="true" name="description" content="${escapeHTML(description)}">\n<link data-rh="true" rel="canonical" href="${escapeHTML(canonical)}">\n<meta data-rh="true" property="og:title" content="${escapeHTML(title)}">\n<meta data-rh="true" property="og:description" content="${escapeHTML(description)}">\n<meta data-rh="true" property="og:url" content="${escapeHTML(canonical)}">\n<meta data-rh="true" property="og:image" content="${escapeHTML(image)}">\n<meta data-rh="true" name="twitter:card" content="summary_large_image">\n${pathname === '/admin' || status !== 200 ? '<meta data-rh="true" name="robots" content="noindex">' : ''}`;
    let html = await fs.readFile(file, 'utf8');
    html = html.replace(/<title>[\s\S]*?<\/title>/, tags);
    html = html.replace(/<div id="root">[\s\S]*?<\/div>/, `<div id="root"><main style="padding:2rem;font-family:sans-serif"><h1>${escapeHTML(title)}</h1><p>${escapeHTML(description)}</p></main></div>`);
    return { html, status };
}
module.exports = { renderPage };
