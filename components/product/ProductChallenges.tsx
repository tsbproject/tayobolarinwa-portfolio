import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

const challenges = [
  {
    title: "Designing a Complete Multi-Vendor Marketplace",
    description:
      "Building a marketplace capable of supporting customers, vendors and administrators within a single application required careful planning of permissions, workflows and business rules while keeping the user experience intuitive for every role.",
  },
  {
    title: "Building a Robust Vendor Ecosystem",
    description:
      "Creating an end-to-end vendor experience involved implementing onboarding, verification, storefront management, product management, order processing, wallet functionality, payouts, messaging, reviews and performance analytics as one cohesive system.",
  },
  {
    title: "Scaling a Growing Codebase",
    description:
      "As MarvelMarts expanded into hundreds of components and numerous API routes, maintaining readability, consistency and long-term maintainability became increasingly challenging.",
  },
  {
    title: "Performance and Search Engine Optimization",
    description:
      "Balancing a feature-rich marketplace with fast page loads, excellent Core Web Vitals and strong SEO required careful optimization across the frontend, backend and media delivery pipeline.",
  },
  {
    title: "Building for Long-Term Growth",
    description:
      "The platform was designed not only for its current feature set but also to accommodate future capabilities such as AI-powered recommendations, advanced analytics, marketing automation and continued marketplace expansion.",
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