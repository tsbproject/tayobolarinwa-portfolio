import { hero } from "@/data/hero";

export default function HeroStats() {
  return (
    <div className="mt-16 grid grid-cols-3 gap-8 border-t border-slate-200 pt-8">
      {hero.stats.map((stat) => (
        <div key={stat.label}>
          <h3 className="heading text-3xl font-bold">
            {stat.value}
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}