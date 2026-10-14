import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Container from "@/components/layout/Container";
import { getJournalBySlug, getPublishedJournals } from "@/lib/journals";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublishedJournals().map(({ slug }) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getJournalBySlug(slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/journals/${slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      publishedTime: article.date,
      url: `https://tayobolarinwa.dev/journals/${slug}`,
    },
  };
}

export default async function JournalArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getJournalBySlug(slug);
  if (!article) notFound();

  return (
    <article className="py-20 md:py-28">
      <Container>
        <div className="mx-auto max-w-3xl">
          <Link href="/journals" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
            ← Back to journal
          </Link>
          <div className="mt-9 flex flex-wrap gap-3 text-sm text-slate-500">
            <time dateTime={article.date}>{article.date}</time>
            <span aria-hidden="true">·</span>
            <span>{article.readingTime} min read</span>
          </div>
          <h1 className="heading mt-5 text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
            {article.title}
          </h1>
          <p className="mt-6 text-xl leading-9 text-slate-600">{article.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">{tag}</span>
            ))}
          </div>
          <div className="mt-12 border-t border-slate-200 pt-10 text-slate-700 [&_a]:text-blue-600 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-blue-300 [&_blockquote]:pl-5 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:mb-2 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-6 [&_p]:leading-8 [&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-slate-100 [&_pre]:p-5 [&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6">
            <MDXRemote source={article.content} />
          </div>
        </div>
      </Container>
    </article>
  );
}
