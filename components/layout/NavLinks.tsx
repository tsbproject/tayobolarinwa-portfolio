"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Journal", href: "/journals" },
  { label: "Services", href: "/services" },

];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={clsx(
            "text-sm font-medium transition-colors",
            pathname === link.href
              ? "text-slate-950"
              : "text-slate-500 hover:text-slate-950"
          )}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}