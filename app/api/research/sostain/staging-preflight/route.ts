import { timingSafeEqual } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { getVercelClientIp } from "@/lib/research/sostain/client-ip";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const headers = {
  "Cache-Control": "private, no-store",
  "X-Robots-Tag": "noindex, nofollow",
};

function respond(status: number, message: string, checks?: Record<string, boolean>) {
  return NextResponse.json(
    {message, ...(checks ? {checks} : {})},
    {status, headers},
  );
}

function authorized(candidate: string, expected: string) {
  const a = Buffer.from(candidate, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

function previewOnly(): boolean {
  return process.env.VERCEL_ENV === "preview" &&
    process.env.VERCEL_GIT_COMMIT_REF === "feature/sostain-research-portal" &&
    process.env.SOSTAIN_STAGING_PREFLIGHT_ENABLED === "true" &&
    process.env.NODE_ENV === "production";
}

/**
 * One-off read-only staging environment preflight. NEVER available in production
 * or localhost and NEVER enables or accepts survey submissions.
 * This route is deliberately separate from the actual POST /submit handler.
 */
export async function POST(request: NextRequest) {
  if (!previewOnly()) return respond(404, "Not found.");
  const runKey = process.env.SOSTAIN_STAGING_PREFLIGHT_KEY;
  if (!runKey || runKey.length < 32 ||
      !authorized(request.headers.get("x-sostain-staging-key") ?? "", runKey)) {
    return respond(403, "Forbidden.");
  }

  // Only same-origin requests to the HTTPS Vercel deployment may run the probe.
  const hostname = request.nextUrl.hostname.toLowerCase();
  if (request.nextUrl.protocol !== "https:" ||
      !hostname.endsWith(".vercel.app") ||
      request.headers.get("origin") !== request.nextUrl.origin) {
    return respond(403, "Forbidden.");
  }
  if (process.env.SOSTAIN_SURVEY_BACKEND_READY !== "false" ||
      process.env.NEXT_PUBLIC_SOSTAIN_SURVEY_OPEN !== "false") {
    return respond(503, "Public survey release flags must remain disabled.");
  }

  const checks: Record<string, boolean> = {
    previewEnvironment: true,
    publicSurveyClosed: true,
    isolatedNeonGuard: false,
    surveyDraft: false,
    participantTablesEmpty: false,
    redisReachable: false,
    clientIpHeaderValid: Boolean(getVercelClientIp(request.headers.get("x-vercel-forwarded-for"))),
    turnstileConfigured: Boolean(process.env.SOSTAIN_TURNSTILE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_SOSTAIN_TURNSTILE_SITE_KEY),
    rateLimitKeyConfigured: Boolean(process.env.SOSTAIN_RATE_LIMIT_KEY &&
      process.env.SOSTAIN_RATE_LIMIT_KEY.length >= 32),
  };

  try {
    const connection = process.env.SOSTAIN_RESEARCH_DATABASE_URL;
    if (connection) {
      const database = new URL(connection);
      if (["postgres:", "postgresql:"].includes(database.protocol) &&
          database.hostname.endsWith(".neon.tech")) {
        const sql = neon(connection);
        const [row] = await sql`
          SELECT
            (SELECT COUNT(*)::integer FROM research_integration_test_guard
              WHERE id=1 AND environment='sostain-write-testing') AS guard_count,
            (SELECT status FROM research_surveys WHERE version='1.1-short') AS survey_status,
            (SELECT COUNT(*)::integer FROM research_responses) AS responses,
            (SELECT COUNT(*)::integer FROM research_consents) AS consents,
            (SELECT COUNT(*)::integer FROM research_contacts) AS contacts
        `;
        checks.isolatedNeonGuard = Number(row?.guard_count) === 1;
        checks.surveyDraft = row?.survey_status === "draft";
        checks.participantTablesEmpty = Number(row?.responses) === 0 &&
          Number(row?.consents) === 0 && Number(row?.contacts) === 0;
      }
    }
  } catch {
    // Fail closed; never expose database, connection or SQL details.
  }

  try {
    const base = process.env.SOSTAIN_UPSTASH_REDIS_REST_URL;
    const token = process.env.SOSTAIN_UPSTASH_REDIS_REST_TOKEN;
    if (base && token && new URL(base).protocol === "https:") {
      const result = await fetch(base.replace(/\/$/, "") + "/pipeline", {
        method: "POST",
        headers: {"Authorization": "Bearer " + token, "Content-Type": "application/json"},
        body: JSON.stringify([["PING"]]),
        signal: AbortSignal.timeout(5000),
        cache: "no-store",
      });
      if (result.ok) {
        const body: unknown = await result.json();
        checks.redisReachable = Array.isArray(body) &&
          body.length === 1 &&
          typeof body[0] === "object" && body[0] !== null &&
          "result" in body[0] && body[0].result === "PONG";
      }
    }
  } catch {
    // Fail closed; never expose Redis credentials or service URLs.
  }

  const passed = Object.values(checks).every(Boolean);
  return respond(
    passed ? 200 : 503,
    passed ? "Isolated Preview preflight passed; no survey data written." :
      "Preview preflight failed; do not enable submissions.",
    checks,
  );
}
