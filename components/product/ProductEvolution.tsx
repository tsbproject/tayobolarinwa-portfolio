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

        <div className="relative mt-20">

          {/* Timeline */}

          <div className="absolute left-6 top-0 hidden h-full w-px bg-slate-200 lg:block" />

          <div className="space-y-10">

            {product.evolution.steps.map((step, index) => (

              <div
                key={step.title}
                className="relative flex gap-8"
              >

                {/* Timeline Marker */}

                <div className="relative z-10 hidden lg:flex">

                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-blue-600 font-bold text-white shadow-lg">

                    {String(index + 1).padStart(2, "0")}

                  </div>

                </div>

                {/* Content */}

                <div className="flex-1 rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">

                    Stage {String(index + 1).padStart(2, "0")}

                  </p>

                  <h3 className="mt-4 text-3xl font-bold text-slate-900">

                    {step.title}

                  </h3>

                  <p className="mt-6 leading-8 text-slate-600">

                    {step.description}

                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </Container>
    </Section>
  );
}