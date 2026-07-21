import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import InfoCard from "@/components/ui/InfoCard";

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
          description="Every technology was intentionally selected to support scalability, maintainability, performance and long-term product growth."
        />

        <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {product.architecture.map((item) => (

            <InfoCard
              key={item.technology}
              label={item.technology}
              value={
                <p className="leading-8 text-slate-600">
                  {item.description}
                </p>
              }
              className="h-full"
            />

          ))}

        </div>

      </Container>
    </Section>
  );
}