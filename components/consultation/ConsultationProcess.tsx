import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  "Discovery Call",
  "Project Review",
  "Technical Recommendation",
  "Implementation Plan",
];

export default function ConsultationProcess() {
  return (
    <Section>
      <Container>

        <SectionHeading
          eyebrow="Process"
          title="What to Expect"
          description="A simple and transparent consultation process."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-4">

          {steps.map((step, index) => (
            <div
              key={step}
              className="rounded-3xl border border-slate-200 bg-white p-8"
            >
              <span className="text-4xl font-bold text-blue-600">
                {index + 1}
              </span>

              <h3 className="mt-6 text-xl font-bold">
                {step}
              </h3>
            </div>
          ))}

        </div>

      </Container>
    </Section>
  );
}