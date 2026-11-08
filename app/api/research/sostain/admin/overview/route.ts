import { NextRequest, NextResponse } from "next/server";
import { authorizeResearchAdmin } from "@/lib/research/sostain/admin-gate";
import { getResearchOverview } from "@/lib/research/sostain/admin-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await authorizeResearchAdmin(request);
  if (!auth.allowed) return auth.response;
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
