"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

const faqs = [
  {
    question: "What types of projects do you work on?",
    answer:
      "I specialize in building scalable web applications, business platforms, enterprise commerce solutions, internal systems, APIs, and modern digital products.",
  },
  {
    question: "Do you work with startups and established businesses?",
    answer:
      "Yes. Whether you're validating a new product idea, modernizing an existing platform, or scaling an established business, I tailor solutions to your goals.",
  },
  {
    question: "Can you work with an existing development team?",
    answer:
      "Absolutely. I can collaborate with your internal team, contribute to existing codebases, or lead the engineering effort where needed.",
  },
  {
    question: "What technologies do you use?",
    answer:
      "I primarily work with Next.js, React, TypeScript, Node.js, Prisma, PostgreSQL, Tailwind CSS, and modern cloud services such as Vercel and Neon.",
  },
  {
    question: "How do we get started?",
    answer:
      "Book a consultation to discuss your project, business goals, timeline, and technical requirements. From there, I'll recommend the best approach for moving forward.",
  },
];

export default function ServicesFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Frequently Asked Questions"
          title="Answers to Common Questions"
          description="Here are some of the questions clients frequently ask before starting a project."
        />

        <div className="mt-16 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <span className="text-lg font-semibold text-slate-900">
                    {faq.question}
                  </span>

                  <ChevronDown
                    size={20}
                    className={`transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-slate-200 px-6 py-5">
                    <p className="leading-8 text-slate-600">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}