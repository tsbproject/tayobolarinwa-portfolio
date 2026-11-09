import { NextRequest, NextResponse } from "next/server";
import { authorizeResearchAdmin } from "@/lib/research/sostain/admin-gate";
import { verifyResearchTotp } from "@/lib/research/sostain/admin-totp";
import {
  createResearchSession, ensureResearchSessionConfigured,
  researchAdminOriginAllowed, researchSessionCookie, researchSessionModeEnabled,
} from "@/lib/research/sostain/admin-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = {"Cache-Control":"private, no-store","X-Robots-Tag":"noindex, nofollow"};
const error = (status:number,message:string) => NextResponse.json({message},{status,headers});

export async function POST(request:NextRequest) {
  if (!researchSessionModeEnabled()) return error(404,"Not found.");
  if (!researchAdminOriginAllowed(request)) return error(403,"Forbidden.");
  if (!(request.headers.get("content-type") ?? "").startsWith("application/json")) {
    return error(415,"Invalid request.");
  }
  if (Number(request.headers.get("content-length") ?? 0) > 2048) return error(413,"Invalid request.");
  let code = "";
  try {
    const raw = await request.text();
    if (raw.length > 2048) return error(413,"Invalid request.");
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || !("code" in parsed) ||
      typeof parsed.code !== "string" || !/^\d{6}$/.test(parsed.code)) {
      return error(400,"Invalid request.");
    }
    code = parsed.code;
    ensureResearchSessionConfigured();
  } catch {
    return error(503,"Research admin login is not configured or available.");
  }

  const credentials = await authorizeResearchAdmin(request);
  if (!credentials.allowed) return credentials.response;
  const step = verifyResearchTotp(code,process.env.SOSTAIN_RESEARCH_ADMIN_TOTP_SECRET!);
  if (step === null) return error(401,"Invalid administrator credentials.");

  try {
    const token = await createResearchSession(step);
    if (!token) return error(401,"This verification code has already been used. Use a new code.");
    const response = NextResponse.json({ok:true},{headers});
    response.cookies.set(researchSessionCookie(token));
    return response;
  } catch {
    return error(503,"Research admin session service temporarily unavailable.");
  }
}
