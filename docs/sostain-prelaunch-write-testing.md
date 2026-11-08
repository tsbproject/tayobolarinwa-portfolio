# Sostain research — controlled write testing and launch security gates

**Status: engineering checklist; do not activate public submissions.**
**Current survey record:** `1.1-short`, `draft`.
**Production collection flags:** both `NEXT_PUBLIC_SOSTAIN_SURVEY_OPEN=false` and `SOSTAIN_SURVEY_BACKEND_READY=false`.

## Isolation required for successful write integration tests

Do NOT switch `research_surveys.status` to `open` in the existing Sostain research Neon database for testing.

Instead:
1. In Neon, create a separate disposable **database branch** cloned from the research project, or a dedicated test project with the same schema. Use a branch/project with no real contact data. Review the branch's permissions and connection settings.
2. Copy the reviewed `docs/sostain-research-schema.sql` into that isolated database if needed. Assert that the schema is present and its survey status is `draft`.
3. Configure a **separate local-only secret** `SOSTAIN_RESEARCH_TEST_DATABASE_URL` in `.env.test.local` (not `.env.local`). Do not reuse `SOSTAIN_RESEARCH_DATABASE_URL`, and do not commit either file.
4. Verify that the configured staging hostname/database is not the production research project, and require an independent test-only sentinel table before any write test.
5. Validate a real write using the production `persistResearchResponse` function with a dedicated staging database and temporary configuration, not with a fake `SELECT` stub. Use fixed test-only responses that contain no real contact data.
6. Assert first `stored`, repeat `duplicate`, consent record count exactly 1, optional contact record exactly 0/1 as applicable, analytics JSON contains no direct-contact or Turnstile fields.
7. Verify open/draft gate by changing *only staging survey status*, using test IDs, then verify draft rejects new inserts.
8. Delete the test records on staging only and restore `draft`, even if tests fail. Re-check counts and record status independently.
9. Test the real HTTP API path separately with genuine Turnstile tokens and the verified Upstash policy, including malformed JSON, honeypot, origin, content-type, token reuse, retries, and failure-path behaviour.
10. Keep release flags false in all production/Vercel environments until tests pass, a privacy notice is finalised and risk review is complete.

## Current limitations blocking public launch

- **No verified successful `persistResearchResponse` write** through the application in an isolated Neon environment. Existing SQL integrity smoke test used an uncommitted ROLLBACK transaction.
- Public submission IP extraction currently expects `x-vercel-forwarded-for`. Its trusted-source semantics must be verified against the actual Vercel deployment before enabling. Missing header deliberately fails closed.
- Admin login uses a standalone long-password Basic scheme without MFA, account lockout, security-event audit or a robust brute-force gate. Keep the admin restricted to the founder until a hardened solution is implemented.
- Consent and contact deletion/retention processes require explicit policy, scheduled deletion design, and operational verification. The survey privacy notice is a prelaunch draft.
- The previous npm audit reported vulnerabilities. Re-run `npm audit --omit=dev` and `npm audit`, classify reachable runtime issues, and remediate without blind `--force` upgrades.
- The Sostain research portal is not the future multi-tenant Sostain SaaS application. Maintain separate data and secrets.

## Tests that have been reported successful by the founder

- Local Next.js production build, typecheck and lint.
- Neon schema connection and draft survey integrity SQL smoke test (rolled back).
- Upstash REST counter/expiration test with disposable key.
- Turnstile verification using a localhost token.
- Local combined Turnstile/Upstash/Neon draft-gate check with no stored responses.
- Protected admin login and export for an empty survey.
- Formatted Excel workbook visual checks, with only Overview and Responses worksheets in a fresh download.

These checks do **not** amount to full end-to-end collecting-survey validation.


## Phase 9: Actual application persistence check on disposable Neon branch (2026-11-08)

The founder has created a 7-day-expiring Neon branch named `sostain-write-testing`. No testing writes have been executed yet.

**Before any write:** In the Neon Console select `sostain-write-testing` specifically, not your main/default research branch. Run `docs/sostain-test-branch-guard.sql` in that branch's SQL Editor. Verify it returns exactly `sostain-write-testing`. The marker MUST NOT exist in the main branch.

Copy the **test branch's own** PostgreSQL connection URL to local `.env.local` under:
```dotenv
SOSTAIN_RESEARCH_TEST_DATABASE_URL="postgresql://YOUR_TEST_BRANCH_CONNECTION"
SOSTAIN_RESEARCH_TEST_RUN_KEY="A_UNIQUE_RANDOM_SECRET_AT_LEAST_32_CHARACTERS"
```
Do not replace or modify `SOSTAIN_RESEARCH_DATABASE_URL` (main research URL). The test URL must have a different Neon hostname and the branch must contain no real respondents. Use a unique random secret generated by a password manager or PowerShell crypto API; never paste secrets into chat.

**Run from Windows PowerShell after pulling and verifying the working tree:**
```powershell
cd C:\Users\MarvelCMedia\Documents\tayobolarinwa-portfolio
git status --short
git pull --ff-only origin feature/sostain-research-portal
npx --no-install tsc --noEmit
npm run lint
npm run build
```
Start `npm run dev` in one terminal. Then use a second terminal:
```powershell
node --env-file=.env.local scripts/run-sostain-write-check.mjs
```
Expected (after validation):
```text
HTTP 200
PASS: real Neon test-branch writes, consent separation, idempotent retry and draft gate. Synthetic records deleted and test survey restored to draft.
```

The test endpoint:
- Is 404 outside `NODE_ENV=development`, checks localhost Origin, requires both public survey flags false, and requires a long secret in a request header.
- Refuses if primary and test Neon hostnames are identical; refuses a test database without the explicit `research_integration_test_guard` marker.
- Requires test survey to start in `draft`, briefly sets **only the isolated test survey** to `open`, uses the real `persistResearchResponseWithClient` logic for two synthetic submissions and an idempotent retry, checks consent separation and draft gating, then deletes its synthetic UUIDs and resets test status to draft.
- Does NOT send real data, accept respondent input, or access the public survey submission route.
- Has best-effort cleanup in `finally`; if cleanup cannot be confirmed, STOP and inspect the isolated Neon branch manually before retrying.

**Independent verification in the Neon test branch after a successful run:**
```sql
SELECT version, status FROM research_surveys WHERE version = '1.1-short';
SELECT COUNT(*) AS response_count FROM research_responses;
SELECT COUNT(*) AS consent_count FROM research_consents;
SELECT COUNT(*) AS contact_count FROM research_contacts;
```
For a fresh empty branch, expect `draft` and zero in each table. If any assertions fail or residual data remain, do not use this branch for further tests until inspected.

This test still does NOT establish production request IP trust, admin MFA, full HTTP submission endpoint correctness, or public-launch readiness. Keep the main Neon survey `draft` and both public release flags false. The test branch will expire in 7 days.
