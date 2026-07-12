import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

const results = [
  {
    value: "100%",
    label: "Responsive Experience",
  },
  {
    value: "99+",
    label: "Performance Score",
  },
  {
    value: "SEO",
    label: "Optimized Architecture",
  },
  {
    value: "Scalable",
    label: "Built For Growth",
  },
];

export default function ProductResults({
  product,
}: Props) {
  return (
    <Section>
      <Container>

        <SectionHeading
          eyebrow="Results"
          title="Project Outcomes"
          description={`Key outcomes achieved while delivering ${product.title}.`}
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {results.map((result) => (

            <div
              key={result.label}
              className="rounded-3xl border border-slate-200 bg-white p-10 text-center transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="heading text-5xl font-bold text-blue-600">
                {result.value}
              </h3>

              <p className="mt-5 text-slate-600">
                {result.label}
              </p>
            </div>

          ))}

        </div>

      </Container>
    </Section>
  );
}