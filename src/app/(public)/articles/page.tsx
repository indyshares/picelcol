import type { Metadata } from "next";
import { listArticles } from "@/services/article.service";
import { getTrendingArticles } from "@/services/engagement.service";
import { ArticleCard } from "@/features/article/components/article-card";
import { ArticleList } from "@/features/article/components/article-list";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "บทความทั้งหมด",
  description: "รวมบทความทั้งหมด",
};

export default async function ArticlesPage() {
  const [articles, trending] = await Promise.all([
    listArticles({ onlyPublished: true, take: 12 }),
    getTrendingArticles(),
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

      <section>
        <h1 className="mb-8 text-3xl font-[var(--font-heading)] font-semibold text-[var(--text)]">
          บทความทั้งหมด
        </h1>
        <ArticleList fallback={articles as unknown as never[]} />
      </section>
    </main>
  );
}
