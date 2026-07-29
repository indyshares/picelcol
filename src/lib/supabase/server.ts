import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const COOKIE_OPTIONS: Partial<CookieOptions> = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, { ...COOKIE_OPTIONS, ...options }),
            );
          } catch {
            // Called from a Server Component — safe to ignore when
            // middleware is responsible for refreshing sessions.
          }
        },
      },
    },
  );
}
