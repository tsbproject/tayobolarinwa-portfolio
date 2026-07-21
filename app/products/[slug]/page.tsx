import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {products } from "@/data/products";
import ProductHero from "@/components/product/ProductHero";
import { generateProductMetadata } from "@/lib/metadata";
import { generateProductJsonLd } from "@/lib/structured-data";
import ProductOverview from "@/components/product/ProductOverview";
import ProductMetrics from "@/components/product/ProductMetrics";
import ProductGallery from "@/components/product/ProductGallery";
import ProductRoadmap from "@/components/product/ProductRoadmap";
import Breadcrumb from "@/components/ui/BreadCrumb";
import Container from "@/components/layout/Container";
import ProductBlueprint from "@/components/product/ProductBlueprint";
import ProductArchitecture from "@/components/product/ProductAchitecture";
import ProductChallenges from "@/components/product/ProductChallenges";
import ProductSolutions from "@/components/product/ProductSolutions";
import ProductLessonsLearned from "@/components/product/ProductLessonsLearned";
import ProductResults from "@/components/product/ProductResults";
import RelatedProjects from "@/components/product/RelatedProjects";
import ProductFeatureHighlight from "@/components/product/ProductFeatureHighlight";
import ProductEngineeringDecisions from "@/components/product/ProductEngineeringDecisions";
import ProductEcosystem from "@/components/product/ProductEcosystem";
import ProductTradingFramework from "@/components/product/ProductTradingFramework";


import ProductEngineeringJourney from "@/components/product/ProductEngineeringJourney";
import ProductEvolution from "@/components/product/ProductEvolution";




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

    <Container>
    <Breadcrumb
      items={[
        {
          label: "Case Studies",
          href: "/products",
        },
        {
          label: product.title,
        },
      ]}
    />
  </Container>


       <ProductHero product={product} />

      <ProductOverview product={product} />

      {product.slug === "apextraders" && (
        <ProductTradingFramework />
      )}

      {product.showEngineeringJourney && (
        <ProductEngineeringJourney />
      )}

      {product.ecosystem ? (
        <ProductEcosystem product={product} />
      ) : (
        <ProductFeatureHighlight product={product} />
      )}

      <ProductMetrics product={product} />

      <ProductBlueprint product={product} />

      <ProductGallery product={product} />

      <ProductArchitecture product={product} />

      

      <ProductEngineeringDecisions product={product} />

      <ProductChallenges product={product} />

      <ProductSolutions product={product} />

      <ProductLessonsLearned product={product} />

      <ProductEvolution product={product} />

      <ProductResults product={product} />

      <ProductRoadmap product={product} />

      <RelatedProjects product={product} />
  </>
  );
}