import { NextRequest, NextResponse } from "next/server";
import { researchSurveySchema } from "@/lib/research/sostain/schema";
import { checkRateLimit, verifyTurnstile } from "@/lib/research/sostain/abuse-protection";
import { createHmac } from "node:crypto";
import { persistResearchResponse } from "@/lib/research/sostain/persistence";
import { getVercelClientIp } from "@/lib/research/sostain/client-ip";

/**
 * Deliberately fail-closed until persistent storage, distributed rate limiting,
 * and Turnstile credentials are provisioned and integration-tested.
 * No payload is logged or treated as submitted.
 */
export async function POST(request: NextRequest) {
  // Never enable collection from a front-end feature flag alone.
  if (process.env.SOSTAIN_SURVEY_BACKEND_READY !== "true") {
    return NextResponse.json({ message: "Research submissions are not open yet. No answers have been stored." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  const origin = request.headers.get("origin");
  const validOrigins = new Set([
    "https://tayobolarinwa.dev",
    "https://www.tayobolarinwa.dev",
    ...(process.env.NODE_ENV === "development" ? ["http://localhost:3000"] : []),
  ]);
  if (!origin || !validOrigins.has(origin)) {
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.startsWith("application/json")) {
    return NextResponse.json({ message: "Invalid content type." }, { status: 415 });
  }

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > 16_384) {
    return NextResponse.json({ message: "Submission too large." }, { status: 413 });
  }

  let parsed: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 16_384) return NextResponse.json({ message: "Submission too large." }, { status: 413 });
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const validated = researchSurveySchema.safeParse(parsed);
  if (!validated.success) {
    return NextResponse.json({ message: "Check the survey answers." }, { status: 400 });
  }
  if (validated.data.website.trim()) return NextResponse.json({ message: "Unable to accept submission." }, { status: 400 });

  const salt = process.env.SOSTAIN_RATE_LIMIT_KEY;
  if (!salt) return NextResponse.json({ message: "Research security is not configured." }, { status: 503 });
  // Use an infrastructure-provided client IP only on the trusted Vercel deployment.
  // Do not allow arbitrary client headers to bypass limits on other hosts.
  const ip = getVercelClientIp(request.headers.get("x-vercel-forwarded-for"));
  if (!ip) return NextResponse.json({ message: "Unable to verify request origin." }, { status: 403 });
  const key = createHmac("sha256", salt).update(ip).digest("hex");
  const limit = await checkRateLimit(key);
  if (!limit.ok) return NextResponse.json({ message: limit.message }, { status: limit.status });
  const turnstile = await verifyTurnstile(validated.data.turnstileToken, ip);
  if (!turnstile.ok) return NextResponse.json({ message: turnstile.message }, { status: turnstile.status });

  try {
    const outcome = await persistResearchResponse(validated.data);
    if (outcome === "closed") {
      return NextResponse.json({message:"Research submissions are currently closed."}, {status:503,headers:{"Cache-Control":"no-store"}});
    }
    // A repeated submissionId is an idempotent retry, not a second response.
    return NextResponse.json(
      {message: outcome === "duplicate" ? "Your response was already received." : "Your response was saved."},
      {status:200, headers:{"Cache-Control":"no-store"}}
    );
  } catch {
    // Never leak credentials or raw SQL errors to the public response.
    return NextResponse.json(
      {message:"Unable to save the survey response. No success has been recorded."},
      {status:503, headers:{"Cache-Control":"no-store"}}
    );
  }
}
