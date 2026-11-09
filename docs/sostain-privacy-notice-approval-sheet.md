# Sostain research — privacy notice approval sheet (2026-11-09)

**Draft for owner/legal review; NOT approved, NOT a live policy. Survey stays closed.** This is the narrow privacy sign-off needed to launch the seven-question research pilot; it does not require building a new SaaS privacy module.

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
| Interview contact retention | Up to 90 days after submission, earlier on verified withdrawal | Owner must confirm ability to execute deletion |
| Survey response retention | Up to 365 days, earlier where valid erasure applies; genuinely anonymous aggregate summaries may remain | Owner must confirm ability to execute deletion |
| Consent records | Retained with related response until deletion, subject to any justified recordkeeping exception | Legal/privacy review |
| Data subject requests | Receive through public contact route; operator privately verifies control/authority; never disclose whether a third-party record exists; use a targeted manual deletion process and record minimal outcome | Owner signs off on operator procedure |
| Backups | Document Neon backup retention/recovery and practical limits on deletion before promising immediate backup erasure | Provider review |
| Cross-border processing | Confirm actual service regions, onward processors and applicable legal transfer safeguards | Provider/legal review |
| Complaints and security | Provide a valid contact for questions/withdrawals and escalation; verify breach response path | Owner confirms |

**90/365 days are internal candidate limits, not legal requirements.** Do not present them as binding public promises until approved and supported by an actual recurring retention-review process or automated purge. NDPC guidance says controllers/processors should establish a clear retention policy and communicate it to data subjects: https://ndpc.gov.ng/wp-content/uploads/2025/07/NDP-ACT-GAID-2025-MARCH-20TH.pdf

## Low-scope manual operational process

1. Once per week, check the governance dashboard's proposed retention candidates. If retention periods have been formally approved, record the review date privately; escalate approaching deadlines.
2. For withdrawal/erasure requests, receive and authenticate through an access-controlled channel. Ask only for the minimum information required to match a response. Do not request ID documents by default.
3. Use a controlled, access-limited manual database process (not the test privacy API) to perform exact-record withdrawal or deletion, with pre/post counts, authorization and private audit of the result. The SQL rehearsal established semantics only; no real-data operation is enabled.
4. Follow up with the requester, applying any legally valid exceptions. Avoid retaining the original contact request longer than required.
5. Review database backups and provider deletion terms separately. Do not imply immediate deletion of all backups unless verified.

## Sign-off before changing the public notice

- [x] Responsible individual identified: **Tayo Bolarinwa**. Contact path provisionally identified as `/consultation`; confirm operational receipt/routing before launch.
- [ ] Legal basis, consent language and rights procedures reviewed.
- [ ] Retention durations approved *and operationally enforceable*.
- [ ] Processing/service regions and transfer terms reviewed.
- [ ] Backups and deletion exceptions accurately described.
- [ ] Manual rights handling owner assigned, documented, practiced.
- [ ] Public privacy page revised to an approved dated version and cross-checked against survey consent UI.
- [ ] Survey still closed until full HTTP staging and Vercel deployment checks pass.

**No one should interpret creation of this checklist as policy approval.**


## Owner instruction — 9 November 2026

The research operator is **Tayo Bolarinwa**, acting as an individual conducting independent Sostain product research. Do not present Marvel Creative Media, Kielflo Technologies or Sostain as a separately established legal controller without an additional explicit decision. The prelaunch public page was revised to describe this role and to direct rights inquiries to `/consultation`. The contact-form delivery path must still be validated.

The proposed 90/365-day limits are stated on the prelaunch page as **not yet approved or operational commitments**. Update to final, enforceable limits and a dated approved notice before public collection. No production release authorization has been given.
