import Link from "next/link";
import { listArticlesForAdmin } from "@/services/article.service";
import { listCategories } from "@/services/taxonomy.service";
import { AdminArticlesList } from "@/components/admin/admin-articles-list";

const STATUS_FILTERS = ["all", "published", "draft"] as const;
const SORT_OPTIONS = ["updated_desc", "created_desc", "title_asc", "views_desc"] as const;

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; sort?: string }>;
}) {
  const sp = await searchParams;
  const initialStatus = STATUS_FILTERS.find((f) => f === sp.status);
  const initialSort = SORT_OPTIONS.find((s) => s === sp.sort);

  const [rawArticles, categories] = await Promise.all([
    listArticlesForAdmin({ take: 50 }),
    listCategories(),
  ]);

  const articles = rawArticles.map(({ _count, ...article }) => ({
    ...article,
    views: _count.views,
  }));

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
        initialStatus={initialStatus}
        initialSort={initialSort}
      />
    </main>
  );
}
