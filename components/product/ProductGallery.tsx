import Image from "next/image";

import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductGallery({
  product,
}: Props) {
  if (!product.gallery.length) {
    return null;
  }

  return (
    <Section>
      <Container>

        <SectionHeading
          eyebrow="Product Walkthrough"
          title="Explore the Platform"
          description={`A guided walkthrough of key interfaces, workflows and experiences built for ${product.title}.`}
        />

        <div className="mt-20 space-y-24">

          {product.gallery.map((image, index) => {

            const reverse = index % 2 !== 0;

            return (

              <article
                key={image.src}
                className={`grid items-center gap-14 lg:grid-cols-2 ${
                  reverse ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg transition duration-300 hover:shadow-2xl">

                  <div className="relative aspect-[16/10]">

                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-center transition duration-700 hover:scale-105"
                    />

                  </div>

                </div>

                <div>

                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                    Screen {index + 1}
                  </span>

                  <h3 className="heading mt-4 text-4xl font-bold">
                    {image.title}
                  </h3>

                  <p className="mt-8 text-lg leading-9 text-slate-600">
                    {image.description}
                  </p>

                </div>

              </article>

            );

          })}

        </div>

      </Container>
    </Section>
  );
}