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
  return (
    <Section>
      <Container>

        <SectionHeading
          eyebrow="Gallery"
          title="Product Showcase"
          description={`Explore key interfaces and experiences from ${product.title}.`}
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-2">

          {product.gallery.map((image) => (

            <article
              key={image.src}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-2 hover:shadow-xl"
            >

              <div className="relative aspect-[16/10] overflow-hidden">

                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-center transition duration-700 group-hover:scale-105"
                />

              </div>

              <div className="space-y-4 p-8">

                <h3 className="text-2xl font-bold">
                  {image.title}
                </h3>

                <p className="leading-8 text-slate-600">
                  {image.description}
                </p>

              </div>

            </article>

          ))}

        </div>

      </Container>
    </Section>
  );
}