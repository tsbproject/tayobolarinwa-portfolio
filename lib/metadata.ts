import type { Metadata } from "next";
import { Product } from "@/types/product";

const SITE_URL = "https://tayobolarinwa.dev";

export function generateProductMetadata(
  product: Product
): Metadata {
  const title = `${product.title} | ${product.category} | Tayo Bolarinwa`;

  const description =
    product.summary || product.description;

  const url = `${SITE_URL}/products/${product.slug}`;

  return {
    title,

    description,

    keywords: [
      product.title,
      product.category,
      product.industry,
      ...product.technologies,
      "Tayo Bolarinwa",
      "Full Stack Engineer",
      "Next.js Developer",
      "Software Engineer",
    ],

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description,
      url,
      siteName: "Tayo Bolarinwa",

      images: [
        {
          url: product.coverImage,
          width: 1200,
          height: 630,
          alt: product.title,
        },
      ],

      type: "article",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.coverImage],
    },
  };
}