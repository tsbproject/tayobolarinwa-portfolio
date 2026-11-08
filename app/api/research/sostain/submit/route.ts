import { NextRequest, NextResponse } from "next/server";
import { researchSurveySchema } from "@/lib/research/sostain/schema";

/**
 * Deliberately fail-closed until persistent storage, distributed rate limiting,
 * and Turnstile credentials are provisioned and integration-tested.
 * No payload is logged or treated as submitted.
 */
export async function POST(request: NextRequest) {
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

  return NextResponse.json(
    { message: "Research submissions are not open yet. No answers have been stored." },
    { status: 503, headers: { "Cache-Control": "no-store" } }
  );
}
