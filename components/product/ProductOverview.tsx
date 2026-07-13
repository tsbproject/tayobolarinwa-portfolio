import Link from "next/link";
import {
  ArrowUpRight,
  FolderOpen,
  Globe,
  Code2,
} from "lucide-react";

import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductOverview({
  product,
}: Props) {
  return (
    <Section>
      <Container>

        <SectionHeading
          eyebrow="Overview"
          title="Project Overview"
          description={product.summary}
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-2">

          {/* Left */}

          <div className="space-y-8">

            <div>

              <h3 className="heading text-2xl font-bold">
                The Vision
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                {product.description}
              </p>

            </div>

            <div>

              {/* <h3 className="heading text-2xl font-bold">
                The Challenge
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                Build a modern marketplace capable of supporting
                customers, vendors and administrators while
                remaining scalable, secure and easy to maintain.
              </p> */}

            </div>

          </div>

          {/* Right */}

          <div>

            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

              <h3 className="text-xl font-bold">
                Project Information
              </h3>

              <dl className="mt-8 space-y-5">

                <div className="flex justify-between">
                  <dt className="text-slate-500">
                    Client
                  </dt>
                  <dd className="font-semibold">
                    {product.client}
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-slate-500">
                    Industry
                  </dt>
                  <dd className="font-semibold">
                    {product.industry}
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-slate-500">
                    Duration
                  </dt>
                  <dd className="font-semibold">
                    {product.duration}
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-slate-500">
                    Role
                  </dt>
                  <dd className="font-semibold">
                    {product.role}
                  </dd>
                </div>

                <div className="flex justify-between">
                  <dt className="text-slate-500">
                    Status
                  </dt>
                  <dd className="font-semibold">
                    {product.status}
                  </dd>
                </div>

              </dl>

              <hr className="my-8 border-slate-200" />

              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Project Links
              </h4>

              <div className="mt-5 space-y-3">

                {product.liveUrl && (
                  <Link
                    href={product.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-slate-900 text-white justify-between rounded-xl border border-slate-200 px-4 py-3 transition hover:border-blue-900 hover:bg-blue-700"
                  >
                    <span className="flex  items-center gap-2 font-medium">
                      <Globe size={18} />
                      Visit Live Site
                    </span>

                    <ArrowUpRight size={16} />
                  </Link>
                )}

                {product.githubUrl &&
                  product.githubUrl.trim() !== "" && (
                    <Link
                      href={product.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 transition hover:border-slate-300 hover:bg-slate-900"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <Code2 size={18} />
                        Source Code
                      </span>

                      <ArrowUpRight size={16} />
                    </Link>
                  )}

                <Link
                  href="/products"
                  className="flex items-center bg-slate-900 text-white justify-between rounded-xl border border-slate-700 px-4 py-3 transition hover:border-slate-300 hover:bg-blue-700"
                >
                  <span className="flex items-center gap-2 font-medium">
                    <FolderOpen size={18} />
                    All Projects
                  </span>

                  <ArrowUpRight size={16} />
                </Link>

              </div>

            </div>

          </div>

        </div>

      </Container>
    </Section>
  );
}