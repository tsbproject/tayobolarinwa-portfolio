import Container from "@/components/layout/Container";
import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-white via-blue-50/60 to-slate-100/70 py-28 lg:flex lg:min-h-screen lg:items-center">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-32 -top-36 h-[480px] w-[480px] rounded-full bg-blue-200/55 blur-[110px]" />
        <div className="absolute -right-24 top-12 h-[520px] w-[520px] rounded-full bg-blue-300/35 blur-[125px]" />
        <div className="absolute bottom-[-200px] left-1/3 h-[440px] w-[440px] rounded-full bg-slate-300/45 blur-[120px]" />
      </div>
      <Container>
        <div className="grid items-center gap-20 lg:grid-cols-2">
          <HeroContent />
          <HeroImage />
        </div>
      </Container>
    </section>
  );
}
