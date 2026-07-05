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
  title: {
    default: "Tayo Bolarinwa",
    template: "%s | Tayo Bolarinwa",
  },
  description:
    "Senior Full Stack Engineer building scalable web applications, enterprise platforms and digital products.",
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