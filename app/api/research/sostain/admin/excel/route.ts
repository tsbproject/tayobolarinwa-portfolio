import { NextRequest } from "next/server";
import { allowResearchAdmin, researchUnauthorizedResponse } from "@/lib/research/sostain/admin-auth";
import { buildResearchExcelWorkbook } from "@/lib/research/sostain/excel";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(request:NextRequest) {
  if (!allowResearchAdmin(request.headers.get("authorization"))) return researchUnauthorizedResponse();
  try {
    const xlsx=await buildResearchExcelWorkbook();
    return new Response(new Uint8Array(xlsx), {
      status:200,
      headers:{
        "Content-Type":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition":'attachment; filename="sostain-research-report.xlsx"',
        "Cache-Control":"private, no-store",
        "X-Content-Type-Options":"nosniff",
        "X-Robots-Tag":"noindex, nofollow",
      },
    });
  } catch {
    return new Response("Research workbook temporarily unavailable.",{status:503,headers:{"Cache-Control":"private, no-store"}});
  }
}
