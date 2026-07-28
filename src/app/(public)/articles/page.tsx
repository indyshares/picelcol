import type { Metadata } from "next";
import { listArticles, searchArticles } from "@/services/article.service";
import { getTrendingArticles } from "@/services/engagement.service";
import { ArticleCard } from "@/features/article/components/article-card";
import { EmptyState } from "@/components/empty-state";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "บทความทั้งหมด",
  description: "รวมบทความทั้งหมด",
};

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function ArticlesPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const isSearching = Boolean(q?.trim());

  const [articles, trending] = await Promise.all([
    isSearching ? searchArticles(q!) : listArticles({ onlyPublished: true, take: 12 }),
    isSearching ? Promise.resolve([]) : getTrendingArticles(),
  ]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      {trending.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-4 text-xl font-[var(--font-heading)] font-semibold text-[var(--text)]">
            มาแรงสัปดาห์นี้
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map(({ article }) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}

      <h1 className="mb-8 text-3xl font-[var(--font-heading)] font-semibold text-[var(--text)]">
        {isSearching ? `ผลการค้นหา "${q}"` : "บทความทั้งหมด"}
      </h1>

      {articles.length === 0 ? (
        <EmptyState
          title={isSearching ? "ไม่พบบทความที่ค้นหา" : "ยังไม่มีบทความเผยแพร่"}
          description={
            isSearching ? "ลองค้นหาด้วยคำอื่นดูนะ" : "เร็วๆ นี้จะมีบทความใหม่มาให้อ่านกัน"
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}
