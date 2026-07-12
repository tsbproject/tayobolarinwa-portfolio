import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

const lessons = [
  {
    title: "Design for Scalability Early",
    description:
      "Making architectural decisions early helped the platform remain flexible as new features and business requirements emerged.",
  },
  {
    title: "Reusable Components Increase Velocity",
    description:
      "Building reusable UI components significantly reduced development time and improved consistency across the application.",
  },
  {
    title: "Type Safety Pays Off",
    description:
      "Using TypeScript throughout the project reduced runtime bugs and made refactoring much safer as the codebase grew.",
  },
  {
    title: "Think Like a Product Builder",
    description:
      "Focusing on business goals and user experience alongside technical implementation led to a more valuable product overall.",
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