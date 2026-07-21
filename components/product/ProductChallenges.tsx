import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import InfoCard from "@/components/ui/InfoCard";

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
          description={`Every complex product presents engineering challenges. These are the key problems encountered while building ${product.title} and the considerations behind solving them.`}
        />

        <div className="mt-20 grid gap-6 lg:grid-cols-2">

          {product.challenges.map((challenge, index) => (

            <InfoCard
              key={challenge.title}
              label={`Challenge ${String(index + 1).padStart(2, "0")}`}
              value={
                <>
                  <h3 className="text-2xl font-bold text-slate-900">
                    {challenge.title}
                  </h3>

                  <p className="mt-5 leading-8 text-slate-600">
                    {challenge.description}
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