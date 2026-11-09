# Sostain research — privacy notice approval sheet (2026-11-09)

**Partial owner approval recorded 9 November 2026: retention durations and manual-operation responsibility approved. Other privacy/legal safeguards remain pending; this is NOT final public-collection approval. Survey stays closed.** This is the narrow privacy sign-off needed to launch the seven-question research pilot; it does not require building a new SaaS privacy module.

## Existing data handling verified against code

- `research_responses`: survey answers and submitted time, keyed by UUID; no contact details, IP or Turnstile token in the answers JSON (`lib/research/sostain/persistence.ts`).
- `research_consents`: notice version and optional interview follow-up permission.
- `research_contacts`: interview name and email/WhatsApp only if the participant opts in.
- Admin reports exclude response UUID and direct contact details; pseudonymous combinations can still be identifiable.
- Cloudflare Turnstile, Upstash, Vercel and Neon process data according to their relevant configurations; document and review international transfers and service arrangements.
- The public `app/research/sostain/privacy/page.tsx` is explicitly a prelaunch draft.

## Recommended minimum pilot policy decisions — require explicit approval

| Issue | Proposed operational decision | Gate |
|---|---|---|
| Controller identity | Identify the person or legal entity responsible and publish reachable contact | Owner confirms |
| Purpose | Seven-question product-discovery research only; interview details only for explicit follow-up | Owner confirms |
| Lawful basis | Document lawful basis for research-answer processing and separately for interview contact | Legal/privacy review |
| Interview contact retention | **Owner-approved:** maximum 90 days from submission, earlier for verified withdrawal/valid erasure | Operational deletion process still needs verification |
| Survey response retention | **Owner-approved:** maximum 365 days from submission, earlier where valid erasure applies; genuinely anonymous aggregate summaries may remain | Operational deletion process still needs verification |
| Consent records | Retained with related response until deletion, subject to any justified recordkeeping exception | Legal/privacy review |
| Data subject requests | Receive through public contact route; operator privately verifies control/authority; never disclose whether a third-party record exists; use a targeted manual deletion process and record minimal outcome | Owner signs off on operator procedure |
| Backups | Document Neon backup retention/recovery and practical limits on deletion before promising immediate backup erasure | Provider review |
| Cross-border processing | Confirm actual service regions, onward processors and applicable legal transfer safeguards | Provider/legal review |
| Complaints and security | Provide a valid contact for questions/withdrawals and escalation; verify breach response path | Owner confirms |

**90/365 days were explicitly approved by the research operator on 9 November 2026; they are not statutory periods.** Before collecting data, the operator must verify that the weekly manual review, targeted deletion and applicable backup arrangements can honor the approved limits. NDPC guidance says controllers/processors should establish a clear retention policy and communicate it to data subjects: https://ndpc.gov.ng/wp-content/uploads/2025/07/NDP-ACT-GAID-2025-MARCH-20TH.pdf

## Low-scope manual operational process

1. Once per week, check the governance dashboard's proposed retention candidates. If retention periods have been formally approved, record the review date privately; escalate approaching deadlines.
2. For withdrawal/erasure requests, receive and authenticate through an access-controlled channel. Ask only for the minimum information required to match a response. Do not request ID documents by default.
3. Use a controlled, access-limited manual database process (not the test privacy API) to perform exact-record withdrawal or deletion, with pre/post counts, authorization and private audit of the result. The SQL rehearsal established semantics only; no real-data operation is enabled.
4. Follow up with the requester, applying any legally valid exceptions. Avoid retaining the original contact request longer than required.
5. Review database backups and provider deletion terms separately. Do not imply immediate deletion of all backups unless verified.

## Sign-off before changing the public notice

- [x] Responsible individual identified: **Tayo Bolarinwa**. Contact path provisionally identified as `/consultation`; confirm operational receipt/routing before launch.
- [ ] Legal basis, consent language and rights procedures reviewed.
- [x] Retention periods **approved by the research operator** (90 days interview contact; 365 days responses).
- [ ] Weekly review, targeted deletion and restoration/backup procedures proven enforceable.
- [ ] Processing/service regions and transfer terms reviewed.
- [ ] Backups and deletion exceptions accurately described.
- [x] Manual rights handling **owner assigned**: Tayo Bolarinwa, who explicitly accepted responsibility.
- [ ] Rights handling and targeted deletion workflow tested end to end in the operator's production-access workflow.
- [ ] Public privacy page revised to an approved dated version and cross-checked against survey consent UI.
- [ ] Survey still closed until full HTTP staging and Vercel deployment checks pass.

**No one should interpret creation of this checklist as policy approval.**


## Owner instruction — 9 November 2026

The research operator is **Tayo Bolarinwa**, acting as an individual conducting independent Sostain product research. Do not present Marvel Creative Media, Kielflo Technologies or Sostain as a separately established legal controller without an additional explicit decision. The prelaunch public page was revised to describe this role and to direct rights inquiries to `/consultation`. The contact-form delivery path must still be validated.

The 90/365-day limits were subsequently approved by the research operator and the prelaunch privacy page was updated on the feature branch to state those limits. Technical enforceability, processing/transfer legal basis, backup disclosures and public-collection authorization still require separate verification.

## Recorded founder approval — 9 November 2026

The founder answered **“approved”** to a direct request to approve **90-day maximum retention of optional interview contacts, 365-day maximum retention of research responses, and accepting responsibility for manual privacy-request and deletion operations**. This approval authorizes updating the draft policy text and owner checklist, not activating production collection or asserting that operational deletion, legal basis, backups, transfer agreements, or the consultation-contact delivery have been verified. Research operator remains Tayo Bolarinwa personally.
