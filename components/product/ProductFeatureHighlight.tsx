import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

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

        <div className="mt-16 grid items-center gap-16 lg:grid-cols-2">

          {/* Platform Preview */}

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="relative aspect-[16/10] bg-slate-100">

              <Image
                src={feature.image}
                alt={feature.title}
                fill
                className="object-center"
                priority={false}
              />

            </div>

          </div>

          {/* Modules */}

          <div>

            <div className="max-w-xl">

              <h3 className="heading text-3xl font-bold text-slate-900">
                Everything runs from one unified platform.
              </h3>

              <p className="mt-5 leading-8 text-slate-600">
                Instead of switching between disconnected tools,
                administrators manage every aspect of the business
                through a single, scalable platform designed for
                efficiency, collaboration and future growth.
              </p>

            </div>

            {feature.modules && feature.modules.length > 0 && (

              <div className="mt-10 grid gap-5 sm:grid-cols-2">

                {feature.modules.map((module) => (

                  <div
                    key={module.title}
                    className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
                  >

                    <div className="flex items-center gap-3">

                      <CheckCircle2
                        size={20}
                        className="text-green-600"
                      />

                      <h4 className="font-semibold text-slate-900">
                        {module.title}
                      </h4>

                    </div>

                    {module.description && (

                      <p className="mt-4 text-sm leading-7 text-slate-600">
                        {module.description}
                      </p>

                    )}

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      </Container>
    </Section>
  );
}