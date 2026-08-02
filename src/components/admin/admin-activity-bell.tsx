"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bell, ChevronLeft, ChevronRight, Loader2, MessageSquare } from "lucide-react";
import type { ActivityPage } from "@/services/dashboard.service";

const STORAGE_KEY = "eiei-admin-activity-seen";

function timeAgo(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Math.max(0, Date.now() - d.getTime());
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function AdminActivityBell() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ActivityPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unread, setUnread] = useState(0);

  const load = useCallback(async (targetPage: number, since?: number) => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({ page: String(targetPage) });
      if (since) qs.set("since", String(since));
      const res = await fetch(`/api/admin/activity?${qs.toString()}`);
      if (!res.ok) throw new Error("bad");
      const json = (await res.json()) as ActivityPage;
      setData(json);
      setUnread(json.unread);
    } catch {
      setError("ไม่สามารถโหลดกิจกรรมได้");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const seen = Number(localStorage.getItem(STORAGE_KEY) ?? 0);
    void load(1, seen || undefined);
  }, [load]);

  function toggle() {
    if (open) {
      setOpen(false);
      return;
    }
    setOpen(true);
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setUnread(0);
    if (!data) void load(1);
  }

  function go(targetPage: number) {
    setPage(targetPage);
    void load(targetPage);
  }

  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label="กิจกรรมล่าสุด"
        aria-expanded={open}
        className="clay-button clay-bounce flex h-11 w-11 items-center justify-center rounded-full bg-[var(--clay-bg-soft)] text-[var(--text)] motion-reduce:transition-none"
      >
        <Bell className="h-5 w-5" />
      </button>

      {unread > 0 && (
        <span
          title="กิจกรรมใหม่"
          className="clay-badge absolute -right-1.5 -top-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white ring-2 ring-[var(--surface)]"
        >
          {unread > 99 ? "99+" : unread}
        </span>
      )}

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="clay-card absolute right-0 top-full z-40 mt-3 w-[22rem] max-w-[calc(100vw-2rem)] rounded-3xl p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-[var(--accent)]" />
                <h2 className="text-sm font-semibold text-[var(--text)]">Latest Activity</h2>
              </div>
              {data && (
                <span className="text-xs text-[var(--text-muted)]">
                  {data.total.toLocaleString()} รายการ
                </span>
              )}
            </div>

            <div className="clay-scroll max-h-80 overflow-y-auto pr-1">
              {loading && !data ? (
                <div className="flex h-40 items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-[var(--text-muted)]" />
                </div>
              ) : error && !data ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-rose-200/60 bg-rose-50/60 p-6 text-sm text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
                  <span>{error}</span>
                  <button
                    type="button"
                    onClick={() => void load(page)}
                    className="clay-button clay-bounce bg-[var(--clay-bg-soft)] px-4 py-2 text-[var(--text)] motion-reduce:transition-none"
                  >
                    ลองใหม่
                  </button>
                </div>
              ) : data && data.items.length === 0 ? (
                <p className="py-8 text-center text-sm text-[var(--text-light)]">
                  ยังไม่มีกิจกรรมล่าสุด
                </p>
              ) : (
                <ul>
                  {(data?.items ?? []).map((item) => (
                    <li key={item.id} className="mb-2 last:mb-0">
                      <Link
                        href={`/articles/${item.articleSlug}`}
                        title={item.content}
                        className="clay-card clay-bounce block rounded-2xl p-3 bg-white/80 transition-all motion-reduce:transition-none hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800"
                      >
                        <div className="flex gap-3">
                          <div className="clay-card h-9 w-9 shrink-0 overflow-hidden rounded-full">
                            {item.authorAvatar ? (
                              <div className="relative h-full w-full">
                                <Image
                                  src={item.authorAvatar}
                                  alt={item.authorName}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                            ) : (
                              <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-sm font-bold text-[var(--accent-contrast)]">
                                {item.authorName.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                              {item.authorName} <span aria-hidden>•</span> {timeAgo(item.createdAt)}
                            </p>
                            <p className="my-0.5 line-clamp-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                              {item.content}
                            </p>
                            <p className="flex items-center gap-1 truncate text-xs text-slate-400 dark:text-slate-500">
                              <MessageSquare className="h-3 w-3 shrink-0" />
                              In the article: {item.articleTitle}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {data && totalPages > 1 && (
              <div className="mt-3 flex items-center justify-between gap-2 border-t border-[var(--border)] pt-3">
                <button
                  type="button"
                  onClick={() => go(page - 1)}
                  disabled={page <= 1}
                  className="clay-button clay-bounce flex h-8 w-8 items-center justify-center rounded-full bg-[var(--clay-bg-soft)] text-[var(--text)] motion-reduce:transition-none disabled:opacity-40"
                  aria-label="หน้าก่อนหน้า"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs font-medium text-[var(--text-muted)]">
                  หน้า {page}/{totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => go(page + 1)}
                  disabled={page >= totalPages}
                  className="clay-button clay-bounce flex h-8 w-8 items-center justify-center rounded-full bg-[var(--clay-bg-soft)] text-[var(--text)] motion-reduce:transition-none disabled:opacity-40"
                  aria-label="หน้าถัดไป"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
