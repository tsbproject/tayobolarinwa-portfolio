import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

const categories = [
  {
    title: "Frontend Engineering",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Redux Toolkit",
    ],
    description:
      "Building fast, accessible and responsive user experiences using modern frontend technologies.",
  },
  {
    title: "Backend & APIs",
    technologies: [
      "Node.js",
      "Prisma ORM",
      "PostgreSQL",
      "REST APIs",
      "Authentication",
    ],
    description:
      "Designing secure backend systems with clean architecture and scalable API integrations.",
  },
  {
    title: "Cloud & Infrastructure",
    technologies: [
      "Vercel",
      "Neon",
      "Resend",
      "Cloudinary",
      "GitHub",
    ],
    description:
      "Deploying reliable cloud-native applications with modern developer workflows.",
  },
  {
    title: "Engineering Practices",
    technologies: [
      "Performance",
      "SEO",
      "Security",
      "Responsive Design",
      "Scalable Architecture",
    ],
    description:
      "Applying engineering best practices to create maintainable software that grows with your business.",
  },
];

export default function TechnologyStack() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Technology"
          title="Built with Modern Technologies"
          description="Every product is built with a carefully selected technology stack focused on performance, maintainability, and long-term scalability."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {categories.map((category) => (
            <div
              key={category.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-blue-200 hover:shadow-lg"
            >
              <h3 className="text-2xl font-bold text-slate-900">
                {category.title}
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                {category.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {category.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}