import Link from "next/link";

import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";

export default function AboutCTA() {
  return (
    <Section>
      <Container>

        <div className="rounded-3xl bg-slate-950 px-10 py-20 text-center text-white">

          <h2 className="text-4xl font-bold">
            Let&apos;s Build Something Amazing Together
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Whether you&apos;re launching a startup, modernizing an existing
            platform or building a new digital product, I'd love to help
            bring your vision to life.
          </p>

          <Link
            href="/consultation"
            className="mt-10 inline-flex rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700"
          >
            Book a Consultation
          </Link>

        </div>

      </Container>
    </Section>
  );
}