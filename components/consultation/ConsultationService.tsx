import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

const services = [
  "Full Stack Web Application Development",
  "Technical Architecture Review",
  "Marketplace & SaaS Development",
  "Next.js Performance Optimization",
  "UI/UX Engineering",
  "API Design & Integration",
  "Codebase Refactoring",
  "SEO & Performance Consulting",
];

export default function ConsultationServices() {
  return (
    <Section>
      <Container>

        <SectionHeading
          eyebrow="Services"
          title="How I Can Help"
          description="Areas where I provide engineering consultation."
        />

        <div className="mt-16 grid gap-4 md:grid-cols-2">

          {services.map((service) => (
            <div
              key={service}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              {service}
            </div>
          ))}

        </div>

      </Container>
    </Section>
  );
}