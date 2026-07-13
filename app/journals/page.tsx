import Container from "@/components/layout/Container";

export default function JournalsPage() {
  return (
    <section className="py-28">
      <Container>

        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
          Journal
        </span>

        <h1 className="mt-6 text-5xl font-bold">
          Engineering Journal
        </h1>

        <p className="mt-8 max-w-3xl text-xl leading-9 text-slate-600">
          I&apos;m currently preparing in-depth articles covering software
          engineering, product architecture, Next.js, TypeScript,
          scalable systems and lessons learned from building production
          applications.
        </p>

        <div className="mt-20 rounded-3xl border border-slate-200 bg-white p-12">

          <h2 className="text-3xl font-bold">
            🚧 Coming Soon
          </h2>

          <p className="mt-6 leading-8 text-slate-600">
            The journal is currently under development. I&apos;m working on
            high-quality technical articles and engineering case studies
            that I&apos;ll begin publishing here soon.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-2">

            <div>✓ Next.js</div>
            <div>✓ TypeScript</div>
            <div>✓ Prisma ORM</div>
            <div>✓ PostgreSQL</div>
            <div>✓ Software Architecture</div>
            <div>✓ Product Engineering</div>
            <div>✓ Performance Optimization</div>
            <div>✓ AI Development</div>

          </div>

        </div>

      </Container>
    </section>
  );
}