"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const navLinks = [
  { href: "/#boxes", label: "הקופסאות" },
  { href: "/#faq", label: "שאלות ותשובות" },
  { href: "/#about", label: "מי אנחנו" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-4">
      <div className="mx-[10px] md:mx-5 flex h-[62px] items-center justify-between gap-4 rounded-lg bg-white px-5 sm:px-8 md:h-[70px]">
        <Link href="/" className="shrink-0">
          <Image
            src="/navmenu-logo.svg"
            alt="ריל"
            width={112}
            height={103}
            priority
            className="h-[80px] w-auto md:h-[103px] md:w-[112px]"
          />
        </Link>

        <nav className="hidden items-center gap-6 text-lg text-purple md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:opacity-70">
              {link.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="flex h-10 items-center rounded-[4px] border-2 border-purple bg-purple px-6 text-white transition-transform duration-150 hover:scale-95 hover:opacity-90"
          >
            יצירת קשר
          </Link>
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/#contact"
            className="flex h-10 items-center rounded-[4px] border-2 border-purple bg-purple px-6 text-white transition-transform duration-150 hover:scale-95 hover:opacity-90"
          >
            יצירת קשר
          </Link>
          <button
            type="button"
            aria-label={open ? "סגור תפריט" : "פתח תפריט"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] bg-pink-light text-purple transition-transform duration-150 hover:scale-95"
          >
            <span className="relative block h-[14px] w-5" aria-hidden="true">
              <span
                className={`absolute right-0 top-0 h-0.5 w-full bg-current transition-transform duration-300 ${
                  open ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute right-0 top-[6px] h-0.5 w-full bg-current transition-opacity duration-300 ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`absolute bottom-0 right-0 h-0.5 w-full bg-current transition-transform duration-300 ${
                  open ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav className="mx-[10px] mt-2 flex flex-col gap-1 rounded-lg bg-pink-light p-4 text-lg text-purple shadow-lg md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-[4px] px-3 py-2 hover:bg-pink-lighter"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
