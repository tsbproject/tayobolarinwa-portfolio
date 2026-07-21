import Image from "next/image";

import Container from "@/components/layout/Container";
import Badge from "@/components/ui/Badge";
import InfoCard from "@/components/ui/InfoCard";


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

        <Badge>Case Study</Badge>

      <h1 className="heading mt-8 text-5xl font-bold tracking-tight text-slate-950 lg:text-7xl">
        {product.title}
      </h1>

      <h2 className="mt-6 max-w-4xl text-2xl font-semibold leading-relaxed text-blue-700 lg:text-3xl">
        {product.headline}
      </h2>

      <p className="mt-8 max-w-4xl text-xl leading-9 text-slate-600">
        {product.description}
      </p>

      <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        <InfoCard
          label="Role"
          value={product.role}
        />

        <InfoCard
          label="Industry"
          value={product.industry}
        />

        <InfoCard
          label="Duration"
          value={product.duration}
        />

        <InfoCard
          label="Status"
          value={product.status}
        />

      </div>

        <div className="mt-20">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Platform Preview
          </p>

          <h3 className="mt-2 text-2xl font-bold text-slate-900">
            Product Interface
          </h3>

        </div>

        {product.liveUrl && (
          <a
            href={product.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            Visit Live Platform →
          </a>
        )}

      </div>

     <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">

        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">


        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-5 py-4">

          <span className="h-3 w-3 rounded-full bg-red-400" />

          <span className="h-3 w-3 rounded-full bg-yellow-400" />

          <span className="h-3 w-3 rounded-full bg-green-400" />

          <div className="ml-6 flex-1 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500">
            {product.liveUrl}
          </div>

        </div>

          <Image
            src={product.coverImage}
            alt={product.title}
            fill
            priority
            className="object-center object-top transition duration-700 hover:scale-[1.02]"
          />

        </div>

      </div>

    </div>

      </Container>
    </section>
  );
}