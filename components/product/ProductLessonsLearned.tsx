import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

const lessons = [
  {
    title: "Build for Scale from Day One",
    description:
      "Designing the architecture with future growth in mind proved invaluable. Planning for scalability early made it significantly easier to introduce new modules and expand the marketplace without major rewrites.",
  },
  {
    title: "Maintainability Is a Feature",
    description:
      "As MarvelMarts grew into a large codebase, investing in reusable components, consistent patterns and a service-oriented backend greatly improved developer productivity and long-term maintainability.",
  },
  {
    title: "Business Understanding Drives Better Engineering",
    description:
      "Building a successful marketplace required understanding vendor workflows, customer expectations and administrative operations—not just writing code. Technical decisions were most effective when aligned with business goals.",
  },
  {
    title: "Iterative Improvement Beats Perfection",
    description:
      "MarvelMarts evolved through continuous refinement. Features were implemented, reviewed, refactored and improved over time, resulting in a stronger and more resilient platform than attempting to perfect everything in the first iteration.",
  },
  {
    title: "Engineering Is About Solving Problems",
    description:
      "The greatest value came not from the technologies themselves, but from using them to solve real business challenges. Every architectural decision was evaluated based on its ability to improve the product, user experience and future growth.",
  },
];

export default function ProductLessonsLearned({
  product,
}: Props) {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Lessons"
          title="Lessons Learned"
          description={`Key insights gained while building ${product.title}.`}
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {lessons.map((lesson) => (
            <div
              key={lesson.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="text-2xl font-bold">
                {lesson.title}
              </h3>

              <p className="mt-5 leading-8 text-slate-600">
                {lesson.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}