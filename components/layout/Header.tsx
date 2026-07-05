"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Container from "./Container";
import NavLinks from "./NavLinks";
import Button from "@/components/ui/Button";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="heading text-2xl font-bold tracking-tight"
        >
          Tayo Bolarinwa
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          <NavLinks />
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Button href="/contact">
            Book Consultation
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 transition hover:bg-slate-100 lg:hidden"
          aria-label="Toggle Menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </Container>

      {/* Mobile Navigation */}
      {open && (
        <div className="border-t border-slate-200 bg-white lg:hidden">
          <Container className="flex flex-col gap-6 py-8">
            <NavLinks />

            <Button href="/contact">
              Book Consultation
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}