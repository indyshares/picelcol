"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getRelatedData } from "@/features/related-articles/actions";
import { ArticleCard } from "@/features/article/components/article-card";

type RelatedSectionProps = {
  articleId: string;
};

export function RelatedSection({ articleId }: RelatedSectionProps) {
  const [articles, setArticles] = useState<Awaited<ReturnType<typeof getRelatedData>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRelatedData(articleId).then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, [articleId]);

  if (loading) {
    return (
      <section className="mt-12 border-t border-[var(--border)] pt-8">
        <h2 className="mb-4 text-xl font-semibold text-[var(--text)]">บทความที่เกี่ยวข้อง</h2>
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Loader2 className="h-4 w-4 animate-spin" />
          กำลังโหลด...
        </div>
      </section>
    );
  }

  if (articles.length === 0) return null;

  return (
    <section className="mt-12 border-t border-[var(--border)] pt-8">
      <h2 className="mb-4 text-xl font-semibold text-[var(--text)]">บทความที่เกี่ยวข้อง</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
