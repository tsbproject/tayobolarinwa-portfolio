import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

const results = [
  {
    value: "100+",
    label: "Reusable UI Components",
  },
  {
    value: "50+",
    label: "Marketplace Features",
  },
  {
    value: "3",
    label: "Integrated User Roles",
  },
  {
    value: "SEO",
    label: "Optimized Architecture",
  },
  {
    value: "Full Stack",
    label: "Next.js Platform",
  },
  {
    value: "Scalable",
    label: "Service-Oriented Backend",
  },
  {
    value: "Production",
    label: "Ready Foundation",
  },
  {
    value: "Future",
    label: "AI-Ready Architecture",
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

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">

          {results.map((result) => (

            <div
              key={result.label}
              className="rounded-3xl border border-slate-200 bg-white p-10 text-center transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="heading text-md md:text-3xl font-bold text-blue-600">
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