# Sostain Phase 11 — Admin Security Hardening

Status: feature branch implementation, not yet locally validated or approved for release. Survey remains CLOSED.

## Changes (2026-11-09)
- `lib/research/sostain/admin-gate.ts`: common async authentication gate for the three admin APIs. Before evaluating credentials, rate-limit credentialed requests through the already-provisioned Sostain Upstash Redis service.
- Shared global 80/10min + per-claimed-username 30/10min fixed-window limits. Username becomes an HMAC-SHA256 digest using `SOSTAIN_RATE_LIMIT_KEY`, not raw credentials in Redis.
- Upstash failure, missing URL/token, or missing/short HMAC key => HTTP 503 **for credentialed requests**. Overlimit => HTTP 429 with Retry-After; cache control no-store.
- Empty/malformed or oversized Authorization headers => existing HTTP 401 without Upstash lookup. The three admin endpoints still reject anonymous requests with 401.
- All HTTP admin responses continue to deny caching. API functionality and CSV/Excel format unchanged.
- `scripts/check-sostain-release-gates.mjs`: expanded from 7 to 9 assertions including malformed/oversized Authorization headers.

## Important security limitations
- This is a risk-reduction measure, not MFA or a modern account/session system. Basic authorization is still browser-memory-based. Restrict admin use to localhost or HTTPS.
- Fixed windows and a shared global bucket may permit an attacker to induce temporary denial of admin access (429); acceptable for the closed small research pilot but **not** a general SaaS auth design.
- Credentialed requests are counted whether correct or incorrect; with normal admin activity, 30/user/10min and 80/global/10min should leave headroom. If counters are exceeded, wait for TTL rather than lowering them blindly.
- `SOSTAIN_RATE_LIMIT_KEY` must be a distinct, random >=32-character value. Never disclose secrets in terminals sent to chat, logs or commits.
- No trusted IP header is used in admin throttling. The public survey's `x-vercel-forwarded-for` trust assumptions still need deployment verification.
- Upstash REST `EXPIRE ... NX` support must be tested against the real local deployment. The gate fails closed if its replies are invalid.
- Password handling and authorization should eventually move to properly configured admin sessions, MFA, role scoping, secure auditing and better account recovery.
- Production dependency advisories remain: React Email nested deepmerge/html-to-text and ExcelJS uuid; avoid --force upgrades.
- Retention / deletion schedule, privacy approval, and public Turnstile/IP end-to-end checks remain launch blockers.

## Required verification after pull
Stop `npm run dev` before `npm run build`, and run:
```powershell
git status --short
git pull --ff-only origin feature/sostain-research-portal
npx --no-install tsc --noEmit
npm run lint
npm run build
```
Start `npm run dev`, then in a second PowerShell terminal:
```powershell
node --env-file=.env.local scripts/check-sostain-release-gates.mjs
```
Expect **9/9 PASS** while both survey release flags are false.

Verify admin login and **one CSV and one Excel download** using your normal test account. These credentialed requests must access Upstash; if they return 503, check local Upstash environment configuration and application logs without sharing secrets. If 429, wait for the 10-minute window to expire. Do not run brute-force tests against a shared production Upstash database.

Do not merge to master, deploy, change survey status to open or toggle release flags until all later review gates pass.

## Phase 11B: isolated rate-limit policy validation (2026-11-09)

Added `scripts/check-sostain-admin-throttle.mjs`. It uses cryptographically random diagnostic-only Redis keys and the **same Upstash INCR/EXPIRE-NX pipeline and threshold logic** as the admin gate.

Assertions:
- Counter 1 starts and is allowed.
- Account attempt 30 remains allowed; attempt 31 is denied (30/10m).
- Global attempt 80 remains allowed; attempt 81 is denied even when that account is below its individual threshold (80/10m).
- Redis TTLs are set and at most ten minutes.
- Four disposable keys are deleted in a finally block; deletion is verified.

Safety: never sends an admin password, reads a research DB, changes release flags or touches actual production admin counters. Use the existing local Upstash test configuration. The script writes **only its own four temporary Redis keys** and cleans them up. If cleanup fails, inspect the isolated diagnostic prefix before retrying.

Local run:
```powershell
git status --short
git pull --ff-only origin feature/sostain-research-portal
node --env-file=.env.local scripts/check-sostain-admin-throttle.mjs
```

This tests the live Redis pipeline and isolated policy semantics. It **does not** prove enforcement through the real admin HTTP route, isolation from an active attacker, or MFA/session integrity. Real-route attempts should only be tested with a separately configured, dedicated development Upstash database; avoid exhausting shared administrator counters.

Launch blockers unchanged: no public survey activation, pending full identity/MFA design, privacy retention/deletion, trusted production IP and Turnstile HTTP checks, and dependency advisories.
