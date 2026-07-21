import {
  ShoppingCart,
  Store,
  ShieldCheck,
  ArrowRightLeft,
} from "lucide-react";

import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

const icons = {
  Buyers: ShoppingCart,
  Vendors: Store,
  Administrators: ShieldCheck,
};

export default function ProductEcosystem({
  product,
}: Props) {
  if (
    !product.ecosystem ||
    !product.ecosystem.available
  ) {
    return null;
  }

  return (
    <Section>
      <Container>

        <SectionHeading
          eyebrow="Platform Ecosystem"
          title={product.ecosystem.title}
          description={product.ecosystem.description}
        />

        {/* Platform */}

        <div className="mt-16 rounded-[2rem] bg-slate-900 px-8 py-14 text-center text-white shadow-2xl">

          <p className="text-sm uppercase tracking-[0.25em] text-orange-400">
            Unified Platform
          </p>

          <h3 className="heading mt-4 text-5xl font-bold">
            MarvelMarts
          </h3>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
            A single enterprise commerce platform connecting
            buyers, vendors and administrators through one
            scalable marketplace ecosystem.
          </p>

        </div>

        {/* Connections */}

        <div className="my-10 hidden items-center justify-center lg:flex">

          <ArrowRightLeft
            size={28}
            className="text-blue-600"
          />

        </div>

        {/* Ecosystem */}

        <div className="grid gap-8 lg:grid-cols-3">

          {product.ecosystem.groups.map((group) => {

            const Icon =
              icons[
                group.title as keyof typeof icons
              ];

            return (

              <div
                key={group.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
              >

                <div className="flex items-center gap-4">

                  <div className="rounded-2xl bg-blue-50 p-4">

                    <Icon
                      size={26}
                      className="text-blue-600"
                    />

                  </div>

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                      Role
                    </p>

                    <h3 className="mt-1 text-3xl font-bold">
                      {group.title}
                    </h3>

                  </div>

                </div>

                <p className="mt-8 leading-8 text-slate-600">
                  {group.description}
                </p>

                <div className="mt-8 space-y-3">

                  {group.features.map((feature) => (

                    <div
                      key={feature}
                      className="flex items-center gap-3"
                    >

                      <div className="h-2 w-2 rounded-full bg-blue-600" />

                      <span className="font-medium text-slate-700">
                        {feature}
                      </span>

                    </div>

                  ))}

                </div>

              </div>

            );

          })}

        </div>

      </Container>
    </Section>
  );
}