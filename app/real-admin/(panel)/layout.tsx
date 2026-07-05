import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminUser } from "@/lib/supabase-auth";
import { signOut } from "../actions";
import AdminTabs from "../components/AdminTabs";

export const metadata: Metadata = {
  title: "ניהול — ריל",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireAdminUser();

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/real-admin" className="font-display text-4xl text-terracotta">
            ניהול האתר
          </Link>
          <p className="mt-1 text-sm text-foreground/60" dir="ltr">
            {user.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="rounded-[4px] border border-purple px-4 py-1.5 text-sm font-bold text-purple hover:bg-pink-light"
          >
            צפייה באתר
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-[4px] border border-brick px-4 py-1.5 text-sm font-bold text-brick transition-colors hover:bg-brick hover:text-white"
            >
              התנתקות
            </button>
          </form>
        </div>
      </header>

      <div className="mt-8">
        <AdminTabs />
      </div>

      <div className="mt-6">{children}</div>
    </main>
  );
}
