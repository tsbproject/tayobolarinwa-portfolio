import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductChallenges({
  product,
}: Props) {
  if (
    !product.challenges ||
    product.challenges.length === 0
  ) {
    return null;
  }

  return (
    <Section>
      <Container>

        <SectionHeading
          eyebrow="Challenges"
          title="Engineering Challenges"
          description={`Key technical and product challenges encountered while building ${product.title}.`}
        />

        <div className="mt-16 space-y-6">

          {product.challenges.map((challenge, index) => (

            <div
              key={challenge.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 transition hover:shadow-lg"
            >

              <div className="flex items-start gap-6">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">
                  {index + 1}
                </div>

                <div>

                  <h3 className="text-2xl font-bold">
                    {challenge.title}
                  </h3>

                  <p className="mt-4 leading-8 text-slate-600">
                    {challenge.description}
                  </p>

                </div>

              </div>

            </div>

          ))}

        </div>

      </Container>
    </Section>
  );
}