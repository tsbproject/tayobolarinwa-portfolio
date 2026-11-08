import { NextRequest } from "next/server";
import { allowResearchAdmin, researchUnauthorizedResponse } from "@/lib/research/sostain/admin-auth";
import { exportResearchCsv } from "@/lib/research/sostain/admin-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!allowResearchAdmin(request.headers.get("authorization"))) return researchUnauthorizedResponse();
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
