# RizQara Tech

React/Vite frontend and Express/MongoDB API. Local development uses its own API and database. Site administration requires a server-verified administrator session.

## Requirements

- Node.js 22.12+ (CI uses Node 24).
- MongoDB 8+; MongoDB Database Tools for backup/restore.

## Local setup

```sh
npm ci
npm ci --prefix server
cp server/.env.example server/.env
```

Configure `MONGODB_URI`, `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH` in `server/.env`. Generate a unique password hash using `npm --prefix server run admin:password` with the password supplied on stdin; avoid putting a real password in shell history. No default administrator password exists in source.

Start a local MongoDB on the configured port, then:

```sh
npm run dev
```

- Website: http://localhost:3000
- API: http://localhost:5001/api
- Administrator: http://localhost:3000/admin
- Liveness: `/api/health`; database readiness: `/api/ready` (503 when disconnected).

For this workspace, an isolated local MongoDB has been started on port 27018 with data in `.local-data/mongo`. Local administrator credentials are in the ignored, private `.local-data/admin-credentials.txt` file. Do not use these development credentials in production. To restart that database after stopping it:

```sh
mongod --bind_ip 127.0.0.1 --port 27018 --dbpath "$PWD/.local-data/mongo" --logpath "$PWD/.local-data/mongodb.log"
```

Optional `npm run seed:public` copies only public website collections from the existing hosted API into the isolated `rizqara_local` database on port 27018. It refuses other destinations and preserves existing records. It never copies messages or applications and never writes to the hosted API.

## Checks

```sh
npm run check
npm audit
npm audit --prefix server
```

The integration suite starts a temporary MongoDB process and uses a uniquely named test database. Set `TEST_MONGODB_URI` instead to use an existing MongoDB server; only the suite's generated test database is dropped. Production or user databases are never used by the tests. The suite requires the `mongod` executable unless `TEST_MONGODB_URI` is provided.

CI runs typechecking, integration tests, production build and dependency audits on pushes and pull requests.

## Production deployment

Use a single public origin for the website and `/api`. Deploy this repository as a Node service with these build/start commands:

```sh
npm ci
npm ci --prefix server
npm run build
NODE_ENV=production npm start
```

Set `MONGODB_URI`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and `ALLOWED_ORIGINS` explicitly. Enable `TRUST_PROXY=1` only behind a known single reverse proxy. HTTPS is required for production session cookies. The Vercel configuration forwards requests to the existing Render hostname, including the Node-rendered route metadata. Deploy the updated Node service before switching the frontend proxy. Do not deploy only `dist` to a static host if route-specific previews and correct HTTP 404 statuses are required.

Administrator sessions are HttpOnly/SameSite cookies backed by this API process's bounded memory store. They expire after eight hours and are invalidated on restart. Run one API instance; shared session/rate-limit storage is required before scaling to multiple instances. Use a durable private volume for `PRIVATE_UPLOAD_DIR`; CVs are served only to signed-in administrators. Back up that directory separately from MongoDB.

## Optional providers

- Images: set the three `CLOUDINARY_*` variables. Only authenticated JPEG/PNG uploads up to 5 MB are accepted. Failed uploads preserve the previous image and cannot save a base64 fallback.
- Email notifications: set `RESEND_API_KEY`, `NOTIFICATION_FROM` (verified sender), and `NOTIFICATION_TO`. Submissions are stored before success is shown. A durable database queue retries notification failures with an idempotency key; it exposes delivery state in the inbox. Without provider settings, submissions remain available in the admin dashboard and notifications stay pending. No email was sent during local verification. [Resend API reference](https://resend.com/docs/api-reference/emails/send-email).
- Automatic translation: set `GOOGLE_TRANSLATE_API_KEY` for Google's official Basic Translation API; otherwise enter translations manually. Public English/Bengali switching does not require an external translation script. [Google Translation documentation](https://docs.cloud.google.com/translate/docs/translate-text).

## API behavior changes

Private lists/details and all content mutations require administrator authentication. Public messages/applications and video comments use dedicated, validated, rate-limited append endpoints. Collection-level PUT is disabled. Record updates require `__v`; deletes require an `If-Match` version. Stale operations return 409 rather than overwriting concurrent work. List responses contain at most 100 records with `X-Has-More` and `offset` pagination. CV submissions use multipart form data containing a PDF `cv` file up to 5 MB.

The unrestricted image proxy is removed. Images load from their original URLs, so an upstream host or ISP block can still make an external image unavailable. Configure a controlled CDN if those assets need mirroring.

## Recovery and media

```sh
npm --prefix server run backup
npm --prefix server run restore -- /absolute/path/to/archive.gz rizqara_restore_unique_name
npm --prefix server run media:inventory
```

Backup files are private, ignored by Git, and contain the full database. Restore only accepts a new database named `rizqara_restore_*` and refuses an existing destination. It never drops the source database. Test restores and configure backup scheduling/retention at the hosting provider. A local backup/restore was verified across 14 collections during this update.

Media deletion is deliberately separated from record deletion to preserve shared assets and survive database write failures. The media inventory command is read-only; review ownership, references and personal-data retention requirements before deleting old images or CV files. Legacy externally hosted CV URLs require a controlled migration into private storage; inline legacy PDF CVs remain available through the protected download endpoint.

See [the original audit](docs/PROJECT_AUDIT.md) and [the fix-by-fix status](docs/FIX_STATUS.md) for the findings, verification and remaining deployment requirements.
