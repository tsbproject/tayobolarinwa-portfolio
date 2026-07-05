import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about Tayo Bolarinwa, a Full Stack Engineer specializing in modern web applications and digital products.",
};

export default function Sidebar() {
  return (
    <main className="py-24">
      <div className="container">
        <h1 className="heading text-5xl font-bold">
          Sidebar
        </h1>

        <p className="mt-6 text-lg text-slate-600">
          This page is currently under development.
        </p>
      </div>
    </main>
  );
}