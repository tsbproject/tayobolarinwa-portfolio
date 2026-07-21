import {
  BarChart3,
  TrendingUp,
  Wallet,
  Trophy,
  Brain,
} from "lucide-react";

import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

const pillars = [
  {
    title: "Market Analysis",
    icon: BarChart3,
    description:
      "Understand market trends and trading opportunities through an intuitive trading dashboard built for rapid decision making.",
  },
  {
    title: "Trade Execution",
    icon: TrendingUp,
    description:
      "Execute trades quickly through a streamlined interface designed to minimize friction and improve trading efficiency.",
  },
  {
    title: "Portfolio Intelligence",
    icon: Wallet,
    description:
      "Track portfolio performance, historical trades and account growth through intelligent financial insights.",
  },
  {
    title: "Performance Analytics",
    icon: Brain,
    description:
      "Analyze trading behaviour and performance metrics to continuously refine strategies and improve consistency.",
  },
  {
    title: "Competitive Trading",
    icon: Trophy,
    description:
      "Leaderboards and tournaments introduce healthy competition while rewarding consistent trading performance.",
  },
];

export default function ProductTradingFramework() {
  return (
    <Section>
      <Container>

        <SectionHeading
          eyebrow="Trading Intelligence"
          title="Trading Intelligence Framework"
          description="ApexTraders is built around five core pillars that transform market information into better trading decisions."
        />

        <div className="mt-20">

          {/* Center Platform */}

          <div className="mx-auto mb-16 max-w-4xl rounded-[2rem] bg-slate-900 px-8 py-12 text-center text-white shadow-2xl">

            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-400">
              Financial Intelligence Platform
            </p>

            <h3 className="heading mt-4 text-5xl font-bold">
              ApexTraders
            </h3>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Every feature inside ApexTraders is designed to
              help traders make faster, more informed and
              more confident trading decisions.
            </p>

          </div>

          {/* Five Pillars */}

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-5">

            {pillars.map((pillar) => {

              const Icon = pillar.icon;

              return (

                <div
                  key={pillar.title}
                  className="group rounded-3xl border border-slate-200 bg-white p-8 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-200 hover:shadow-xl"
                >

                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 transition-all duration-300 group-hover:bg-cyan-600">

                    <Icon
                      size={30}
                      className="text-cyan-600 transition-all duration-300 group-hover:text-white"
                    />

                  </div>

                  <h3 className="mt-8 text-center text-2xl font-bold text-slate-900">

                    {pillar.title}

                  </h3>

                  <p className="mt-5 text-center leading-8 text-slate-600">

                    {pillar.description}

                  </p>

                </div>

              );

            })}

          </div>

        </div>

      </Container>
    </Section>
  );
}