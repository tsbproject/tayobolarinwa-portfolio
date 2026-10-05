import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

import Tag from "@/components/ui/Tag";
import { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function CaseStudyCard({
  product,
}: Props) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {product.coverImage ? (
          <Image
            src={product.coverImage}
            alt={product.title}
            fill
            className="object-center transition duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 px-8 text-center text-white">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-300/10">
              <ShieldCheck className="h-8 w-8 text-amber-300" />
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">Verified Housing Infrastructure</p>
            <p className="mt-3 text-3xl font-bold">Rilaebu</p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-300">Housing you can trust.</p>
          </div>
        )}
      </div>

      <div className="space-y-5 p-8">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-blue-600">
            {product.year}
          </span>

          <span className="text-sm text-slate-500">
            {product.client}
          </span>
        </div>

        <h3 className="heading text-2xl font-bold">
          {product.title}
        </h3>

        <p className="leading-7 text-slate-600">
          {product.summary}
        </p>

        <div className="flex flex-wrap gap-2">
          {product.technologies.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>
      </div>
    </Link>
  );
}