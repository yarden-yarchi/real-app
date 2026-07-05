import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";

export async function supabaseAuth() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — cookies are refreshed by the proxy instead.
          }
        },
      },
    }
  );
}

export async function getAdminUser() {
  const supabase = await supabaseAuth();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireAdminUser() {
  const user = await getAdminUser();
  if (!user) redirect("/real-admin/login");
  return user;
}
