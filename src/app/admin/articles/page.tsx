import Link from "next/link";
import Image from "next/image";
import { Eye, ImageIcon, Pencil, Trash2 } from "lucide-react";
import { listArticlesForAdmin } from "@/services/article.service";
import { deleteArticleAction } from "@/features/article/actions";
import { formatICTDateTime } from "@/utils/date";

export default async function AdminArticlesPage() {
  const articles = await listArticlesForAdmin({ take: 50 });

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

      {articles.length === 0 && (
        <p className="p-6 text-[var(--text-light)]">ยังไม่มีบทความ</p>
      )}

      <div>
        {articles.map((article) => {
          const coverUrl = article.coverImage ?? article.coverMedia?.url;
          return (
            <div
              key={article.id}
              className="clay-card mb-4 flex flex-col gap-4 rounded-2xl p-4 md:flex-row md:items-center md:gap-5 md:p-5"
            >
              <div className="clay-well shrink-0 self-center rounded-2xl p-1.5 md:self-auto">
                <div className="relative h-16 w-24 overflow-hidden rounded-xl bg-[var(--clay-bg-soft)]">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={article.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--primary)]/30 to-[var(--secondary)]/30 text-[var(--text-muted)]">
                      <ImageIcon className="h-6 w-6" />
                    </div>
                  )}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate text-base font-semibold text-[var(--text)]">
                    {article.title}
                  </h2>
                  <span
                    className={`clay-badge inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${
                      article.published
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    }`}
                  >
                    {article.published ? "เผยแพร่แล้ว" : "แบบร่าง"}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-sm text-[var(--text-muted)]">
                  /{article.slug}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[var(--text-muted)]">
                  <span>สร้างเมื่อ {formatICTDateTime(article.createdAt)}</span>
                  <span aria-hidden>·</span>
                  <span>แก้ไขเมื่อ {formatICTDateTime(article.updatedAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 md:justify-end">
                <Link
                  href={`/articles/${article.slug}`}
                  className="clay-button clay-bounce inline-flex items-center gap-1.5 bg-[var(--primary)]/20 px-3 py-1.5 text-xs font-medium text-[var(--text)] motion-reduce:transition-none"
                  title="ดูบทความ"
                >
                  <Eye className="h-3.5 w-3.5" />
                  ดู
                </Link>
                <Link
                  href={`/admin/articles/${article.id}/edit`}
                  className="clay-button clay-bounce inline-flex items-center gap-1.5 bg-[var(--clay-bg-soft)] px-3 py-1.5 text-xs font-medium text-[var(--text)] motion-reduce:transition-none"
                  title="แก้ไข"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  แก้ไข
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deleteArticleAction(article.id);
                  }}
                >
                  <button
                    type="submit"
                    className="clay-button clay-bounce inline-flex items-center gap-1.5 bg-[var(--accent)]/20 px-3 py-1.5 text-xs font-medium text-[var(--accent)] motion-reduce:transition-none"
                    title="ลบ"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    ลบ
                  </button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
