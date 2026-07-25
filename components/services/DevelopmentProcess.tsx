import {
  Search,
  ClipboardCheck,
  PencilRuler,
  Code2,
  Rocket,
  TrendingUp,
} from "lucide-react";

import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  {
    icon: Search,
    title: "Discover",
    description:
      "Understand your business goals, users, and technical requirements.",
  },
  {
    icon: ClipboardCheck,
    title: "Strategy",
    description:
      "Define the roadmap, scope, architecture, and delivery plan.",
  },
  {
    icon: PencilRuler,
    title: "Design",
    description:
      "Create intuitive user experiences and scalable product structures.",
  },
  {
    icon: Code2,
    title: "Engineer",
    description:
      "Develop high-quality software using modern engineering practices.",
  },
  {
    icon: Rocket,
    title: "Launch",
    description:
      "Deploy confidently with testing, optimization, and monitoring.",
  },
  {
    icon: TrendingUp,
    title: "Grow",
    description:
      "Continuously improve the product through iteration and new features.",
  },
];

export default function DevelopmentProcess() {
  return (
    <Section className="bg-slate-50">
      <Container>
        <SectionHeading
          eyebrow="Process"
          title="A Proven Product Engineering Process"
          description="Every project follows a structured approach that minimizes risk, improves collaboration, and delivers reliable digital products."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <div
              key={title}
              className="relative rounded-3xl bg-white border border-slate-200 p-8 shadow-sm"
            >
              <div className="absolute right-6 top-6 text-4xl font-extrabold text-slate-100">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="inline-flex rounded-2xl bg-blue-50 p-3 text-blue-600">
                <Icon size={26} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
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