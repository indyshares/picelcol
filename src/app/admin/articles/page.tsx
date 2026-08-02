import Link from "next/link";
import { listArticlesForAdmin } from "@/services/article.service";
import { listCategories } from "@/services/taxonomy.service";
import { AdminArticlesList } from "@/components/admin/admin-articles-list";

export default async function AdminArticlesPage() {
  const [articles, categories] = await Promise.all([
    listArticlesForAdmin({ take: 50 }),
    listCategories(),
  ]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[var(--text)]">จัดการบทความ</h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">รวม {articles.length} บทความ</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="clay-button clay-bounce bg-[var(--accent)] px-4 py-2 font-medium text-[var(--accent-contrast)] motion-reduce:transition-none"
        >
          + สร้างบทความใหม่
        </Link>
      </div>

      <AdminArticlesList
        articles={articles}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
    </main>
  );
}
