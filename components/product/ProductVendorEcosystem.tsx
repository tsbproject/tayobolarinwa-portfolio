import Image from "next/image";

import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

type Props = {
  image: string;
};

export default function ProductVendorEcosystem({
  image,
}: Props) {
  return (
    <Section>
      <Container>

        <SectionHeading
          eyebrow="Vendor Ecosystem"
          title="Vendor Success Ecosystem"
          description="A complete lifecycle designed to help vendors launch, manage and grow successful businesses on MarvelMarts."
        />

        <div className="mt-16 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          <div className="relative aspect-[16/9]">

            <Image
              src={image}
              alt="MarvelMarts Vendor Ecosystem"
              fill
              className="object-center"
            />

          </div>

        </div>

      </Container>
    </Section>
  );
}