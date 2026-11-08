# Sostain Research Portal — Integration and Release Notes

Status: **pre-launch; NOT accepting submissions**. This branch is intentionally not deployable as a collecting survey until its backing infrastructure is provisioned and tested.

## Short-form research decision (2026-11-08)
- Founder feedback: a lengthy questionnaire risks abandonment by busy Nigerian SME respondents.
- Reduced the earlier long-form v1.0 survey to **v1.1-short: 7 core questions in 2 steps**; the follow-up invitation is optional.
- Target completion time: **2–3 minutes**, subject to piloting with five businesses (not a measured claim).
- Core questions: business category, team size, main customer channel, current recordkeeping, top two challenges, challenge frequency, indicative monthly price.
- Deferred: detailed finance, invoices, expenses, late-payment workflows, AI acceptance, and software adoption to **interviews**, not the initial survey.
- Preserve prior schema v1.0 in Git history; do not merge response datasets across differing survey versions without mapping.

## Current state
- Public survey page: `/research/sostain`; two steps and seven core questions, mobile-first; schema-driven validation; optional interview opt-in; explicitly disabled until NEXT_PUBLIC_SOSTAIN_SURVEY_OPEN=true.
- Versioned, typed question catalogue: `lib/research/sostain/`.
- POST route: `/api/research/sostain/submit`; origin, content-type, size, schema and honeypot checks.
- **The POST route deliberately returns HTTP 503 while the backend-only release gate is disabled.** Atomic Neon persistence code has been written, but this code is NOT activated or database-tested yet. Do not enable flags until the database/schema/security/privacy/QA gates pass.
- Turnstile client widget and server-side Siteverify plus Redis REST distributed rate-limit helpers are present but cannot be end-to-end tested without credentials.
- Proposed SQL schema is in `docs/sostain-research-schema.sql`; it has NOT been executed in a database.
- A CSV-safe serialization helper exists, but no authenticated export endpoint exists yet.
- Thank-you page only follows an actual successful response; under the current route that cannot occur.
- No changes to global portfolio header/footer, existing consultation route, or shared API security pipeline.

## Production blockers — must resolve before public recruitment
1. Provision **separate** research PostgreSQL database, credentials, backups, retention and access policy.
2. Install `@neondatabase/serverless@1.2.0` locally and commit the updated package-lock.json; GitHub code has the updated package.json but NOT a matching lockfile. CI/npm ci will fail until this step is done.
3. **Implementation written, not tested:** transaction-safe atomic persistence (survey response, consent and optional contact), stable client retry submissionId and duplicate handling. Apply schema, validate DB write permissions and run end-to-end duplicate/retry tests.
4. Add persistent distributed rate limiting, not the existing development `LocalRateLimiter` which always allows requests.
5. Integrate Turnstile on client + server using Siteverify, verifying token before any storage.
6. Add authenticated, audit-logged, formula-injection-safe CSV export that excludes direct contact fields by default.
7. Publish an accurate research privacy notice (controller identity, lawful basis, recipients, retention, deletion and rights contact). Do not treat the single acknowledgement checkbox as a substitute for other lawful-basis requirements.
8. Add production tests, baseline verification of portfolio and consultation, TypeScript, ESLint and full build.
9. Pilot with five consenting SMEs before wider distribution; adjust survey duration and language.

## Existing portfolio security finding
`app/api/consultation/route.ts` sets `requireRateLimit` and `requireTurnstile`, but `app/_lib/security/api/pipeline.ts` currently ignores these flags. `LocalRateLimiter` is permissive. Perform **a separate, explicitly tested security-hardening change** before publishing Sostain. Avoid silently breaking the existing consultation flow by enabling fail-closed dependencies without configured production secrets.

## Database design (proposed)
- `research_surveys`: id, version, published_at, status.
- `research_responses`: id (opaque UUID), survey_version, structured_answers (JSONB), business_category, submitted_at, recruitment_source; unique submission id.
- `research_consents`: response_id, privacy_notice_version, relevant consent/preferences, timestamp.
- `research_contacts`: response_id, optional name and contact, explicit follow-up permission, retention/deletion status.
Store contacts separately, avoid raw payload logs, restrict access using least privilege, and set explicit retention limits.

## Change boundaries
- No new links in the global navigation, no changes to homepage, case studies, journal, résumé or consultation.
- Use a dedicated feature branch; only merge after the security, database and QA gates pass.
- Sostain commercial SaaS remains **research-only** and separate from the portfolio research module.

## GitHub branch
`feature/sostain-research-portal`


## Configuration inventory (DO NOT add values to Git)
- `NEXT_PUBLIC_SOSTAIN_SURVEY_OPEN` — defaults to false. Only activate after all release checks pass.
- `SOSTAIN_SURVEY_BACKEND_READY` — defaults to false. Must not activate until transactional persistence is implemented and tested.
- `NEXT_PUBLIC_SOSTAIN_TURNSTILE_SITE_KEY` — public Cloudflare Turnstile site key.
- `SOSTAIN_TURNSTILE_SECRET_KEY` — secret Cloudflare Turnstile verification key.
- `SOSTAIN_UPSTASH_REDIS_REST_URL` and `SOSTAIN_UPSTASH_REDIS_REST_TOKEN` — durable shared rate-limit connection.
- `SOSTAIN_RATE_LIMIT_KEY` — random secret used to HMAC client IP before sending Redis keys; set using a secret manager.
- **Database credentials**: Not yet defined in the app, because the database driver, migration ownership, and target Neon instance must be explicitly provisioned and tested first.

## Local sync after feature branch development
From the existing Windows PowerShell clone:
```powershell
cd C:\Users\MarvelCMedia\Documents\tayobolarinwa-portfolio
git status --short
git fetch origin
git switch --track -c feature/sostain-research-portal origin/feature/sostain-research-portal
git status
npx tsc --noEmit
npm run lint
npm run build
```
**Important**: Stop if `git status --short` shows uncommitted changes or Git says the branch already exists. Do not reset or discard changes. If the branch already exists locally, use `git switch feature/sostain-research-portal` then `git pull --ff-only origin feature/sostain-research-portal`. Resolve baseline errors before launch.

## Preliminary security cautions
- Verify the application actually receives a trusted, non-user-controllable `x-vercel-forwarded-for` header in its deployment environment before activating any submission. Reject missing or untrusted IP source; do not use arbitrary forwarded headers.
- Verify Redis REST `EXPIRE NX` support and rate-limit semantics in integration tests.
- Confirm Turnstile expected hostname/action for both production and permitted preview environments.
- Add user-facing rights/contact link and complete the privacy notice before using the survey.
- Current code changes have NOT been validated locally with a full Next.js build. A Vercel status check is not a substitute for functional testing.


## Phase 2 Neon connection handoff (2026-11-08)
The Neon research project was created by the founder. Database connection, migration execution and storage tests have **not yet** been performed.

**1. On the local portfolio feature branch**, after checking for a clean working tree:
```powershell
git pull --ff-only origin feature/sostain-research-portal
npm install @neondatabase/serverless@1.2.0
npx --no-install tsc --noEmit
npm run lint
npm run build
git status --short
```
This updates `package-lock.json` to match the dependency already declared in `package.json`.
**Do not run `npm ci` before updating the lockfile.** GitHub preview deployments may fail while the lockfile is incomplete.

**2. Add your research connection string to your LOCAL `.env.local` file** (never paste it into chat or commit it):
```dotenv
SOSTAIN_RESEARCH_DATABASE_URL="postgresql://...your-new-Neon-research-connection..."
NEXT_PUBLIC_SOSTAIN_SURVEY_OPEN=false
SOSTAIN_SURVEY_BACKEND_READY=false
```
Use the separate Sostain research project, not the portfolio or future SaaS database. Verify `.env.local` is ignored by Git.
The source can remain in the Neon console; keep the database credentials out of all screenshots and logs.

**3. Run the SQL in Neon Console -> SQL Editor**, selecting the new Sostain research project:
`docs/sostain-research-schema.sql`
It inserts the initial survey record with `status='draft'`; this is intentional.

**4. Verify the connection and schema**:
```powershell
node --env-file=.env.local scripts/check-sostain-database.mjs
```
Expected: connection OK, tables OK, survey status draft. No responses or personal details printed.

**5. Do not activate the collection flags yet.**
Production activation additionally requires the Redis REST rate limiter and Cloudflare Turnstile credentials, privacy notice, tests, and an authenticated export service. The database must use a least-privilege application role (no schema changes), and private contact fields must never enter analytics JSON.

**6. Sync the dependency lockfile back to GitHub only once validation passes**:
```powershell
git add package-lock.json
git commit -m "Lock Neon driver for Sostain research database"
git push origin feature/sostain-research-portal
```
Do not commit `.env.local`, credential files, or downloaded database exports.

### Security and deployment notes
- The backend fails closed with HTTP 503 unless `SOSTAIN_SURVEY_BACKEND_READY=true`.
- Frontend Submit remains disabled unless `NEXT_PUBLIC_SOSTAIN_SURVEY_OPEN=true`.
- The database write checks the survey record status is `open` inside the SQL statement.
- These are **three independent checks**, each requiring an intentional release decision after validation.
- PostgreSQL uses a single data-modifying CTE statement for atomicity. It returns `stored`, `duplicate` or `closed`.
- The site remains research-only and the portfolio's existing consultation pipeline has not been modified.


## Phase 3: Database integrity smoke test (2026-11-08)
With the Neon database created, schema committed, and local connection check passing, run the test script
`docs/sostain-research-integrity-smoke-test.sql` **in the dedicated Neon SQL Editor only**, after inspecting its contents.

The script starts a transaction, temporarily opens the `draft` survey **within that uncommitted transaction only**, verifies atomic response + consent, optional contact separation, duplicate-blocking, and the draft guard; it then explicitly **ROLLBACK**s every test write. The expected notice is `PASS: atomic response/consent inserts...` and final survey status `draft`.

Safety requirements:
- Do not remove or change `ROLLBACK` to `COMMIT`.
- Do not run in any other Neon project or on a survey already open to real respondents.
- If any statement errors, run `ROLLBACK;` separately and verify the survey status is still `draft`.
- This is a **database SQL smoke test**, not a full test of the TypeScript `persistResearchResponse` function nor the HTTP security pipeline; those require subsequent isolated integration tests.
- Keep frontend and backend launch flags false pending the Turnstile, Redis, privacy notice, rate-limit and endpoint checks.
- Confirm the local package-lock update has been pushed to GitHub before using `npm ci` in CI.


## Phase 4: Local-only Turnstile test
- `/research/sostain/turnstile-check` is only accessible when the Next.js runtime is `development`.
- `POST /api/research/sostain/turnstile-check` returns 404 outside development and only accepts `Origin: http://localhost:3000` in development.
- It verifies a real Cloudflare Turnstile token server-side, including allowed hostname (`localhost`) and the exact action `sostain-survey`. It does NOT write to Neon, use Redis or open the public submit endpoint.
- Required local `.env.local`: `NEXT_PUBLIC_SOSTAIN_TURNSTILE_SITE_KEY`, `SOSTAIN_TURNSTILE_SECRET_KEY`. Turnstile widget must explicitly allow `localhost` for local testing.
- Keep both `NEXT_PUBLIC_SOSTAIN_SURVEY_OPEN=false` and `SOSTAIN_SURVEY_BACKEND_READY=false`.
- Local command: `git pull --ff-only origin feature/sostain-research-portal` followed by `npm run dev`; visit `http://localhost:3000/research/sostain/turnstile-check`, complete challenge and choose Verify Turnstile.
- Expect `Cloudflare Turnstile verification: PASS. No survey answers were submitted.` Tokens are single use; refresh the diagnostic page for a new test.
- After the check, run `npx --no-install tsc --noEmit`, `npm run lint`, and `npm run build`.
- This does not validate rate limit plus Turnstile integration, production request IP extraction, privacy notice, nor authenticated exports. Public survey remains disabled.


## Phase 5: Combined local-only submission security check
- New local-only URL: `http://localhost:3000/research/sostain/integration-check`.
- New local-only API: `POST /api/research/sostain/integration-check`; returns 404 if `NODE_ENV` is not `development`, rejects non-localhost origins, and refuses testing if either survey release flag is true.
- This diagnostic validates a server-generated response against the actual Zod survey schema, checks a fresh short-lived Upstash rate-limit key, verifies an actual single-use Cloudflare Turnstile token, and invokes the Neon persistence gate while the survey status is `draft` (expect `closed`).
- No user answers or contacts are sent to Neon; successful completion means **no research response was stored**. This is not a public submit API test and does not prove transaction commit behavior or concurrency safety.
- **Before testing:** retain `NEXT_PUBLIC_SOSTAIN_SURVEY_OPEN=false` and `SOSTAIN_SURVEY_BACKEND_READY=false`; confirm the Neon survey status is `draft`, and that Turnstile/Upstash/Neon environment variables are present in local `.env.local`. Never set the survey status to `open` for this check.
- Pull the current feature branch, restart `npm run dev`, open the local URL, complete Turnstile if needed, and click **Run Combined Check**.
- Expected output: `PASS: schema validation, Upstash rate limit, Turnstile verification and Neon draft write gate. No survey response was stored.`
- Refresh the page before retrying; Turnstile tokens are single use.
- After this diagnostic, re-run TypeScript, lint and production build, and share any errors.
- Before production: verify request IP trust boundary and cleanly separate real write integration tests against an isolated test database; add privacy notice, protected CSV admin access and monitor dependency audit results.


## Phase 6: Pilot research administration (feature branch, not live)
- Private page: `/research/sostain/admin`. The static page contains **no private data**. Username/password are entered in a local client component and retained only in React memory for the session; they are not placed into URLs, localStorage or cookies.
- Protected endpoints: `GET /api/research/sostain/admin/overview` and `GET /api/research/sostain/admin/export`.
- Every API read validates the HTTP Basic Authorization header on the server using constant-time comparison of SHA-256 digests; missing credentials or invalid credentials return HTTP 401. Admin password must have at least 24 characters.
- Provide both variables locally and in the correct Vercel environment (after review):
```dotenv
SOSTAIN_RESEARCH_ADMIN_USERNAME="your-private-research-admin-id"
SOSTAIN_RESEARCH_ADMIN_PASSWORD="generate-a-long-random-password"
```
Use a unique random secret with a password manager. DO NOT put values in repository files, screenshots, chat or logs.
- The admin page displays total responses, category counts and up to 20 recent response summaries. No contacts or names are queried or exported.
- CSV export contains at most 10,000 rows, uses an explicit analytics-only column whitelist and has formula-injection escaping. If survey exceeds 10k responses, a future paginated export is required.
- This is an early-stage isolated credential gate **not a replacement for MFA/SSO**, authentication failure monitoring, session expiration, role-based access or audit trails. Do not offer it broadly to team members until a mature auth system has been reviewed.
- For production use, enforce HTTPS at the hosting layer. Locally, use `http://localhost:3000/research/sostain/admin`.
- With `status='draft'`, a zero-response overview is expected. Do not enable survey flags to test the admin interface.
- The admin credential is used with direct Authorization headers in fetch, not via URL query strings; the export is downloaded as a Blob after authenticated fetch.
- Verify an unauthenticated `GET /api/research/sostain/admin/overview` returns 401; valid local login returns count 0; CSV contains header only; bad password returns an error; secret values are never printed in console.
- Before launch: independently validate build/lint/TypeScript, test against a staged dataset, verify security headers and cache behaviour on deployed preview, resolve npm audit issues, and add stronger MFA-based research admin authentication if access expands.
