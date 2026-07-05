import { notFound } from "next/navigation";
import { products } from "@/data/products";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="container py-20">
      <h1 className="heading text-5xl font-bold">
        {product.title}
      </h1>

      <p className="mt-6 max-w-3xl text-lg text-slate-600">
        {product.description}
      </p>
    </main>
  );
}