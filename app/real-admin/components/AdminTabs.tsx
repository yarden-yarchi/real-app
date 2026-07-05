"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/real-admin/users", label: "ניהול משתמשים" },
  { href: "/real-admin/boxes", label: "קופסאות" },
  { href: "/real-admin/faqs", label: "שאלות ותשובות" },
];

export default function AdminTabs() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-[4px] px-5 py-2 font-bold transition-colors ${
              active ? "bg-purple text-white" : "bg-white text-purple hover:bg-pink-light"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
