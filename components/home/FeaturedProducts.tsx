import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/product/ProductCard";

import { products } from "@/data/products";

export default function FeaturedProducts() {
  const featured = products.filter((product) => product.featured);

  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Featured Products"
          title="Products I've Built"
          description="A collection of products I've designed, engineered and continue to improve."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {featured.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}