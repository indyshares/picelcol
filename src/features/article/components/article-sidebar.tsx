import { getRelatedArticles } from "@/services/related-articles.service";
import { getTrendingArticles } from "@/services/engagement.service";
import { listArticles } from "@/services/article.service";
import { SidebarListItem } from "@/components/sidebar-list-item";

export async function ArticleSidebar({ articleId }: { articleId: string }) {
  const [related, trendingRaw, recommended] = await Promise.all([
    getRelatedArticles(articleId),
    getTrendingArticles(5, 5),
    listArticles({ onlyPublished: true, take: 5 }),
  ]);

  const trending = trendingRaw.map((t) => t.article);

  return (
    <aside className="space-y-8">
      {related.length > 0 && (
        <section>
          <h2 className="mb-2 font-[var(--font-heading)] text-base font-semibold text-[var(--text)]">
            บทความที่เกี่ยวข้อง
          </h2>
          <div className="divide-y divide-[var(--border)]">
            {related.map((a) => (
              <SidebarListItem key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      {recommended.length > 0 && (
        <section>
          <h2 className="mb-2 font-[var(--font-heading)] text-base font-semibold text-[var(--text)]">
            แนะนำ
          </h2>
          <div className="divide-y divide-[var(--border)]">
            {recommended.slice(0, 5).map((a) => (
              <SidebarListItem key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}

      {trending.length > 0 && (
        <section>
          <h2 className="mb-2 font-[var(--font-heading)] text-base font-semibold text-[var(--text)]">
            มาแรง
          </h2>
          <div className="divide-y divide-[var(--border)]">
            {trending.map((a) => (
              <SidebarListItem key={a.id} article={a} />
            ))}
          </div>
        </section>
      )}
    </aside>
  );
}
