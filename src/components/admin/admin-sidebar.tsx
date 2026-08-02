"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { FileText, Globe, LayoutDashboard, LogOut, Menu, Sparkles, Users, X } from "lucide-react";
import { signOutAction } from "@/features/auth/actions";

type AdminSidebarProps = {
  user: { email: string };
};

const NAV_ITEMS: { href: Route; label: string; icon: typeof LayoutDashboard }[] = [
  { href: "/admin" as Route, label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/users" as Route, label: "Users", icon: Users },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const brand = (
    <div className="mb-6 flex items-center gap-3 px-2">
      <div className="clay-badge flex h-10 w-10 shrink-0 items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-[var(--accent-contrast)]">
        <Sparkles className="h-5 w-5" />
      </div>
      <div className="leading-tight">
        <p className="text-base font-semibold text-[var(--text)]">eiei Admin</p>
        <p className="text-xs text-[var(--text-muted)]">Picel Collections</p>
      </div>
    </div>
  );

  const nav = (
    <nav className="space-y-2">
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            className={
              active
                ? "clay-button clay-bounce flex items-center gap-3 rounded-full bg-[var(--primary)]/25 px-4 py-2.5 text-sm font-medium text-[var(--text)] motion-reduce:transition-none"
                : "clay-bounce flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-[var(--text-light)] motion-reduce:transition-none hover:bg-[var(--clay-bg-soft)] hover:text-[var(--text)]"
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );

  const bottom = (
    <div className="mt-auto space-y-3 border-t border-[var(--border)] pt-4">
      <div className="flex items-center gap-2 px-2">
        <div className="clay-badge flex h-8 w-8 shrink-0 items-center justify-center bg-[var(--clay-bg-soft)] text-xs font-semibold text-[var(--text)]">
          {user.email.charAt(0).toUpperCase()}
        </div>
        <span className="truncate text-sm text-[var(--text-light)]">{user.email}</span>
      </div>
      <div className="flex gap-2">
        <Link
          href="/"
          title="View site"
          className="clay-button clay-bounce flex h-10 w-10 shrink-0 items-center justify-center bg-[var(--clay-bg-soft)] text-[var(--text)] motion-reduce:transition-none hover:bg-[var(--clay-bg-soft)]"
        >
          <Globe className="h-4 w-4" />
        </Link>
        <form action={signOutAction} className="flex-1">
          <button
            type="submit"
            className="clay-button clay-bounce flex w-full items-center justify-center gap-2 bg-[var(--clay-bg-soft)] px-3 py-2 text-sm font-medium text-[var(--text)] motion-reduce:transition-none hover:bg-[var(--clay-bg-soft)]"
          >
            <LogOut className="h-4 w-4" />
            ออกจากระบบ
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <aside className="clay-card sticky top-4 m-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 flex-col rounded-3xl p-4 lg:flex">
        {brand}
        {nav}
        {bottom}
      </aside>

      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 bg-[var(--surface)] px-4 py-3 lg:hidden">
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="clay-button clay-bounce flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--clay-bg-soft)] text-[var(--text)] motion-reduce:transition-none"
            aria-label="เปิดเมนู"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="truncate text-base font-semibold text-[var(--text)]">eiei Admin</span>
        </div>
        <span className="truncate text-sm text-[var(--text-muted)]">{user.email}</span>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="clay-card absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col rounded-r-3xl p-4">
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="clay-button clay-bounce flex h-9 w-9 items-center justify-center bg-[var(--clay-bg-soft)] text-[var(--text)] motion-reduce:transition-none"
                aria-label="ปิดเมนู"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {brand}
            {nav}
            {bottom}
          </div>
        </div>
      )}
    </>
  );
}
