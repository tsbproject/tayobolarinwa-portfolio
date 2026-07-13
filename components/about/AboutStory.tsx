import Container from "@/components/layout/Container";
import Section from "@/components/ui/Section";
import SectionHeading from "@/components/ui/SectionHeading";

export default function AboutStory() {
  return (
    <Section>
      <Container>

        <SectionHeading
          eyebrow="My Story"
          title="Engineering with Purpose"
          description="My journey into software engineering."
        />

        <div className="mt-16 max-w-4xl space-y-8 text-lg leading-9 text-slate-600">

          <p>
            My journey into web development began in 2018 as a WordPress developer,
            where I built websites for businesses and individuals. While WordPress
            provided a powerful foundation, I became increasingly curious about how
            websites were built from the ground up. I wanted the freedom to design,
            customize and develop digital experiences without being limited by themes
            or plugins. That curiosity led me to begin learning programming from
            scratch 2023, marking the beginning of my transition into
            software engineering.
            </p>

            <p>
            Today, I specialize in building scalable, production-ready web
            applications using modern technologies such as Next.js, React,
            TypeScript, Prisma ORM, PostgreSQL and cloud platforms. I enjoy solving
            complex business problems by designing clean architectures, developing
            maintainable systems and delivering software that balances performance,
            user experience and long-term scalability.
            </p>

            <p>
            Beyond writing code, I enjoy architecting products, improving user
            experiences and transforming ideas into digital solutions that create
            measurable business value. Every project is an opportunity to learn,
            innovate and build software that continues to grow long after launch.
            </p>

        </div>

      </Container>
    </Section>
  );
}