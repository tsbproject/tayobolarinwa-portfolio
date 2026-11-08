import { headers } from "next/headers";
import { allowResearchAdmin, researchUnauthorizedResponse } from "@/lib/research/sostain/admin-auth";
import { getResearchOverview } from "@/lib/research/sostain/admin-data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Sostain Research Administration", robots: {index: false, follow: false} };

export default async function ResearchAdminPage() {
  const incoming = await headers();
  if (!allowResearchAdmin(incoming.get("authorization"))) {
    // Next.js server component requires throwing to return an auth challenge;
    // enforce with middleware-level route protection using proxy.ts below.
    // This branch must never access the database or display private data.
    return <main className="mx-auto max-w-3xl p-12"><h1>Access denied</h1><p>Research admin authentication required.</p></main>;
  }
  let overview: Awaited<ReturnType<typeof getResearchOverview>>;
  try {
    overview = await getResearchOverview();
  } catch {
    return <main className="mx-auto max-w-3xl p-12"><h1 className="text-2xl font-bold">Research administration</h1><p>Research database is temporarily unavailable.</p></main>;
  }
  return <main className="mx-auto max-w-5xl px-6 py-12">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-700">Sostain Research</p>
        <h1 className="mt-3 text-3xl font-bold">Research Overview</h1>
        <p className="mt-2 text-slate-600">Aggregate and de-identified responses only. Interview contacts are excluded.</p>
      </div>
      <a className="rounded-lg bg-slate-950 px-4 py-3 font-semibold text-white" href="/api/research/sostain/admin/export">Export CSV</a>
    </div>
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
      <p className="text-sm text-slate-500">Total research responses</p>
      <p className="mt-2 text-4xl font-bold">{overview.total}</p>
    </section>
    <section className="mt-8">
      <h2 className="text-xl font-bold">Business categories</h2>
      {overview.categories.length ? <div className="mt-4 divide-y rounded-2xl border border-slate-200">
        {overview.categories.map(item => <div key={item.category} className="flex justify-between gap-4 p-4"><span>{item.category}</span><strong>{item.count}</strong></div>)}
      </div> : <p className="mt-3 text-slate-500">No submissions yet. The survey is still in research preparation.</p>}
    </section>
    <section className="mt-8">
      <h2 className="text-xl font-bold">Recent responses (up to 20)</h2>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="bg-slate-50"><tr><th className="p-3">Submitted</th><th className="p-3">Category</th><th className="p-3">Challenges</th><th className="p-3">Price consideration</th></tr></thead>
          <tbody>{overview.recent.map((item,i) => <tr key={i} className="border-t">
            <td className="p-3">{new Date(item.submittedAt).toLocaleDateString("en-NG",{dateStyle:"medium",timeZone:"Africa/Lagos"})}</td>
            <td className="p-3">{item.category}</td><td className="p-3">{item.challengeSummary}</td><td className="p-3">{item.price}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </section>
  </main>;
}
