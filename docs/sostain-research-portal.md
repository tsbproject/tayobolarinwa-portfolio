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
- **The POST route deliberately returns HTTP 503 and nothing is stored.** The independent server-only release gate requires SOSTAIN_SURVEY_BACKEND_READY=true, but there is STILL no persistence implementation; setting flags alone does NOT open a functional survey.
- Turnstile client widget and server-side Siteverify plus Redis REST distributed rate-limit helpers are present but cannot be end-to-end tested without credentials.
- Proposed SQL schema is in `docs/sostain-research-schema.sql`; it has NOT been executed in a database.
- A CSV-safe serialization helper exists, but no authenticated export endpoint exists yet.
- Thank-you page only follows an actual successful response; under the current route that cannot occur.
- No changes to global portfolio header/footer, existing consultation route, or shared API security pipeline.

## Production blockers — must resolve before public recruitment
1. Provision **separate** research PostgreSQL database, credentials, backups, retention and access policy.
2. Choose/install a supported database driver or Prisma, including a consistent updated lockfile.
3. Implement transaction-safe persistence (research version, de-identified response, consent and optional contact separate), idempotency keyed by submissionId, and duplicate-handling tests.
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
