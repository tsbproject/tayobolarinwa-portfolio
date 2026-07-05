import Image from "next/image";

import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductBlueprint({
  product,
}: Props) {
  if (!product.blueprint?.available) {
    return null;
  }

  return (
    <Section>

      <Container>

        <SectionHeading
          eyebrow="Blueprint"
          title="Product Blueprint"
          description={product.blueprint.description}
        />

        <div className="mt-16 grid gap-10">

          {product.blueprint.pages.map((page) => (

            <div
              key={page.title}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >

              <div className="relative aspect-[16/10]">

                <Image
                  src={page.src}
                  alt={page.title}
                  fill
                  className="object-cover"
                />

              </div>

              <div className="space-y-3 p-8">

                <h3 className="text-2xl font-bold">
                  {page.title}
                </h3>

                {page.description && (
                  <p className="leading-8 text-slate-600">
                    {page.description}
                  </p>
                )}

              </div>

            </div>

          ))}

        </div>

      </Container>

    </Section>
  );
}