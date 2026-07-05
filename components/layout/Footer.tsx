import Link from "next/link";

import Container from "@/components/layout/Container";

const navigation = [
  {
    title: "Navigation",
    links: [
      { name: "About", href: "/about" },
      { name: "Case Studies", href: "/products" },
      { name: "Engineering", href: "/journals" },
      { name: "Services", href: "/services" },
      { name: "Contact", href: "/contact" },
    ],
  },
];

const socialLinks = [
  {
    name: "GitHub",
    href: "https://github.com/tsbproject",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
  },
];

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-slate-200 bg-slate-50">
      <Container className="py-20">

        <div className="grid gap-16 lg:grid-cols-[2fr_1fr_1fr]">

          {/* Brand */}

          <div>

            <Link
              href="/"
              className="heading text-3xl font-bold"
            >
              Tayo Bolarinwa
            </Link>

            <p className="mt-6 max-w-md leading-8 text-slate-600">
              Full Stack Engineer building scalable products,
              enterprise software and high-performance digital
              experiences.
            </p>

          </div>

          {/* Navigation */}

          {navigation.map((group) => (

            <div key={group.title}>

              <h3 className="font-semibold">
                {group.title}
              </h3>

              <ul className="mt-6 space-y-4">

                {group.links.map((link) => (

                  <li key={link.href}>

                    <Link
                      href={link.href}
                      className="text-slate-600 transition hover:text-blue-600"
                    >
                      {link.name}
                    </Link>

                  </li>

                ))}

              </ul>

            </div>

          ))}

          {/* Social */}

          <div>

            <h3 className="font-semibold">
              Connect
            </h3>

            <ul className="mt-6 space-y-4">

              {socialLinks.map((social) => (

                <li key={social.name}>

                  <Link
                    href={social.href}
                    target="_blank"
                    className="text-slate-600 transition hover:text-blue-600"
                  >
                    {social.name}
                  </Link>

                </li>

              ))}

            </ul>

          </div>

        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-slate-200 pt-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">

          <p>
            © {new Date().getFullYear()} Tayo Bolarinwa.
            All rights reserved.
          </p>

          <p>
            Designed & Engineered with Next.js + TypeScript.
          </p>

        </div>

      </Container>
    </footer>
  );
}