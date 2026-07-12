import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

const solutions = [
  {
    title: "Modular Full-Stack Architecture",
    description:
      "The platform was built using a modular architecture with reusable components, shared utilities and clearly separated concerns. This approach improved scalability, simplified maintenance and accelerated feature development.",
  },
  {
    title: "Service-Oriented Backend",
    description:
      "As the application grew, business logic was progressively extracted from API routes into dedicated service classes. This reduced code duplication, improved readability and made complex marketplace operations easier to maintain.",
  },
  {
    title: "Complete Vendor Ecosystem",
    description:
      "A comprehensive vendor ecosystem was implemented to support the entire business lifecycle, including onboarding, verification, store management, inventory, orders, wallet, payouts, messaging, reviews and business analytics.",
  },
  {
    title: "Performance-Driven Development",
    description:
      "Performance optimization was considered throughout development by leveraging Next.js App Router, optimized image delivery, efficient database queries and modern rendering strategies to deliver a fast and responsive user experience.",
  },
  {
    title: "Future-Ready Foundation",
    description:
      "The architecture was intentionally designed to accommodate future capabilities such as AI-powered features, advanced reporting, marketing tools, additional payment providers and continued marketplace growth without requiring major structural changes.",
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