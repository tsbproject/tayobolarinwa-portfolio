import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { hero } from "@/data/hero";
import HeroStats from "./HeroStats";

export default function HeroContent() {
  return (
    <div>
      <Badge variant="success">{hero.availability}</Badge>

      <p className="mt-8 text-lg text-slate-500">{hero.greeting}</p>

      <h1 className="heading mt-2 text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
        {hero.name}
      </h1>

      <h2 className="mt-4 text-2xl font-semibold text-blue-600">
        {hero.title}
      </h2>

      <h3 className="heading mt-8 text-4xl font-bold leading-tight text-slate-900 md:text-5xl">
        {hero.headline}
      </h3>

      <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600">
        {hero.description}
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <Button
          href={hero.primaryCTA.href}
          className="bg-blue-600 shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/25"
        >
          {hero.primaryCTA.text}
        </Button>
        <Button href={hero.secondaryCTA.href} variant="secondary">
          {hero.secondaryCTA.text}
        </Button>
      </div>
      <div className="mt-8">
        <HeroStats />
      </div>
    </div>
  );
}
