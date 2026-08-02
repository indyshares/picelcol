"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { SearchX } from "lucide-react";
import { toast } from "sonner";
import { deleteArticleAction } from "@/features/article/actions";
import { DeleteArticleModal } from "@/components/admin/delete-article-modal";
import {
  AdminArticlesControls,
  type SortOption,
  type StatusFilter,
} from "@/components/admin/admin-articles-controls";
import { ViewSwitcher, type ViewMode } from "@/components/admin/view-switcher";
import {
  ArticleFeed,
  ArticleGrid,
  ArticleSlimList,
  ArticleTable,
  type AdminArticle,
} from "@/components/admin/admin-article-views";

type CategoryOption = { id: string; name: string };

export function AdminArticlesList({
  articles,
  categories,
  initialStatus,
  initialSort,
}: {
  articles: AdminArticle[];
  categories: CategoryOption[];
  initialStatus?: StatusFilter;
  initialSort?: SortOption;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState<AdminArticle | null>(null);
  const [isDeleting, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>(initialStatus ?? "all");
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState<SortOption>(initialSort ?? "updated_desc");

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
      if (sort === "views_desc") return b.views - a.views;
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
        actions={<ViewSwitcher viewMode={viewMode} onChange={setViewMode} />}
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
      ) : viewMode === "grid" ? (
        <ArticleGrid articles={filtered} onDelete={setSelected} showRanks={sort === "views_desc"} />
      ) : viewMode === "list" ? (
        <ArticleSlimList articles={filtered} onDelete={setSelected} showRanks={sort === "views_desc"} />
      ) : viewMode === "table" ? (
        <ArticleTable articles={filtered} onDelete={setSelected} showRanks={sort === "views_desc"} />
      ) : (
        <ArticleFeed articles={filtered} onDelete={setSelected} showRanks={sort === "views_desc"} />
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
