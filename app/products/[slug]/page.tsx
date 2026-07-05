import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { products } from "@/data/products";
import ProductHero from "@/components/product/ProductHero";
import { generateProductMetadata } from "@/lib/metadata";
import { generateProductJsonLd } from "@/lib/structured-data";
import ProductOverview from "@/components/product/ProductOverview";
import ProductMetrics from "@/components/product/ProductMetrics";
import ProductGallery from "@/components/product/ProductGallery";



type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const product = products.find(
    (item) => item.slug === slug
  );

  if (!product) {
    return {};
  }

  return generateProductMetadata(product);
}

export default async function ProductPage({
  params,
}: Props) {
  const { slug } = await params;

  const product = products.find(
    (item) => item.slug === slug
  );

  if (!product) {
    notFound();
  }

  const jsonLd =
    generateProductJsonLd(product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

    <ProductHero product={product} />
    <ProductOverview product={product} />
     <ProductMetrics product={product} />
     <ProductGallery product={product} />
       </>
  );
}