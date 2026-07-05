"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function StickyLogout() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const supabase = supabaseBrowser();
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) =>
      setLoggedIn(!!session)
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  // The admin panel has its own logout button in the header.
  if (pathname.startsWith("/real-admin") || !loggedIn) return null;

  const handleLogout = async () => {
    setPending(true);
    await supabaseBrowser().auth.signOut();
    setPending(false);
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={pending}
      aria-label="התנתקות"
      title="התנתקות"
      className="fixed bottom-5 left-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border-2 border-brick bg-white text-brick shadow-lg transition-colors hover:bg-brick hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    </button>
  );
}
