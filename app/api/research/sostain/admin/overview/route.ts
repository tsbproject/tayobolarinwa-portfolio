import { NextRequest, NextResponse } from "next/server";
import { authorizeResearchAdmin } from "@/lib/research/sostain/admin-gate";
import { researchSessionModeEnabled, validResearchSession } from "@/lib/research/sostain/admin-session";
import { getResearchOverview } from "@/lib/research/sostain/admin-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (researchSessionModeEnabled()) {
    try {
      if (!(await validResearchSession(request))) return new Response("Research admin session required.", {
        status:401, headers:{"Cache-Control":"private, no-store","X-Robots-Tag":"noindex, nofollow"},
      });
    } catch {
      return new Response("Research admin session verification unavailable.", {
        status:503, headers:{"Cache-Control":"private, no-store"},
      });
    }
  } else {
    const auth = await authorizeResearchAdmin(request);
    if (!auth.allowed) return auth.response;
  }
  try {
    const overview = await getResearchOverview();
    return NextResponse.json(overview, {
      headers: {"Cache-Control":"private, no-store","X-Robots-Tag":"noindex, nofollow"},
    });
  } catch {
    return NextResponse.json({message:"Research overview temporarily unavailable."},{
      status:503,headers:{"Cache-Control":"private, no-store"},
    });
  }
}
