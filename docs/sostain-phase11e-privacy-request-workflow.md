# Sostain Phase 11E — Test-only privacy request review workflow

**Status:** Implementation committed; not yet locally typechecked, tested, migrated, or enabled. The public survey stays closed. No destructive participant operation exists in this API.

## Components

- `docs/sostain-phase11e-test-privacy-register.sql` creates a request register and append-only event table, only when the disposable test-branch guard is present, survey is draft and participant tables are empty.
- `app/api/research/sostain/admin/privacy-requests/route.ts` is a localhost-development-only, MFA-session-required test API. It requires `SOSTAIN_PRIVACY_REQUEST_TEST_ENABLED=true`, `SOSTAIN_ADMIN_SESSION_ENABLED=true`, separate main and disposable test database hostnames, the existing test-branch marker and empty participant tables.
- GET returns up to 50 requests' IDs, kinds, statuses and timestamps (no response IDs or evidence hashes).
- POST register records `withdraw_followup` or `erase_response` plus a preverified synthetic response UUID and SHA-256 evidence digest; never include private contact data in either.
- POST approve/reject transitions only `pending` requests and atomically records the audit event. A request can be reviewed only once; invalid follow-up transitions return 409.
- Even `approved` does **not** withdraw consent or erase any response, and there is no execution endpoint. All calls fail closed outside localhost development, and no legacy Basic-auth fallback exists.

**Important limitations:** No actual verification of participant ownership or rights request authenticity is automated. A digest merely references evidence assessed by an authorized operator; it is not itself proof of identity. An approved request is an administrative review state, not permission for an unattended deletion. Access is founder-only using the local MFA session. Request metadata (including a pseudonymous response UUID) still constitutes personal data in some contexts, and its lifecycle/retention needs explicit policy approval. The workflow has not been tested with real Neon or via HTTP. Do not launch.

## Next operator steps (ONLY disposable Neon branch)

1. Confirm SQL Editor displays the disposable `sostain-write-testing` branch. The guard must exist; `1.1-short` must remain `draft`; all three participant tables must be empty.
2. Apply `docs/sostain-phase11e-test-privacy-register.sql` in that branch only. **Unlike the previous rehearsal, this migration commits test-only tables.** Never run on the main research database.
3. In local PowerShell, with clean working tree, pull feature branch and run `npx --no-install tsc --noEmit`, `npm run lint`, `npm run build`. Do not set the feature flag until these checks pass.
4. In local-only `.env.local`, keep public flags false, set `SOSTAIN_PRIVACY_REQUEST_TEST_ENABLED=true`, `SOSTAIN_ADMIN_SESSION_ENABLED=true`, and ensure `SOSTAIN_RESEARCH_TEST_DATABASE_URL` points at the disposable test branch. Do not copy secrets into chat or commit them.
5. Start `npm run dev`, log into the admin using MFA and open `http://localhost:3000/api/research/sostain/admin/privacy-requests`. Expect `{"mode":"ISOLATED_TEST_ONLY","destructiveActionsEnabled":false,"items":[]}` on a fresh branch. Without MFA, expect HTTP 401. With feature flag false, expect HTTP 404.
6. For further POST integration tests, use only generated random synthetic UUIDs and test evidence digests. The endpoint checks Origin `http://localhost:3000`. Verify that register yields 201, first approve or reject yields 200, repeat yields 409, and GET never includes response UUID or evidence digest. Verify corresponding audit event count using the test SQL Editor.
7. Re-disable `SOSTAIN_PRIVACY_REQUEST_TEST_ENABLED` after testing. Clean up the disposable Neon branch on schedule. Production must never have the test flag enabled.

## Remaining release blockers

Operator identity verification and proof-of-authority procedure, privacy contact channels, legal assessment of retention and erasure including backups, audit tamper protection/retention, production role separation, CSRF and per-action auth resilience, actual transaction-safe execution workflow (not created), full HTTP integration and risk review, launch security gates. No automatic retention deletion or public survey opening.
