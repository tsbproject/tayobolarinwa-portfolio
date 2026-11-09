import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sostain Research Privacy Notice | Tayo Bolarinwa",
  description: "Privacy information for the Sostain Nigerian business research survey conducted by Tayo Bolarinwa.",
  robots: { index: false, follow: false },
};

export default function SostainPrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-14 text-slate-800 sm:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Sostain · Business research</p>
      <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Research privacy notice</h1>
      <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        Privacy notice version sostain-research-v1 · Updated 9 November 2026.
        Participation is voluntary. Check the research survey page for whether submissions are currently open.
      </p>

      <div className="mt-8 space-y-7 leading-7">
        <section>
          <h2 className="text-xl font-semibold text-slate-950">Who is responsible for this research?</h2>
          <p className="mt-2">
            <strong>Tayo Bolarinwa</strong> is the individual responsible for the Sostain business research
            conducted through tayobolarinwa.dev. Sostain is the name of the proposed business-software product
            under investigation; participation does not register you for a product or create a customer relationship.
            The study aims to understand day-to-day operational difficulties experienced by Nigerian businesses.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-950">What information is collected?</h2>
          <p className="mt-2">
            The seven-question survey asks about your type of business, team size, customer enquiry channel,
            how you track records, your principal business challenges, their frequency, and the monthly price
            you might consider for a useful software solution. A response identifier, survey version and
            submission time are also stored.
          </p>
          <p className="mt-2">
            If you explicitly agree to an optional interview and provide contact details, your name
            (if supplied) and email or WhatsApp contact are stored in a separate contact record, linked to your
            response. Interview contact permission is separate from the required acknowledgement that you have
            read this notice. Providing contact details does not sign you up for marketing.
          </p>
          <p className="mt-2">
            Cloudflare Turnstile and Upstash help detect automated or excessive submissions. Security
            services may process IP addresses or related technical data. The research answers table and
            ordinary reports do not store your IP address, CAPTCHA token or direct contact details.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-950">Why is the information used?</h2>
          <p className="mt-2">
            Survey answers are used to identify common business problems, summarize patterns and decide
            which issues warrant further product research. Optional interview contact details are used only
            for the research follow-up you have permitted, not for unrelated promotions.
            Participation is voluntary; you may decline to provide interview contact details.
          </p>
          <p className="mt-2">
            We rely on your affirmative consent to process the answers you choose to submit for this
            research. You can participate without providing any interview contact details. If you separately
            opt in to an interview and provide contact details, we rely on that separate permission to use
            those details solely to contact you about the research. You may withdraw your permission using
            the contact method below. Withdrawal does not invalidate processing performed before it,
            and verified requests will be assessed under applicable data-protection requirements.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-950">Storage, access and service providers</h2>
          <p className="mt-2">
            Research responses, consent records and optional contact details are stored in an
            access-controlled PostgreSQL database provided by Neon. The site is hosted by Vercel;
            Cloudflare provides security challenges and Upstash provides rate limiting.
            Access to administrative research information is restricted. Standard CSV and Excel reports
            exclude names, direct contact information and response identifiers, although combinations
            of answers may still be potentially identifying.
          </p>
          <p className="mt-2">
            These providers may process data outside Nigeria, including in the regions where their
            infrastructure operates. Their service terms and applicable data-protection arrangements
            govern that processing. You can ask for further information about relevant international
            processing and safeguards through the contact route below. Do not include customer names,
            financial account information or other confidential third-party information in your answers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-950">Your choices and privacy requests</h2>
          <p className="mt-2">
            You may ask about your information or request access, correction, withdrawal of optional
            interview permission or deletion, subject to applicable requirements and verification.
            Contact the research operator through the{" "}
            <Link className="font-semibold text-blue-700 underline underline-offset-2" href="/consultation">
              portfolio contact form
            </Link>{" "}
            and identify the message as a <strong>Sostain research privacy request</strong>.
            Do not send identity documents or sensitive information unless specifically necessary.
            We will verify requests carefully without disclosing another person&apos;s participation.
          </p>
          <p className="mt-2">
            If you did not provide contact details, identifying and verifying your particular response
            may be difficult. We will assess requests individually and will not disclose other participants'
            information. You may also raise a complaint with the Nigeria Data Protection Commission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-slate-950">Retention and deletion</h2>
          <p className="mt-2">
            The research operator has approved a maximum retention of <strong>90 days from submission</strong> for
            optional interview contact information and <strong>365 days from submission</strong> for
            identifiable or pseudonymous survey responses. Contact permission and related records will
            be reviewed alongside their linked response. Verified withdrawal or a valid erasure request
            may require earlier removal, subject to applicable legal exceptions. The operator is responsible
            for weekly retention reviews and secure, targeted manual deletion. Removed records may persist
            temporarily in provider-managed backups until the backup retention cycle expires; we do not
            promise immediate deletion from every backup copy.
          </p>
        </section>
      </div>

      <p className="mt-10 border-t border-slate-200 pt-5 text-sm text-slate-500">
        Privacy notice version sostain-research-v1 · Updated 9 November 2026 ·{" "}
        <Link href="/research/sostain" className="text-blue-700 underline underline-offset-2">
          Return to research survey
        </Link>
      </p>
    </main>
  );
}
