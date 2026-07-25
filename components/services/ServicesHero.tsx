import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function ServicesHero() {
  return (
    <Section className="overflow-hidden">
      <Container>

        <div className="mx-auto max-w-5xl text-center">

          <Badge>
            Product Engineering Services
          </Badge>

          <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
            Engineering
            <span className="block text-blue-600">
              Digital Products
            </span>
            That Scale.
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-9 text-slate-600 md:text-xl">
            I help startups, businesses and organizations transform
            ideas into scalable digital products,  from enterprise
            business platforms and commerce systems to modern web
            applications engineered for long-term growth.
          </p>

          <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">

            <Button
              href="/consultation"
             
            >
              Book a Consultation
            </Button>

            <Button
            href="/products"
            variant="secondary"
            >
            Explore My Work
            <ArrowRight size={18} />
          </Button>

          </div>

          <div className="mt-20 grid gap-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:grid-cols-3">
            <div>
                <h3 className="text-lg font-semibold text-slate-900">
                Product Engineering
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                Building scalable digital products from concept to deployment.
                </p>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-slate-900">
                Enterprise Solutions
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                Modern business platforms, commerce systems and internal tools.
                </p>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-slate-900">
                Long-Term Partnership
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                Engineering support beyond launch through continuous improvement.
                </p>
            </div>
            </div>

        </div>

      </Container>
    </Section>
  );
}