# Search visibility audit — 10 November 2026

## Live observations
- Non-www redirects to www (307). Choose www as the canonical host; configure a permanent host redirect in hosting settings.
- /services initial HTML has the homepage title and homepage canonical.
- /seo-audit-missing-page returns 200 and the homepage canonical (soft-404 risk).
- Initial HTML on checked pages contains zero anchor links. Google may render JavaScript, but crawlable server content is more resilient.
- Live sitemap is a static short list; detailed services, projects and articles are not represented in the observed response.
- Production differs from this local checkout. Local fixes have NOT been deployed.

## Changes prepared
- Consistent www canonical URLs and sitemap host.
- Server HTML includes page-specific metadata, navigation and real service-category descriptions on home/services.
- Robust replacement of startup markup using explicit HTML markers.
- Database-backed sitemap for service, project, blog, case-study and video detail pages, with 503 while unavailable rather than an incomplete sitemap.
- Correct organization logo and Facebook profile references.
- Existing server renderer returns 404 for unknown pages with DB available; deployment must route page requests through it.

## Before deployment / after deployment
1. Deploy the matching frontend build and backend renderer together. Verify Vercel actually uses the rewrite configuration; the observed live static fallback does not show these server behaviors.
2. Verify /services canonical, unique page titles, unknown URL HTTP 404, XML sitemap and working detail URLs on production.
3. Submit https://www.rizqara.tech/sitemap.xml in Search Console. Inspect homepage and priority service URLs, request indexing once after verifying their rendered content.
4. Review 3 months of Search Console impressions, clicks, average positions, queries, page indexing and Google-selected canonical. No account data was available during audit; zero traffic's precise cause remains unproven.
5. Prioritize useful service detail pages for custom website development, mobile apps, business software and digital marketing, with actual scope, process, relevant work, FAQs and inquiry links. Avoid duplicative keyword/location pages.
6. Publish verifiable project outcomes and original expert articles. Do not invent clients, rankings, certifications or backlinks.
7. Review mobile Core Web Vitals using actual field data. No PageSpeed score was measured in this audit.
8. Analytics uses consent and two measurement IDs. Confirm intended GA4 property and tag collection; unconsented visits will not appear in Analytics. Search Console clicks are separate from Analytics sessions.

User requested dashboard visitor reporting later, after SEO; not implemented here.
