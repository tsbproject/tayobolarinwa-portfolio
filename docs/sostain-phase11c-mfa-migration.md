# Sostain Phase 11C — Isolated Research Admin MFA / Session Migration

**Status: opt-in implementation requiring developer validation. Do NOT enable on production yet.**
No merge to master; Sostain survey must remain draft with both public release flags false.

## What was introduced
- New `SOSTAIN_ADMIN_SESSION_ENABLED` **server-only** flag. It is OFF unless explicitly set to `true`. Keep it false through the initial checks.
- Server-only TOTP validator: RFC 6238, SHA-1, 6 digits, 30-second interval, +/- 1 interval clock tolerance. Base32 secret must decode to >=20 bytes; it is never sent to the browser or printed to logs.
- `POST /api/research/sostain/admin/login`: validates same-site Origin and content-type; applies existing shared Upstash Basic credential throttle (30/account, 80/global per 10 minutes), verifies TOTP, prevents reuse of accepted time-step with atomic Redis SET NX EX, and creates a 30-minute Redis-backed opaque session. No raw password is stored in the session.
- `GET /api/research/sostain/admin/session`: validates session without passwords.
- `POST /api/research/sostain/admin/logout`: requires allowed Origin, deletes the Redis session, clears cookie. It refuses to declare signout completed if Redis is unavailable.
- Session cookie: opaque 32 random bytes (hex), httpOnly, SameSite Strict, Secure in production, scoped to `/api/research/sostain/admin`. Redis stores only SHA-256 session token digest, not raw token. Fixed 30-minute expiration.
- Existing protected admin overview, CSV and Excel endpoints use **only session validation** once the server flag is enabled. In disabled mode they continue the currently verified Basic+Upstash gate. The user interface supports the optional six-digit authenticator field and refresh session restore.
- MFA endpoints return 404 when the flag is disabled. Closed-mode security regression checks were extended from 9 to 12, including these 404 assertions.

## Important gaps and caveats
- These are first implementation changes, **not proof of completed MFA security or production readiness**.
- Admin login remains a single shared research administrator identity. No user directory, independent accounts, hardware security keys, recovery codes, device management, security event auditing, or fine-grained access roles yet.
- Browser UI can retain an already-loaded de-identified overview after the 30-minute session expires; server-side exports and data access are rejected. Clear/expire the UI in a follow-up hardening change.
- Upstash errors fail closed. Explicit logout requires Redis availability; closing browser, waiting 30 minutes or rotating secrets also terminates access.
- The TOTP secret is single-account and configured manually. Protect it in an authenticator and securely backed-up password vault. Loss of both device and secret requires server operator recovery.
- The legacy admin username and password still exist as the first factor. Do not share these or an Authorization header.
- MFA workflow needs direct validation against a separate local/staging environment before feature flag activation outside localhost.
- The survey's trusted Vercel client IP, release flow, privacy retention and deletion, and remaining dependency advisories still block public launch.

## Safe baseline validation (keep MFA mode disabled)

Before `git pull`, confirm local working tree is clean and preserve uncommitted work.

```powershell
git status --short
git pull --ff-only origin feature/sostain-research-portal
npx --no-install tsc --noEmit
npm run lint
npm run build
```

Stop the production build and start `npm run dev`, then in another terminal:

```powershell
node --env-file=.env.local scripts/check-sostain-release-gates.mjs
```

Expect **12/12 PASS** with `SOSTAIN_ADMIN_SESSION_ENABLED` unset/false and the two public survey flags false. Verify existing admin login and CSV/Excel export once; they should be unchanged. Any failure: do not enable the mode.


## Safer QR-based enrollment (recommended)

Before enabling MFA, scan an offline QR generated locally by \`scripts/sostain-mfa-enroll.mjs\`; do not paste a long TOTP secret or expose an \`otpauth://\` URL to a website. This helper:
- Requires both survey launch flags set to \`false\` in \`.env.local\`, and refuses to run if MFA mode is \`true\`.
- Generates a new 256-bit secret locally via Node.js cryptographic randomness.
- Writes a new secret to the existing local \`.env.local\` **without enabling MFA**. If a valid 52-character Base32 MFA secret already exists, it reuses it without changing the file; an invalid/placeholder value is rejected and not replaced.
- Uses a locally installed QR renderer to create a PNG within a random directory under the OS temporary directory (never \`public/\`, Git, or an online QR service).
- Prints **only the local file location**, not the secret or QR payload.

After pulling the feature branch, from repository root:

\`\`\`powershell
git status --short
git pull --ff-only origin feature/sostain-research-portal
npm install --no-save --package-lock=false qrcode
node scripts/sostain-mfa-enroll.mjs
\`\`\`

Use the output path privately to open the PNG on your own PC (for example, \`Start-Process 'FULL_PATH_FROM_TERMINAL'\`). Scan with Google Authenticator or another standard TOTP application. When scanning works, delete the PNG and the newly created empty temporary folder; **do not send the QR image or its URL to chat or anyone else**. Safeguard the secret already stored in \`.env.local\` with a private password-manager backup.

Once enrollment succeeds, set \`SOSTAIN_ADMIN_SESSION_ENABLED=true\` in \`.env.local\`, restart the local Next.js server, and follow the private validation steps below. Never enable the flag in Vercel at this stage.

If \`SOSTAIN_RESEARCH_ADMIN_TOTP_SECRET\` already exists and contains a valid 52-character Base32 value, the helper regenerates a QR from that same secret without modifying it. If the configured value is a placeholder or invalid, the helper stops with instructions to review that setting privately. Never share the secret or an enrollment QR.

The \`npm install --no-save --package-lock=false\` command only provides the local QR renderer; no production dependency or package-lock change is intended. Check \`git status --short\` afterwards for unexpected changes and do not commit any secret or QR output.

## MFA enrollment (manual fallback; local test only, after baseline passes)

1. Use a real authenticator app supporting six-digit SHA-1 TOTP at 30-second intervals. Generate a **unique 32-byte cryptographic random secret** and encode it in Base32 (52-character unpadded form).
2. For convenience, run this Node.js script **locally** to generate a Base32 secret. Do not paste its output into chat or commit it:
```powershell
node -e "const c=require('node:crypto');let bits=0,n=0,out='';const alpha='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';for(const b of c.randomBytes(32)){n=(n<<8)|b;bits+=8;while(bits>=5){bits-=5;out+=alpha[(n>>>bits)&31]}}if(bits)out+=alpha[(n<<(5-bits))&31];console.log(out)"
```
3. In your authenticator app, manually add the secret as a **time-based** account labelled `Sostain Research (Local)`, six digits, SHA-1, 30 seconds. Make sure the machine clock is synchronized.
4. In local `.env.local` set `SOSTAIN_RESEARCH_ADMIN_TOTP_SECRET="<YOUR_OWN_SECRET>"` and **only after enrollment** set `SOSTAIN_ADMIN_SESSION_ENABLED=true`. Preserve the existing username, newly rotated password, Upstash URL/token and `SOSTAIN_RATE_LIMIT_KEY`. Never print a real Authorization header.
5. Restart `npm run dev`. Go to `http://localhost:3000/research/sostain/admin` and login using username, password, and current six-digit code.
6. Confirm that admin overview, CSV and Excel export succeed. Refresh the page; the session should restore without requesting the password. Click Sign out; the page must return to login and the session API must reject the revoked token. Test wrong TOTP once. Do not brute-force or run the **12-check legacy script** with MFA mode enabled.
7. Change `SOSTAIN_ADMIN_SESSION_ENABLED=false` or remove it and restart the server to return to previously validated Basic mode if any failure occurs. This **rolls back only the local session mode**, not any release flags. Leave MFA mode disabled in Vercel until a separately reviewed deployment plan is approved.

## Review before enabling outside localhost
- Formal integration tests for successful login, wrong TOTP, replay, expired and revoked cookie, CSRF Origin enforcement, session storage fail-closed, throttling, and password rotation.
- Security review of shared account and recovery mechanism. Add audit logging and administrative identity controls.
- Verify HTTPS-only deployment and correct environment secret scope; do not expose local testing keys.
- Review subtle risks of TOTP replay reservation and concurrent requests.
- Re-run production build + closed survey checks before any release.

No background work, authentication migration, survey launch or production credential update is carried out automatically.


## Phase 11C security diagnostics (after local MFA activation)

Added \`scripts/check-sostain-admin-sessions.mjs\` to exercise *disposable, randomly named* Upstash keys and deny-path checks against the **local** admin HTTP routes. It requires \`SOSTAIN_ADMIN_SESSION_ENABLED=true\` and both public survey flags explicitly false.

\`\`\`powershell
git status --short
git pull --ff-only origin feature/sostain-research-portal
node --env-file=.env.local scripts/check-sostain-admin-sessions.mjs
\`\`\`

The diagnostic exercises the same underlying Redis primitives used by research sessions: one-time \`SET NX EX\` (replay reservation), fixed 30-minute TTL, a short *test-only* expiry (two seconds), explicit \`DEL\` and simulated unavailable storage. It also makes **only unauthenticated / forged / disallowed-Origin** requests to the real local overview, CSV, Excel, login and logout HTTP endpoints. It sends **no passwords, MFA codes, real session cookies, or contact data**, and never uses real admin login/session keys.

**What it does not prove:** the normal 30-minute session actually expires in a running browser, TOTP RFC 6238 numeric matching, MFA-login route handling of a real replayed code, end-to-end correct rejection on actual Redis outage, or complete CSRF/browser security. The simulated outage verifies the isolated storage operation errors, not the full HTTP route's catch path. Those still need dedicated integration/chaos validation and a security review before production. The user's prior successful login, refresh, exports and logout establish working basic functionality but do not replace these tests.

Keep MFA enabled only in localhost. This script is **not** the earlier 12-check release test, which expects MFA disabled. Never run either script against a production origin. The new script uses temporary Redis writes and validates their deletion; it never changes research responses in Neon.
