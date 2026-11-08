"use client";

import { useState } from "react";

type Overview = {
  total: number;
  categories: {category:string;count:number}[];
  recent: {submittedAt:string;category:string;challengeSummary:string;price:string}[];
};

export default function ResearchAdminClient() {
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [overview,setOverview] = useState<Overview | null>(null);
  const [error,setError] = useState("");
  const [busy,setBusy] = useState(false);
  // The Basic credential lives only in component memory. Never write to a
  // cookie, query string, storage, analytics, server logs or URL.
  const [authorization,setAuthorization] = useState("");
  const [exporting,setExporting] = useState(false);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    try {
      const encoded = btoa(unescape(encodeURIComponent(username + ":" + password)));
      const header = "Basic " + encoded;
      const response = await fetch("/api/research/sostain/admin/overview",{
        headers:{Authorization:header},cache:"no-store",
      });
      if (!response.ok) throw new Error(response.status === 401 ? "Invalid admin credentials or admin access not configured." : "Research admin service is unavailable.");
      const data = (await response.json()) as Overview;
      setOverview(data); setAuthorization(header);
      setUsername(""); setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {setBusy(false);}
  }

  async function exportFile(format: "csv" | "excel") {
    if (!authorization || exporting) return;
    setExporting(true); setError("");
    try {
      const response = await fetch(format === "excel" ? "/api/research/sostain/admin/excel" : "/api/research/sostain/admin/export",{
        headers:{Authorization:authorization},cache:"no-store",
      });
      if (!response.ok) throw new Error("Export could not be completed.");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url; anchor.download = format === "excel" ? "sostain-research-report.xlsx" : "sostain-research-anonymized.csv";
      document.body.append(anchor); anchor.click(); anchor.remove();
      URL.revokeObjectURL(url);
    } catch(err) {
      setError(err instanceof Error ? err.message : "Export failed.");
    } finally {setExporting(false);}
  }

  function signOut() {
    setAuthorization("");setOverview(null);setUsername("");setPassword("");setError("");
  }
  return <main className="mx-auto max-w-5xl px-6 py-12">
    {!overview ? <form onSubmit={login} autoComplete="off" className="mx-auto max-w-md space-y-5 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-blue-700">Sostain Research</p>
      <h1 className="text-2xl font-bold">Research administration</h1>
      <p className="text-sm text-slate-600">Private researcher access. Use only on localhost or HTTPS.</p>
      <label className="block text-sm font-medium">Username
        <input required autoComplete="off" value={username} onChange={e=>setUsername(e.target.value)} className="mt-2 w-full rounded-xl border p-3"/>
      </label>
      <label className="block text-sm font-medium">Password
        <input type="password" required autoComplete="off" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border p-3"/>
      </label>
      <button disabled={busy} className="rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white disabled:opacity-50">{busy?"Checking…":"Sign in"}</button>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    </form> : <>
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div><p className="text-xs font-bold uppercase tracking-wider text-blue-700">Sostain Research</p><h1 className="mt-2 text-3xl font-bold">Research Overview</h1><p className="mt-2 text-slate-600">Aggregate and de-identified answers only.</p></div>
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={exporting} onClick={()=>exportFile("excel")} className="rounded-lg bg-slate-950 px-4 py-3 font-semibold text-white disabled:opacity-50">{exporting?"Preparing…":"Download Excel Report"}</button>
          <button type="button" disabled={exporting} onClick={()=>exportFile("csv")} className="rounded-lg border border-slate-300 px-4 py-3 font-semibold disabled:opacity-50">Export CSV</button>
          <button type="button" onClick={signOut} className="rounded-lg border border-slate-300 px-4 py-3 font-semibold">Sign out</button>
        </div>
      </div>
      {error && <p role="alert" className="mt-5 text-sm text-red-700">{error}</p>}
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6"><p className="text-sm text-slate-500">Research responses</p><p className="mt-2 text-4xl font-bold">{overview.total}</p></section>
      <section className="mt-8"><h2 className="text-xl font-bold">Business categories</h2>
        {overview.categories.length ? <div className="mt-4 divide-y rounded-2xl border border-slate-200">
          {overview.categories.map(item=><div className="flex justify-between gap-4 p-4" key={item.category}><span>{item.category}</span><strong>{item.count}</strong></div>)}
        </div> : <p className="mt-3 text-slate-500">No research responses yet. The survey is still in preparation.</p>}
      </section>
      <section className="mt-8"><h2 className="text-xl font-bold">Recent responses (up to 20)</h2><div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="bg-slate-50"><tr><th className="p-3">Submitted</th><th className="p-3">Category</th><th className="p-3">Challenges</th><th className="p-3">Price consideration</th></tr></thead>
          <tbody>{overview.recent.map((item,i)=><tr key={i} className="border-t"><td className="p-3">{new Date(item.submittedAt).toLocaleDateString("en-NG",{dateStyle:"medium",timeZone:"Africa/Lagos"})}</td><td className="p-3">{item.category}</td><td className="p-3">{item.challengeSummary}</td><td className="p-3">{item.price}</td></tr>)}</tbody>
        </table>
      </div></section>
    </>}
  </main>;
}
