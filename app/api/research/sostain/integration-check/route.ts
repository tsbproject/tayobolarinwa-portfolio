import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { verifyTurnstile, checkRateLimit } from "@/lib/research/sostain/abuse-protection";
import { persistResearchResponse } from "@/lib/research/sostain/persistence";
import { researchSurveySchema } from "@/lib/research/sostain/schema";
import { businessCategories, challenges, channels, surveyVersion, trackingMethods } from "@/lib/research/sostain/questions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(message: string, status: number) {
  return NextResponse.json({ message }, { status, headers: { "Cache-Control": "no-store" } });
}

/**
 * Local development only. Exercise actual Cloudflare, Redis and Neon integration
 * while the survey remains 'draft'. This endpoint MUST NEVER create records.
 * No user-supplied answers or PII enter the database.
 */
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") return json("Not found.", 404);
  if (request.headers.get("origin") !== "http://localhost:3000") return json("Forbidden.", 403);
  if (process.env.SOSTAIN_SURVEY_BACKEND_READY === "true" ||
      process.env.NEXT_PUBLIC_SOSTAIN_SURVEY_OPEN === "true") {
    return json("Diagnostic disabled when survey release flags are enabled.", 403);
  }
  if (!(request.headers.get("content-type") ?? "").startsWith("application/json")) return json("Expected JSON.", 415);
  let token: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 6000) return json("Request too large.", 413);
    const parsed: unknown = JSON.parse(raw);
    token = parsed && typeof parsed === "object" && "token" in parsed ? parsed.token : undefined;
  } catch {
    return json("Invalid JSON.", 400);
  }
  if (typeof token !== "string" || !token || token.length > 4096) return json("Complete Turnstile first.", 400);

  // Validate a server-generated fixture against the actual submission schema.
  const fixture = researchSurveySchema.safeParse({
    surveyVersion, submissionId: randomUUID(),
    category: businessCategories[0], teamSize: "Just me",
    mainChannel: channels[0], tracking: trackingMethods[0],
    challenges: [challenges[0]], challengeFrequency: "Weekly",
    price: "Not sure / Need to see it", followup: "No",
    contactName: "", contactDetail: "", contactPermission: false,
    privacyAcknowledged: true, website: "", turnstileToken: token,
  });
  if (!fixture.success) return json("Server-side test fixture failed validation.", 500);

  // Each invocation uses its own short-lived rate-limit key and cannot
  // consume any real visitor's allowance.
  const rate = await checkRateLimit("local-smoke:" + randomUUID());
  if (!rate.ok) return json("Redis integration failed (HTTP " + rate.status + ").", 503);
  const turnstile = await verifyTurnstile(token);
  if (!turnstile.ok) return json("Turnstile integration failed (HTTP " + turnstile.status + ").", 503);

  try {
    const outcome = await persistResearchResponse(fixture.data);
    if (outcome !== "closed") {
      // A successful insert is a serious configuration error. Do not say PASS.
      return json("FAIL: survey is not closed to writes. Stop testing and inspect Neon survey status.", 500);
    }
  } catch {
    return json("Neon read/write-gate check failed. Inspect schema and database configuration.", 503);
  }
  return json(
    "PASS: schema validation, Upstash rate limit, Turnstile verification and Neon draft write gate. No survey response was stored.",
    200
  );
}
