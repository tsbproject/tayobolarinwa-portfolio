import Container from "@/components/layout/Container";

export default function AboutHero() {
  return (
    <section className="border-b border-slate-200 bg-white py-28">
      <Container>

        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
          About Me
        </span>

        <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-tight tracking-tight lg:text-6xl">
          Building digital products that solve real business problems.
        </h1>

        <p className="mt-8 max-w-3xl text-xl leading-9 text-slate-600">
          I&apos;m Tayo Samuel Bolarinwa, a Full Stack Engineer passionate about
          designing scalable software, building modern web applications,
          and transforming ideas into production-ready digital products.
        </p>

      </Container>
    </section>
  );
}