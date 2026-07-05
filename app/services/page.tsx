import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Full-stack engineering, product development, technical consulting and digital transformation services.",
};

export default function ServicesPage() {
  return (
    <main className="py-24">
      <div className="container">
        <h1 className="heading text-5xl font-bold">
          Services
        </h1>

        <p className="mt-6 text-lg text-slate-600">
          Services page coming soon.
        </p>
      </div>
    </main>
  );
}