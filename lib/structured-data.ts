import { Product } from "@/types/product";

export function generateProductJsonLd(
  product: Product
) {
  return {
    "@context": "https://schema.org",

    "@type": "SoftwareApplication",

    name: product.title,

    applicationCategory: product.category,

    description: product.description,

    operatingSystem: "Web",

    author: {
      "@type": "Person",

      name: "Tayo Bolarinwa",

      url: "https://tayobolarinwa.dev",
    },

    image: product.coverImage,

    url: product.liveUrl,
  };
}