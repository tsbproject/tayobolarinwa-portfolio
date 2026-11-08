import { NextRequest, NextResponse } from "next/server";
import { verifyTurnstile } from "@/lib/research/sostain/abuse-protection";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function reply(message: string, status: number) {
  return NextResponse.json({ message }, { status, headers: { "Cache-Control": "no-store" } });
}

/**
 * Diagnostic endpoint: no database or Redis operations. Strictly local dev.
 * Never echo or log the received challenge token or secret key.
 */
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") return reply("Not found.", 404);
  const origin = request.headers.get("origin");
  if (origin !== "http://localhost:3000") return reply("Forbidden.", 403);
  if (!(request.headers.get("content-type") ?? "").startsWith("application/json")) {
    return reply("Expected JSON.", 415);
  }
  let token: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 6000) return reply("Request too large.", 413);
    const parsed = JSON.parse(raw) as unknown;
    token = parsed && typeof parsed === "object" && "token" in parsed ? parsed.token : undefined;
  } catch {
    return reply("Invalid JSON.", 400);
  }
  if (typeof token !== "string" || !token) return reply("Complete the challenge first.", 400);
  const result = await verifyTurnstile(token);
  return result.ok
    ? reply("Cloudflare Turnstile verification: PASS. No survey answers were submitted.", 200)
    : reply("Turnstile verification failed (HTTP " + result.status + "). Review hostname, action and keys.", result.status);
}
