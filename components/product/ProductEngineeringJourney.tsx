import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

import { engineeringJourney } from "@/data/engineering-journey";



export default function ProductEngineeringJourney() {
  const journey = engineeringJourney;

//   if (!journey || !journey.available) {
//     return null;
//   }

  return (
    <Section>
      <Container>

        <SectionHeading
          eyebrow="Engineering Journey"
          title={journey.title}
          description={journey.description}
        />

        <div className="relative mt-20">

          {/* Timeline */}

          <div className="absolute left-5 top-0 hidden h-full w-px bg-slate-200 lg:block" />

          <div className="space-y-12">

            {journey.steps.map((step, index) => (

              <div
                key={`${step.year}-${step.title}`}
                className="relative flex flex-col gap-6 lg:flex-row"
              >

                {/* Timeline Dot */}

                <div className="relative z-10 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white bg-slate-900 shadow lg:flex">

                  <div className="h-2.5 w-2.5 rounded-full bg-white" />

                </div>

                {/* Card */}

                <div
                  className={`flex-1 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                    index % 2 === 0
                      ? "lg:ml-8"
                      : "lg:ml-20"
                  }`}
                >

                  <span className="inline-flex rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white">

                    {step.year}

                  </span>

                  <h3 className="heading mt-5 text-2xl font-bold text-slate-900">

                    {step.title}

                  </h3>

                  <p className="mt-4 leading-8 text-slate-600">

                    {step.description}

                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </Container>
    </Section>
  );
}