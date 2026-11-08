import "server-only";
import { neon } from "@neondatabase/serverless";
import { surveyVersion } from "./questions";
import type { ResearchSurveyInput } from "./schema";

/**
 * A single PostgreSQL statement provides atomic persistence for the response,
 * privacy acknowledgement and (when explicitly permitted) contact details.
 * The response UUID is the idempotency key.
 */
export async function persistResearchResponse(data: ResearchSurveyInput): Promise<"stored" | "duplicate" | "closed"> {
  const connectionString = process.env.SOSTAIN_RESEARCH_DATABASE_URL;
  if (!connectionString) throw new Error("Research database is not configured.");
  const sql = neon(connectionString);
  return persistResearchResponseWithClient(data, sql);
}

/** Database-client injection is used only by controlled isolated integration tests. */
export async function persistResearchResponseWithClient(
  data: ResearchSurveyInput,
  sql: ReturnType<typeof neon>,
): Promise<"stored" | "duplicate" | "closed"> {
  // Explicit whitelist: never persist CAPTCHA tokens, honeypots, IPs,
  // direct-contact details or unapproved client fields in analytics JSON.
  const answers = {
    category: data.category,
    teamSize: data.teamSize,
    mainChannel: data.mainChannel,
    tracking: data.tracking,
    challenges: data.challenges,
    challengeFrequency: data.challengeFrequency,
    price: data.price,
  };
  const contactAllowed = data.followup === "Yes" && data.contactPermission && Boolean(data.contactDetail.trim());
  const name = contactAllowed ? data.contactName.trim() : "";
  const contact = contactAllowed ? data.contactDetail.trim() : "";

  // The open-survey guard is checked IN the SQL write, not only in application
  // memory, so closing the survey prevents further inserts.
  const rows = await sql`
    WITH survey_gate AS (
      SELECT version FROM research_surveys
      WHERE version = ${surveyVersion} AND status = 'open'
    ),
    inserted AS (
      INSERT INTO research_responses (id, survey_version, business_category, answers)
      SELECT ${data.submissionId}::uuid, version, ${data.category}, ${JSON.stringify(answers)}::jsonb
      FROM survey_gate
      ON CONFLICT (id) DO NOTHING
      RETURNING id
    ),
    consent AS (
      INSERT INTO research_consents (response_id, privacy_notice_version, acknowledgement, followup_permission)
      SELECT id, 'sostain-research-v1', TRUE, ${contactAllowed}
      FROM inserted
      RETURNING response_id
    ),
    contact_record AS (
      INSERT INTO research_contacts (response_id, contact_name, contact_detail, followup_permission)
      SELECT id, ${name}, ${contact}, TRUE FROM inserted WHERE ${contactAllowed}
      RETURNING response_id
    )
    SELECT
      EXISTS(SELECT 1 FROM survey_gate) AS is_open,
      EXISTS(SELECT 1 FROM inserted) AS was_inserted,
      (SELECT COUNT(*)::integer FROM consent) AS consent_count,
      (SELECT COUNT(*)::integer FROM contact_record) AS contact_count
  `;

  const result = rows[0] as {is_open?:boolean;was_inserted?:boolean;consent_count?:number;contact_count?:number} | undefined;
  if (!result?.is_open) return "closed";
  if (!result.was_inserted) return "duplicate";
  if (result.consent_count !== 1 || result.contact_count !== (contactAllowed ? 1 : 0)) {
    // The conditional inserts are required to succeed; a discrepancy
    // must never be acknowledged as a successful submission.
    throw new Error("Research persistence integrity check failed.");
  }
  return "stored";
}
