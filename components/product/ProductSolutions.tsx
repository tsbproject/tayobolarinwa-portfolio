import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import InfoCard from "@/components/ui/InfoCard";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductSolutions({
  product,
}: Props) {
  if (
    !product.solutions ||
    product.solutions.length === 0
  ) {
    return null;
  }

  return (
    <Section>
      <Container>

        <SectionHeading
          eyebrow="Solutions"
          title="Engineering Solutions"
          description={`Each challenge was addressed through deliberate architectural and engineering decisions that support long-term scalability and maintainability.`}
        />

        <div className="mt-20 grid gap-6 lg:grid-cols-2">

          {product.solutions.map((solution, index) => (

            <InfoCard
              key={solution.title}
              label={`Solution ${String(index + 1).padStart(2, "0")}`}
              value={
                <>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {solution.title}
                  </h3>

                  <p className="mt-5 leading-8 text-slate-600">
                    {solution.description}
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