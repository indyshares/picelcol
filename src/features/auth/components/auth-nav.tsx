"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { Bookmark, Loader2 } from "lucide-react";
import { signOutAction } from "@/features/auth/actions";

export function AuthNav() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
      <div className="flex items-center gap-4 text-sm">
        <Link
          href="/bookmarks"
          className="flex items-center gap-1 font-medium text-[var(--text)] hover:text-[var(--link)]"
        >
          <Bookmark className="h-4 w-4" />
          <span className="hidden sm:inline">บันทึก</span>
        </Link>
        <button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(async () => { await signOutAction(); })}
          className="font-medium text-[var(--text-light)] hover:text-[var(--accent)] disabled:opacity-50"
        >
          {isPending ? "กำลังออก..." : "ออกจากระบบ"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 text-sm">
      <Link
        href="/login"
        className="rounded-[var(--radius-btn)] bg-[var(--accent)] px-4 py-2 font-medium text-white transition hover:bg-[var(--accent-hover)]"
      >
        เข้าสู่ระบบ
      </Link>
    </div>
  );
}
