import Image from "next/image";

import Container from "@/components/layout/Container";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductGallery({
  product,
}: Props) {
  if (product.gallery.length === 0) {
    return null;
  }

  return (
    <section className="py-20">
      <Container>

        <h2 className="heading text-4xl font-bold">
          Project Gallery
        </h2>

        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          A visual walkthrough of the product and some of its key
          interfaces.
        </p>

        <div className="mt-14 grid gap-8 md:grid-cols-2">

          {product.gallery.map((image) => (

            <figure
              key={image.src}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[16/10]">

                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                />

              </div>

              {image.title && (
                <figcaption className="p-5 font-medium">
                  {image.title}
                </figcaption>
              )}

            </figure>

          ))}

        </div>

      </Container>
    </section>
  );
}