# Sostain Phase 13 — concise final acceptance and handoff

**Date:** 2026-11-09. **Decision:** Continue staging acceptance. **Public survey remains NO-GO** until the recorded founder privacy decision and real positive HTTP path test. This is the Sostain research portal, NOT approval to build the full three-agent SaaS.

## Completed — do NOT rerun

- Isolated Neon guard and empty draft survey; Preview read-only preflight **9/9 PASS**.
- Preview-only component integration **14/14 PASS**: Upstash first six accepted / seventh rejected; malformed Turnstile token rejected; two synthetic Neon responses, idempotent retry, contact consent separation, closed draft guard, synthetic cleanup and final draft verified.
- Diagnostics for environment flags **6/6 PASS** after selecting fresh Preview deployment; both flags remain explicitly false in verified diagnostic.
- Temporary routes `/api/research/sostain/staging-preflight` and `/api/research/sostain/staging-integration` both returned JSON 404 on the post-closure deployment `1fggshpyy`, commit `a0b8b30`.
- Protecting Preview via Vercel Authentication remained enabled; Vercel CLI granted an automation bypass credential during testing. **Revocation not yet confirmed**.

## Final three technical acceptance gates

### 13-A: Edge IP trust and negative HTTP security checks

Vercel documentation: https://vercel.com/docs/headers/request-headers states ordinary `x-forwarded-for` is overwritten by Vercel to prevent client spoofing, and `x-vercel-forwarded-for` matches the trusted forwarded address. The current submit handler relies on `getVercelClientIp(x-vercel-forwarded-for)`; local parser unit tests passed. **Documentation plus observed syntactic validity is NOT a live forged-header acceptance test.** Test with a controlled authenticated, read-only Preview diagnostic that hashes/compares trusted forwarded IPs and never returns an IP. Keep fake `x-vercel-forwarded-for` request headers from determining identity or bypassing rate limit. Fail closed if unexpected behaviour.

Keep real public API `/api/research/sostain/submit` closed; a synthetic POST with proper content to deployed Preview should return 503 at the backend gate; invalid origin and other validation cannot be exercised unless a strictly isolated, authenticated staging route is provided.

### 13-B: Cloudflare real token and complete HTTP submission

Cloudflare official testing instructions https://developers.cloudflare.com/turnstile/troubleshooting/testing/ explicitly say success test secret results contain `hostname=example.com` and omit `action`. Hence test keys cannot prove the code's real `hostname` / `sostain-survey` action guard. Do NOT add generic `.vercel.app` to the production hostname allowlist or special-case a dummy success as production-quality.

One pass: establish a **single fixed staging hostname** in Cloudflare Turnstile's widget allowed domains and configure Preview-specific real site/secret keys, retaining production keys unchanged. Require Vercel Preview protection, independent Neon guarded test branch, authenticated test invocation, an exact Preview hostname/action allowlist; test the **real** `POST /api/research/sostain/submit` only through a strictly scoped and removable staging harness that refuses writes unless both public release flags are false and the disposable DB guard is present. Include real Turnstile positive and negative/replay, valid no-contact and opted-in responses, idempotency, invalid/oversized payload, origin, honeypot, 429, survey draft gate. Cleanup synthetic UUIDs and restore draft; verify participant tables empty. Remove/disable the harness after one successful pass. This is the **only uncompleted significant new engineering test**; previous tests do not substitute.

### 13-C: Lightweight production safety review

Run locally on feature branch: `npx --no-install tsc --noEmit`, `npm run lint`, `npm run build`, `npm audit --omit=dev`, `npm audit`. Review severity/reachability, do not run `npm audit fix --force` blindly. Verify production admin credentials exist and MFA session mode is actually enabled; Vercel variable-name audit previously did not show `SOSTAIN_RESEARCH_ADMIN_USERNAME` and `SOSTAIN_RESEARCH_ADMIN_PASSWORD`. Verify Preview and Production DB endpoints separate, Turnstile key domains and privacy routes, and no staging switches enabled in Production. No secrets in transcripts.

## Founder approvals (remaining launch blockers, not engineering features)

**Research operator:** Tayo Bolarinwa personally, not Marvel Creative Media, Kielflo, or a new Sostain company. Published privacy notice remains a pre-launch draft. Decide whether to approve the *proposed* contact-retention ceiling of 90 days and response-record ceiling of 365 days; these are NOT yet operational promises. Confirm a concrete, safe manual privacy request, deletion, backup and retention calendar, final notice/legal basis and cross-border-service disclosure. No invented approvals. Public opening requires all acceptance results and explicit founder sign-off.

## Mandatory state / handoff

- Branch: `feature/sostain-research-portal` at latest audited continuation point `a0b8b30`; this document adds a subsequent commit.
- Portfolio site: `tayobolarinwa.dev/research/sostain`; repository `tsbproject/tayobolarinwa-portfolio`.
- Production and Preview release flags `NEXT_PUBLIC_SOSTAIN_SURVEY_OPEN=false`, `SOSTAIN_SURVEY_BACKEND_READY=false`. Preserve Neon main survey in `draft`; only disposable Neon test branch may be used for additional tests.
- Never merge to master or open the survey without recorded completion of 13-A/B/C and privacy approval. Never claim 14/14 is full public POST E2E.
- After final test: disable all test flags, redeploy and see both staging route 404, revoke the temporary Vercel CLI automation protection bypass, retain Vercel SSO, verify zero synthetic rows and database survey draft, record release sign-off.
- **Fastest route to other work:** stop adding research portal features. Complete the single positive full-path isolated acceptance scenario, approvals, and bypass revocation. Once the research portal is sign-off ready, return to the higher-level Sostain customer discovery and three-agent business operating system planning.
