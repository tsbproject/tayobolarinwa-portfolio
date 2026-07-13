import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

const timeline = [
  {
    year: "2018",
    title: "Started Web Development",
    description:
      "Began building websites professionally using WordPress while developing a strong understanding of web design, client projects and digital business needs.",
  },
  {
    year: "2023",
    title: "Transitioned Into Software Engineering",
    description:
      "Started learning HTML, CSS, JavaScript and modern frontend development to understand how applications are built from scratch.",
  },
  {
    year: "2024",
    title: "Modern Full Stack Development",
    description:
      "Mastered React, Next.js, TypeScript, backend development and modern engineering practices while building increasingly complex applications.",
  },
  {
    year: "2025–Present",
    title: "Building Scalable Products",
    description:
      "Leading the design and development of production-ready platforms including Marvel Creative Media, MarvelMarts and ApexTraders using modern full-stack technologies.",
  },
];

export default function AboutTimeline() {
  return (
    <Section>
      <Container>

        <SectionHeading
          eyebrow="Journey"
          title="My Development Journey"
          description="A timeline of my growth as a software engineer."
        />

        <div className="mt-16 space-y-8">

          {timeline.map((item) => (
            <div
              key={item.year}
              className="rounded-3xl border border-slate-200 bg-white p-8"
            >
              <span className="text-sm font-semibold text-blue-600">
                {item.year}
              </span>

              <h3 className="mt-2 text-2xl font-bold">
                {item.title}
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                {item.description}
              </p>
            </div>
          ))}

        </div>

      </Container>
    </Section>
  );
}