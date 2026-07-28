"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { searchArticlesAction } from "@/features/article/actions";
import { ArticleCard } from "@/features/article/components/article-card";
import { EmptyState } from "@/components/empty-state";

type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
  categories?: { category: { name: string } }[];
  author?: { profile: { displayName: string | null } | null } | null;
};

export function ArticleList({ fallback }: { fallback: Article[] }) {
  const [mode, setMode] = useState<"default" | "loading" | "results">("default");
  const [results, setResults] = useState<Article[]>([]);
  const [query, setQuery] = useState("");
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    const params = new URLSearchParams(window.location.search);
    const q = params.get("q")?.trim();
    if (!q) return;

    setQuery(q);
    setMode("loading");
    searchArticlesAction(q).then((data) => {
      setResults(data as unknown as Article[]);
      setMode("results");
    });
  }, []);

  if (mode === "loading") {
    return (
      <div className="flex items-center justify-center gap-2 py-12 text-sm text-[var(--text-muted)]">
        <Loader2 className="h-4 w-4 animate-spin" />
        กำลังค้นหา &ldquo;{query}&rdquo;...
      </div>
    );
  }

  if (mode === "results") {
    return (
      <>
        <h2 className="mb-6 text-xl font-semibold text-[var(--text)]">
          ผลการค้นหา &ldquo;{query}&rdquo;
        </h2>
        {results.length === 0 ? (
          <EmptyState
            title="ไม่พบบทความที่ค้นหา"
            description="ลองค้นหาด้วยคำอื่นดูนะ"
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </>
    );
  }

  if (fallback.length === 0) {
    return (
      <EmptyState
        title="ยังไม่มีบทความเผยแพร่"
        description="เร็วๆ นี้จะมีบทความใหม่มาให้อ่านกัน"
      />
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {fallback.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
