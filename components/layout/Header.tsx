"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
} from "react";

import { Menu, X, Download } from "lucide-react";

import Container from "./Container";
import NavLinks from "./NavLinks";

import Button from "@/components/ui/Button";
import Logo from "@/components/ui/logo";

export default function Header() {
  const [open, setOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = open
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function handleEscape(
      e: KeyboardEvent
    ) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener(
      "keydown",
      handleEscape
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleEscape
      );
  }, []);

  useEffect(() => {
    function handleClick(
      e: MouseEvent
    ) {
      if (
        open &&
        menuRef.current &&
        !menuRef.current.contains(
          e.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClick
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">

        <Container className="flex h-20 items-center justify-between">

          <Link
            href="/"
            className="heading text-2xl font-bold tracking-tight"
          >
            <Logo priority />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            <NavLinks />
          </nav>

          <div className="hidden items-center gap-4 lg:flex">

              <Button
                href="/resume/Tayo-Bolarinwa-Resume.pdf"
                target="_blank"
                variant="secondary"
              >

                <Download size={18} />

                <span>Download Résumé</span>

              </Button>

              <Button href="/consultation">
                Book Consultation
              </Button>

            </div>

          <button
            onClick={() =>
              setOpen(!open)
            }
            className="rounded-lg p-2 transition hover:bg-slate-100 lg:hidden"
          >
            <div className="transition-transform duration-300">
              {open ? (
                <X size={26} />
              ) : (
                <Menu size={26} />
              )}
            </div>
          </button>

        </Container>
      </header>

      {/* Backdrop */}

      <div
        onClick={() =>
          setOpen(false)
        }
        className={`fixed left-0 right-0 top-20 z-50 origin-top border-b border-slate-200 bg-white shadow-xl transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden ${
          open
            ? "translate-y-0 scale-y-100 opacity-100"
            : "-translate-y-6 scale-y-95 pointer-events-none opacity-0"
        }`}
      />

      {/* Mobile Menu */}

      <div
        ref={menuRef}
        className={`fixed left-0 right-0 top-20 z-50 border-b border-slate-200 bg-white shadow-xl transition-all duration-300 ease-out lg:hidden ${
          open
            ? "translate-y-0 opacity-100"
            : "-translate-y-8 pointer-events-none opacity-0"
        }`}
      >

        <Container className="flex flex-col gap-6 py-8">

          <NavLinks
            onNavigate={() =>
              setOpen(false)
            }
          />

          <div className="space-y-4">

           <Button
              href="/resume/Tayo-Bolarinwa-Resume.pdf"
              target="_blank"
              variant="secondary"
            >

              <Download size={18} />

              <span>Download Résumé</span>

            </Button>

            <Button href="/consultation">
              Book Consultation
            </Button>

          </div>

        </Container>

      </div>
    </>
  );
}




