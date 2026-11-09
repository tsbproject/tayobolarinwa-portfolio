import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { researchAdminOriginAllowed, researchSessionModeEnabled, validResearchSession } from "@/lib/research/sostain/admin-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = {"Cache-Control":"private, no-store","X-Robots-Tag":"noindex, nofollow"};
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function access(request: NextRequest) {
  if (process.env.NODE_ENV !== "development" ||
      process.env.SOSTAIN_PRIVACY_REQUEST_TEST_ENABLED !== "true" ||
      request.nextUrl.hostname !== "localhost" ||
      !researchSessionModeEnabled()) return {error:new Response("Not found.",{status:404,headers})};
  try {
    if (!(await validResearchSession(request))) return {error:new Response("Research admin session required.",{status:401,headers})};
  } catch { return {error:new Response("Research admin security unavailable.",{status:503,headers})}; }
  const primary = process.env.SOSTAIN_RESEARCH_DATABASE_URL;
  const isolated = process.env.SOSTAIN_RESEARCH_TEST_DATABASE_URL;
  if (!primary || !isolated) return {error:new Response("Research test database unavailable.",{status:503,headers})};
  try {
    const mainUrl = new URL(primary), testUrl = new URL(isolated);
    if (mainUrl.hostname === testUrl.hostname) return {error:new Response("Database isolation required.",{status:503,headers})};
  } catch { return {error:new Response("Invalid database configuration.",{status:503,headers})}; }
  const sql = neon(isolated);
  try {
    const [row] = await sql`
      SELECT (SELECT COUNT(*)::int FROM research_integration_test_guard WHERE id=1 AND environment='sostain-write-testing') AS guarded,
        (SELECT status FROM research_surveys WHERE version='1.1-short') AS survey_status,
        (SELECT COUNT(*)::int FROM research_responses) AS responses,
        (SELECT COUNT(*)::int FROM research_consents) AS consents,
        (SELECT COUNT(*)::int FROM research_contacts) AS contacts
    `;
    if (Number(row?.guarded)!==1 || row?.survey_status!=="draft" ||
        Number(row?.responses)!==0 || Number(row?.consents)!==0 || Number(row?.contacts)!==0)
      return {error:new Response("Test branch preconditions failed.",{status:503,headers})};
    return {sql};
  } catch { return {error:new Response("Test branch unavailable.",{status:503,headers})}; }
}

export async function GET(request: NextRequest) {
  const gate = await access(request);
  if ("error" in gate) return gate.error;
  try {
    const rows = await gate.sql`
      SELECT id, request_kind, status, created_at, reviewed_at
      FROM research_privacy_requests ORDER BY created_at DESC LIMIT 50
    `;
    return NextResponse.json({mode:"ISOLATED_TEST_ONLY",destructiveActionsEnabled:false,items:rows},{headers});
  } catch { return NextResponse.json({message:"Test register unavailable."},{status:503,headers}); }
}

export async function POST(request: NextRequest) {
  if (!researchAdminOriginAllowed(request)) return new Response("Origin denied.",{status:403,headers});
  const gate = await access(request);
  if ("error" in gate) return gate.error;
  let body: Record<string, unknown>;
  try {
    if (Number(request.headers.get("content-length") ?? 0) > 2048) throw Error("Oversized");
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw Error("Invalid");
    body = parsed as Record<string,unknown>;
  } catch { return NextResponse.json({message:"Invalid request."},{status:400,headers}); }
  try {
    if (body.action === "register" &&
        typeof body.responseId === "string" && uuid.test(body.responseId) &&
        (body.kind === "withdraw_followup" || body.kind === "erase_response") &&
        typeof body.evidenceSha256 === "string" && /^[a-f0-9]{64}$/.test(body.evidenceSha256)) {
      const id = randomUUID();
      const rows = await gate.sql`
        WITH inserted AS (
          INSERT INTO research_privacy_requests(id,request_kind,response_id,evidence_sha256)
          VALUES (${id},${body.kind},${body.responseId},${body.evidenceSha256})
          RETURNING id,request_kind,status
        ), logged AS (
          INSERT INTO research_privacy_request_events(id,request_id,action,actor)
          SELECT ${randomUUID()},id,'registered','local-mfa-admin' FROM inserted RETURNING request_id
        )
        SELECT inserted.id,inserted.request_kind,inserted.status FROM inserted
        JOIN logged ON inserted.id=logged.request_id
      `;
      return NextResponse.json({request:rows[0],destructiveActionsEnabled:false},{status:201,headers});
    }
    if ((body.action === "approve" || body.action === "reject") &&
        typeof body.requestId === "string" && uuid.test(body.requestId)) {
      const status = body.action === "approve" ? "approved" : "rejected";
      const rows = await gate.sql`
        WITH changed AS (
          UPDATE research_privacy_requests SET status=${status},reviewed_at=now()
          WHERE id=${body.requestId} AND status='pending' RETURNING id,status
        ), logged AS (
          INSERT INTO research_privacy_request_events(id,request_id,action,actor)
          SELECT ${randomUUID()},id,${status},'local-mfa-admin' FROM changed RETURNING request_id
        )
        SELECT changed.id,changed.status FROM changed JOIN logged ON changed.id=logged.request_id
      `;
      if (!rows.length) return NextResponse.json({message:"Not pending or not found."},{status:409,headers});
      return NextResponse.json({request:rows[0],destructiveActionsEnabled:false},{headers});
    }
  } catch { return NextResponse.json({message:"Test operation unavailable."},{status:503,headers}); }
  return NextResponse.json({message:"Invalid request."},{status:400,headers});
}
