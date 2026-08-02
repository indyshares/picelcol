"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Bookmark, LayoutDashboard, LogOut, Loader2 } from "lucide-react";
import { signOutAction } from "@/features/auth/actions";
import { useAuthStore } from "@/stores/auth-store";

export function AuthNav() {
  const pathname = usePathname();
  const { user, loading, setUser } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, [pathname, setUser]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <Loader2 className="h-4 w-4 animate-spin text-[var(--text-muted)]" />
      </div>
    );
  }

  if (user) {
    return (
      <div ref={menuRef} className="relative text-sm">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="clay-button clay-bounce flex items-center gap-2 bg-[var(--clay-bg-soft)] px-3 py-1.5 font-medium text-[var(--text)] motion-reduce:transition-none"
        >
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Profile</span>
        </button>

        {open && (
          <div className="clay-card absolute right-0 top-full z-50 mt-3 w-48 overflow-hidden">
            <div className="border-b border-[var(--border)] px-4 py-3">
              <p className="truncate text-xs text-[var(--text-muted)]">{user.email}</p>
            </div>

            <Link
              href={"/profile"}
              onClick={() => setOpen(false)}
              className="clay-bounce flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text)] motion-reduce:transition-none hover:bg-[var(--bg)]"
            >
              <User className="h-4 w-4 text-[var(--text-muted)]" />
              Profile
            </Link>

            <Link
              href="/bookmarks"
              onClick={() => setOpen(false)}
              className="clay-bounce flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text)] motion-reduce:transition-none hover:bg-[var(--bg)]"
            >
              <Bookmark className="h-4 w-4 text-[var(--text-muted)]" />
              Favorite
            </Link>

            {(user.role === "admin" || user.role === "writer") && (
              <Link
                href="/admin/articles"
                onClick={() => setOpen(false)}
                className="clay-bounce flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text)] motion-reduce:transition-none hover:bg-[var(--bg)]"
              >
                <LayoutDashboard className="h-4 w-4 text-[var(--text-muted)]" />
                Dashboard
              </Link>
            )}

            <div className="border-t border-[var(--border)]">
              <button
                type="button"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await signOutAction();
                    setUser(null);
                  })
                }
                className="clay-bounce flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-light)] motion-reduce:transition-none hover:bg-[var(--bg)] disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" />
                {isPending ? "Signing out..." : "Sign Out"}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      <Link
        href="/login"
        className="clay-button clay-bounce bg-[var(--accent)] px-4 py-2 font-medium text-[var(--accent-contrast)] motion-reduce:transition-none"
      >
        เข้าสู่ระบบ
      </Link>
    </div>
  );
}
