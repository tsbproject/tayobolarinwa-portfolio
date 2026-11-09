import { NextRequest, NextResponse } from "next/server";
import {
  clearResearchSessionCookie, researchAdminOriginAllowed,
  researchSessionModeEnabled, revokeResearchSession,
} from "@/lib/research/sostain/admin-session";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = {"Cache-Control":"private, no-store","X-Robots-Tag":"noindex, nofollow"};
export async function POST(request:NextRequest) {
  if (!researchSessionModeEnabled()) return NextResponse.json({message:"Not found."},{status:404,headers});
  if (!researchAdminOriginAllowed(request)) return NextResponse.json({message:"Forbidden."},{status:403,headers});
  try {
    await revokeResearchSession(request);
    const response = NextResponse.json({ok:true},{headers});
    response.cookies.set(clearResearchSessionCookie());
    return response;
  } catch {
    return NextResponse.json({message:"Could not revoke session."},{status:503,headers});
  }
}
