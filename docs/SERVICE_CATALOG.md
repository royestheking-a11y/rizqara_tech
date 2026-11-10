# Service catalog and artwork

The catalog contains all 44 requested offerings across seven categories. The homepage presents all seven disciplines; `/services` provides search, category filters, summaries, and individual detail links. English and Bengali category names and offering summaries are included. Deliverables currently use English in both languages. Four existing specialist offerings remain: Custom Software, AI Strategy, Generative AI, and MLOps. Existing service IDs, canonical slugs, and old title aliases are preserved.

## Source and maintenance

- `shared/service-catalog.json`: versioned categories, offering descriptions, deliverables, and category artwork.
- `src/components/services/ServiceCatalog.tsx`: category cards and searchable catalog.
- The admin service editor supports category, image URL, alt text, capabilities, and process steps. Unclassified services remain visible under “More services.”
- `server/scripts/sync-service-catalog.js`: dry run by default. `npm run services:sync -- --apply` applies the catalog to the isolated local `rizqara_local` database on port 27018. It creates a service backup under `.local-data`, writes individual records with version checks, deletes nothing, and skips unchanged catalog revisions so subsequent runs preserve admin edits.
- This migration intentionally refuses remote databases. No hosted database was updated. A production rollout needs a reviewed backup and migration against that environment.
- `node scripts/verify-service-catalog.mjs`: verifies the local API has all 44 unique catalog entries, their categories, images, deliverables, process, and four legacy specialists.

## Generated images

Seven category-specific images were generated with the built-in image generation tool. The coordinated palette uses RizQara maroon `#500000`, burgundy `#701b32`, pearl white, glass, and polished metal. Every service uses its category’s relevant image.

Original 1536×1024 PNGs are preserved in `assets/service-artwork/`. Optimized 1200px WebP covers and 640px card versions are in `public/images/services/premium/`. All 14 delivery files together are approximately 0.8 MB. Responsive `srcset`, lazy loading, fixed aspect ratios, and alt text are applied.

Exact generation prompts: `docs/service-image-prompts.json`. Asset mapping: `docs/service-artwork-manifest.json`.

Rebuild delivery files with `npm run images:services` (Sharp only resizes and encodes; it does not alter the artwork).

## Validation

`npm run check` runs TypeScript, real MongoDB integration tests, and the production build. The service integration test verifies editing preserves catalog identity, artwork, canonical slugs, and previous title links. Browser checks cover desktop and mobile, search, category filtering, empty results, new details, Bengali content, homepage category navigation, and image loading.
