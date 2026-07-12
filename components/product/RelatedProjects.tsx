import Link from "next/link";

import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/product/ProductCard";

import { Product } from "@/types/product";
import { products } from "@/data/products";

type Props = {
  product: Product;
};

export default function RelatedProjects({
  product,
}: Props) {
  const related = products
    .filter((item) => item.slug !== product.slug)
    .slice(0, 2);

  if (!related.length) {
    return null;
  }

  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Explore More"
          title="Related Projects"
          description="Discover more products and engineering case studies."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {related.map((item) => (
            <ProductCard
              key={item.slug}
              product={item}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex rounded-xl bg-slate-950 px-6 py-3 text-white transition hover:bg-blue-600"
          >
            View All Projects
          </Link>
        </div>
      </Container>
    </Section>
  );
}