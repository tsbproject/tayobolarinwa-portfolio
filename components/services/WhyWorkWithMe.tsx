import {
  Lightbulb,
  Layers3,
  ShieldCheck,
  Handshake,
} from "lucide-react";

import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

const reasons = [
  {
    icon: Lightbulb,
    title: "Product-First Thinking",
    description:
      "Every decision starts with solving business problems and creating value for users, not simply writing code.",
  },
  {
    icon: Layers3,
    title: "Scalable Architecture",
    description:
      "I build maintainable systems designed to evolve with your business instead of becoming technical debt.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Engineering",
    description:
      "Clean code, performance, security, accessibility, and maintainability are built into every project.",
  },
  {
    icon: Handshake,
    title: "Long-Term Partnership",
    description:
      "Launching is only the beginning. I help businesses improve, iterate, and scale their products over time.",
  },
];

export default function WhyWorkWithMe() {
  return (
    <Section className="bg-slate-50">
      <Container>
        <SectionHeading
          eyebrow="Why Work With Me"
          title="Engineering Solutions That Create Business Value"
          description="I approach every project with a product mindset—combining technical expertise with business thinking to build software that lasts."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {reasons.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              <div className="inline-flex rounded-2xl bg-blue-50 p-3 text-blue-600">
                <Icon size={28} />
              </div>

              <h3 className="mt-6 text-2xl font-bold text-slate-900">
                {title}
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                {description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}