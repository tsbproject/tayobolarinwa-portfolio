import Image from "next/image";

import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductFeatureHighlight({
  product,
}: Props) {
  if (
    !product.featureHighlight ||
    !product.featureHighlight.available
  ) {
    return null;
  }

  const feature = product.featureHighlight;

  return (
    <Section>
      <Container>

        <SectionHeading
          eyebrow="Platform Highlight"
          title={feature.title}
          description={feature.description}
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-2">

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="relative aspect-[16/10]">

              <Image
                src={feature.image}
                alt={feature.title}
                fill
                className="object-center"
              />

            </div>

          </div>

          {feature.modules && feature.modules.length > 0 && (

            <div>

              <h3 className="heading text-2xl font-bold">
                Core Platform Modules
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                The platform integrates multiple business modules
                into a unified administrative experience,
                streamlining daily operations while supporting
                future scalability.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">

                {feature.modules.map((module) => (

                  <div
                    key={module.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <h4 className="font-semibold">
                      {module.title}
                    </h4>
                  </div>

                ))}

              </div>

            </div>

          )}

        </div>

      </Container>
    </Section>
  );
}