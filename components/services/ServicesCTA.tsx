import { ArrowRight } from "lucide-react/";

import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

export default function ServicesCTA() {
  return (
    <Section className="bg-slate-900 text-white">
      <Container>
        <div className="mx-auto max-w-4xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Let&apos;s Build Together
          </p>

          <h2 className="mt-6 text-4xl font-bold leading-tight md:text-5xl">
            Ready to Build
            <span className="block text-blue-400">
              Something Exceptional?
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-300">
            Whether you&apos;re launching a startup, modernizing an
            existing platform, or building enterprise software,
            I&apos;d love to help turn your vision into a reliable,
            scalable digital product.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">

            <Button href="/consultation">
             Book a Consultation
            <ArrowRight size={18} />
            </Button>

            <Button
            href="/products"
            variant="secondary"
            className="border-white/20 bg-transparent text-blue-400 hover:border-white hover:bg-white/10 hover:text-white"
            >
            View My Work
            </Button>

          </div>

        </div>
      </Container>
    </Section>
  );
}