import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

const challenges = [
  {
    title: "Scalable Marketplace Architecture",
    description:
      "Designing a platform capable of supporting customers, vendors and administrators while maintaining a clean and maintainable codebase.",
  },
  {
    title: "Complex Vendor Ecosystem",
    description:
      "Building a complete vendor experience covering onboarding, verification, store management, products, orders, payouts and analytics.",
  },
  {
    title: "Performance & SEO",
    description:
      "Maintaining excellent performance and search engine visibility while delivering a feature-rich user experience.",
  },
  {
    title: "Long-Term Maintainability",
    description:
      "Structuring the project with reusable components, modular services and a scalable architecture to support future growth.",
  },
];

export default function ProductChallenges({
  product,
}: Props) {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Challenges"
          title="Engineering Challenges"
          description={`Key technical and product challenges encountered while building ${product.title}.`}
        />

        <div className="mt-16 space-y-6">
          {challenges.map((challenge, index) => (
            <div
              key={challenge.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 transition hover:shadow-lg"
            >
              <div className="flex items-start gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">
                  {index + 1}
                </div>

                <div>
                  <h3 className="text-2xl font-bold">
                    {challenge.title}
                  </h3>

                  <p className="mt-4 leading-8 text-slate-600">
                    {challenge.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}