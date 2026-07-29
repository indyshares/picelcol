import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const COOKIE_OPTIONS: Partial<CookieOptions> = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getRateLimiter(limit: number, windowMs: number) {
  return (key: string): { allowed: boolean } => {
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetAt) {
      rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true };
    }

    if (entry.count >= limit) {
      return { allowed: false };
    }

    entry.count++;
    return { allowed: true };
  };
}

const authLimiter = getRateLimiter(10, 60 * 1000);
const searchLimiter = getRateLimiter(30, 60 * 1000);

function addCorsHeaders(response: NextResponse, origin: string) {
  response.headers.set("Access-Control-Allow-Origin", origin);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? request.headers.get("x-real-ip")
    ?? "unknown";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  // --- CORS preflight ---
  if (request.method === "OPTIONS" && pathname.startsWith("/api/")) {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": siteUrl,
        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // --- Rate limiting ---
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    const { allowed } = authLimiter(ip);
    if (!allowed) {
      const res = new NextResponse("Too many requests", { status: 429 });
      addCorsHeaders(res, siteUrl);
      return res;
    }
  }

  if (pathname.startsWith("/api/search")) {
    const { allowed } = searchLimiter(ip);
    if (!allowed) {
      const res = NextResponse.json({ error: "Too many requests" }, { status: 429 });
      addCorsHeaders(res, siteUrl);
      return res;
    }
  }

  if (pathname.startsWith("/api/auth")) {
    const { allowed } = authLimiter(ip);
    if (!allowed) {
      const res = NextResponse.json({ error: "Too many requests" }, { status: 429 });
      addCorsHeaders(res, siteUrl);
      return res;
    }
  }

  // --- CSRF defense + CORS for API routes ---
  if (pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    const referer = request.headers.get("referer");

    if (request.method !== "GET") {
      const validOrigin = origin?.startsWith(siteUrl);
      const validReferer = referer?.startsWith(siteUrl);
      if (!validOrigin && !validReferer) {
        const res = NextResponse.json({ error: "Forbidden" }, { status: 403 });
        addCorsHeaders(res, siteUrl);
        return res;
      }
    }

    const response = NextResponse.next({ request });
    addCorsHeaders(response, siteUrl);
    return response;
  }

  // --- Admin auth check ---
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, { ...COOKIE_OPTIONS, ...options }),
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
