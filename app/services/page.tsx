import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Full-stack engineering, product development, technical consulting, and digital transformation services by Tayo Bolarinwa.",
};

export default function ServicesPage() {
  return (
    <main className="py-24">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-bold">Services</h1>

        <p className="mt-6 text-lg text-slate-600">
          This page is currently under development.
        </p>
      </div>
    </main>
  );
}