import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

const decisions = [
  {
    title: "Framework Selection",
    decision: "Next.js App Router",
    reason:
      "MarvelMarts was built with Next.js App Router to deliver server-side rendering, excellent SEO, fast page loads, and a scalable full-stack architecture capable of supporting future marketplace growth.",
  },
  {
    title: "End-to-End Type Safety",
    decision: "TypeScript",
    reason:
      "TypeScript was adopted across the entire application to improve maintainability, reduce runtime errors, and provide confidence while refactoring a rapidly growing codebase.",
  },
  {
    title: "Database Layer",
    decision: "Prisma ORM + PostgreSQL",
    reason:
      "Prisma ORM combined with PostgreSQL provides type-safe database access, reliable relational data management, efficient schema migrations, and strong transactional integrity for marketplace operations.",
  },
  {
    title: "Scalable Backend Architecture",
    decision: "Service Layer Pattern",
    reason:
      "Business logic was progressively extracted into dedicated service classes, making the application easier to maintain, extend, and test while keeping API routes clean and focused.",
  },
  {
    title: "Media Management",
    decision: "Cloudinary",
    reason:
      "Cloudinary was integrated to provide optimized image storage, transformation, and delivery for products, vendor assets, and promotional content.",
  },
  {
    title: "Deployment Strategy",
    decision: "Vercel",
    reason:
      "The platform is deployed on Vercel, leveraging automatic deployments, global edge delivery, and seamless integration with the Next.js ecosystem.",
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