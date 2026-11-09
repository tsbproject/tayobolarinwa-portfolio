import { NextRequest, NextResponse } from "next/server";
import { authorizeResearchAdmin } from "@/lib/research/sostain/admin-gate";
import { researchSessionModeEnabled, validResearchSession } from "@/lib/research/sostain/admin-session";
import { getResearchGovernanceOverview } from "@/lib/research/sostain/governance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = {"Cache-Control":"private, no-store","X-Robots-Tag":"noindex, nofollow"};

export async function GET(request: NextRequest) {
  if (researchSessionModeEnabled()) {
    try {
      if (!(await validResearchSession(request))) {
        return new Response("Research admin session required.", {status:401,headers});
      }
    } catch {
      return new Response("Research admin security unavailable.", {status:503,headers});
    }
  } else {
    const auth = await authorizeResearchAdmin(request);
    if (!auth.allowed) return auth.response;
  }
  try {
    return NextResponse.json(await getResearchGovernanceOverview(), {headers});
  } catch {
    return NextResponse.json({message:"Governance report unavailable."},{status:503,headers});
  }
}
