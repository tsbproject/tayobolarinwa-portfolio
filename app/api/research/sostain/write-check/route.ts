import { randomUUID, timingSafeEqual } from "node:crypto";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { persistResearchResponseWithClient } from "@/lib/research/sostain/persistence";
import { researchSurveySchema } from "@/lib/research/sostain/schema";
import { businessCategories, challenges, channels, surveyVersion, trackingMethods } from "@/lib/research/sostain/questions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function reply(status: number, message: string) {
  return NextResponse.json({ message }, { status, headers: { "Cache-Control": "private, no-store" } });
}
function equalSecret(a: string, b: string) {
  const aa = Buffer.from(a), bb = Buffer.from(b);
  return aa.length === bb.length && timingSafeEqual(aa, bb);
}
function identity(connection: string) {
  const uri = new URL(connection);
  if (!["postgres:","postgresql:"].includes(uri.protocol) || !uri.hostname.endsWith(".neon.tech")) {
    throw new Error("Only isolated Neon test databases are permitted.");
  }
  return uri;
}

/**
 * This endpoint is NEVER available in production and ONLY touches a separately
 * marked, disposable Neon test database. Do not send real personal data.
 */
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") return reply(404, "Not found.");
  if (request.headers.get("origin") !== "http://localhost:3000") return reply(403, "Forbidden.");
  if (process.env.SOSTAIN_SURVEY_BACKEND_READY === "true" ||
      process.env.NEXT_PUBLIC_SOSTAIN_SURVEY_OPEN === "true") return reply(403, "Release flags must remain disabled.");

  const expectedKey = process.env.SOSTAIN_RESEARCH_TEST_RUN_KEY;
  const providedKey = request.headers.get("x-sostain-test-key") ?? "";
  if (!expectedKey || expectedKey.length < 32 || !equalSecret(providedKey, expectedKey)) {
    return reply(403,"Test runner not authorised.");
  }
  const testUrl = process.env.SOSTAIN_RESEARCH_TEST_DATABASE_URL;
  const mainUrl = process.env.SOSTAIN_RESEARCH_DATABASE_URL;
  if (!testUrl || !mainUrl) return reply(503, "Both isolated and parent database URLs must be configured.");

  let sql: NeonQueryFunction<false, false>;
  try {
    const test = identity(testUrl), parent = identity(mainUrl);
    // Neon branch endpoints must have distinct hostnames. Never trust path/name alone.
    if (test.hostname === parent.hostname || testUrl === mainUrl) return reply(403,"Test database is not isolated.");
    sql = neon(testUrl);
    const marker = await sql`
      SELECT environment FROM research_integration_test_guard WHERE id = 1
    `;
    if (marker[0]?.environment !== "sostain-write-testing") return reply(403,"Test-only marker is missing.");
    const survey = await sql`SELECT status FROM research_surveys WHERE version = ${surveyVersion}`;
    if (survey[0]?.status !== "draft") return reply(403,"Test survey must start as draft.");
  } catch {
    return reply(403,"Test database identity or marker verification failed.");
  }

  const one = randomUUID(), two = randomUUID(), closedId = randomUUID();
  const fixture = (submissionId: string, followup: boolean) => researchSurveySchema.parse({
    surveyVersion,submissionId,category:businessCategories[0],teamSize:"Just me",
    mainChannel:channels[0],tracking:trackingMethods[0],
    challenges:[challenges[0]],challengeFrequency:"Weekly",price:"Not sure / Need to see it",
    followup:followup ? "Yes":"No",contactName:followup ? "SOSTAIN TEST":"",contactDetail:followup ? "synthetic@example.invalid":"",
    contactPermission:followup,privacyAcknowledged:true,website:"",turnstileToken:"test-only-no-cloudflare",
  });
  let result = "FAIL: database persistence test did not complete.";
  let passed = false;
  let cleanupOk = false;

  try {
    // Only the separate test DB is temporarily open; the main research DB stays draft.
    await sql`UPDATE research_surveys SET status='open' WHERE version=${surveyVersion}`;
    const first = await persistResearchResponseWithClient(fixture(one,false),sql);
    const retry = await persistResearchResponseWithClient(fixture(one,false),sql);
    const second = await persistResearchResponseWithClient(fixture(two,true),sql);

    const inspected = await sql`
      SELECT r.id, r.answers, c.followup_permission, co.contact_detail
      FROM research_responses r
      LEFT JOIN research_consents c ON c.response_id=r.id
      LEFT JOIN research_contacts co ON co.response_id=r.id
      WHERE r.id IN (${one}::uuid,${two}::uuid)
      ORDER BY r.id
    `;
    if(first !== "stored" || retry !== "duplicate" || second !== "stored" || inspected.length !== 2) {
      throw new Error("Insert/idempotency/record count mismatch.");
    }
    for(const row of inspected){
      const a = row.answers as Record<string, unknown>;
      if (!a || a.contactDetail || a.contactName || a.turnstileToken || a.website) {
        throw new Error("Private data leaked into analytics.");
      }
      if(row.id === one && (row.followup_permission !== false || row.contact_detail != null)) {
        throw new Error("Unconsented contact was stored.");
      }
      if(row.id === two && (row.followup_permission !== true || row.contact_detail !== "synthetic@example.invalid")) {
        throw new Error("Consented synthetic contact not stored separately.");
      }
    }
    await sql`UPDATE research_surveys SET status='draft' WHERE version=${surveyVersion}`;
    const closed = await persistResearchResponseWithClient(fixture(closedId,false),sql);
    if (closed !== "closed") throw new Error("Draft gate did not block writes.");
    passed = true;
    result = "PASS: real Neon test-branch writes, consent separation, idempotent retry and draft gate.";
  } catch {
    result = "FAIL: write integration assertions failed; cleanup attempted.";
  } finally {
    try {
      // Restrict cleanup to synthetic UUIDs created by this diagnostic.
      await sql`DELETE FROM research_responses WHERE id IN (${one}::uuid,${two}::uuid,${closedId}::uuid)`;
      await sql`UPDATE research_surveys SET status='draft' WHERE version=${surveyVersion}`;
      const remaining = await sql`
        SELECT COUNT(*)::integer AS n FROM research_responses
        WHERE id IN (${one}::uuid,${two}::uuid,${closedId}::uuid)
      `;
      const state = await sql`SELECT status FROM research_surveys WHERE version=${surveyVersion}`;
      cleanupOk = remaining[0]?.n === 0 && state[0]?.status === "draft";
    } catch {
      cleanupOk = false;
    }
  }
  if (!cleanupOk) return reply(500,"Test cleanup could not be confirmed. Inspect the isolated test branch; do not retry until safe.");
  return reply(passed ? 200 : 500,result + " Synthetic records deleted and test survey restored to draft.");
}
