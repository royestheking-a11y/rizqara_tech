# RizQara Tech project audit

Historical audit snapshot. See [FIX_STATUS.md](FIX_STATUS.md) for subsequent fixes and verification.

Date: 10 November 2026 (Asia/Dhaka). Scope: supplied checkout, local runtime, frontend, Express API, schemas, environment/deployment configuration, dependency advisory scans, and selected browser checks. No application source was changed. This is a bounded audit, not a guarantee that every defect has been discovered.

## Results and limits

- Vite production build passed during project startup. Main application JavaScript: 461.05 kB; vendor: 686.04 kB, plus icons/motion chunks. Total reported JavaScript gzip size is approximately 350 kB.
- `tsc --noEmit` fails with 79 diagnostics. Most involve version-suffixed imports understood by Vite aliases but not TypeScript; additional implicit-any, unused-import, and missing-property errors remain. See `audit-typescript.txt`.
- Local frontend and `/health` return HTTP 200. Local MongoDB is disconnected because `server/.env`/MONGODB_URI is missing. Health success does not imply database readiness.
- `/api/health` returns 404, intercepted by the generic collection route.
- Local image proxy successfully fetched `http://127.0.0.1:5001/health`, returning `OK`. This confirms unrestricted access to a loopback HTTP destination; broader network reach was not tested.
- Isolated Express tests used synthetic model stubs, with no database connection or hosted mutations: unauthenticated GET `/api/messages` returned synthetic private data with HTTP 200; unauthenticated bulk PUT reached deletion, then returned 500 after an injected insertion failure.
- Browser checks: homepage data rendered from the default hosted API; no broken image was found at the sampled moment. The homepage had no h1; contact metadata contained two canonical tags and two descriptions; several visible inputs/selects lacked accessible labels. Viewport sampled: 653 px; no horizontal overflow at that width. This is not a full responsive or accessibility certification.
- npm audit reported 18 affected root-project packages (3 critical, 13 high, 2 moderate) and 17 backend packages (2 critical, 10 high, 5 moderate). These are package-level counts across production/development dependencies, with overlap between projects; they are not distinct exploit counts. Reachability and actual exploitability require separate assessment. Raw registry output is attached in the dependency JSON files.
- Real database persistence, upload credentials, email delivery, backups, production access controls outside this code, and every browser/device combination could not be verified from this environment. No production write, delete, form submission, upload, or private-data retrieval was performed.

## Critical and high-priority findings

### 01 — Critical: API mutations have no authentication or authorization
Evidence: `server/routes.js:265`, `:284`, `:338`, `:378`; mounted without auth in `server/index.js:36`.
Anyone reaching the API can create, update, replace, or delete site collections. The frontend login does not protect these endpoints. Isolated synthetic testing confirmed an unauthenticated bulk PUT reaches its destructive operation.
Fix: server-verified sessions, password hashing, administrator authorization on every privileged operation; separate public form/comment endpoints from content administration.

### 02 — Critical: private messages and career applications are publicly readable
Evidence: model map in `server/routes.js:27-29`; unrestricted collection reads at `:222` and `:250`.
The generic reader includes messages, applicant email addresses, reasons/experience and CV contents/links. Synthetic unauthenticated read returned 200. This is confirmed in supplied code; actual production exposure was not probed.
Fix: protect both list/detail private endpoints, restrict response fields, and ensure sensitive responses are not publicly cacheable.

### 03 — Critical: admin credentials and authentication are entirely in the browser
Evidence: `src/App.tsx:1870-1874`, `:2136`.
A literal administrator email/password is shipped in the client bundle. Authentication is a localStorage boolean with no server verification or expiration. Do not retain or reuse this embedded password.
Fix: remove client credentials, provision a real administrator identity, invalidate exposed credentials wherever reused, and enforce authorization server-side.

### 04 — High: image proxy permits server-side requests to internal destinations
Evidence: `server/routes.js:85-116`; local loopback fetch reproduced.
The endpoint accepts arbitrary destination URLs without host/IP restrictions, only selects HTTP/HTTPS by a simple protocol check, and streams upstream content. No request deadline, response-size cap, or image-only restriction is enforced.
Fix: allowlist required image hosts and schemes, reject private/loopback/link-local addresses including resolved DNS results, set size/time limits, and enforce expected content types. Remove the proxy if unnecessary.

### 05 — High: bulk save can permanently lose existing data
Evidence: `server/routes.js:290-324`.
Both array and object payloads delete all documents before inserting replacements. Prevalidation does not protect against duplicate-key errors, database interruptions, or insertion failures. Empty arrays also clear entire collections. A synthetic insertion failure confirmed deletion happens first.
Fix: individual record writes; transactional replacement only for explicitly authorized import workflows, with backup and conflict handling.

### 06 — High: normal edits can overwrite another user's work or new submissions
Evidence: `src/components/AdminDashboard.tsx:176-191`; `src/context/DataContext.tsx:496-504`, `:603-612`, `:615-630`.
The client sends its complete in-memory collection for an ordinary edit, marking a message read, or posting a video comment. A stale tab can erase newer records/comments, including fresh messages not present in its snapshot.
Fix: POST/PATCH/DELETE individual IDs; append comments atomically and use revision/version conflict checks.

### 07 — High: local editing defaults to the hosted backend
Evidence: `src/context/DataContext.tsx:337`; upload fallback `src/components/admin/ImageUploader.tsx:81`; translation fallback `src/components/AdminDashboard.tsx:297`; proxy fallback `src/utils/imageProxy.ts:15`.
Content operations default to the hosted API while upload and translation default to localhost. Running locally can edit hosted data and upload assets somewhere else.
Fix: one shared API configuration, `/api` for development with Vite proxy, explicit production URL, and documented environment examples.

### 08 — High: uploads and expensive public endpoints have no abuse controls
Evidence: `server/routes.js:15-16`, `:65`, `:206`; `server/index.js:14-16`.
Multer buffers uploads in memory without file-size or file-type limits. Upload/translation/proxy/public submissions have no rate limits; JSON accepts 50 MB. An unauthenticated client can consume memory, provider quota or outbound requests.
Fix: authenticated admin uploads, MIME/content checks, per-endpoint limits, deadlines, rate limiting and public-submission anti-abuse controls.

### 09 — High: dependency advisory backlog includes critical packages
Evidence: attached npm audit JSON files and lockfiles.
Root critical packages: concurrently, shell-quote and safe-eval. Backend critical packages: proxy-addr and safe-eval. High findings include Vite, router, Mongoose, Multer and translation-google chains. Registry reports no available fix for translation-google itself.
Fix: assess reachable production paths, replace translation-google and its vulnerable chain, update dependencies in controlled groups, regenerate lockfiles and rerun checks. Do not blindly force all suggested upgrades.

### 10 — High: contact/newsletter/chat can claim success when nothing was stored
Evidence: `src/components/premium/UIComponents.tsx:1714-1737`, `:1993`; `src/App.tsx:1404-1417`; `src/context/DataContext.tsx:544-571`.
EmailJS optional chaining silently skips email when its script is unavailable. addMessage is not awaited by callers, catches its own errors, and only keeps failed data in React memory. Users see success and forms clear before persistence is known.
Fix: require confirmed server acceptance; return/rethrow failures, preserve entered text on failure, and distinguish accepted submissions from email notification status.

### 11 — High: career application success is simulated before the request finishes
Evidence: `src/components/pages/ExtraPages.tsx:53-59`; `src/context/DataContext.tsx:574-599`.
A timer starts onSubmit without awaiting it and immediately shows Application Sent. The data layer also swallows failures. CVs are base64 strings stored inline, with no application-level size/type validation.
Fix: await persistence, show recoverable failure, validate files server-side, and store private CVs in protected object storage rather than embedding large payloads in collection responses.

### 12 — High: cookie controls do not govern tracking
Evidence: `index.html:29-44`; `src/components/premium/CookieConsent.tsx:20-47`.
Google analytics, AdSense and Ahrefs scripts load unconditionally before the banner choice. The preferences only write localStorage and are not consumed to gate those scripts. Reopening settings also resets UI preferences to defaults instead of reading saved values.
Fix: central consent state that controls script initialization and subsequent consent changes; hydrate the settings UI from persisted choices. This is a technical behavior finding, not a legal-compliance determination.

## Reliability and functional defects

### 13 — Medium: missing database configuration leaves a misleading healthy server
Evidence: `server/index.js:19-25`, `:44-48`, `:67`.
The server listens after failed MongoDB connection; `/health` still says OK, while database calls can buffer then fail. No environment example exists.
Fix: validate required configuration, connect before accepting DB traffic, and add separate liveness/readiness checks with database state.

### 14 — Medium: default backend port contradicts the frontend proxy and README
Evidence: `server/index.js:8` (5000), `vite.config.ts` proxy (5001), README (5001 and frontend 5173 while Vite uses 3000).
The previous startup needed `PORT=5001 npm run dev`. A plain documented startup does not align the local API proxy.
Fix: consistent defaults and updated setup instructions.

### 15 — Medium: API health route is unreachable
Evidence: generic route in `server/routes.js:222`, health registered later in `server/index.js:48`.
GET `/api/health` is treated as the collection named health and returns 404; the GitHub keep-alive workflow calls it.
Fix: mount specific operational routes before generic routes.

### 16 — Medium: delete failures disappear and saves leave unsaved UI state
Evidence: `src/context/DataContext.tsx:479-515`, `:518-541`; `src/components/AdminDashboard.tsx:83-195`.
Optimistic state is changed without rollback. Delete ignores HTTP status entirely, and save closes the editor without waiting for success. An HTTP 500 can appear to have removed a record until reload.
Fix: await writes, check response status, retain editor input on failure, and reconcile or roll back state.

### 17 — Medium: inbox and application delete controls do nothing
Evidence: `src/components/AdminDashboard.tsx:65-80`, `:283`, `:421`, `:762`.
The shared list renders delete buttons for message/application types, but handleDelete has no branch for either type. Application lists also expose generic add/edit controls without corresponding save handling.
Fix: implement dedicated message/application operations and render only supported actions.

### 18 — Medium: record updates bypass schema validation and missing IDs return success
Evidence: `server/routes.js:344-349`; schemas in `server/models/Schemas.js`.
findOneAndUpdate has no runValidators option; arbitrary supplied fields/operators go directly into the update. A nonexistent ID returns JSON null with 200. Review rating has no min/max; email/URL fields lack semantic checks.
Fix: request DTO allowlists, validated PATCH operations, server-owned ID/status/timestamps, and correct 400/404/409 responses.

### 19 — Medium: a single failed fetch can discard otherwise successful page data
Evidence: `src/context/DataContext.tsx:388-415`, `:420-437`.
Promise.all rejects the whole phase before any result is consumed. Up to three 60-second attempts plus backoff can delay initial content for roughly three minutes. Secondary loading has no separate readiness state; case-study detail reads the shared loading flag even though its collection is still loading.
Fix: independently settle resources, set sensible deadlines, abort on unmount and track collection-level loading/error state.

### 20 — Medium: collection reads are unbounded
Evidence: `server/routes.js:238`; application inline CV handling in `ExtraPages.tsx:35-49`.
Every read returns every record and every field, and caches the full payload for five minutes. Large collections/CVs increase memory, network and dashboard cost.
Fix: pagination, projections, indexed filtering and bounded cache policy; retrieve CVs only through authorized downloads.

### 21 — Medium: global error middleware runs before the routes it should handle
Evidence: `server/index.js:28-36`.
Express forwards route/parser errors through later handlers, so this early handler cannot normalize errors thrown by later routes, including upload errors. Most route handlers additionally expose raw err.message strings to clients.
Fix: final error middleware after routing, safe public messages, structured internal logs and typed application errors.

### 22 — Medium: asset deletion is non-atomic and ignores shared references
Evidence: `server/routes.js:356-396`.
Cloudinary images are destroyed before DB deletion; a DB failure leaves records pointing to deleted assets. Shared image URLs are not checked, and bulk replacement does not perform asset cleanup at all.
Fix: track media ownership/references and use a retryable cleanup job after successful record changes.

### 23 — Medium: local asset paths are sent to an external-image proxy
Evidence: `src/utils/imageProxy.ts:1-16`.
Any URL other than data/blob/Cloudinary, including `/logo.png`, is turned into a proxy request. The backend expects an absolute URL, so relative local images passed through this helper fail. Cloudinary detection also uses a substring rather than a parsed hostname.
Fix: return relative/same-origin paths unchanged and parse/allowlist external hosts.

### 24 — Medium: failed image uploads can save large data URLs as permanent content
Evidence: `src/components/admin/ImageUploader.tsx:93-105`; `src/utils/canvasUtils.ts:109`.
Upload failure invokes onImageChange with a base64 crop, enabling normal content save with inline image data. This bypasses media lifecycle controls, enlarges collection responses and can hit body/document limits.
Fix: preserve the local preview separately, prevent publication until durable upload succeeds, and offer retry.

### 25 — Medium: reset control does not reset system data
Evidence: `src/components/AdminDashboard.tsx:243-245`; `src/context/DataContext.tsx:633-635`.
The UI promises an irreversible reset to defaults, but only clears every localStorage key on this origin and reloads. Database contents remain unchanged; consent, language and unrelated same-origin app state may be erased.
Fix: rename/scope this as local preference reset or implement an explicitly controlled server reset workflow.

## Frontend, metadata and maintainability

### 26 — Medium: TypeScript checking is broken and omitted from build
Evidence: `audit-typescript.txt`; `vite.config.ts` aliases; `package.json` scripts.
79 diagnostics are currently hidden by transpile-only Vite builds. Version-suffixed import names are the largest source; other diagnostics remain after that group.
Fix: normal package import names or shared resolver configuration, resolve remaining types, and require typecheck in CI.

### 27 — Medium: no automated quality gate
Evidence: `.github/workflows/keep_alive.yml`, root/server package scripts.
There is no project test suite, lint/check pipeline or deployment validation gate; the backend test script is an intentional failure placeholder. The keep-alive workflow absorbs curl failures so its status can remain successful while endpoints fail.
Fix: focused authorization, privacy, write-failure and submission tests; build/typecheck on PRs; monitoring that fails meaningfully.

### 28 — Medium: forms, mobile navigation and dialogs have accessibility gaps
Evidence: homepage DOM inspection; `src/App.tsx:927-930`; `src/components/pages/ExtraPages.tsx:62-71`; cookie modal implementation.
Visible fields/selects lack programmatic labels; the mobile menu trigger is a clickable div without button semantics; custom modals lack focus trapping/restoration and dialog semantics. Clickable cards and icon-only controls have similar keyboard/name gaps.
Fix: semantic buttons/links, associated labels, accessible names, and shared accessible modal components. Follow with keyboard and screen-reader testing.

### 29 — Medium: duplicate and inconsistent SEO metadata
Evidence: browser `/contact` contains both homepage and contact canonicals/descriptions; static `index.html` metadata plus `src/components/SEO.tsx`.
Helmet inserts dynamic tags alongside unmanaged static ones. Static social metadata describes the homepage for every SPA URL before JavaScript runs. Homepage has no h1; unmatched routes redirect home instead of displaying a useful not-found page.
Fix: one metadata owner, route-specific render/prerender where social previews matter, semantic page headings and explicit 404 UX/status strategy.

### 30 — Medium: public content identity and contact links are inconsistent
Evidence: `src/components/premium/UIComponents.tsx:1803` and `index.html` organization schema; `src/components/SEO.tsx` social profiles.
The visible phone +880 (1343-042761) links to a different placeholder number; schema contains another placeholder number, and schema social handles differ from footer handles.
Fix: one verified company configuration for UI, structured data and contact actions. Verify public trust/certification/client claims against business records before carrying them into a redesigned site; their validity was not established by this audit.

### 31 — Medium: mutable, collision-prone title slugs identify content
Evidence: `src/App.tsx:50`, `:188-198`, project/service equivalents.
Changing a title changes its URL, punctuation can collapse distinct titles into one slug, and the ASCII-only regex strips Bengali text. find() resolves the first collision. No stored unique slug or redirect history exists.
Fix: stored unique stable slugs/IDs, Unicode-aware generation where needed and redirects for renamed pages.

### 32 — Medium: avoidable bundle and build complexity
Evidence: `src/App.tsx`, `src/components/premium/UIComponents.tsx`, `src/main.tsx`, `package.json` build script.
Large eagerly imported modules include admin and public page code; the root build installs dependencies again and then installs backend dependencies instead of enforcing a reproducible verification pipeline. Many package versions use wildcard ranges. No top-level React error boundary provides recovery from rendering faults.
Fix: route-level lazy loading (including admin), smaller feature modules, lockfile-based installation in CI, separate install/build/check steps, bounded dependency ranges and an error boundary with useful recovery.

### 33 — Low: analytics time ranges omit boundary-day submissions
Evidence: `src/components/admin/UserInteractionAnalytics.tsx:45-62`.
Weekly aggregate start/end Dates retain the current time of day while stored date-only values parse at midnight; records on a range start day can be excluded. UTC date creation and local date display can also disagree near midnight in Bangladesh.
Fix: consistent business timezone and normalized inclusive day boundaries with exclusive next-day upper bounds.

## Suggested update sequence

1. Contain exposure: server authentication/authorization, protected private reads, remove embedded credentials, restrict proxy/upload and public submission abuse.
2. Protect persistence: individual writes, transactions for deliberate imports, revision checks, backups and tested restore process; align local/production API configuration.
3. Make forms truthful: awaited server persistence, validated private file storage, recoverable errors and reliable email notifications.
4. Repair runtime/tooling: environment validation, ports/readiness/error handling, dependency upgrades/replacement, all TypeScript diagnostics and CI checks.
5. Improve product quality: accessible components, functional admin controls, consent-driven scripts, metadata/slug/contact consistency, lazy loading and performance checks.

Acceptance checks for implementation should include unauthenticated private reads/writes returning 401/403; authenticated least-privilege operations; injected write failures preserving data and form input; concurrent edits preserving new submissions; rejected consent preventing optional scripts; valid and failed contact/application/upload paths; typecheck/build passing; and representative mobile/keyboard checks. Real persistence and delivery validation require a configured non-production database and provider credentials.
