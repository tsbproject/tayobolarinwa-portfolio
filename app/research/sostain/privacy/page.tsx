import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sostain Research Privacy Notice",
  description: "How the Sostain business operations research handles survey answers and optional interview contact information.",
  robots: { index: false, follow: false },
};

export default function SostainPrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-14 text-slate-800 sm:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Sostain · Business research</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Research privacy notice</h1>
      <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        Pre-launch research notice. The survey is not yet accepting responses. Data-retention arrangements and
        contact handling will be reviewed before public recruitment begins.
      </p>
      <div className="mt-8 space-y-7 leading-7">
        <section><h2 className="text-xl font-semibold text-slate-950">Who is conducting the research?</h2>
          <p className="mt-2">Sostain is a proposed business-software product being researched through the
          tayobolarinwa.dev portfolio. This study is intended to understand the everyday challenges of Nigerian businesses.
          Participation does not create a customer relationship or register you for a product.</p>
        </section>
        <section><h2 className="text-xl font-semibold text-slate-950">What information is collected?</h2>
          <p className="mt-2">The short questionnaire asks about your type of business, team size, customer channels,
          recordkeeping, challenges, how often those challenges occur and a possible software price range.
          If you separately agree to an interview follow-up and provide contact details, a name (if entered) and
          your email or WhatsApp contact are saved separately from your survey answers.</p>
          <p className="mt-2">The site also uses Cloudflare Turnstile and Upstash Redis to check for automated or excessive
          submissions. Security systems may process technical information such as IP addresses. We do not put
          challenge tokens or IP addresses into the research answers table or standard de-identified export.</p>
        </section>
        <section><h2 className="text-xl font-semibold text-slate-950">Why and how is it used?</h2>
          <p className="mt-2">Answers are used for product discovery, research summaries and decisions about which
          business problems warrant deeper interviews. Interview contact details are used only to invite you to
          discuss your experience, if you explicitly opt in. The survey does not enroll you in marketing communications.</p>
        </section>
        <section><h2 className="text-xl font-semibold text-slate-950">Where is it stored and who can see it?</h2>
          <p className="mt-2">Research answers and optional contact records are held in an access-controlled
          PostgreSQL research database supplied by Neon. Operational services include Vercel hosting, Cloudflare
          challenge verification and Upstash rate limiting. Research administration is restricted to authorised
          researchers. Ordinary exports do not include names, contact details, submission identifiers or security tokens.</p>
          <p className="mt-2">These service providers may handle information outside Nigeria according to their
          configurations and applicable service terms. Do not include customer names, financial account numbers or
          other confidential business or customer information in the survey.</p>
        </section>
        <section><h2 className="text-xl font-semibold text-slate-950">Your choices and requests</h2>
          <p className="mt-2">Taking part is voluntary. You can skip interview contact details entirely.
          You can ask questions or request access, correction or deletion of information linked to you using the
          <Link className="font-semibold text-blue-700 underline underline-offset-2" href="/consultation"> portfolio contact page</Link>.
          Anonymous responses may be difficult to locate without an identifying reference. We will review requests
          in light of the available records and applicable requirements.</p>
        </section>
        <section><h2 className="text-xl font-semibold text-slate-950">Retention and research launch</h2>
          <p className="mt-2">The survey is currently closed. A documented retention and deletion schedule,
          administrative safeguards and final privacy review are required before real research responses are accepted.
          This page will be updated with the approved retention periods before the public launch.</p>
        </section>
      </div>
      <p className="mt-10 border-t border-slate-200 pt-5 text-sm text-slate-500">Pre-launch draft · 8 November 2026 · <Link href="/research/sostain" className="text-blue-700 underline underline-offset-2">Return to research survey</Link></p>
    </main>
  );
}
