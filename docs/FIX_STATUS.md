# Audit remediation status

10 November 2026, Asia/Dhaka. Findings refer to the original PROJECT_AUDIT.md. The changes are local and have not been deployed. This file distinguishes implemented code from external configuration and business verification.

| # | Finding | Implementation / verification |
|---|---|---|
| 01 | Unauthenticated writes | Server administrator middleware guards content writes; integration tests reject unauthenticated requests. |
| 02 | Public private records | Protected message/application reads and PDF downloads; private responses use no-store. |
| 03 | Client credentials | Removed embedded credentials and localStorage authentication. HttpOnly, expiring server sessions; local administrator provisioned privately. |
| 04 | Unrestricted image proxy | Removed; endpoint returns 410 and images use validated original URLs. |
| 05 | Destructive bulk save | Collection PUT returns 405 without touching data; real database test preserves existing records. |
| 06 | Concurrent overwrites | Individual writes with version checks; atomic comment append; concurrent edit tests return one success and one conflict. |
| 07 | Hosted/local confusion | Central /api client with credentials and deadline, one environment configuration and local Vite proxy. |
| 08 | Unbounded uploads/abuse | File signature/size checks, 256 KB JSON limit, per-operation rate limits, protected uploads/translation. Oversized and invalid image tests pass. |
| 09 | Dependency advisories | Vulnerable translation chain removed, dependencies updated, nodemon replaced with Node watch; both current npm scans report zero advisories. |
| 10 | False contact/newsletter/chat success | Success requires confirmed database acceptance; errors preserve input. Optional email notifications use a durable retry queue. Browser contact submission verified locally. |
| 11 | Simulated application success | Awaited multipart submission; private PDF storage; file validation; protected download test passes. |
| 12 | Ineffective consent | Optional scripts load only for saved consent; revocation clears known tracking cookies and reloads. Browser verified zero tracking scripts after revocation. |
| 13 | Misleading DB health | Separate readiness/liveness, explicit disconnected 503 responses, production environment validation, and local MongoDB configured. |
| 14 | Port/setup mismatch | Backend 5001 and frontend 3000 aligned; environment examples and README updated. |
| 15 | Shadowed API health | Operational routes precede generic routes; tested. |
| 16 | Failed writes hidden | No optimistic removal; saves await server and preserve editor on failure; versioned deletes check status. |
| 17 | Broken private admin controls | Message/application deletes wired, unsupported add/edit hidden, mark-read and application-status controls implemented. |
| 18 | Unvalidated updates | Schema validators, field allowlists, server-owned identity, validated public forms, rating/email rules, 400/404/409 responses; invalid update tests preserve records. |
| 19 | Fetch coupling/loading | Independent settled loads, collection-group readiness, abort deadline and retry banner. |
| 20 | Unbounded reads | Bounded per-page reads with pagination; CV contents omitted from list payloads. Pagination tests pass. |
| 21 | Error middleware order | Final error handler normalizes errors and protects internal details; malformed uploads/validation follow it. |
| 22 | Unsafe media deletion | Automatic image destruction removed from record deletes; shared assets retained. Read-only reference inventory supplied; cleanup/retention remains an operator-reviewed maintenance action. |
| 23 | Relative image proxy errors | Relative paths preserved; external schemes/hosts parsed; unnecessary proxy removed. |
| 24 | Failed upload base64 publication | Failed upload leaves existing durable URL intact. Client validates size/type and read errors. |
| 25 | Misleading reset | Local language-only reset, updated English/Bengali labels; other origin preferences preserved. |
| 26 | TypeScript failures | Normal package imports, redundant Vite aliases removed, all 79 original diagnostics resolved; typecheck is required by build/CI. |
| 27 | No quality gate | Real MongoDB integration suite, typecheck/build and advisory checks in CI; keep-alive requests fail meaningfully. |
| 28 | Accessibility gaps | Named native controls, linked admin field labels, keyboard-operable cards/menu, shared modal focus/escape behavior. Sampled 390 px contact page has no unnamed fields or horizontal overflow. Full WCAG certification is not claimed. |
| 29 | Metadata/404 defects | Single client metadata owner, server-rendered route metadata/fallback content, real production 404 status, admin noindex and page headings. Tests cover canonical uniqueness and entry-script integrity. |
| 30 | Inconsistent public identity | Contact dial target corrected and social schema handles aligned. Company/client/certification claims still require owner verification; code cannot establish their truth. |
| 31 | Mutable slugs | Persisted unique slugs for new/edited content, ID-based fallback, Unicode-aware generation, legacy aliases preserved. Title-edit test passes. |
| 32 | Build/bundle structure | Reproducible lockfile installs, separate checks/build, bounded versions, lazy administrator bundle, extracted API/content/consent/dialog utilities, render error boundary. Larger public-page modules remain a future maintainability improvement. |
| 33 | Analytics date boundaries | Asia/Dhaka day keys, consistent boundaries and month/year grouping; invalid dates are ignored. |

## Verification

- `npm run check`: TypeScript, 19 real-MongoDB integration tests and Vite production build passed.
- Root and server npm audit reports: zero advisories at verification time; see `audit-dependencies-*-after.json`.
- Local `/api/ready`: 200 with the isolated local database connected.
- Browser: administrator login/logout, populated dashboard, mobile navigation, contact submission, one canonical, page heading and consent revocation verified. The synthetic local submission was removed after verification. No production/private hosted collection was read or changed.
- Backup created locally and restored into a fresh isolated database; all 14 collection counts matched. Only the disposable restore database was dropped after verification; original data and the backup remain intact.
- Media inventory generated without deleting assets.
- Local public data copied into a development-only database; real provider credentials were not present.

## Still requires configuration or owner action

1. Deploy the Node service and same-origin frontend proxy together. The hosted site still runs its existing code until deployment.
2. Configure production MongoDB, a unique administrator hash, HTTPS/trusted proxy settings, and exact allowed origins. Existing embedded credentials must be rotated anywhere they were reused; that cannot be inferred or performed across other systems from this checkout.
3. Configure Cloudinary, Google Translation, and a verified Resend sender/recipient to enable those provider features. Provider delivery/upload/translation could not be exercised without credentials; provider calls are bounded and failures are explicit.
4. Provision persistent private CV storage and scheduled database/file backups. A local restore was tested; hosting-provider backup schedules and retention were not changed.
5. Review legacy externally hosted CVs, shared media cleanup, retention, and company/client/certification claims with the owner. The inventory does not delete assets.
6. The current session/rate-limit stores are scoped to one API process. Keep a single instance or add a shared store before horizontal scaling. Sessions intentionally end on restart.
7. The public-page code can be split further in a subsequent refactor. This update isolates the administrator bundle and key shared responsibilities without rewriting the site's design.
