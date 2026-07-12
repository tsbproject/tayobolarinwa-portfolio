import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

const decisions = [
  {
    title: "Modern Frontend Architecture",
    decision: "Next.js App Router",
    reason:
      "Chosen for server rendering, excellent SEO, improved performance and a modern React architecture.",
  },
  {
    title: "Type Safety",
    decision: "TypeScript",
    reason:
      "Provides end-to-end type safety, improves maintainability and reduces runtime errors.",
  },
  {
    title: "Database Access",
    decision: "Prisma ORM",
    reason:
      "Selected for its developer experience, schema management and type-safe database queries.",
  },
  {
    title: "Authentication",
    decision: "NextAuth",
    reason:
      "Provides a secure, scalable authentication system with flexible provider support.",
  },
  {
    title: "Deployment",
    decision: "Vercel",
    reason:
      "Optimized for Next.js with automatic deployments, edge delivery and excellent performance.",
  },
  {
    title: "Media Management",
    decision: "Cloudinary",
    reason:
      "Handles image optimization, transformation and scalable cloud-based media delivery.",
  },
];

export default function ProductEngineeringDecisions({
  product,
}: Props) {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Engineering"
          title="Engineering Decisions"
          description={`Key technical decisions that shaped the architecture of ${product.title}.`}
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {decisions.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                {item.title}
              </p>

              <h3 className="mt-3 text-2xl font-bold">
                {item.decision}
              </h3>

              <p className="mt-5 leading-8 text-slate-600">
                {item.reason}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}