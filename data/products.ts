import { Product } from "@/types/product";

export const products: Product[] = [
  {
    slug: "marvel-creative-media",

    title: "Marvel Creative Media",

    headline:
  "Building the operating system behind a modern digital agency.",

    client: "Marvel Creative Media",

    industry: "Digital Agency",

    role: "Lead Full Stack Engineer",

    duration: "8 Months",

    year: "2026",

    featured: true,

    showEngineeringJourney: true,

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
        alt: "Marvel Creative Media Homepage",

        title: "Homepage",

        subtitle: "A high-performance digital storefront",

        description:
          "Designed to communicate the agency's services, establish trust and provide a fast, SEO-first experience for prospective clients.",

        impact:
          "Creates a strong first impression while supporting search visibility and lead generation.",
      },
      {
        src: "/images/products/marvelcmedia/mcmedia-blogpage.png",
        alt: "Blog Platform",

        title: "Engineering Journal",

        subtitle: "Content marketing powered by SEO",

        description:
          "A dynamic publishing platform built to support long-term organic growth through technical articles and educational content.",

        impact:
          "Transforms the website into a scalable content engine that continuously attracts qualified visitors.",
      },
       {
        src: "/images/products/marvelcmedia/blog-analytics.png",
        alt: "Blog Analytics Dashboard",

        title: "Content Analytics",

        subtitle: "Measuring content performance",

        description:
          "Provides detailed insights into article engagement, audience behaviour and publishing performance.",

        impact:
          "Supports data-driven content decisions and continuous SEO optimisation.",
      },
      {
        src: "/images/products/marvelcmedia/mcmedia-project-management.png",
        alt: "Project Management",

        title: "Project Management",

        subtitle: "Centralising delivery workflows",

        description:
          "Allows administrators to manage client projects, timelines and progress from a unified dashboard.",

        impact:
          "Improves collaboration and provides better visibility into project delivery.",
      },
      {
        src: "/images/products/marvelcmedia/mcmedia-role.png",
        alt: "Role Management",

        title: "Role Management",

        subtitle: "Secure access control",

        description:
          "Role-based permissions ensure that every team member has access only to the functionality required for their responsibilities.",

        impact:
          "Strengthens platform security while simplifying team administration.",
      },
       {
        src: "/images/products/marvelcmedia/mcmedia-client.png",
        alt: "Client Management",

        title: "Client Management",

        subtitle: "Building stronger client relationships",

        description:
          "Centralises client records, communication history and project information into a single management interface.",

        impact:
          "Improves operational efficiency and creates a more connected client experience.",
      },
    ],

    liveUrl: "https://marvelcmedia.com",

    githubUrl: "https://github/tsbproject/mcmedia-website",

    metrics: {
      performance: 100,
      seo: 100,
      accessibility: 100,
    },
    category: "Business Website",
    status: "Completed",

        vision:
      "Marvel Creative Media was rebuilt as a modern digital agency platform focused on performance, search engine visibility, scalability and long-term maintainability. The goal was to replace the previous architecture with a future-ready platform capable of supporting business growth, content marketing and client acquisition.",

      challenge:
        "Design and build a high-performance business website that combines exceptional user experience, enterprise-grade architecture, modern SEO practices and an intuitive content management workflow while remaining easy to scale and maintain.",

              architecture: [
          {
            technology: "Next.js",
            description:
              "Provides server-side rendering, App Router architecture, dynamic metadata and excellent SEO performance.",
          },
          {
            technology: "TypeScript",
            description:
              "Ensures type safety throughout the application, improving maintainability and reducing development errors.",
          },
          {
            technology: "Tailwind CSS",
            description:
              "Powers a modern design system with responsive layouts and reusable UI components.",
          },
          {
            technology: "Prisma ORM",
            description:
              "Provides a type-safe database layer for managing blog content, projects and application data.",
          },
          {
            technology: "PostgreSQL",
            description:
              "Stores structured application data with excellent reliability and scalability.",
          },
          {
            technology: "NextAuth",
            description:
              "Provides secure authentication and protected administration features.",
          },
          {
            technology: "Cloudinary",
            description:
              "Handles image uploads, optimization and media delivery across the platform.",
          },
          {
            technology: "Resend",
            description:
              "Powers transactional emails including consultation requests and website communications.",
          },
          {
            technology: "Vercel",
            description:
              "Provides automatic deployments, edge optimization and excellent global performance.",
          },
        ],


        evolution: {
          available: true,

          title: "Platform Evolution",

          description:
            "Marvel Creative Media evolved from a traditional PHP-powered website into a modern full-stack business platform engineered for performance, scalability, SEO and long-term growth.",

          steps: [
            {
              title: "Legacy PHP Platform",
              description:
                "The original website relied on a traditional PHP backend with limited flexibility, weaker SEO capabilities and a codebase that became increasingly difficult to maintain as the business expanded.",
            },
            {
              title: "Engineering Assessment",
              description:
                "A comprehensive review identified opportunities to improve performance, technical SEO, architecture, developer experience and long-term scalability.",
            },
            {
              title: "Architecture Redesign",
              description:
                "The platform was rebuilt using Next.js, TypeScript, Prisma and PostgreSQL with a reusable component architecture, server rendering and modern development practices.",
            },
            {
              title: "SEO Transformation",
              description:
                "Technical SEO was rebuilt from the ground up using dynamic metadata, structured data, sitemap generation, optimized routing and a scalable content publishing system.",
            },
            {
              title: "Business Operations Platform",
              description:
                "Beyond the public website, the platform now includes a custom administrative dashboard supporting CRM, client management, quotations, project management, messaging, reporting and content publishing.",
            },
            {
              title: "Business Growth",
              description:
                "Following the migration, search visibility improved significantly. Google began displaying sitelinks, the new blog became a long-term SEO asset and the platform now provides a scalable foundation for continued business growth.",
            },
          ],
        },

     featureHighlight: {
        available: true,

        title: "Business Operations Platform",

        description:
          "Beyond the public website, Marvel Creative Media includes a custom-built business operations platform that centralizes agency workflows into a single administrative experience. From managing leads and projects to publishing content and tracking performance, the platform streamlines day-to-day operations while providing a scalable foundation for future growth.",

        image: "/images/products/marvelcmedia/mcmedia-dashboard.png",

        modules: [
          {
            title: "CRM",
            description:
              "Maintain client relationships, communication history and business interactions from one place.",
          },
          {
            title: "Lead Management",
            description:
              "Capture, qualify and track new business opportunities through the sales pipeline.",
          },
          {
            title: "Client Management",
            description:
              "Organize client accounts, contacts, projects and ongoing engagements efficiently.",
          },
          {
            title: "Project Management",
            description:
              "Coordinate project delivery, milestones, assignments and progress across teams.",
          },
          {
            title: "Quotations",
            description:
              "Generate and manage professional quotations for prospective and existing clients.",
          },
          {
            title: "Messages",
            description:
              "Centralize conversations and internal communication within the platform.",
          },
          {
            title: "Reports",
            description:
              "Access operational reports to monitor business performance and decision-making.",
          },
          {
            title: "Blog CMS",
            description:
              "Create, manage and publish SEO-optimized articles without relying on third-party tools.",
          },
          {
            title: "Gallery Manager",
            description:
              "Manage portfolio images, media assets and visual content from a unified interface.",
          },
          {
            title: "Training Manager",
            description:
              "Publish and organize internal learning resources and training materials.",
          },
          {
            title: "User Management",
            description:
              "Control user roles, permissions and administrative access across the platform.",
          },
          {
            title: "Analytics",
            description:
              "Monitor business activity and key operational metrics through interactive dashboards.",
          },
          {
            title: "Blog Analytics",
            description:
              "Track article performance, audience engagement and content growth over time.",
          },
        ],
      },   


      engineeringDecisions: [
      {
        title: "Modern Framework",
        decision: "Next.js App Router",
        reason:
          "Selected to deliver excellent SEO, server-side rendering, modern routing and a scalable full-stack architecture.",
      },
      {
        title: "Type Safety",
        decision: "TypeScript",
        reason:
          "Used across the project to improve maintainability, refactoring confidence and developer productivity.",
      },
      {
        title: "Database Architecture",
        decision: "Prisma + PostgreSQL",
        reason:
          "Chosen to provide reliable relational data management with a type-safe development experience.",
      },
      {
        title: "Performance First",
        decision: "Server Components",
        reason:
          "Leveraged Server Components and optimized rendering strategies to improve performance and Core Web Vitals.",
      },
      {
        title: "Media Optimization",
        decision: "Cloudinary",
        reason:
          "Integrated for efficient image optimization, storage and fast global delivery.",
      },
    ],


      challenges: [
      {
        title: "Complete Platform Rebuild",
        description:
          "The previous website was completely redesigned and re-engineered using a modern technology stack without compromising business continuity.",
      },
      {
        title: "SEO Migration",
        description:
          "Migrating existing content while improving search visibility required careful planning of URLs, metadata and structured data.",
      },
      {
        title: "Performance Optimization",
        description:
          "Balancing modern visual design with excellent loading performance required continuous optimization.",
      },
    ],


   
    solutions: [
      {
        title: "Modern Architecture",
        description:
          "Migrated the platform to a scalable Next.js architecture using reusable components and modern development practices.",
      },
      {
        title: "Enterprise SEO",
        description:
          "Implemented structured metadata, Open Graph, dynamic sitemap generation and technical SEO best practices.",
      },
      {
        title: "Content Platform",
        description:
          "Built a flexible blog system supporting scalable content publishing and long-term SEO growth.",
      },
    ],



        lessons: [
      {
        title: "Architecture Matters",
        description:
          "Investing in a solid architecture from the beginning significantly simplifies future expansion and maintenance.",
      },
      {
        title: "SEO Begins During Development",
        description:
          "Technical SEO should be part of the architecture rather than something added after launch.",
      },
      {
        title: "Performance Is Part of User Experience",
        description:
          "Fast loading times contribute directly to better engagement, SEO and overall business outcomes.",
      },
    ],


      results: [
    {
      value: "100",
      label: "Performance Score",
    },
    {
      value: "100",
      label: "SEO Score",
    },
    {
      value: "100",
      label: "Accessibility",
    },
    {
      value: "Next.js",
      label: "Modern Platform",
    },
    {
      value: "Blog",
      label: "SEO Content Engine",
    },
    {
      value: "Enterprise",
      label: "Architecture",
    },
    {
      value: "Cloud",
      label: "Deployment Ready",
    },
    {
      value: "Scalable",
      label: "Future Growth",
    },
  ],
   
  },

  

  {
    slug: "marvelmarts",

    title: "MarvelMarts",

      headline:
    "Engineering a scalable multi-vendor commerce ecosystem.",

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
        alt: "MarvelMarts Homepage",

        title: "Marketplace Homepage",

        subtitle: "A modern multi-vendor shopping experience",

        description:
          "The customer-facing storefront was designed to make product discovery fast, intuitive and engaging. It supports featured products, promotional campaigns, category navigation and responsive browsing across devices.",

        impact:
          "Creates a seamless shopping experience while increasing product visibility and marketplace engagement.",
      },

      {
        src: "/images/products/marvelmarts/vendor-dashboard.png",
        alt: "Vendor Dashboard",

        title: "Vendor Business Dashboard",

        subtitle: "Running an entire business from one workspace",

        description:
          "A comprehensive workspace where vendors monitor sales, manage products, fulfil orders, review analytics and oversee their entire business operation.",

        impact:
          "Provides every vendor with an independent business management platform inside the marketplace.",
      },

      {
        src: "/images/products/marvelmarts/vendor-inventory-dashboard.png",
        alt: "Inventory Management",

        title: "Inventory Management",

        subtitle: "Warehouse and stock intelligence",

        description:
          "Inventory tools help vendors organise products, monitor stock availability and maintain accurate inventory records across the marketplace.",

        impact:
          "Improves stock control while reducing inventory errors and operational overhead.",
      },

      {
        src: "/images/products/marvelmarts/vendor-analytics-dashboard.png",
        alt: "Vendor Analytics",

        title: "Business Analytics",

        subtitle: "Data-driven business insights",

        description:
          "Interactive dashboards provide vendors with insights into sales, revenue, customer activity and overall marketplace performance.",

        impact:
          "Transforms operational data into actionable business intelligence for smarter decision-making.",
      },

      {
        src: "/images/products/marvelmarts/customer-payment-method.png",
        alt: "Customer Payment Methods",

        title: "Wallet & Payment Methods",

        subtitle: "Secure digital payment experience",

        description:
          "Customers can securely manage payment methods and complete transactions through an intuitive payment experience integrated into the platform.",

        impact:
          "Simplifies checkout while improving transaction reliability and customer confidence.",
      },

      {
        src: "/images/products/marvelmarts/vendor-withdrawal-dashboard.png",
        alt: "Vendor Withdrawal Dashboard",

        title: "Vendor Withdrawal Centre",

        subtitle: "Financial operations made simple",

        description:
          "Vendors can monitor earnings, request withdrawals and manage financial transactions from a centralized financial dashboard.",

        impact:
          "Provides transparent financial management and supports efficient vendor payouts.",
      },

      {
        src: "/images/products/marvelmarts/vendor-store-settings.png",
        alt: "Store Settings",

        title: "Store Configuration",

        subtitle: "Complete business customization",

        description:
          "Allows vendors to configure their storefront, business information, payment preferences and operational settings.",

        impact:
          "Empowers vendors to personalise their businesses while maintaining marketplace standards.",
      },

      {
        src: "/images/products/marvelmarts/vendor-creditboost-dashboard.png",
        alt: "Credit Boost Dashboard",

        title: "Credit Boost Engine",

        subtitle: "Marketplace growth and promotion",

        description:
          "A built-in promotional system that enables vendors to increase product visibility through paid marketplace promotion.",

        impact:
          "Creates an additional revenue model for the platform while helping vendors grow faster.",
      },

      {
        src: "/images/products/marvelmarts/vendor-support-dashboard.png",
        alt: "Vendor Support",

        title: "Support Centre",

        subtitle: "Integrated vendor assistance",

        description:
          "A centralized support system that enables vendors to raise issues, monitor requests and receive assistance without leaving the platform.",

        impact:
          "Improves operational efficiency while delivering better support experiences.",
      },

      {
        src: "/images/products/marvelmarts/vendor-livechat-interface.png",
        alt: "Live Messaging",

        title: "Live Messaging",

        subtitle: "Real-time marketplace communication",

        description:
          "Built-in messaging enables seamless communication between marketplace participants without relying on external communication tools.",

        impact:
          "Strengthens collaboration, improves response times and enhances the overall marketplace experience.",
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

    featureHighlight: {
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


          ecosystem: {
            available: true,

            title: "Enterprise Commerce Ecosystem",

            description:
              "MarvelMarts was designed as a complete commerce ecosystem where buyers, vendors and administrators operate together through a unified platform. Each role has dedicated tools while sharing a common marketplace infrastructure.",

            groups: [
              {
                title: "Buyers",

                description:
                  "Discover products, place orders and manage purchases.",

                features: [
                  "Marketplace",
                  "Product Search",
                  "Wishlist",
                  "Orders",
                  "Reviews",
                  "Secure Checkout",
                ],
              },

              {
                title: "Vendors",

                description:
                  "Operate an independent online business within the marketplace.",

                features: [
                  "Dashboard",
                  "Inventory",
                  "Orders",
                  "Analytics",
                  "Wallet",
                  "Payouts",
                  "Live Messaging",
                  "Support",
                  "Boost Center",
                ],
              },

              {
                title: "Administrators",

                description:
                  "Manage the marketplace, vendors and platform operations.",

                features: [
                  "Vendor Management",
                  "Marketplace Control",
                  "Order Fulfilment",
                  "Reports",
                  "CMS",
                  "Moderation",
                  "Configuration",
                ],
              },
            ],
          },

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


        evolution: {
          available: true,

          title: "Platform Evolution",

          description:
            "MarvelMarts evolved from an online marketplace concept into a comprehensive enterprise commerce platform. Each stage introduced new capabilities that expanded the platform beyond buying and selling into a complete business ecosystem.",

          steps: [
            {
              title: "Marketplace Vision",
              description:
                "The project began with a simple vision: create a scalable online marketplace where multiple vendors could sell products through one unified platform while customers enjoyed a seamless shopping experience.",
            },

            {
              title: "Marketplace Foundation",
              description:
                "Core marketplace functionality was established, including authentication, product management, categories, shopping cart, checkout and order processing to support day-to-day commerce operations.",
            },

            {
              title: "Vendor Business Suite",
              description:
                "The platform expanded beyond selling products by introducing dedicated vendor workspaces with inventory management, analytics, order management, messaging and operational tools.",
            },

            {
              title: "Financial Operations",
              description:
                "Advanced financial workflows such as wallets, withdrawals, payment methods, vendor settlements and promotional credit systems transformed MarvelMarts into a financially capable commerce platform.",
            },

            {
              title: "Business Intelligence",
              description:
                "Interactive analytics, reporting dashboards and operational insights enabled vendors and administrators to make data-driven business decisions while improving overall marketplace performance.",
            },

            {
              title: "Enterprise Commerce Platform",
              description:
                "Today MarvelMarts operates as a complete enterprise commerce ecosystem connecting buyers, vendors and administrators through scalable architecture, business workflows and modern engineering practices.",
            },
          ],
        },

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

 headline:
"Engineering a high-performance trading intelligence platform for digital asset traders.",

  client: "Personal Product",

  industry: "FinTech / Trading Platform",

  role: "Lead Frontend Engineer",

  duration: "In Progress",

  year: "2026",

  featured: true,

summary:
"A modern trading intelligence platform engineered to help digital asset traders execute trades, monitor portfolio performance and improve decision-making through an intuitive financial dashboard.",
description:
"ApexTraders combines a decoupled React frontend with an Express API, Prisma ORM and PostgreSQL to deliver a scalable trading platform focused on execution workflows, portfolio intelligence, analytics and competitive trading experiences.",
  
technologies: [
  "React 19",
  "TypeScript",
  "Vite",
  "Tailwind CSS 4",
  "Redux Toolkit",
  "React Router 7",
  "Express.js",
  "Prisma ORM",
  "PostgreSQL",
  "Framer Motion",
],

coverImage: "/images/products/apextraders/cover.png",

    gallery: [
  {
    src: "/images/products/apextraders/dashboard.png",

    alt: "Trading Workspace",

    title: "Trading Workspace",

    subtitle: "A professional trading environment",

    description:
      "The primary workspace where traders monitor market activity, manage positions and interact with the platform through an optimized financial interface.",

    impact:
      "Provides a focused environment that supports fast decision-making and efficient trading workflows.",
  },

  {
    src: "/images/products/apextraders/portfolio.png",

    alt: "Portfolio Intelligence",

    title: "Portfolio Intelligence",

    subtitle: "Tracking performance with clarity",

    description:
      "Portfolio analytics help traders evaluate account performance, monitor positions and understand trading outcomes over time.",

    impact:
      "Transforms raw trading data into actionable insights that support continuous improvement.",
  },

  {
    src: "/images/products/apextraders/leaderboard.png",

    alt: "Competitive Leaderboard",

    title: "Competitive Leaderboard",

    subtitle: "Performance-driven competition",

    description:
      "The leaderboard introduces a competitive dimension by highlighting top-performing traders within the platform.",

    impact:
      "Encourages engagement while rewarding consistent trading performance.",
  },

  {
    src: "/images/products/apextraders/profile.png",

    alt: "Identity & Security",

    title: "Profile & Account Management",

    subtitle: "Managing trader identity",

    description:
      "A secure account management interface designed to help traders manage their profiles and platform preferences.",

    impact:
      "Supports a professional user experience while preparing the platform for future account capabilities.",
  },
],

  liveUrl: "https://apextraders.vercel.app",

  githubUrl: "",

  metrics: {
    performance: 98,
    seo: 95,
    accessibility: 98,
  },
  category: "Trading Platform",
  status: "Active Development",
  blueprint: {
  available: true,

  coverImage: "/images/products/apextraders/apextrader-blueprint-cover.png",

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


vision:
"To build a professional trading intelligence platform that empowers digital asset traders with fast execution tools, portfolio insights and scalable financial technology.",

challenge:
"Designing a responsive financial dashboard capable of presenting complex trading information with clarity while maintaining a scalable architecture ready for future market intelligence capabilities.",


evolution: {
  available: true,

  title: "Platform Evolution",

  description:
    "ApexTraders evolved from a trading dashboard concept into a modern trading intelligence platform focused on helping traders make better decisions through intuitive financial software.",

  steps: [
    {
      title: "Trading Concept",
      description:
        "The project began with the vision of creating a professional trading experience focused on usability and performance.",
    },
    {
      title: "Execution Workspace",
      description:
        "Core trading workflows were designed to provide a focused environment for monitoring and managing trading activity.",
    },
    {
      title: "Portfolio Intelligence",
      description:
        "Performance tracking and portfolio analytics transformed raw trading activity into meaningful insights.",
    },
    {
      title: "Competitive Trading",
      description:
        "Leaderboards introduced competition and community engagement while encouraging trading excellence.",
    },
    {
      title: "Trading Intelligence Platform",
      description:
        "The platform continues evolving toward a comprehensive trading intelligence solution capable of supporting advanced market analysis and future real-time capabilities.",
    },
  ],
},
}





];



