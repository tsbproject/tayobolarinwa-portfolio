import {
  Blocks,
  Building2,
  Globe,
  Server,
  ShoppingCart,
  Lightbulb,
} from "lucide-react";

import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

const services = [
  {
    icon: Blocks,
    title: "Product Engineering",
    description:
      "Designing and building scalable digital products with a focus on performance, maintainability, and long-term growth.",
  },
  {
    icon: Building2,
    title: "Business Platforms",
    description:
      "Custom internal systems, operational software, CRMs and business platforms tailored to your workflow.",
  },
  {
    icon: ShoppingCart,
    title: "Enterprise Commerce",
    description:
      "Modern commerce platforms with secure payments, vendor management, and scalable architecture.",
  },
  {
    icon: Globe,
    title: "Modern Web Applications",
    description:
      "Fast, responsive web applications built with modern technologies and excellent user experience.",
  },
  {
    icon: Server,
    title: "API & Backend Development",
    description:
      "Secure APIs, authentication systems, database design and third-party integrations.",
  },
  {
    icon: Lightbulb,
    title: "Technical Consulting",
    description:
      "Architecture reviews, modernization strategies, performance optimization and engineering guidance.",
  },
];

export default function ServicesGrid() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Core Services"
          title="Helping Businesses Build Better Digital Products"
          description="From architecture to deployment, I provide engineering services focused on building reliable, scalable, and maintainable software."
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {services.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="group rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              <div className="inline-flex rounded-2xl bg-blue-50 p-3 text-blue-600">
                <Icon size={28} />
              </div>

              <h3 className="mt-6 text-xl font-bold text-slate-900">
                {title}
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                {description}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}