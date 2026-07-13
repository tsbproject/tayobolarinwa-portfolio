import Container from "@/components/layout/Container";

export default function ConsultationHero() {
  return (
    <section className="border-b border-slate-200 bg-white py-28">
      <Container>

        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
          Consultation
        </span>

        <h1 className="mt-6 max-w-4xl text-5xl font-bold leading-tight lg:text-6xl">
          Let&apos;s discuss your next software project.
        </h1>

        <p className="mt-8 max-w-3xl text-xl leading-9 text-slate-600">
          Whether you&apos;re planning a new web application, modernizing an
          existing platform or solving complex technical challenges,
          I&apos;ll help you choose the right technical direction.
        </p>

      </Container>
    </section>
  );
}