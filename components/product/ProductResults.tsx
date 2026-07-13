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
          description={`Key outcomes achieved while delivering ${product.title}.`}
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {product.results.map((result) => (

            <div
              key={result.label}
              className="rounded-3xl border border-slate-200 bg-white p-10 text-center transition hover:-translate-y-1 hover:shadow-lg"
            >

              <h3 className="heading text-3xl font-bold text-blue-600 lg:text-4xl">
                {result.value}
              </h3>

              <p className="mt-4 text-sm font-medium uppercase tracking-wide text-slate-500">
                {result.label}
              </p>

            </div>

          ))}

        </div>

      </Container>
    </Section>
  );
}