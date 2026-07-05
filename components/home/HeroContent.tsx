import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { hero } from "@/data/hero";
import HeroStats from "./HeroStats";

export default function HeroContent() {
  return (
    <div>
      <Badge variant="success">
        {hero.availability}
      </Badge>

      <p className="mt-8 text-lg text-slate-500">
        {hero.greeting}
        </p>

        <h1 className="heading mt-2 text-6xl font-bold tracking-tight md:text-7xl">
        {hero.name}
        </h1>

        <h2 className="mt-4 text-2xl font-medium text-blue-600">
        {hero.title}
        </h2>

        <h3 className="heading mt-8 text-4xl font-bold leading-tight md:text-5xl">
        {hero.headline}
        </h3>



      <p className="mt-8 max-w-xl text-lg leading-8 text-slate-600">
        {hero.description}
      </p>

      <div className="mt-10 flex flex-wrap gap-4">
        <Button href={hero.primaryCTA.href}>
            {hero.primaryCTA.text}
            </Button>

            <Button
            href={hero.secondaryCTA.href}
            variant="secondary"
            >
            {hero.secondaryCTA.text}
            </Button>
        <HeroStats />
      </div>
    </div>
  );
}