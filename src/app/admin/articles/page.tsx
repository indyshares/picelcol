import Link from "next/link";
import { listArticles } from "@/services/article.service";
import { deleteArticleAction } from "@/features/article/actions";

export default async function AdminArticlesPage() {
  const articles = await listArticles({ onlyPublished: false, take: 50 });

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-[var(--text)]">จัดการบทความ</h1>
        <Link
          href="/admin/articles/new"
          className="rounded-[var(--radius-btn)] bg-[var(--accent)] px-4 py-2 font-medium text-white transition hover:bg-[var(--accent-hover)]"
        >
          + สร้างบทความใหม่
        </Link>
      </div>

      <div className="flex flex-col divide-y divide-[var(--border)] rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)]">
        {articles.length === 0 && (
          <p className="p-6 text-[var(--text-light)]">ยังไม่มีบทความ</p>
        )}
        {articles.map((article) => (
          <div key={article.id} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="font-medium text-[var(--text)]">{article.title}</p>
              <p className="text-sm text-[var(--text-muted)]">
                /{article.slug} · {article.published ? "เผยแพร่แล้ว" : "แบบร่าง"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/admin/articles/${article.id}/edit`}
                className="text-sm font-medium text-[var(--link)] hover:text-[var(--link-hover)]"
              >
                แก้ไข
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deleteArticleAction(article.id);
                }}
              >
                <button type="submit" className="text-sm font-medium text-[var(--accent)]">
                  ลบ
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
