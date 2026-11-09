"use client";

import { useState } from "react";
import SurveyTurnstile from "@/components/research/sostain/SurveyTurnstile";

type TestResult = {message?: string; checks?: Record<string, boolean>};

export default function StagingAcceptanceClient() {
  const [key, setKey] = useState("");
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<TestResult | null>(null);
  const [status, setStatus] = useState<number | null>(null);

  async function run() {
    if (!key || !token || busy) return;
    setBusy(true);
    setResult(null);
    setStatus(null);
    try {
      const response = await fetch("/api/research/sostain/staging-e2e", {
        method: "POST",
        headers: {"Content-Type": "application/json", "x-sostain-staging-key": key},
        body: JSON.stringify({turnstileToken: token}),
        cache: "no-store",
      });
      setStatus(response.status);
      setResult(await response.json() as TestResult);
    } catch {
      setResult({message:"Network error; verify the current Preview alias and deployment."});
    } finally {
      setBusy(false);
      setToken(""); // Turnstile tokens are single-use; reload for a fresh challenge.
    }
  }

  return <main className="mx-auto max-w-xl px-5 py-14 text-slate-900">
    <h1 className="text-2xl font-bold">Sostain — protected staging acceptance</h1>
    <p className="mt-3 text-sm leading-6 text-slate-600">
      This is a one-shot synthetic test on an isolated Neon branch, not a respondent
      survey. The public survey remains closed. No real business information is entered here.
    </p>
    <div className="mt-7 space-y-5 rounded-xl border border-slate-200 bg-white p-6">
      <label className="block text-sm font-medium">Staging preflight key
        <input type="password" autoComplete="off" spellCheck={false}
          value={key} onChange={event=>setKey(event.target.value)}
          className="mt-2 w-full rounded-md border border-slate-300 p-3"
          placeholder="Enter locally; never share in chat or screenshots"/>
      </label>
      <div>
        <p className="mb-2 text-sm font-medium">Genuine Cloudflare Turnstile challenge</p>
        <SurveyTurnstile onToken={setToken}/>
      </div>
      <button type="button" onClick={run} disabled={!key || !token || busy || result !== null}
        className="rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
        {busy ? "Checking…" : "Run one synthetic acceptance test"}
      </button>
    </div>
    {result && <section className="mt-6 rounded-lg border border-slate-200 p-5" aria-live="polite">
      <p className="font-semibold">HTTP {status ?? "unknown"} — {result.message ?? "No message"}</p>
      {result.checks && <dl className="mt-4 space-y-2 text-sm">
        {Object.entries(result.checks).map(([name, ok])=>
          <div className="flex justify-between gap-4" key={name}>
            <dt>{name}</dt><dd className={ok ? "font-bold text-green-700" : "font-bold text-red-700"}>{ok ? "PASS" : "FAIL"}</dd>
          </div>)}
      </dl>}
      <p className="mt-4 text-sm text-slate-600">
        Do not retry if database cleanup or draft restoration failed or is uncertain.
        Share only the response status and check booleans; never share the key or challenge token.
      </p>
    </section>}
  </main>;
}
