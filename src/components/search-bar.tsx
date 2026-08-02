"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";

type SearchResult = {
  slug: string;
  title: string;
  excerpt: string | null;
};

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback(async (q: string) => {
    if (abortRef.current) abortRef.current.abort();
    if (!q.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
        signal: controller.signal,
      });
      if (!res.ok) throw new Error("search failed");
      const data = await res.json();
      setResults(data);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => search(query), 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative hidden sm:block">
      <div className="clay-input flex items-center gap-2 px-4 py-2">
        <Search className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="ค้นหาบทความ..."
          className="w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
          id="search-input"
          name="search"
        />
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--text-muted)]" />}
      </div>
      {open && query.trim() && (
        <div className="clay-card absolute left-0 right-0 top-full z-50 mt-3 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-[var(--text-muted)]">
              <Loader2 className="h-4 w-4 animate-spin" />
              กำลังค้นหา...
            </div>
          ) : results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-[var(--text-muted)]">
              ไม่พบบทความที่ค้นหา
            </p>
          ) : (
            <ul>
              {results.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/articles/${r.slug}`}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="clay-bounce block border-b border-[var(--border)] px-4 py-3 text-sm motion-reduce:transition-none hover:bg-[var(--primary)]/5 last:border-0"
                  >
                    <span className="font-medium text-[var(--text)]">{r.title}</span>
                    {r.excerpt && (
                      <span className="mt-0.5 line-clamp-1 text-xs text-[var(--text-light)]">
                        {r.excerpt}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
