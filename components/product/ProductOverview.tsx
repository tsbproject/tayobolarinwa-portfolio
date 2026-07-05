import Link from "next/link";
import { Globe, Briefcase, Clock3, Layers, FolderGit2 } from "lucide-react";

import Container from "@/components/layout/Container";
import Tag from "@/components/ui/Tag";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductOverview({ product }: Props) {
  return (
    <section className="py-20 border-y border-slate-200 bg-slate-50">
      <Container>
        <div className="grid gap-16 lg:grid-cols-[2fr_1fr]">

          {/* Left */}

          <div>

            <h2 className="heading text-4xl font-bold">
              Project Overview
            </h2>

            <p className="mt-8 text-lg leading-8 text-slate-600">
              {product.description}
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              {product.technologies.map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>

          </div>

          {/* Right */}

          <aside className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            <h3 className="text-xl font-semibold">
              Project Details
            </h3>

            <div className="mt-8 space-y-6">

              <Info
                icon={<Briefcase size={18} />}
                label="Client"
                value={product.client}
              />

              <Info
                icon={<Layers size={18} />}
                label="Industry"
                value={product.industry}
              />

              <Info
                icon={<FolderGit2 size={18} />}
                label="Category"
                value={product.category}
              />

              <Info
                icon={<Clock3 size={18} />}
                label="Duration"
                value={product.duration}
              />

              <Info
                label="Role"
                value={product.role}
              />

              <Info
                label="Status"
                value={product.status}
              />

            </div>

            {product.liveUrl && (
              <Link
                href={product.liveUrl}
                target="_blank"
                className="mt-10 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-white transition hover:bg-blue-600"
              >
                <Globe size={18} />
                Visit Live Site
              </Link>
            )}

          </aside>

        </div>
      </Container>
    </section>
  );
}

type InfoProps = {
  icon?: React.ReactNode;
  label: string;
  value: string;
};

function Info({
  icon,
  label,
  value,
}: InfoProps) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-500">
        {icon}
        {label}
      </div>

      <p className="font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}