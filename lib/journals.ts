import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const journalDirectory = path.join(process.cwd(), "content", "journals");

export type JournalArticle = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readingTime: number;
  content: string;
};

type JournalFrontmatter = {
  title?: unknown;
  description?: unknown;
  date?: unknown;
  tags?: unknown;
  published?: unknown;
};

function parseArticle(slug: string): JournalArticle | null {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const filename = path.join(journalDirectory, `${slug}.mdx`);
  if (!fs.existsSync(filename)) return null;

  const { data, content } = matter(fs.readFileSync(filename, "utf8"));
  const frontmatter = data as JournalFrontmatter;
  if (frontmatter.published !== true) return null;
  if (
    typeof frontmatter.title !== "string" ||
    typeof frontmatter.description !== "string" ||
    typeof frontmatter.date !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(frontmatter.date) ||
    Number.isNaN(Date.parse(frontmatter.date)) ||
    !Array.isArray(frontmatter.tags) ||
    !frontmatter.tags.every((tag) => typeof tag === "string")
  ) {
    throw new Error(`Invalid journal frontmatter: ${slug}`);
  }

  return {
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    date: frontmatter.date,
    tags: frontmatter.tags as string[],
    readingTime: Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 220)),
    content,
  };
}

export function getPublishedJournals(): JournalArticle[] {
  if (!fs.existsSync(journalDirectory)) return [];
  return fs.readdirSync(journalDirectory)
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => parseArticle(filename.slice(0, -4)))
    .filter((article): article is JournalArticle => article !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getJournalBySlug(slug: string): JournalArticle | null {
  return parseArticle(slug);
}
