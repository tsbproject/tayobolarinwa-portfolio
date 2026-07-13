import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductLessonsLearned({
  product,
}: Props) {
  if (
    !product.lessons ||
    product.lessons.length === 0
  ) {
    return null;
  }

  return (
    <Section>
      <Container>

        <SectionHeading
          eyebrow="Lessons"
          title="Lessons Learned"
          description={`Key insights gained while building ${product.title}.`}
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-2">

          {product.lessons.map((lesson) => (

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