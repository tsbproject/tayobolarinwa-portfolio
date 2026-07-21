import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import InfoCard from "@/components/ui/InfoCard";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductEngineeringDecisions({
  product,
}: Props) {
  if (
    !product.engineeringDecisions ||
    product.engineeringDecisions.length === 0
  ) {
    return null;
  }

  return (
    <Section>
      <Container>

        <SectionHeading
          eyebrow="Engineering"
          title="Engineering Decisions"
          description={`Every major technology choice was made to improve scalability, maintainability and long-term product evolution.`}
        />

        <div className="mt-20 grid gap-6 lg:grid-cols-2">

          {product.engineeringDecisions.map((item) => (

            <InfoCard
              key={item.title}
              label={item.title}
              value={
                <>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {item.decision}
                  </h3>

                  <p className="mt-5 leading-8 text-slate-600">
                    {item.reason}
                  </p>
                </>
              }
              className="h-full"
            />

          ))}

        </div>

      </Container>
    </Section>
  );
}