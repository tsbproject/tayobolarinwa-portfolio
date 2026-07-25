import ServicesHero from "@/components/services/ServicesHero";
import ServicesGrid from "@/components/services/ServicesGrid";
import DevelopmentProcess from "@/components/services/DevelopmentProcess";
import TechnologyStack from "@/components/services/TechnologyStack";
import WhyWorkWithMe from "@/components/services/WhyWorkWithMe";
import ServicesFAQ from "@/components/services/ServicesFAQ";
import ServicesCTA from "@/components/services/ServicesCTA";

export default function ServicesPage() {
  return (
    <>
      <ServicesHero />
      <ServicesGrid />
      <DevelopmentProcess />
      <TechnologyStack />
      <WhyWorkWithMe />
      <ServicesFAQ />
      <ServicesCTA />

    </>
  );
}