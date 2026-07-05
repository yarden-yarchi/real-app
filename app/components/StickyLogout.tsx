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
      className="fixed bottom-5 left-5 z-50 rounded-[4px] border-2 border-brick bg-white px-5 py-2 font-bold text-brick shadow-lg transition-colors hover:bg-brick hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "מתנתק..." : "התנתקות"}
    </button>
  );
}
