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

const noStore = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };

function response(status: number, message: string, checks?: Record<string, boolean>) {
  return NextResponse.json({ message, ...(checks ? { checks } : {}) }, { status, headers: noStore });
}

function sameSecret(a: string, b: string) {
  const aa = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}

function previewEnabled() {
  return process.env.VERCEL_ENV === "preview" &&
    process.env.VERCEL_GIT_COMMIT_REF === "feature/sostain-research-portal" &&
    process.env.NODE_ENV === "production" &&
    process.env.SOSTAIN_STAGING_INTEGRATION_ENABLED === "true";
}

/**
 * Preview-only synthetic component-integration suite.
 * This NEVER enables the public /submit endpoint, never accepts real respondent
 * data, and refuses writes unless the active Neon DB has the test-only marker.
 * A successful run does not replace an end-to-end browser/Turnstile test.
 */
export async function POST(request: NextRequest) {
  if (!previewEnabled()) return response(404, "Not found.");

  const secret = process.env.SOSTAIN_STAGING_PREFLIGHT_KEY;
  if (!secret || secret.length < 32 ||
      !sameSecret(request.headers.get("x-sostain-staging-key") ?? "", secret)) {
    return response(403, "Forbidden.");
  }
  const host = request.nextUrl.hostname.toLowerCase();
  if (request.nextUrl.protocol !== "https:" || !host.endsWith(".vercel.app") ||
      request.headers.get("origin") !== request.nextUrl.origin) {
    return response(403, "Forbidden.");
  }
  if (process.env.SOSTAIN_SURVEY_BACKEND_READY !== "false" ||
      process.env.NEXT_PUBLIC_SOSTAIN_SURVEY_OPEN !== "false") {
    return response(503, "Release flags must remain disabled.");
  }

  const checks: Record<string, boolean> = {
    previewOnly: true,
    publicSurveyClosed: true,
    isolatedNeonGuard: false,
    initialSurveyDraft: false,
    initialParticipantTablesEmpty: false,
    redisRateLimitAllowsSix: false,
    redisRateLimitBlocksSeventh: false,
    turnstileRejectsInvalidToken: false,
    syntheticInsert: false,
    idempotentRetry: false,
    consentSeparated: false,
    closedSurveyRejectsWrite: false,
    syntheticCleanup: false,
    finalSurveyDraft: false,
  };

  const connection = process.env.SOSTAIN_RESEARCH_DATABASE_URL;
  if (!connection) return response(503, "Isolated database configuration missing.", checks);
  try {
    const url = new URL(connection);
    if (!["postgres:", "postgresql:"].includes(url.protocol) ||
        !url.hostname.endsWith(".neon.tech")) {
      return response(503, "Isolated Neon database required.", checks);
    }
  } catch {
    return response(503, "Isolated Neon database required.", checks);
  }

  const sql = neon(connection);
  try {
    const [row] = await sql`
      SELECT
        (SELECT COUNT(*)::integer FROM research_integration_test_guard
          WHERE id=1 AND environment='sostain-write-testing') AS guard_count,
        (SELECT status FROM research_surveys WHERE version=${surveyVersion}) AS survey_status,
        (SELECT COUNT(*)::integer FROM research_responses) AS responses,
        (SELECT COUNT(*)::integer FROM research_consents) AS consents,
        (SELECT COUNT(*)::integer FROM research_contacts) AS contacts
    `;
    checks.isolatedNeonGuard = row?.guard_count === 1;
    checks.initialSurveyDraft = row?.survey_status === "draft";
    checks.initialParticipantTablesEmpty = row?.responses === 0 && row?.consents === 0 && row?.contacts === 0;
  } catch {
    return response(503, "Test database marker or schema verification failed.", checks);
  }
  if (!checks.isolatedNeonGuard || !checks.initialSurveyDraft ||
      !checks.initialParticipantTablesEmpty) {
    return response(503, "Test database is not in the required safe initial state.", checks);
  }

  // Use an unguessable ephemeral subject; these seven short-lived keys belong
  // only to this run. No shared Redis FLUSH/DELETE or existing key is touched.
  const salt = process.env.SOSTAIN_RATE_LIMIT_KEY;
  if (!salt || salt.length < 32) return response(503, "Preview rate-limit key missing.", checks);
  const subject = createHmac("sha256", salt).update("staging:" + randomUUID()).digest("hex");
  try {
    const decisions = [];
    for (let i = 0; i < 7; i++) decisions.push(await checkRateLimit(subject));
    checks.redisRateLimitAllowsSix = decisions.slice(0, 6).every(x => x.ok);
    checks.redisRateLimitBlocksSeventh = !decisions[6].ok && decisions[6].status === 429;
  } catch {
    return response(503, "Redis rate-limit test failed.", checks);
  }
  if (!checks.redisRateLimitAllowsSix || !checks.redisRateLimitBlocksSeventh) {
    return response(503, "Redis rate-limit policy did not pass.", checks);
  }

  // This proves invalid tokens are rejected by the real Cloudflare verification
  // function; it does not prove success for an actual visitor challenge.
  const invalidCaptcha = await verifyTurnstile("sostain-staging-invalid-" + randomUUID());
  checks.turnstileRejectsInvalidToken = !invalidCaptcha.ok &&
    invalidCaptcha.status === 403;
  if (!checks.turnstileRejectsInvalidToken) {
    return response(503, "Turnstile negative-verification test did not pass.", checks);
  }

  const anonymousId = randomUUID();
  const consentedId = randomUUID();
  const closedId = randomUUID();
  const fixture = (id: string, followup: boolean) => researchSurveySchema.parse({
    surveyVersion, submissionId: id, category: businessCategories[0],
    teamSize: "Just me", mainChannel: channels[0], tracking: trackingMethods[0],
    challenges: [challenges[0]], challengeFrequency: "Weekly",
    price: "Not sure / Need to see it", followup: followup ? "Yes" : "No",
    contactName: followup ? "SOSTAIN SYNTHETIC" : "",
    contactDetail: followup ? "synthetic@example.invalid" : "",
    contactPermission: followup, privacyAcknowledged: true,
    website: "", turnstileToken: "synthetic-fixture-no-token",
  });

  let gateAcquired = false;
  try {
    // An atomic draft->open update prevents concurrent suites from sharing
    // the same test run. This opens only the isolated test DB, NEVER /submit.
    const updated = await sql`
      UPDATE research_surveys SET status='open'
      WHERE version=${surveyVersion} AND status='draft'
      AND EXISTS (SELECT 1 FROM research_integration_test_guard
        WHERE id=1 AND environment='sostain-write-testing')
      RETURNING version
    `;
    gateAcquired = updated.length === 1;
    if (!gateAcquired) return response(503, "Could not acquire the isolated test survey gate.", checks);

    const first = await persistResearchResponseWithClient(fixture(anonymousId, false), sql);
    const retry = await persistResearchResponseWithClient(fixture(anonymousId, false), sql);
    const second = await persistResearchResponseWithClient(fixture(consentedId, true), sql);
    checks.syntheticInsert = first === "stored" && second === "stored";
    checks.idempotentRetry = retry === "duplicate";

    const records = await sql`
      SELECT r.id, r.answers, c.followup_permission, co.contact_detail
      FROM research_responses r
      JOIN research_consents c ON c.response_id=r.id
      LEFT JOIN research_contacts co ON co.response_id=r.id
      WHERE r.id IN (${anonymousId}::uuid, ${consentedId}::uuid)
    `;
    checks.consentSeparated = records.length === 2 && records.every(row => {
      const answers = row.answers as Record<string, unknown>;
      if (!answers || "contactName" in answers || "contactDetail" in answers ||
          "turnstileToken" in answers || "website" in answers) return false;
      return row.id === anonymousId ?
        row.followup_permission === false && row.contact_detail === null :
        row.id === consentedId && row.followup_permission === true &&
          row.contact_detail === "synthetic@example.invalid";
    });

    await sql`UPDATE research_surveys SET status='draft' WHERE version=${surveyVersion}`;
    const rejected = await persistResearchResponseWithClient(fixture(closedId, false), sql);
    checks.closedSurveyRejectsWrite = rejected === "closed";
  } catch {
    // No raw SQL, tokens or credentials are included in the HTTP response.
  } finally {
    if (gateAcquired) {
      try {
        // The test-only branch must be cleaned even if an assertion fails.
        await sql`
          DELETE FROM research_responses
          WHERE id IN (${anonymousId}::uuid, ${consentedId}::uuid, ${closedId}::uuid)
        `;
        await sql`UPDATE research_surveys SET status='draft' WHERE version=${surveyVersion}`;
        const [final] = await sql`
          SELECT
            (SELECT status FROM research_surveys WHERE version=${surveyVersion}) AS survey_status,
            (SELECT COUNT(*)::integer FROM research_responses) AS responses,
            (SELECT COUNT(*)::integer FROM research_consents) AS consents,
            (SELECT COUNT(*)::integer FROM research_contacts) AS contacts
        `;
        checks.syntheticCleanup = final?.responses === 0 && final?.consents === 0 &&
          final?.contacts === 0;
        checks.finalSurveyDraft = final?.survey_status === "draft";
      } catch {
        // Failure is surfaced as HTTP 503 and must be manually investigated.
      }
    }
  }

  const passed = Object.values(checks).every(Boolean);
  return response(
    passed ? 200 : 503,
    passed ?
      "Preview-only synthetic integration passed. Cleanup verified; public survey unchanged." :
      "Synthetic integration incomplete or cleanup not confirmed. Inspect test Neon branch before retrying.",
    checks,
  );
}
