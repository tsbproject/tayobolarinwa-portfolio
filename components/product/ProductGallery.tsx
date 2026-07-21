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
          eyebrow="Product Walkthrough"
          title="Inside the Platform"
          description="A guided walkthrough of the key experiences that define the product, highlighting both the user interface and the engineering decisions behind each major feature."
        />

        <div className="mt-20 space-y-32">

          {product.gallery.map((image, index) => {

            const reverse = index % 2 !== 0;

            return (

              <div
                key={image.src}
                className={`grid items-center gap-16 lg:grid-cols-2 ${
                  reverse ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >

                {/* Screenshot */}

                <div>

                  <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl">

                    {/* Browser Chrome */}

                    <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-5 py-4">

                      <span className="h-3 w-3 rounded-full bg-red-400" />

                      <span className="h-3 w-3 rounded-full bg-yellow-400" />

                      <span className="h-3 w-3 rounded-full bg-green-400" />

                      <div className="ml-6 h-8 flex-1 rounded-lg border border-slate-200 bg-white" />

                    </div>

                    <div className="relative aspect-[16/10]">

                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className=" object-top transition duration-700 hover:scale-[1.02]"
                      />

                    </div>

                  </div>

                </div>

                {/* Story */}

                <div>

                  <span className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">

                    {String(index + 1).padStart(2, "0")}

                  </span>

                  <h3 className="heading mt-4 text-4xl font-bold">

                    {image.title}

                  </h3>

                  {image.subtitle && (

                    <p className="mt-3 text-xl font-medium text-blue-700">

                      {image.subtitle}

                    </p>

                  )}

                  <p className="mt-8 leading-8 text-slate-600">

                    {image.description}

                  </p>

                  {image.impact && (

                    <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-6">

                      <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">

                        Business Impact

                      </p>

                      <p className="mt-3 leading-8 text-slate-700">

                        {image.impact}

                      </p>

                    </div>

                  )}

                </div>

              </div>

            );

          })}

        </div>

      </Container>
    </Section>
  );
}