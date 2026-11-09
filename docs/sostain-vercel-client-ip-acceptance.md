# Sostain — Vercel client-IP deployment acceptance check

**2026-11-09 — code hardened, deployment verification still pending. Survey remains closed.**

## Documented Vercel behavior

Vercel's request-header documentation (https://vercel.com/docs/headers/request-headers) states that `x-vercel-forwarded-for` corresponds to `x-forwarded-for` normally, while intermediate proxies can change the behavior of the generic forwarded header. Its documentation also describes overwriting `x-forwarded-for` to mitigate spoofing in standard deployments.

The survey submission route intentionally reads only `x-vercel-forwarded-for`, now through `getVercelClientIp` in `lib/research/sostain/client-ip.ts`. It rejects absent, malformed, oversized or excessive-chain values, supports valid IPv4 and IPv6, and never falls back to a user-supplied generic forwarding header. An HMAC of the parsed IP is used as the rate-limit key, without saving the address in research records.

**Parsing syntax does not establish header provenance.** The infrastructure must be a trusted Vercel ingress (or separately audited reverse-proxy configuration). Do not treat a local header injected with curl as proof of anti-spoofing.

## Before release — deployment acceptance

- [ ] Confirm the Sostain domain reaches Vercel's trusted edge, and record whether any CDN, WAF or reverse proxy is between clients and Vercel.
- [ ] Confirm Vercel documentation for the actual routing configuration, header shape and spoofing behavior. If a custom proxy forwards traffic, obtain a security review before activation.
- [ ] Run `npx tsx --test tests/sostain-client-ip.test.ts`, `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- [ ] On an **isolated staging deployment** (not the live research database), verify the public submission endpoint can receive the expected Vercel-injected client-IP header, with both real IPv4 and IPv6 clients where feasible.
- [ ] Test spoofing attempts via externally supplied `x-vercel-forwarded-for` and `x-forwarded-for` and check that the edge enforces documented behavior. Never log or expose a raw visitor IP for this test; collect only pass/fail and HTTP codes in a restricted test record.
- [ ] Test real Turnstile hostname/action and Upstash rate limit with synthetic submissions and disposable Neon. Verify no records remain after cleanup.
- [ ] Confirm survey release flags are false in all existing deployments until all gates are approved.

## Launch blockers remaining

Actual deployed ingress/header trust validation, end-to-end real submission path, approved privacy notice and retention procedure, dependency/environment review, final launch authorization. Code hardening is not itself launch approval.
