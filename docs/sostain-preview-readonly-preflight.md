# Sostain Preview-only preflight — 2026-11-09

**Status:** Implemented in source, not yet built, deployed or exercised. This is NOT the end-to-end survey submission test.

## Purpose

The read-only `POST /api/research/sostain/staging-preflight` checks:

- Actual Vercel environment is Preview, Git branch is `feature/sostain-research-portal`, request is HTTPS to a `.vercel.app` host and Origin matches the deployment.
- Test switch `SOSTAIN_STAGING_PREFLIGHT_ENABLED=true` and an independently generated `SOSTAIN_STAGING_PREFLIGHT_KEY` of at least 32 characters, passed in `x-sostain-staging-key`. **Never include the key in a query string, URL or public code.**
- Both survey-opening flags are explicitly `false`.
- Preview's `SOSTAIN_RESEARCH_DATABASE_URL` resolves to a Neon database containing the disposable `sostain-write-testing` guard, a draft survey and zero participant rows.
- Preview's Upstash REST credentials can perform a read-only `PING`.
- The Vercel client-IP header has a syntactically valid IPv4 or IPv6 address (this does NOT prove header spoof-resistance).
- Server-side Turnstile keys and the preview HMAC rate-limit key exist.

No raw database address, Redis URL, credentials, IP, names, participant IDs, or answer payloads are returned. No survey rows or Redis records are written. Failures produce HTTP 503 with boolean flags for diagnostic categories.

## Required setup (Preview only; do NOT enable Production)

1. Confirm Preview's database URL points to an independently isolated Neon branch with `research_integration_test_guard` set to `sostain-write-testing`. Do not rely merely on distinct URL text; two URLs can still reach one database.
2. Ensure all existing survey flags remain explicitly `false` in Preview and Production.
3. Create a new 32+ character random key using a cryptographic generator; store it in Vercel Preview as `SOSTAIN_STAGING_PREFLIGHT_KEY`. Do not reuse `SOSTAIN_RATE_LIMIT_KEY` or admin credentials.
4. Set `SOSTAIN_STAGING_PREFLIGHT_ENABLED=true` only on Preview and only during testing. Prefer a branch-specific Preview variable.
5. Deploy the current feature-branch commit to Vercel Preview. Confirm commit and deployment are READY. Vercel preview deployment may be SSO-protected; do not disable protection globally for the diagnostic.
6. Use an authorized HTTPS client that can access the protected deployment, with its deployment URL as the Origin and the staging key in the `x-sostain-staging-key` header. Do not transmit this key over untrusted services.
7. Expected: HTTP 200, message `Isolated Preview preflight passed; no survey data written.`, with all boolean checks true. HTTP 404 in production or with the switch off; HTTP 403 with wrong key; HTTP 503 if any prerequisite fails.
8. Switch `SOSTAIN_STAGING_PREFLIGHT_ENABLED=false` after verification and redeploy. The route will return HTTP 404.

## Important safety and known limitations

- The IP header check validates **format only**, not that Vercel overwrote spoofed client IPs. That separately requires ingress trust verification.
- Turnstile configured means keys are present, **not** that the `sostain-survey` challenge/action passes on the preview domain. Existing `verifyTurnstile` only allows `tayobolarinwa.dev`, `www.tayobolarinwa.dev` and localhost in development. A Preview `.vercel.app` token will fail this function today. Do not loosen allowed-host settings indiscriminately; choose a dedicated staging hostname and Cloudflare hostname setup or safely scoped test strategy before true HTTP submission tests.
- The public `POST /api/research/sostain/submit` must remain closed. No automatic testing endpoint should temporarily open the survey on Preview without strict isolation, auth and reliable cleanup.
- A read-only SQL guard and zero-table state does not establish absolute production DB separation or remove user responsibility to verify the selected Neon branch in its console.
- Shared Upstash Free Redis is **logical**, not physical, isolation; this endpoint uses PING only and does not alter shared keys.
- This route requires a new commit and redeployment; an older READY Preview deployment cannot contain it.

## Recommended PowerShell request (only if deployment protection permits authenticated access)

Set `$previewUrl` to your trusted, exact preview deployment URL (no trailing slash). The following prompts for the key instead of printing it:

```powershell
$previewUrl = "https://YOUR-PREVIEW-DEPLOYMENT.vercel.app"
$secret = Read-Host "Sostain staging preflight key"
Invoke-RestMethod -Method Post -Uri "$previewUrl/api/research/sostain/staging-preflight" -Headers @{
  "Origin" = $previewUrl
  "x-sostain-staging-key" = $secret
} -ContentType "application/json" -Body "{}"
Remove-Variable secret
```

If Vercel Deployment Protection challenges a PowerShell request, do not disable protection for convenience. Use a sanctioned authenticated deployment access workflow. Do not paste the key or full private URLs into shared chat logs.

**No production settings or research data were modified by creating this source file.**
