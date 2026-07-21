import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductResults({
  product,
}: Props) {
  if (
    !product.results ||
    product.results.length === 0
  ) {
    return null;
  }

  return (
    <Section>
      <Container>

        <SectionHeading
          eyebrow="Results"
          title="Project Outcomes"
          description={`The measurable outcomes and long-term value delivered through the engineering decisions behind ${product.title}.`}
        />

        <div className="mt-20 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

          {product.results.map((result) => (

            <div
              key={result.label}
              className="group rounded-3xl border border-slate-200 bg-white p-10 text-center transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
            >

              <h3 className="heading text-4xl font-bold text-blue-600 transition-colors duration-300 group-hover:text-blue-700">

                {result.value}

              </h3>

              <div className="mx-auto mt-6 h-px w-12 bg-slate-200" />

              <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">

                {result.label}

              </p>

            </div>

          ))}

        </div>

      </Container>
    </Section>
  );
}