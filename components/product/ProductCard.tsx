import Image from "next/image";
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
        <Image
          src={product.coverImage}
          alt={product.title}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
        />
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