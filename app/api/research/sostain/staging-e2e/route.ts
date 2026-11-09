import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, verifyTurnstile } from "@/lib/research/sostain/abuse-protection";
import { getVercelClientIp } from "@/lib/research/sostain/client-ip";
import { persistResearchResponseWithClient } from "@/lib/research/sostain/persistence";
import { researchSurveySchema } from "@/lib/research/sostain/schema";
import { businessCategories, challenges, channels, surveyVersion, trackingMethods } from "@/lib/research/sostain/questions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const stagingHost = "tayobolarinwa-portfolio-git-feature-1059e2-tsbprojects-projects.vercel.app";
const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };
const reply = (status: number, message: string, checks?: Record<string, boolean>) =>
  NextResponse.json({message, ...(checks ? {checks} : {})}, {status, headers});

function matchSecret(actual: string, expected: string): boolean {
  const left = Buffer.from(actual, "utf8");
  const right = Buffer.from(expected, "utf8");
  return left.length === right.length && timingSafeEqual(left, right);
}

function stagingReady(): boolean {
  return process.env.VERCEL_ENV === "preview" &&
    process.env.VERCEL_GIT_COMMIT_REF === "feature/sostain-research-portal" &&
    process.env.NODE_ENV === "production" &&
    process.env.SOSTAIN_STAGING_E2E_ENABLED === "true" &&
    process.env.SOSTAIN_SURVEY_BACKEND_READY === "false" &&
    process.env.NEXT_PUBLIC_SOSTAIN_SURVEY_OPEN === "false";
}

/**
 * An authenticated ONE-SHOT synthetic HTTP acceptance test.
 * This is a companion route, NOT the public /submit route, which stays closed.
 * The only database modified is a guard-marked disposable Neon test branch.
 * Never send real participant answers or contact details here.
 */
export async function POST(request: NextRequest) {
  if (!stagingReady()) return reply(404, "Not found.");
  const expectedOrigin = "https://" + stagingHost;
  if (request.nextUrl.hostname !== stagingHost ||
      request.nextUrl.protocol !== "https:" ||
      request.headers.get("origin") !== expectedOrigin) return reply(403, "Forbidden.");

  const key = process.env.SOSTAIN_STAGING_PREFLIGHT_KEY;
  if (!key || key.length < 32 ||
      !matchSecret(request.headers.get("x-sostain-staging-key") ?? "", key)) {
    return reply(403, "Forbidden.");
  }

  if (!(request.headers.get("content-type") ?? "").startsWith("application/json")) {
    return reply(415, "Invalid content type.");
  }
  if (Number(request.headers.get("content-length") ?? 0) > 4096) {
    return reply(413, "Request too large.");
  }

  let token: string;
  try {
    const raw = await request.text();
    if (raw.length > 4096) return reply(413, "Request too large.");
    const body: unknown = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body) ||
        typeof (body as Record<string, unknown>).turnstileToken !== "string") {
      return reply(400, "Invalid request.");
    }
    token = (body as {turnstileToken: string}).turnstileToken;
  } catch {
    return reply(400, "Invalid request.");
  }

  const checks: Record<string, boolean> = {
    previewOnly: true, publicSurveyClosed: true,
    isolatedNeonGuard: false, initialDraftAndEmpty: false,
    edgeIpValid: false, redisAllowed: false, genuineTurnstileAccepted: false,
    syntheticStored: false, idempotentRetry: false, consentSeparated: false,
    cleanupVerified: false, finalSurveyDraft: false,
  };

  const connection = process.env.SOSTAIN_RESEARCH_DATABASE_URL;
  if (!connection) return reply(503, "Test database not configured.", checks);
  try {
    const url = new URL(connection);
    if (!["postgres:","postgresql:"].includes(url.protocol) ||
        !url.hostname.endsWith(".neon.tech")) {
      return reply(503, "Guarded Neon test database required.", checks);
    }
  } catch {
    return reply(503, "Guarded Neon test database required.", checks);
  }

  const sql = neon(connection);
  try {
    const [initial] = await sql`
      SELECT
        (SELECT COUNT(*)::integer FROM research_integration_test_guard
          WHERE id = 1 AND environment = 'sostain-write-testing') AS guard_count,
        (SELECT status FROM research_surveys WHERE version = ${surveyVersion}) AS survey_status,
        (SELECT COUNT(*)::integer FROM research_responses) AS responses,
        (SELECT COUNT(*)::integer FROM research_consents) AS consents,
        (SELECT COUNT(*)::integer FROM research_contacts) AS contacts
    `;
    checks.isolatedNeonGuard = initial?.guard_count === 1;
    checks.initialDraftAndEmpty = initial?.survey_status === "draft" &&
      initial?.responses === 0 && initial?.consents === 0 && initial?.contacts === 0;
  } catch {
    return reply(503, "Test database verification failed.", checks);
  }
  if (!checks.isolatedNeonGuard || !checks.initialDraftAndEmpty) {
    return reply(503, "Test database is not in a safe initial state.", checks);
  }

  const ip = getVercelClientIp(request.headers.get("x-vercel-forwarded-for"));
  checks.edgeIpValid = Boolean(ip);
  const salt = process.env.SOSTAIN_RATE_LIMIT_KEY;
  if (!ip || !salt || salt.length < 32) {
    return reply(503, "Trusted client IP or rate-limit configuration missing.", checks);
  }

  const subject = createHmac("sha256", salt).update("staging-e2e:" + ip).digest("hex");
  const limit = await checkRateLimit(subject);
  checks.redisAllowed = limit.ok;
  if (!limit.ok) return reply(limit.status, limit.message, checks);

  const captcha = await verifyTurnstile(token, ip);
  checks.genuineTurnstileAccepted = captcha.ok;
  if (!captcha.ok) return reply(captcha.status, captcha.message, checks);

  const id = randomUUID();
  const synthetic = researchSurveySchema.parse({
    surveyVersion, submissionId: id, category: businessCategories[0],
    teamSize: "Just me", mainChannel: channels[0], tracking: trackingMethods[0],
    challenges: [challenges[0]], challengeFrequency: "Weekly",
    price: "Not sure / Need to see it", followup: "No",
    contactName: "", contactDetail: "", contactPermission: false,
    privacyAcknowledged: true, website: "", turnstileToken: token,
  });

  let acquired = false;
  try {
    const updated = await sql`
      UPDATE research_surveys SET status = 'open'
      WHERE version = ${surveyVersion} AND status = 'draft'
        AND EXISTS (SELECT 1 FROM research_integration_test_guard
          WHERE id = 1 AND environment = 'sostain-write-testing')
      RETURNING version
    `;
    acquired = updated.length === 1;
    if (acquired) {
      const first = await persistResearchResponseWithClient(synthetic, sql);
      const second = await persistResearchResponseWithClient(synthetic, sql);
      checks.syntheticStored = first === "stored";
      checks.idempotentRetry = second === "duplicate";

      const result = await sql`
        SELECT r.answers, c.acknowledgement, c.followup_permission,
          (SELECT COUNT(*)::integer FROM research_contacts
            WHERE response_id = ${id}::uuid) AS contacts
        FROM research_responses r
        JOIN research_consents c ON c.response_id = r.id
        WHERE r.id = ${id}::uuid
      `;
      const row = result[0];
      const answers = row?.answers as Record<string, unknown> | undefined;
      checks.consentSeparated = result.length === 1 && row?.acknowledgement === true &&
        row?.followup_permission === false && row?.contacts === 0 &&
        !!answers && !("contactDetail" in answers) &&
        !("turnstileToken" in answers) && !("website" in answers);
    }
  } catch {
    // Always attempt cleanup below; no raw SQL errors or tokens are emitted.
  } finally {
    if (acquired) {
      try {
        await sql`DELETE FROM research_responses WHERE id = ${id}::uuid`;
        await sql`
          UPDATE research_surveys SET status = 'draft'
          WHERE version = ${surveyVersion}
            AND EXISTS (SELECT 1 FROM research_integration_test_guard
              WHERE id = 1 AND environment = 'sostain-write-testing')
        `;
        const [end] = await sql`
          SELECT (SELECT status FROM research_surveys WHERE version=${surveyVersion}) AS status,
                 (SELECT COUNT(*)::integer FROM research_responses) AS responses,
                 (SELECT COUNT(*)::integer FROM research_consents) AS consents,
                 (SELECT COUNT(*)::integer FROM research_contacts) AS contacts
        `;
        checks.cleanupVerified = end?.responses === 0 &&
          end?.consents === 0 && end?.contacts === 0;
        checks.finalSurveyDraft = end?.status === "draft";
      } catch {
        // Any cleanup uncertainty is a hard failure: inspect test DB, do not retry.
      }
    }
  }

  const passed = Object.values(checks).every(Boolean);
  return reply(passed ? 200 : 503,
    passed ? "Protected genuine-Turnstile HTTP acceptance passed; synthetic cleanup verified." :
      "Staging E2E incomplete. Inspect isolated Neon branch before retrying.",
    checks);
}
