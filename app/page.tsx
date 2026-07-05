import Hero from "@/components/home/Hero";
// import About from "@/components/home/About";
// import Metrics from "@/components/home/Metrics";
import FeaturedCaseStudies from "@/components/home/FeaturedProducts";
// import TechStack from "@/components/home/TechStack";
// import CTA from "@/components/home/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
     <FeaturedCaseStudies />
      {/* <About />
      <Metrics />
   
      <TechStack />
      <CTA /> */}
    </>
  );
}