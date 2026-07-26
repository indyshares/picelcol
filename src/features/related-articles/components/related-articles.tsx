import { getRelatedArticles } from "@/services/related-articles.service";
import { ArticleCard } from "@/features/article/components/article-card";

export async function RelatedArticles({ articleId }: { articleId: string }) {
  const related = await getRelatedArticles(articleId);

  if (related.length === 0) return null;

  return (
    <section className="mt-12 border-t border-[var(--border)] pt-8">
      <h2 className="mb-4 text-xl font-semibold text-[var(--text)]">บทความที่เกี่ยวข้อง</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
