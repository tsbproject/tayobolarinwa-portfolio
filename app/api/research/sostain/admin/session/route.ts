import { NextRequest, NextResponse } from "next/server";
import { researchSessionModeEnabled, validResearchSession } from "@/lib/research/sostain/admin-session";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = {"Cache-Control":"private, no-store","X-Robots-Tag":"noindex, nofollow"};
export async function GET(request:NextRequest) {
  if (!researchSessionModeEnabled()) return NextResponse.json({message:"Not found."},{status:404,headers});
  try {
    const valid = await validResearchSession(request);
    return NextResponse.json({authenticated:valid},{status:valid?200:401,headers});
  } catch {
    return NextResponse.json({message:"Session verification unavailable."},{status:503,headers});
  }
}
