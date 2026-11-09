import "server-only";
import { neon } from "@neondatabase/serverless";

/**
 * Aggregate-only governance overview. Never return contact values, response
 * UUIDs, IPs, answers JSON, or identifiable participant metadata.
 */
export async function getResearchGovernanceOverview() {
  const connection = process.env.SOSTAIN_RESEARCH_DATABASE_URL;
  if (!connection) throw new Error("Research database is not configured.");
  const sql = neon(connection);

  const [row] = await sql`
    SELECT
      (SELECT COUNT(*)::integer FROM research_responses WHERE survey_version = '1.1-short') AS total_responses,
      (SELECT COUNT(*)::integer FROM research_contacts c JOIN research_responses r
        ON r.id = c.response_id WHERE r.survey_version = '1.1-short') AS contact_records,
      (SELECT COUNT(*)::integer FROM research_consents c JOIN research_responses r
        ON r.id = c.response_id WHERE r.survey_version = '1.1-short'
          AND c.followup_permission = TRUE) AS followup_consents,
      (SELECT COUNT(*)::integer FROM research_consents c JOIN research_responses r
        ON r.id = c.response_id WHERE r.survey_version = '1.1-short') AS consent_records,
      (SELECT COUNT(*)::integer FROM research_contacts c JOIN research_responses r
        ON r.id = c.response_id WHERE r.survey_version = '1.1-short'
          AND c.created_at < NOW() - INTERVAL '90 days') AS contacts_older_than_proposed_90d,
      (SELECT COUNT(*)::integer FROM research_responses
        WHERE survey_version = '1.1-short'
          AND submitted_at < NOW() - INTERVAL '365 days') AS responses_older_than_proposed_365d,
      (SELECT MIN(submitted_at) FROM research_responses WHERE survey_version = '1.1-short') AS oldest_response_at,
      (SELECT MAX(submitted_at) FROM research_responses WHERE survey_version = '1.1-short') AS latest_response_at
  `;

  const date = (value: unknown) => value ? new Date(String(value)).toISOString() : null;
  return {
    surveyVersion: "1.1-short",
    totals: {
      responses: Number(row?.total_responses ?? 0),
      contacts: Number(row?.contact_records ?? 0),
      consents: Number(row?.consent_records ?? 0),
      followupConsents: Number(row?.followup_consents ?? 0),
    },
    reviewCandidates: {
      contactsOlderThanProposed90Days: Number(row?.contacts_older_than_proposed_90d ?? 0),
      responsesOlderThanProposed365Days: Number(row?.responses_older_than_proposed_365d ?? 0),
    },
    oldestResponseAt: date(row?.oldest_response_at),
    latestResponseAt: date(row?.latest_response_at),
    policyStatus: "DRAFT_NOT_APPROVED",
    destructiveActionsEnabled: false,
  };
}
