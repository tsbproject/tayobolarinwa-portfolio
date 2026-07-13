import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";

import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tayobolarinwa.dev"),

  title: {
    default: "Tayo Samuel Bolarinwa | Full Stack Engineer",
    template: "%s | Tayo Samuel Bolarinwa",
  },

  description:
    "Portfolio of Tayo Samuel Bolarinwa, a Full Stack Engineer specializing in scalable web applications, system architecture, enterprise software and modern digital products.",

  keywords: [
    "Tayo Samuel Bolarinwa",
    "Tayo Bolarinwa",
    "Full Stack Engineer",
    "Software Engineer",
    "Next.js Developer",
    "React Developer",
    "TypeScript",
    "Prisma ORM",
    "PostgreSQL",
    "Software Architecture",
    "Web Development",
    "MarvelMarts",
    "Marvel Creative Media",
  ],

  authors: [
    {
      name: "Tayo Samuel Bolarinwa",
      url: "https://tayobolarinwa.dev",
    },
  ],

  creator: "Tayo Samuel Bolarinwa",

  publisher: "Tayo Samuel Bolarinwa",

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tayobolarinwa.dev",
    siteName: "Tayo Bolarinwa",

    title: "Tayo Samuel Bolarinwa | Full Stack Engineer",

    description:
      "Building scalable web applications, enterprise platforms and modern digital products.",

    images: [
      {
        url: "/images/og/website-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Tayo Samuel Bolarinwa",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Tayo Samuel Bolarinwa | Full Stack Engineer",

    description:
      "Building scalable web applications, enterprise platforms and modern digital products.",

    images: ["/images/og/website-cover.jpg"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico" },
      {
        url: "/favicon-32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/favicon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],

    apple: "/apple-touch-icon.png",
  },



  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${sora.variable}`}>
        <Header />

        <main className="pt-20">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}