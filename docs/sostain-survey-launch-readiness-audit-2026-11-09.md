# Sostain seven-question survey — focused launch audit

**Audit date:** 2026-11-09. **Scope:** the existing research portal on `feature/sostain-research-portal`, not the future Sostain SaaS. **Decision:** NO-GO for opening public submissions today. Avoid starting another broad engineering phase.

This checklist distinguishes source-code inspection, founder-reported local checks, and genuinely missing validation. It does not assert that production was tested. Keep `NEXT_PUBLIC_SOSTAIN_SURVEY_OPEN=false`, `SOSTAIN_SURVEY_BACKEND_READY=false`, and the main Neon survey `draft` until all launch gates have evidence and approval.

## Already built — do not rebuild

| Capability | Evidence and boundary |
|---|---|
| Seven-question survey | `lib/research/sostain/questions.ts`, `schema.ts`, `app/research/sostain/page.tsx`; form implementation exists |
| Consent-separated persistence | `persistence.ts`, one atomic SQL operation and separate consent/contact records; isolated Phase 9 synthetic write/idempotency/draft-gate run founder-confirmed |
| Abuse prevention | `abuse-protection.ts` Cloudflare Turnstile hostname/action check and fail-closed Upstash 6/10-minute counter; components tested locally, not public-path end-to-end |
| MFA administration | TOTP and Redis opaque sessions, 30-minute expiry/revocation/replay protection; founder-reported session tests passed |
| Analytics and exports | Admin overview, anonymized CSV and Excel; local tests passed |
| Governance | Aggregate-only counts and proposed retention review, authenticated read-only route |
| Withdrawal and erasure SQL behavior | Disposable Neon transaction rehearsal returned successful statements and final ROLLBACK; independent draft/0/0/0 check passed |
| Privacy request review | Test-only GET/POST registration/approve/reject, audit events, duplicate-decision 409, anonymous 401, disabled 404; founder-confirmed HTTP and SQL events |
| Production deletion | Intentionally **not** available; test request review and SQL rehearsal are **not** a deployed participant-erasure service |

## Must complete before public recruitment — launch blockers

**P0-A: Final privacy notice, ownership verification and handling procedure.**
- Current `app/research/sostain/privacy/page.tsx` visibly states PRE-LAUNCH and retention TBD. Approve achievable contact/answer retention, rights/contact process, third-party processing/transfers, backup implications, and who responds to inquiries. Do not copy proposed 90/365 days into public commitments until approved and operationally supported.
- A documented, manually operated rights-response process may suffice for a small pilot if it is secure and legally reviewed; **do not need to build a full automated deletion product** merely to launch. Set a retention review calendar and document emergency containment and manual withdrawal/erasure procedure.

**P0-B: Verify deployed client IP and request origin assumptions.**
- `app/api/research/sostain/submit/route.ts` uses `x-vercel-forwarded-for` as its only IP source, then HMACs for Redis rate limiting. Verify that exact header is populated and trustworthy for the real Vercel deployment behind its proxy and cannot be arbitrarily spoofed by a client. Confirm expected handling of missing, multi-value and IPv6 headers. Keep closed if unverified.
- Verify trusted origins and Turnstile siteverify hostname/action on the actual deployed domain, not only localhost.

**P0-C: Execute one controlled full public submission HTTP-path test before opening.**
- Existing isolated write test invokes persistence logic but is **not** the real `POST /api/research/sostain/submit` path with real Turnstile, Upstash, proxy, validation and Neon writes together.
- Use a staging/deployment environment and test-only Neon branch, never main. Validate legitimate no-contact and opt-in submissions, retry idempotency, malformed/oversized payload, honeypot, cross-origin rejection, Turnstile replay/failure, rate-limit behavior, database failure, draft/closed gating, audit of unexpected stored PII and cleanup. Explicitly plan test flags and ensure default/live deployment remains closed.

**P0-D: Final environment and security review.**
- Run `npm audit --omit=dev` and `npm audit`; classify reachable advisories and remediate as appropriate without `--force`. Check secrets and env separation, production admin configuration, MFA requirement, least-privileged Neon role, HTTPS/cookie behavior and `Cache-Control: no-store` on sensitive endpoints. Avoid falling back to Basic-only admin protection when production release is approved; verify the intended deployed admin security mode.
- Confirm test-only write and privacy APIs remain unreachable in deployed production, and `SOSTAIN_PRIVACY_REQUEST_TEST_ENABLED=false`. Audit Vercel env settings and deployed branch rather than assuming local flags reflect production.

**P0-E: Release sign-off and reversible opening.**
- Founder reviews each P0 outcome. Record approved privacy notice version and live operations ownership; document rollback steps and monitoring checks.
- Only after all gates: promote the correct `research_surveys` record to `open` under a documented change, configure backend readiness and public UI flags, deploy/verify, and be ready to close submissions immediately on failure. Never treat a successful build as sufficient release authorization.

## Not blockers for a small, tightly controlled research pilot

- Full Sostain multi-tenant SaaS architecture, AI agent orchestration, billing and CRM.
- Automatic execution of approved privacy requests or a participant self-service deletion dashboard, provided a secure, workable manual rights process is approved and operated.
- Advanced analytics visualizations or researcher role-management UI.
- Automatic retention jobs **if** a documented lawful/manual retention-and-deletion procedure is approved, assigned and can reliably be executed. The absence of an automated job must not become indefinite retention.

## Recommended order and stop criteria

1. **Close privacy policy and operator procedures** (P0-A). Block if the retention promises cannot be honored.
2. **Validate deployment trust and third-party security integration** (P0-B).
3. **Run staging full-path HTTP tests** against disposable Neon and verify independent cleanup (P0-C).
4. **Audit dependencies and deployed environment** (P0-D).
5. **Founder sign-off, release with rollback** (P0-E).

**Known risk from code review:** `submit/route.ts` currently uses a platform-specific forwarded IP header that still requires production verification. The public privacy notice remains a draft. The documented end-to-end public HTTP collection test has not been evidenced. These are specific gaps; do not re-run completed Phase 9/11D/11E checks as substitutes.

### Status of historical continuity documents

Older engineering notes may say admin MFA or Neon persistence was not done because they were written before later phases. Use the actual current code and confirmed 2026-11-08/09 test results above as the baseline. Keep this audit as the current launch checklist; it does not supersede the detailed security procedures.

## 2026-11-09 targeted live Vercel metadata review (read-only)

Vercel project identified through the repository's Git link: `tayobolarinwa-portfolio` under `tsbprojects-projects`, framework Next.js, domains `tayobolarinwa.dev` and `www.tayobolarinwa.dev`. Project access settings showed Vercel SSO protection on non-custom domains; this is project metadata only, not a successful request-path test.

**Environment variable names/targets only were inspected. No secret values were decrypted.** Relevant observations:

- `SOSTAIN_SURVEY_BACKEND_READY` and `NEXT_PUBLIC_SOSTAIN_SURVEY_OPEN` are present for production and preview, but their **effective boolean values were not verified**. Keep both explicitly false.
- `SOSTAIN_RESEARCH_DATABASE_URL` exists for **both production and preview**. Critical staging safeguard: preview connection isolation has **not** been proven; assume preview can reach real data until independently confirmed. Do not turn on preview submissions before isolation is established.
- `SOSTAIN_RESEARCH_ADMIN_USERNAME` and `SOSTAIN_RESEARCH_ADMIN_PASSWORD` were **not present** among listed project variables. That would prevent successful configured admin login; verify there is no alternative source or deployment-specific configuration before calling production MFA operational. Do not add credentials without a deliberate production admin-access decision.
- `SOSTAIN_ADMIN_SESSION_ENABLED` and `SOSTAIN_RESEARCH_ADMIN_TOTP_SECRET` are present for production only; the configured flag **value was not verified**.
- `SOSTAIN_UPSTASH_REDIS_REST_TOKEN` and `SOSTAIN_RATE_LIMIT_KEY` appear for production only; `SOSTAIN_UPSTASH_REDIS_REST_URL` appears for preview and production. Thus preview's full Redis-backed submission pipeline is **not** demonstrably configured.
- `SOSTAIN_TURNSTILE_SECRET_KEY` and public site key appear for preview and production.
- `SOSTAIN_PRIVACY_REQUEST_TEST_ENABLED` is **not present** in the listed Vercel variables. The route is also development-only.
- The site/repository configuration was checked read-only. **No variables, domains, deployments, database surveys or production flags were modified.**

These metadata findings sharpen P0-D (deployed environment review). They do not validate the Vercel edge IP header, authentication end-to-end, Turnstile acceptance on the domain, or isolated public HTTP submissions. A verified, **separate staging database and secrets** are required before full-path testing.

### Privacy operator determination

The user has designated **Tayo Bolarinwa** as the individual responsible for Sostain research. `app/research/sostain/privacy/page.tsx` now reflects this and includes explicit draft limitations. The lawful basis, enforceable retention, transfer safeguards, contact-path delivery and final approval still need evidence before a final version is published.
