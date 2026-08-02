"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  FileText,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { signOutAction } from "@/features/auth/actions";

type AdminSidebarProps = {
  user: {
    email: string;
    displayName: string | null;
    avatarUrl: string | null;
    role: string;
  };
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
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setConfirmLogout(false);
      }
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

  const displayName = user.displayName || user.email.split("@")[0] || "ผู้ดูแลระบบ";
  const roleLabel =
    user.role === "admin" ? "Admin" : user.role === "writer" ? "Writer" : "User";

  const bottom = (
    <div className="mt-auto space-y-3 border-t border-[var(--border)] pt-4">
      <div className="clay-card flex items-center gap-3 rounded-2xl p-3">
        <div className="relative shrink-0">
          <div className="clay-badge flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)]">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={displayName}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <span className="text-sm font-bold text-[var(--accent-contrast)]">
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <span
            className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 animate-pulse rounded-full border-2 border-[var(--surface)] bg-emerald-500"
            title="ออนไลน์"
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-[var(--text)]" title={user.email}>
            {displayName}
          </p>
          <span className="clay-badge mt-1 inline-flex items-center rounded-full bg-[var(--primary)]/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--text)]">
            {roleLabel}
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        <Link
          href="/"
          title="View site"
          className="clay-button clay-bounce flex h-10 w-10 shrink-0 items-center justify-center bg-[var(--clay-bg-soft)] text-[var(--text)] motion-reduce:transition-none hover:bg-[var(--clay-bg-soft)]"
        >
          <Globe className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={() => setConfirmLogout(true)}
          className="clay-button clay-bounce inline-flex flex-1 items-center justify-center gap-2 border border-rose-200/60 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 motion-reduce:transition-none hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60"
        >
          <LogOut className="h-4 w-4" />
          ออกจากระบบ
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="clay-card m-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 flex-col rounded-3xl p-4 lg:flex">
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
        <span className="truncate text-sm text-[var(--text-muted)]">{displayName}</span>
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

      {confirmLogout && (
        <div
          className="clay-fade-in fixed inset-0 z-[60] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
          onClick={() => setConfirmLogout(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-confirm-title"
            className="clay-pop-in clay-card w-full max-w-sm space-y-4 rounded-3xl p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-100 p-3 text-rose-500 dark:bg-rose-500/15 dark:text-rose-400">
                <LogOut className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1 pt-1">
                <h2 id="logout-confirm-title" className="text-lg font-semibold text-[var(--text)]">
                  ออกจากระบบ?
                </h2>
                <p className="mt-1 text-sm text-[var(--text-light)]">
                  คุณแน่ใจหรือว่าต้องการออกจากระบบ? คุณจะต้องเข้าสู่ระบบใหม่เพื่อกลับมาใช้งาน
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConfirmLogout(false)}
                className="clay-bounce flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--clay-bg-soft)] text-[var(--text-muted)] motion-reduce:transition-none hover:text-[var(--text)]"
                aria-label="ปิด"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmLogout(false)}
                className="clay-button clay-bounce bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 motion-reduce:transition-none hover:bg-gray-200"
              >
                ยกเลิก
              </button>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="clay-button clay-bounce inline-flex items-center gap-2 border border-rose-200/60 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-600 motion-reduce:transition-none hover:bg-rose-100 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/60"
                >
                  <LogOut className="h-4 w-4" />
                  ยืนยันออกจากระบบ
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
