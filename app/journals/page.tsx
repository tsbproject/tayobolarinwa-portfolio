import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Engineering Journal",
  description:
    "Engineering articles, architecture decisions, development insights and product updates by Tayo Bolarinwa.",
};

export default function EngineeringJournalPage() {
  return (
    <main className="py-24">
      <div className="container">
        <h1 className="heading text-5xl font-bold">
          Engineering Journal
        </h1>

        <p className="mt-6 text-lg text-slate-600">
          Engineering articles coming soon.
        </p>
      </div>
    </main>
  );
}