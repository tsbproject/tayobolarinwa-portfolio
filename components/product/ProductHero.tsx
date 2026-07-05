import Image from "next/image";

import Container from "@/components/layout/Container";

import Badge from "@/components/ui/Badge";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductHero({
  product,
}: Props) {
  return (
    <section className="py-24">
      <Container>
        <Badge>{product.category}</Badge>

        <h1 className="heading mt-8 text-6xl font-bold">
          {product.title}
        </h1>

        <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-600">
          {product.description}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            {product.status}
        </span>

        <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
            {product.category}
        </span>

        {product.blueprint && (
            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
            Blueprint Available
            </span>
        )}
        </div>

        <div className="relative mt-16 aspect-[16/9] overflow-hidden rounded-3xl">
          <Image
            src={product.coverImage}
            alt={product.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  );
}