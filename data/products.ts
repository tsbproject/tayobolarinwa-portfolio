import { Product } from "@/types/product";

export const products: Product[] = [
  {
    slug: "marvel-creative-media",

    title: "Marvel Creative Media",

    client: "Marvel Creative Media",

    industry: "Digital Agency",

    role: "Lead Full Stack Engineer",

    duration: "8 Months",

    year: "2026",

    featured: true,

    summary: "A modern digital agency platform built for performance, SEO and scalability.",

    description: "Complete redesign and redevelopment of Marvel Creative Media into a high-performance business platform powered by Next.js and TypeScript.",

    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Prisma ORM",
      "PostgreSQL",
      "NextAuth",
      "Cloudinary",
      "Resend",
      "Vercel",
    ],

    coverImage: "/images/case-studies/marvelcmedia/cover.png",

    gallery: [],

    liveUrl: "https://marvelcmedia.com",

    githubUrl: "",

    metrics: {
      performance: 100,
      seo: 100,
      accessibility: 100,
    },
    category: "",
    status: "Completed",
    blueprint: false
  },

  {
    slug: "marvelmarts",

    title: "MarvelMarts",

    client: "MarvelMarts",

    industry: "Multi-Vendor E-commerce Marketplace",

    role: "Lead Full Stack Engineer",

    duration: "Ongoing",

    year: "2026",

    featured: true,

    summary: "A modern multi-vendor marketplace engineered for scalability, security, and exceptional user experience.",

    description: "MarvelMarts is a full-featured e-commerce marketplace built to support multiple vendors, advanced product management, secure authentication, order processing, customer engagement, and a scalable administrative ecosystem. The platform focuses on performance, maintainability, and long-term business growth.",

    technologies: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Prisma ORM",
      "PostgreSQL",
      "NextAuth",
      "Cloudinary",
      "Resend",
      "Vercel",
    ],

    coverImage: "/images/case-studies/marvelmarts/cover.png",

    gallery: [],

    liveUrl: "https://marvelmarts.com",

    githubUrl: "",

    metrics: {
      performance: 99,
      seo: 100,
      accessibility: 100,
    },
    category: "",
    status: "Completed",
    blueprint: true
  },

{
  slug: "apextraders",

  title: "ApexTraders",

  client: "Personal Product",

  industry: "FinTech / Trading Platform",

  role: "Lead Frontend Engineer",

  duration: "In Progress",

  year: "2026",

  featured: true,

  summary: "A professional cryptocurrency trading platform featuring live market data, portfolio management, tournament rankings and an immersive trading experience.",

  description: "ApexTraders is a modern trading platform focused on delivering an intuitive, high-performance trading experience through real-time market updates, portfolio tracking and competitive trading features.",

  technologies: [
    "React",
    "TypeScript",
    "Vite",
    "Redux Toolkit",
    "Tailwind CSS",
    "React Router",
  ],

  coverImage: "/images/case-studies/apextraders/cover.png",

  gallery: [],

  liveUrl: "https://apextraders.vercel.app",

  githubUrl: "",

  metrics: {
    performance: 98,
    seo: 95,
    accessibility: 98,
  },
  category: "",
  status: "Completed",
  blueprint: true
}
];