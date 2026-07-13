import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductEvolution({
  product,
}: Props) {
  if (
    !product.evolution ||
    !product.evolution.available
  ) {
    return null;
  }

  return (
    <Section>
      <Container>

        <SectionHeading
          eyebrow="Transformation"
          title={product.evolution.title}
          description={product.evolution.description}
        />

        <div className="mt-16 space-y-8">

          {product.evolution.steps.map((step, index) => (

            <div
              key={step.title}
              className="flex gap-6 rounded-3xl border border-slate-200 bg-white p-8"
            >

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 font-bold text-white">
                {index + 1}
              </div>

              <div>

                <h3 className="text-2xl font-bold">
                  {step.title}
                </h3>

                <p className="mt-4 leading-8 text-slate-600">
                  {step.description}
                </p>

              </div>

            </div>

          ))}

        </div>

      </Container>
    </Section>
  );
}