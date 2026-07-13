"use client";

import { useState } from "react";

import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    // API integration comes later.

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  return (
    <Section>
      <Container>

        <SectionHeading
          eyebrow="Let's Discuss Your Project"
          title="Tell Me About Your Project"
          description="Complete the form below and I'll get back to you as soon as possible."
        />

        <div className="mt-12 rounded-2xl border border-blue-200 bg-blue-50 p-6">

            <h3 className="text-lg font-semibold text-blue-700">
                Before You Submit
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
                Please provide as much information as possible about your project.
                The more context you share, the better I can understand your goals,
                prepare for our discussion and recommend the most suitable technical
                solution.
            </p>

            </div>

        <form
          onSubmit={handleSubmit}
          className="mt-16 space-y-8"
        >

          <div className="grid gap-8 md:grid-cols-2">

            <div>

              <label className="mb-2 block font-medium">
                Full Name
              </label>

              <input
                type="text"
                required
                className="w-full rounded-xl border border-slate-300 px-5 py-4 outline-none transition focus:border-blue-600"
              />

            </div>

            <div>

              <label className="mb-2 block font-medium">
                Email Address
              </label>

              <input
                type="email"
                required
                className="w-full rounded-xl border border-slate-300 px-5 py-4 outline-none transition focus:border-blue-600"
              />

            </div>

          </div>

          <div className="grid gap-8 md:grid-cols-2">

            <div>

                <label className="mb-2 block font-medium">
                Project Stage
                </label>

                <select className="w-full rounded-xl border border-slate-300 px-5 py-4">

                <option>Idea / Planning</option>

                <option>Design Complete</option>

                <option>Development in Progress</option>

                <option>Existing Platform</option>

                <option>Scaling Existing Product</option>

                </select>

            </div>

            <div>

                <label className="mb-2 block font-medium">
                Estimated Start Date
                </label>

                <select className="w-full rounded-xl border border-slate-300 px-5 py-4">

                <option>Immediately</option>

                <option>Within 2 Weeks</option>

                <option>Within 1 Month</option>

                <option>Within 3 Months</option>

                <option>Flexible</option>

                </select>

            </div>

            </div>

            <div>

            <label className="mb-2 block font-medium">
                Preferred Contact Method
            </label>

            <select className="w-full rounded-xl border border-slate-300 px-5 py-4">

                <option>Email</option>

                <option>WhatsApp</option>

                <option>Phone Call</option>

                <option>Google Meet</option>

            </select>

            </div>

          <div>

            <label className="mb-2 block font-medium">
            Describe your project, the problem you&apos;re trying to solve, your goals, and any specific requirements or challenges you&apos;d like to discuss.
            </label>

            <textarea
              rows={8}
              required
              placeholder="Tell me about your project..."
              className="w-full rounded-xl border border-slate-300 px-5 py-4 outline-none transition focus:border-blue-600"
            />

          </div>

          <button
            disabled={loading}
            className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading
              ? "Sending..."
              : "Book Consultation"}
          </button>

          <p className="mt-6 text-center text-sm leading-7 text-slate-500">

                ✓ Your information will remain confidential.

                <br />

                ✓ No spam or unsolicited emails.

                <br />

                ✓ Every consultation request is personally reviewed by me.

                </p>

        </form>

      </Container>
    </Section>
  );
}