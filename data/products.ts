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

    coverImage: "/images/products/marvelcmedia/cover.png",

      gallery: [
      {
        src: "/images/products/marvelcmedia/cover.png",
        alt: "Marvel Creative Media homepage",
        title: "Homepage",
        description:
      "Marvel Creative Media frontpage ",
      },
      {
        src: "/images/products/marvelcmedia/mcmedia-blogpage.png",
        alt: "Bloglist page",
        title: "Blogpage",
        description:
        "Dynamic bloglist page ",
      },
    ],

    liveUrl: "https://marvelcmedia.com",

    githubUrl: "",

    metrics: {
      performance: 100,
      seo: 100,
      accessibility: 100,
    },
    category: "Business Website",
    status: "Completed",
   
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

    coverImage: "/images/products/marvelmarts/coverx.png",

    gallery: [
    {
      src: "/images/products/marvelmarts/coverx.png",
      alt: "MarvelMarts homepage",
      title: "Homepage",
      description:
      "The customer-facing homepage designed for product discovery, promotions and category navigation.",
    },
    {
      src: "/images/products/marvelmarts/vendor-dashboard.png",
      alt: "Vendo dashboard",
      title: "Vendor Dashboard",
      description:
      "A comprehensive workspace for vendors to manage products, orders, inventory, analytics and payouts.",
    },
    {
      src: "/images/products/marvelmarts/vendor-orderpage.png",
      alt: "Vendor order page",
      title: "Vendor Orderpage",
      description:
      "Comprehensive order management page for Vendors or Marchants.",
    },
    {
      src: "/images/products/marvelmarts/admin-order-fulfilment.png",
      alt: "Admin dashboard",
      title: "Admin Dashboard",
      description:
      "Centralized administration panel for managing users, vendors, products, orders and marketplace operations.",
    },
  ],

    liveUrl: "https://marvelmarts.com",

    githubUrl: "",

    metrics: {
      performance: 99,
      seo: 100,
      accessibility: 100,
    },
    category: "Multi-vendor Marketplace",
    status: "Completed",
    
   blueprint: {
      available: true,

      coverImage: "/images/products/marvelmarts/blueprint-coverx.png",

      description:
        "Complete implementation blueprint covering platform architecture, development roadmap and vendor ecosystem.",

      pages: [
      
      ],

    },

    vendorEcosystem: {
        available: true,

        title: "Vendor Success Ecosystem",

        description:
          "A complete lifecycle designed to help vendors launch, manage and grow successful businesses on MarvelMarts.",

        image: "/images/products/marvelmarts/vendor-dashboard.png",
      },

          architecture: [
        {
          technology: "Next.js",
          description:
            "Provides the App Router architecture, server-side rendering, routing and performance optimizations for a scalable marketplace.",
        },
        {
          technology: "TypeScript",
          description:
            "Ensures end-to-end type safety, improving maintainability and reducing runtime errors across the application.",
        },
        {
          technology: "Tailwind CSS",
          description:
            "Powers a consistent design system with responsive layouts and reusable UI components.",
        },
        {
          technology: "Prisma ORM",
          description:
            "Provides a type-safe data layer for interacting with PostgreSQL while simplifying complex database operations.",
        },
        {
          technology: "PostgreSQL",
          description:
            "Stores marketplace data including users, products, orders, payments and vendor operations with high reliability.",
        },
        {
          technology: "NextAuth",
          description:
            "Handles secure authentication, session management and role-based access for customers, vendors and administrators.",
        },
        {
          technology: "Cloudinary",
          description:
            "Optimizes image uploads, storage and delivery for products, banners and media assets.",
        },
        {
          technology: "Resend",
          description:
            "Delivers transactional emails including order confirmations, account notifications and marketplace communications.",
        },
        {
          technology: "Vercel",
          description:
            "Hosts the frontend with automatic deployments, edge optimization and excellent global performance.",
        },
      ],

          engineeringDecisions: [
            {
              title: "Framework Selection",
              decision: "Next.js App Router",
              reason:
                "MarvelMarts was built with Next.js App Router to provide server-side rendering, excellent SEO, fast navigation and a scalable full-stack architecture for long-term growth.",
            },
            {
              title: "End-to-End Type Safety",
              decision: "TypeScript",
              reason:
                "TypeScript was adopted throughout the application to improve maintainability, reduce runtime errors and enable confident refactoring as the platform continues to evolve.",
            },
            {
              title: "Database Layer",
              decision: "Prisma ORM + PostgreSQL",
              reason:
                "Prisma ORM together with PostgreSQL delivers a reliable, type-safe and scalable data layer capable of handling marketplace transactions and complex relationships.",
            },
            {
              title: "Backend Architecture",
              decision: "Service Layer Pattern",
              reason:
                "Business logic was progressively extracted into dedicated services, keeping API routes clean while improving scalability, maintainability and future testing.",
            },
            {
              title: "Media Management",
              decision: "Cloudinary",
              reason:
                "Cloudinary provides optimized storage, image transformation and fast delivery for product images, vendor assets and marketplace media.",
            },
            {
              title: "Deployment Strategy",
              decision: "Vercel",
              reason:
                "The frontend is deployed on Vercel, benefiting from automatic deployments, edge optimization and seamless integration with the Next.js ecosystem.",
            },
          ],

            challenges: [
            {
              title: "Designing a Complete Multi-Vendor Marketplace",
              description:
                "Building a marketplace capable of supporting customers, vendors and administrators within a single application required careful planning of permissions, workflows and business rules while maintaining an intuitive user experience for every role.",
            },
            {
              title: "Building a Robust Vendor Ecosystem",
              description:
                "Creating an end-to-end vendor experience involved implementing onboarding, verification, storefront management, inventory, orders, wallet functionality, payouts, messaging, reviews and analytics as one cohesive platform.",
            },
            {
              title: "Scaling a Growing Codebase",
              description:
                "As MarvelMarts expanded into hundreds of components and numerous API routes, maintaining consistency, readability and long-term maintainability became increasingly important.",
            },
            {
              title: "Performance and Search Engine Optimization",
              description:
                "Balancing a feature-rich marketplace with excellent Core Web Vitals, fast page loads and strong SEO required optimization across the frontend, backend and media delivery pipeline.",
            },
            {
              title: "Building for Long-Term Growth",
              description:
                "The architecture was designed not only for today's features but also to support future capabilities including AI-powered recommendations, marketing automation, advanced analytics and continued marketplace expansion.",
            },
          ],

          solutions: [
          {
            title: "Modular Full-Stack Architecture",
            description:
              "The platform was built using a modular architecture with reusable components, shared utilities and clearly separated concerns. This improved scalability, simplified maintenance and accelerated feature development.",
          },
          {
            title: "Service-Oriented Backend",
            description:
              "Business logic was progressively extracted from API routes into dedicated service classes, reducing duplication, improving readability and making complex marketplace operations easier to maintain.",
          },
          {
            title: "Complete Vendor Ecosystem",
            description:
              "A comprehensive vendor ecosystem was implemented to support onboarding, verification, storefront management, inventory, orders, wallet, payouts, messaging, reviews and business analytics within one unified platform.",
          },
          {
            title: "Performance-Driven Development",
            description:
              "Performance optimization was considered throughout development using Next.js App Router, optimized media delivery, efficient database queries and modern rendering strategies to deliver a fast user experience.",
          },
          {
            title: "Future-Ready Foundation",
            description:
              "The architecture was intentionally designed to support future capabilities including AI-powered features, advanced reporting, marketing automation, additional payment providers and continued marketplace expansion.",
          },
        ],

        lessons: [
          {
            title: "Build for Scale from Day One",
            description:
              "Designing the architecture with future growth in mind proved invaluable. Planning for scalability early made it significantly easier to introduce new modules and expand the marketplace without major rewrites.",
          },
          {
            title: "Maintainability Is a Feature",
            description:
              "As MarvelMarts evolved into a large codebase, investing in reusable components, consistent engineering patterns and a service-oriented backend greatly improved long-term maintainability.",
          },
          {
            title: "Business Understanding Drives Better Engineering",
            description:
              "Building a successful marketplace required understanding vendor workflows, customer expectations and administrative operations. The strongest technical decisions were those aligned with real business needs.",
          },
          {
            title: "Iterative Improvement Beats Perfection",
            description:
              "MarvelMarts continuously evolved through implementation, review, refactoring and refinement. Incremental improvements consistently produced better outcomes than trying to perfect every feature in a single iteration.",
          },
          {
            title: "Engineering Is About Solving Problems",
            description:
              "Technology was never the end goal. Every architectural decision was made to solve real business challenges, improve user experience and create a platform capable of supporting future growth.",
          },
        ],

        results: [
      {
        value: "100+",
        label: "Reusable Components",
      },
      {
        value: "50+",
        label: "Marketplace Features",
      },
      {
        value: "3",
        label: "User Roles",
      },
      {
        value: "SEO",
        label: "Optimized Platform",
      },
      {
        value: "Full Stack",
        label: "Next.js Application",
      },
      {
        value: "Scalable",
        label: "Backend Architecture",
      },
      {
        value: "Production",
        label: "Ready Foundation",
      },
      {
        value: "AI Ready",
        label: "Future Expansion",
      },
    ],


  vision:
    "MarvelMarts was envisioned as a modern multi-vendor marketplace capable of empowering businesses of all sizes through scalable technology, exceptional user experience and a future-ready architecture.",

  challenge:
    "Build a complete marketplace that supports customers, vendors and administrators while maintaining high performance, security, maintainability and room for continuous expansion.",

      
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

  coverImage: "/images/products/apextraders/cover.png",

    gallery: [
      {
        src: "/images/products/marvelcmedia/homepage.webp",
        alt: "Marvel Creative Media homepage",
        title: "Homepage",
        description:
      "Apextrader comprehensive frontpage ",
        
      },
      {
        src: "/images/products/marvelcmedia/services.webp",
        alt: "Services page",
        title: "Services",
        description:
        "Crypto tuenament paage",
      },

      
    ],

  liveUrl: "https://apextraders.vercel.app",

  githubUrl: "",

  metrics: {
    performance: 98,
    seo: 95,
    accessibility: 98,
  },
  category: "FinTech",
  status: "Completed",
  blueprint: {
  available: true,

  coverImage: "/images/products/apextraders/blueprint-cover.webp",

  description:
    "Trading platform blueprint illustrating dashboard architecture, trading workflow and development roadmap.",

  pages: [
    {
      src: "/images/products/apextraders/blueprint-1.webp",
      title: "Trading Platform Blueprint",
      description:
        "Overall platform architecture and trading workflow.",
    },
  ],
},
}


];



