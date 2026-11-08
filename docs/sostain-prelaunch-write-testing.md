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
