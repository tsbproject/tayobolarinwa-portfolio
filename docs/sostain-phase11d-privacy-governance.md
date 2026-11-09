# Sostain Phase 11D — Research Privacy & Data Governance (Draft)

**2026-11-09 · DRAFT — No deletion operations enabled, no approved retention schedule, survey remains closed.**

## Data inventory from actual application code

| Table | Fields / purpose | Identifiability | Lifecycle |
|---|---|---|---|
| `research_responses` | response UUID, survey version, category, whitelisted JSON answers, submitted time | Pseudonymous; potentially identifiable in combinations | No retention/deletion automation yet |
| `research_consents` | response UUID, notice version, privacy acknowledgement, follow-up permission, recorded time | Linked by UUID | Cascades if parent response is deleted |
| `research_contacts` | response UUID, optional contact name, email/WhatsApp, permission, creation time | Directly identifiable | Cascades if parent response deleted; independently deletable |
| `research_surveys` | version, draft/open/closed | Not participant-level | Retain for research audit |
| Upstash | HMAC-keyed rate-limit counters, MFA replay reservations and expiring admin sessions | Operational metadata | Redis TTL and explicit revocation; verify backups/settings separately |

Public answers are purposefully whitelisted. Contact details, honeypot, Turnstile tokens and IP addresses are not stored within the answers JSON. Ordinary CSV and Excel exports exclude contact details and response UUIDs, although some answer combinations can still permit reidentification. The application does not currently expose individual contacts in research reports.

## Governance report (implemented, read-only)

`GET /api/research/sostain/admin/governance`:
- Uses the same local MFA/session gate as existing admin reporting APIs (or legacy Basic gate if opt-in session mode is disabled).
- Returns counts for responses, consents, follow-up consents and optional contact records; earliest/latest response times; how many records would meet **proposed** contact and response age thresholds.
- **No personal identifiers, names, phone numbers, emails, answer JSON, response IDs or list of individuals.**
- `policyStatus: "DRAFT_NOT_APPROVED"` and `destructiveActionsEnabled: false` are explicit. No mutations.
- Response must be no-store, noindex. Authenticated status cannot be inferred from the request alone; verify 401 for missing session.
- If database queries fail, return 503 without leaking SQL or database details.

## Proposed retention schedule — for owner and legal review

The following periods are **proposed internal policy choices, NOT statutory retention limits**:

| Data | Candidate policy | Trigger / exception |
|---|---|---|
| Optional interview contact records | Delete after **90 days** from submission, or earlier upon verified withdrawal/erasure request | Extend only for a separately documented, communicated purpose and applicable lawful basis |
| Linked research answers and consent record | Retain up to **365 days** from submission, then delete or transform into genuinely anonymous aggregates | Respond to verified access/erasure requests sooner where applicable; document any lawful exception |
| Aggregate findings irreversibly de-identified | Longer-term product research | Must not contain data capable of reidentification |
| Temporary admin sessions | 30 minutes maximum | Revoked on sign-out |
| MFA replay keys | 120 seconds | Automatic Redis expiry |

**Do not present candidate periods to participants as approved promises** until reviewed and implemented; no automatic deletion is currently scheduled.

## Rights and withdrawal operating procedure

1. Receive privacy request through the existing portfolio consultation/contact path. **Avoid asking for identity documents or excessive identifiers by default.**
2. Record request intake date, type (access, correction, withdrawal, erasure, objection), minimal necessary reply address, and status in a securely managed access-controlled log (not GitHub or public analytics).
3. Verify that the requester controls the contact address or owns the record. Do not disclose whether another person's contact or response exists.
4. Search using direct contact in a **private, operator-only database session**, not via public API or broad export. For anonymous responses, do not guess or delete unrelated records.
5. For follow-up consent withdrawal, cease outreach and delete the linked `research_contacts` row, and update the corresponding `research_consents.followup_permission` to `false` **within one controlled database transaction**. Confirm the updated consent state before closing the case.
6. For a validated full erasure request, review applicable exceptions first, then delete the specific `research_responses` parent row in a controlled transaction; the consent and contact rows cascade. Confirm targeted row counts and backup handling.
7. Respond to the person with the outcome, retention exceptions where applicable, and any follow-up actions. Document completion without retaining unnecessarily identifying records.

**No SQL deletion commands or public delete endpoints are shipped in Phase 11D part 1.** Before implementation, require an approved retention schedule, dual review of destructive operations, dry-run preview, transactional safeguards, an audit trail excluding full contact details, backup retention review, and actual verification with synthetic data on the isolated Neon test branch.

## Legal baseline (research, not legal advice)

The Nigeria Data Protection Act 2023, section 24, addresses purpose limitation, data minimisation, storage limitation and safeguards; section 34 provides data subject access/erasure-related rights and section 35 concerns withdrawal of consent. Source: Nigeria Data Protection Commission official PDF: https://ndpc.gov.ng/wp-content/uploads/2024/03/Nigeria_Data_Protection_Act_2023.pdf

This policy needs review for appropriate lawful basis, complaint channel, processing roles, provider transfers (including Neon, Vercel, Upstash and Cloudflare), breach management and an accurate public privacy notice. A static set of numbers is not a substitute for assessing why each item must be retained.

## Required local validation

Maintain `SOSTAIN_SURVEY_BACKEND_READY=false` and `NEXT_PUBLIC_SOSTAIN_SURVEY_OPEN=false`; leave local MFA enabled for authenticated route testing.

```powershell
git status --short
git pull --ff-only origin feature/sostain-research-portal
npx --no-install tsc --noEmit
npm run lint
npm run build
```

With `npm run dev` running, navigate to `http://localhost:3000/api/research/sostain/admin/governance` in a private browser to verify missing-session HTTP **401**, and in the already-authenticated MFA browser to verify the JSON governance report. **Do not copy individual answers or contact details** into support conversations.

No privacy notice is being advertised as final, no responses are collected publicly, and no retention job runs until approval and isolated testing.


## Phase 11D Part 2 — Consent withdrawal and erasure rehearsal (ROLLBACK only)

Added \`docs/sostain-phase11d-deletion-rehearsal.sql\`. **It is a SQL Editor rehearsal, not an application deletion endpoint or a production migration.** Its last statement is \`ROLLBACK\`.

### Strict preconditions

- Only use a **disposable, empty Neon database branch** explicitly selected in the Neon Console, named \`sostain-write-testing\`, where the \`research_integration_test_guard\` marker exists and has \`environment='sostain-write-testing'\`.
- The old 7-day Phase 9 branch may have expired; if so, provision a fresh isolated test branch and install the approved guard on **that branch only** using \`docs/sostain-test-branch-guard.sql\`. Never install the marker on the main research database.
- Independently verify the selected Neon branch and that the \`1.1-short\` survey is \`draft\` and all three response/consent/contact tables are empty.
- **Never copy the rehearsal into the main or production SQL Editor**, even though it contains safeguards. Never change \`ROLLBACK\` to \`COMMIT\`.
- In case any assertion fails, PostgreSQL aborts the transaction. Do not use this as a real user data deletion mechanism.

### What the SQL exercises

1. Acquires a transaction advisory lock; verifies guard, survey draft and empty branch.
2. Inserts three entirely synthetic records using \`.invalid\` contact addresses (withdrawal, erasure, untouched control).
3. Withdraws contact consent by deleting one associated \`research_contacts\` record and setting \`research_consents.followup_permission=false\`, while preserving the survey answer.
4. Deletes one targeted \`research_responses\` parent, proving foreign-key cascades remove that response's consent and contact.
5. Verifies the untouched synthetic control remains intact and cardinalities match.
6. Rolls **all test inserts/changes/deletions back**, leaving survey draft and all three tables empty.

Pass criteria are the \`PASS\` notices in the SQL output, followed by **independent** read-only post-test queries showing zero responses, consents and contacts and a draft survey. These tests cannot prove a production rights-request workflow or that data is removed from database backups.

### Still intentionally disabled

No administrator button, DELETE API, retention cron, participant lookup endpoint, email/phone lookup, or real-user deletion has been added. An actual rights-request operation requires a verifiable request, approved retention policy, audit design, response ID targeting, least-privilege access and separate testing against synthetic data using a real application connection. The main database must remain untouched.
