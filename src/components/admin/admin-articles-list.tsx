"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, ImageIcon, Pencil, SearchX, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteArticleAction } from "@/features/article/actions";
import { formatICTDateTime } from "@/utils/date";
import { DeleteArticleModal } from "@/components/admin/delete-article-modal";
import {
  AdminArticlesControls,
  type SortOption,
  type StatusFilter,
} from "@/components/admin/admin-articles-controls";

type AdminArticle = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  coverImage: string | null;
  coverMedia: { url: string } | null;
  createdAt: Date;
  updatedAt: Date;
  excerpt: string | null;
  content: string;
  categories: { category: { id: string; name: string; slug: string } }[];
};

type CategoryOption = { id: string; name: string };

export function AdminArticlesList({
  articles,
  categories,
}: {
  articles: AdminArticle[];
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<AdminArticle | null>(null);
  const [isDeleting, startTransition] = useTransition();

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState<SortOption>("updated_desc");

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleReset = () => {
    setSearchInput("");
    setSearch("");
    setStatus("all");
    setCategoryId("");
    setSort("updated_desc");
  };

  const hasActiveFilters =
    search.trim() !== "" || status !== "all" || categoryId !== "" || sort !== "updated_desc";

  const filtered = useMemo(() => {
    let list = articles;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.slug.toLowerCase().includes(q) ||
          (a.excerpt ?? "").toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q),
      );
    }
    if (status === "published") list = list.filter((a) => a.published);
    if (status === "draft") list = list.filter((a) => !a.published);
    if (categoryId) {
      list = list.filter((a) => a.categories.some((c) => c.category.id === categoryId));
    }

    return [...list].sort((a, b) => {
      if (sort === "updated_desc") return b.updatedAt.getTime() - a.updatedAt.getTime();
      if (sort === "created_desc") return b.createdAt.getTime() - a.createdAt.getTime();
      return a.title.localeCompare(b.title, "th");
    });
  }, [articles, search, status, categoryId, sort]);

  const handleConfirmDelete = () => {
    if (!selected) return;
    startTransition(async () => {
      try {
        await deleteArticleAction(selected.id);
        toast.success("ลบบทความสำเร็จ");
        setSelected(null);
        router.refresh();
      } catch {
        toast.error("ลบบทความไม่สำเร็จ");
        setSelected(null);
      }
    });
  };

  return (
    <>
      <AdminArticlesControls
        search={searchInput}
        onSearchChange={setSearchInput}
        status={status}
        onStatusChange={setStatus}
        categoryId={categoryId}
        onCategoryChange={setCategoryId}
        sort={sort}
        onSortChange={setSort}
        categories={categories}
        onReset={handleReset}
        hasActiveFilters={hasActiveFilters}
      />

      {filtered.length === 0 ? (
        <div className="clay-card rounded-3xl p-10 text-center">
          {articles.length === 0 ? (
            <p className="text-[var(--text-light)]">ยังไม่มีบทความ</p>
          ) : (
            <>
              <SearchX className="mx-auto h-8 w-8 text-[var(--text-muted)]" />
              <p className="mt-3 font-medium text-[var(--text)]">ไม่พบบทความที่ค้นหา</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                ลองเปลี่ยนคำค้นหรือเงื่อนไขตัวกรองดู
              </p>
            </>
          )}
        </div>
      ) : (
        <div>
          {filtered.map((article) => {
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
                      className={`clay-badge inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        article.published
                          ? "border border-emerald-200/60 bg-emerald-100 text-emerald-800 dark:border-emerald-800/50 dark:bg-emerald-950/80 dark:text-emerald-300"
                          : "border border-amber-200/60 bg-amber-100 text-amber-800 dark:border-amber-800/50 dark:bg-amber-950/80 dark:text-amber-300"
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
                  <button
                    type="button"
                    onClick={() => setSelected(article)}
                    className="clay-button clay-bounce inline-flex items-center gap-1.5 bg-[var(--accent)]/20 px-3 py-1.5 text-xs font-medium text-[var(--accent)] motion-reduce:transition-none"
                    title="ลบ"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    ลบ
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <DeleteArticleModal
        isOpen={selected !== null}
        onClose={() => setSelected(null)}
        onConfirm={handleConfirmDelete}
        title={selected?.title ?? ""}
        isDeleting={isDeleting}
      />
    </>
  );
}
