# Sostain Preview synthetic integration suite — 2026-11-09

**Status:** Implemented on feature branch. NOT yet compiled, deployed, executed or signed off.

## Scope

`POST /api/research/sostain/staging-integration` is a **synthetic component integration suite**, not a real browser-to-public-`/submit` end-to-end test. It uses existing, production-grade `checkRateLimit`, `verifyTurnstile` and `persistResearchResponseWithClient` helpers.

It checks:
- Vercel Preview environment on the exact Sostain feature branch, HTTPS same-origin Vercel URL, explicit `SOSTAIN_STAGING_INTEGRATION_ENABLED=true`.
- Constant-time preflight key authentication via `x-sostain-staging-key`; Vercel Deployment Protection must remain active.
- Both public submission flags explicitly `false`.
- Isolated Neon branch marker (`research_integration_test_guard`, `sostain-write-testing`) and an empty, draft survey before any write.
- Real Upstash fixed-window rate limiter: first six synthetic attempts accepted, seventh returns HTTP 429, under a random, temporary rate key (no global deletes).
- Cloudflare Turnstile refuses a fabricated token. **No positive CAPTCHA verification** is claimed.
- Two synthetic responses using the actual persistence helper; repeat submission deduplicated; consented contact kept out of analytics answers; draft survey prevents a third write.
- Cleanup deletes only generated UUIDs, verifies the entire test-branch participant tables are empty, and restores the draft status.

## Before execution

1. **Do not configure this on Production.** Keep `SOSTAIN_SURVEY_BACKEND_READY=false` and `NEXT_PUBLIC_SOSTAIN_SURVEY_OPEN=false` in both Preview and Production.
2. Existing read-only Preview preflight should have passed, including isolated database guard, empty tables, client-IP format, Redis PING and configured credentials.
3. Create Vercel Preview-only variable `SOSTAIN_STAGING_INTEGRATION_ENABLED=true` (branch scope preferred) while running this suite. The route reuses the separate 32+ character `SOSTAIN_STAGING_PREFLIGHT_KEY` for authorization.
4. Pull and build the latest feature-branch commit locally before deploying. Redeploy latest commit in Preview **after** configuring the variable; verify Vercel Preview status READY.
5. Use your existing linked Vercel CLI, which is authorized to access protected Preview deployments. Replace preview URL below with the **latest** deployment URL, and run in PowerShell:

```powershell
$previewUrl = "https://YOUR-LATEST-DEPLOYMENT.vercel.app"
$secureKey = Read-Host "Enter Sostain staging preflight key" -AsSecureString
$key = [System.Net.NetworkCredential]::new("", $secureKey).Password
try {
  vercel curl "$previewUrl/api/research/sostain/staging-integration" `
    -X POST `
    -H "Origin: $previewUrl" `
    -H "x-sostain-staging-key: $key" `
    -H "Content-Type: application/json" `
    --data-raw "{}"
} finally {
  Remove-Variable key, secureKey -ErrorAction SilentlyContinue
}
```

**Caution:** CLI arguments containing secrets may be exposed to local process inspection. Use only on your own trusted machine. Do not copy a command containing the actual key into tickets, GitHub or chat.

Expected HTTP 200 has all fourteen Boolean checks `true` and message `Preview-only synthetic integration passed. Cleanup verified; public survey unchanged.`

### If it fails

- A 404 means Preview switch is off, branch does not match, or the Preview deployment is stale.
- 403 indicates missing or incorrect test key / same-origin condition.
- 503 with a `false` check means a component failed.
- **If `syntheticCleanup` or `finalSurveyDraft` is false, DO NOT retry.** Inspect the isolated Neon test branch and restore its draft state/zero records safely. Do not touch Production database.
- The suite uses actual temporary DB writes. During the run only the isolated test branch survey may briefly be marked `open`, while the public `/submit` handler remains shut by its independent server-side flag.
- It should run once under operator control. Concurrent test runs are not supported.

## Post-test security closure

- Set `SOSTAIN_STAGING_INTEGRATION_ENABLED=false`, redeploy Preview, and confirm route returns 404.
- Set `SOSTAIN_STAGING_PREFLIGHT_ENABLED=false` too once no longer needed, redeploy.
- Revoke the temporary Vercel Protection Bypass for Automation credential added by `vercel curl` when Preview testing is complete. Leave deployment SSO protection enabled.
- Verify Neon test survey remains draft and all participant tables zero; Upstash synthetic rate keys expire after their 600-second TTL.

## Remaining true full HTTP submission acceptance gates

- Real Turnstile token **success** with appropriate action and trusted hostname. Current `verifyTurnstile` allowlist does NOT accept arbitrary Preview `.vercel.app` hostnames.
- End-to-end browser form through `POST /api/research/sostain/submit` with Preview-only gate and stringent isolated DB guard, without ever opening public production submissions.
- Trusted Vercel `x-vercel-forwarded-for` spoof-resistance test, not merely IP syntactic validity.
- Explicit privacy and retention approval; final security and production release sign-off.

This stage does not grant permission to open the public survey or merge the feature branch.
