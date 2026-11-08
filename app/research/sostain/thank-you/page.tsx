import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Survey received | Sostain", robots: { index: false, follow: false } };

export default function ThankYou() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="heading text-4xl font-semibold">Thank you for participating</h1>
      <p className="mt-6 text-slate-600">Your response has been received. If you opted in to follow-up contact, the research team may contact you about an interview.</p>
      <Link className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 font-medium text-white" href="/">Return to portfolio</Link>
    </main>
  );
}
