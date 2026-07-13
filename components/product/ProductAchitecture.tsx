import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductArchitecture({
  product,
}: Props) {
  if (
    !product.architecture ||
    product.architecture.length === 0
  ) {
    return null;
  }

  return (
    <Section>
      <Container>

        <SectionHeading
          eyebrow="Architecture"
          title="Technical Architecture"
          description="Core technologies and architectural decisions behind the product."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {product.architecture.map((item) => (

            <div
              key={item.technology}
              className="rounded-3xl border border-slate-200 bg-white p-8 transition hover:-translate-y-1 hover:shadow-lg"
            >

              <h3 className="text-xl font-semibold">
                {item.technology}
              </h3>

              <p className="mt-4 leading-7 text-slate-600">
                {item.description}
              </p>

            </div>

          ))}

        </div>

      </Container>
    </Section>
  );
}