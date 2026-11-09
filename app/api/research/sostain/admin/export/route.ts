import { NextRequest } from "next/server";
import { authorizeResearchAdmin } from "@/lib/research/sostain/admin-gate";
import { researchSessionModeEnabled, validResearchSession } from "@/lib/research/sostain/admin-session";
import { exportResearchCsv } from "@/lib/research/sostain/admin-data";

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
    const csv = await exportResearchCsv();
    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="sostain-research-anonymized.csv"',
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch {
    return new Response("Research export temporarily unavailable.", {status: 503,headers: {"Cache-Control":"no-store"}});
  }
}
