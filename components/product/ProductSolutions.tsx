import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

const solutions = [
  {
    title: "Modular System Architecture",
    description:
      "The platform was structured into reusable components and clearly separated modules to improve scalability and simplify long-term maintenance.",
  },
  {
    title: "Robust Vendor Ecosystem",
    description:
      "A complete vendor lifecycle was implemented, including onboarding, verification, store management, inventory, orders, payouts, messaging and analytics.",
  },
  {
    title: "Performance-First Development",
    description:
      "Modern Next.js capabilities, optimized assets and efficient rendering strategies were used to deliver fast loading times and excellent SEO.",
  },
  {
    title: "Maintainable Engineering Practices",
    description:
      "TypeScript, Prisma ORM and reusable service patterns were adopted to reduce technical debt and support future feature expansion.",
  },
];

export default function ProductSolutions({
  product,
}: Props) {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Solutions"
          title="Engineering Solutions"
          description={`How the identified challenges were addressed while building ${product.title}.`}
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {solutions.map((solution) => (
            <div
              key={solution.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="text-2xl font-bold">
                {solution.title}
              </h3>

              <p className="mt-5 leading-8 text-slate-600">
                {solution.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}