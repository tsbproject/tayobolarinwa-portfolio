export interface EngineeringJourneyStep {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  technologies?: string[];
  quote?: string;
}

export interface EngineeringJourney {
  title: string;
  description: string;
  steps: EngineeringJourneyStep[];
}

export const engineeringJourney: EngineeringJourney = {
  title: "Engineering Evolution",

  description:
    "My journey from building WordPress websites to architecting scalable business platforms reflects a continuous commitment to learning, solving real business problems and engineering software for long-term growth.",

  steps: [
    {
      year: "2019",

      title: "Joined Marvel Creative Media",

      subtitle: "Beginning as a WordPress Developer",

      image: "/images/journey/wordpress.jpg",

      technologies: [
        "WordPress",
        "PHP",
        "MySQL",
        "HTML",
        "CSS",
      ],

      quote:
        "Every engineering journey begins by mastering the fundamentals.",

      description:
        "I joined Marvel Creative Media as a WordPress Developer, building and maintaining business websites while learning how real-world digital products are delivered to clients. This period laid the foundation for my understanding of web development, user experience and client collaboration.",
    },

    {
      year: "2023",

      title: "Transition into Modern Software Engineering",

      subtitle: "Learning how modern applications are engineered",

      image: "/images/journey/frontend.jpg",

      technologies: [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "TypeScript",
      ],

      quote:
        "Curiosity pushed me beyond CMS development into software engineering.",

      description:
        "Driven by a desire to understand how software works beneath the surface, I began learning modern frontend development with HTML, CSS, JavaScript, React and TypeScript. This marked a turning point from assembling websites to engineering reusable software.",
    },

    {
      year: "2025",

      title: "Engineering Scalable Platforms",

      subtitle: "Building systems instead of pages",

      image: "/images/journey/fullstack.jpg",

      technologies: [
        "Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Prisma ORM",
        "PostgreSQL",
      ],

      quote:
        "Architecture became more important than individual pages.",

      description:
        "As my experience grew, my focus shifted toward scalable architectures, reusable components, service-oriented design and full-stack engineering. Rather than thinking page by page, I began designing complete systems capable of supporting business growth.",
    },

    {
      year: "2026",

      title: "Architecting Business Platforms",

      subtitle: "Engineering software that powers businesses",

      image: "/images/journey/platform.jpg",

      technologies: [
        "Next.js",
        "Prisma",
        "PostgreSQL",
        "NextAuth",
        "Cloudinary",
        "Resend",
      ],

      quote:
        "Software should help businesses scale—not create more work.",

      description:
        "The redevelopment of Marvel Creative Media into a modern business operations platform represents the culmination of this journey so far. The platform now combines CRM, client management, project management, reporting, analytics and content management into a unified experience engineered for long-term scalability.",
    },

    {
      year: "Today",

      title: "Still Building",

      subtitle: "The journey continues",

      image: "/images/journey/future.jpg",

      technologies: [
        "AI",
        "System Design",
        "Product Engineering",
        "Developer Experience",
      ],

      quote:
        "The best engineers never stop learning.",

      description:
        "Today my focus is on building scalable products, improving software architecture and continuously expanding my knowledge. Every project is an opportunity to solve more meaningful problems and create software that delivers lasting value.",
    },
  ],
};