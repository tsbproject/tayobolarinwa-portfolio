import Image from "next/image";

import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

import { Product } from "@/types/product";

type Props = {
  product: Product;
};

export default function ProductVendorEcosystem({
  product,
}: Props) {
  if (
    !product.vendorEcosystem ||
    !product.vendorEcosystem.available
  ) {
    return null;
  }

  const ecosystem = product.vendorEcosystem;

  return (
    <Section>
      <Container>

        <SectionHeading
          eyebrow="Vendor Ecosystem"
          title={ecosystem.title}
          description={ecosystem.description}
        />

        <div className="mt-16 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="relative aspect-[16/9]">

            <Image
              src={ecosystem.image}
              alt={ecosystem.title}
              fill
              className="object-center"
            />

          </div>

        </div>

      </Container>
    </Section>
  );
}