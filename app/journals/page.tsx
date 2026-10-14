import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedJournals } from "@/lib/journals";
import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Engineering Journal",
  description:
    "Engineering notes on software architecture, product development, Next.js, TypeScript, and lessons from building real digital products.",
  alternates: { canonical: "/journals" },
};

const topics = [
  { name: "Product Engineering", description: "From business requirements to maintainable product decisions." },
  { name: "Architecture & Security", description: "Practical boundaries, authentication, authorization and reliable systems." },
  { name: "Next.js & TypeScript", description: "Patterns, trade-offs and lessons from modern full-stack development." },
  { name: "Performance & SEO", description: "Making applications discoverable, responsive and dependable." },
];

export default function JournalsPage() {
  const articles = getPublishedJournals();
  return (
    <section className="relative isolate overflow-hidden py-24 md:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 -z-10 h-[480px] w-[480px] rounded-full bg-blue-100/80 blur-3xl" />
      <Container>
        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600">
          Notes from the build
        </span>
        <h1 className="heading mt-6 max-w-4xl text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
          Engineering Journal
        </h1>
        <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl md:leading-9">
          A place for technical decisions, lessons learned and the thinking behind
          building useful, secure and scalable software products.
        </p>

        <div className="mt-14 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-slate-50 p-7 md:p-10">
          <span className="inline-flex rounded-full border border-blue-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700">
            Articles in preparation
          </span>
          <h2 className="heading mt-5 text-2xl font-bold text-slate-900 md:text-3xl">
            Thoughtful engineering, documented as it happens.
          </h2>
          <p className="mt-4 max-w-2xl leading-8 text-slate-600">
            I’m preparing detailed write-ups drawn from product development and
            engineering work. Articles will appear here once they are reviewed
            and ready to publish.
          </p>
          <Link
            href="/products"
            className="mt-7 inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Explore case studies <span aria-hidden="true" className="ml-2">→</span>
          </Link>
        </div>

        {articles.length > 0 && (
          <div className="mt-20">
            <h2 className="heading text-2xl font-bold text-slate-900 md:text-3xl">Latest articles</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {articles.map((article) => (
                <Link key={article.slug} href={`/journals/${article.slug}`} className="rounded-2xl border border-slate-200 bg-white p-7 transition hover:border-blue-300 hover:shadow-md">
                  <time dateTime={article.date} className="text-sm text-slate-500">{article.date} · {article.readingTime} min read</time>
                  <h3 className="heading mt-3 text-xl font-semibold text-slate-900">{article.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{article.description}</p>
                  <span className="mt-5 inline-block text-sm font-semibold text-blue-600">Read article →</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-20">
          <h2 className="heading text-2xl font-bold text-slate-900 md:text-3xl">
            Topics I’ll be writing about
          </h2>
          <p className="mt-3 text-slate-600">
            Real-world engineering practices, not just tutorials.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {topics.map((topic) => (
              <article key={topic.name} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-blue-200 hover:shadow-md">
                <h3 className="heading text-xl font-semibold text-slate-900">{topic.name}</h3>
                <p className="mt-3 leading-7 text-slate-600">{topic.description}</p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
