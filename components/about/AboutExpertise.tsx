import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

const expertise = [
  "Full Stack Web Development",
  "Next.js & React",
  "TypeScript",
  "Node.js",
  "Prisma ORM",
  "PostgreSQL",
  "REST APIs",
  "System Architecture",
  "Technical SEO",
  "UI/UX Engineering",
  "Performance Optimization",
  "Product Development",
];

export default function AboutExpertise() {
  return (
    <Section>
      <Container>

        <SectionHeading
          eyebrow="Expertise"
          title="Core Expertise"
          description="Technologies and disciplines I work with daily."
        />

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {expertise.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-white p-6 font-medium"
            >
              {item}
            </div>
          ))}

        </div>

      </Container>
    </Section>
  );
}