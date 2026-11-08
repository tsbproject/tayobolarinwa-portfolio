# Sostain Research Portal — Integration and Release Notes

Status: **pre-launch; NOT accepting submissions**. This branch is intentionally not deployable as a collecting survey until its backing infrastructure is provisioned and tested.

## Current state
- Public survey page: `/research/sostain`; five steps, mobile-first; schema-driven validation; optional interview opt-in.
- Versioned, typed question catalogue: `lib/research/sostain/`.
- POST route: `/api/research/sostain/submit`; origin, content-type, size, schema and honeypot checks.
- **The POST route deliberately returns HTTP 503 for all otherwise valid submissions; nothing is stored.**
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
