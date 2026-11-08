"use client";

import { useState } from "react";
import SurveyTurnstile from "./SurveyTurnstile";

export default function TurnstileCheckClient({ combined = false }: { combined?: boolean }) {
  const [token, setToken] = useState("");
  const [result, setResult] = useState("");
  const [busy, setBusy] = useState(false);

  async function verify() {
    if (!token || busy) return;
    setBusy(true);
    setResult("");
    try {
      const response = await fetch(combined ? "/api/research/sostain/integration-check" : "/api/research/sostain/turnstile-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
        cache: "no-store",
      });
      const data = (await response.json()) as { message?: string };
      setResult(data.message ?? "Unexpected response.");
    } catch {
      setResult("Verification request could not be completed.");
    } finally {
      setToken(""); // Turnstile tokens are single use; refresh this page to test again.
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-xl px-6 py-20">
      <h1 className="text-3xl font-bold">{combined ? "Sostain Security — Combined Local Check" : "Sostain Turnstile — Local Check"}</h1>
      <p className="mt-3 text-slate-600">
        {combined ? "This development-only test exercises Turnstile, a disposable Upstash rate-limit key and the Neon draft write gate. It must not store survey answers." : "This development-only test checks Cloudflare verification. It does not submit research answers, create database records or modify Redis counters."}
      </p>
      <div className="mt-8 rounded-xl border border-slate-200 p-5">
        <SurveyTurnstile onToken={setToken}/>
        <button type="button" onClick={verify} disabled={!token || busy}
          className="mt-5 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white disabled:opacity-50">
          {busy ? "Verifying…" : combined ? "Run Combined Check" : "Verify Turnstile"}
        </button>
      </div>
      {result && <p role="status" className="mt-5 text-sm font-semibold">{result}</p>}
      <p className="mt-6 text-sm text-slate-500">
        For a second attempt, refresh the page to generate a fresh single-use token.
      </p>
    </main>
  );
}
