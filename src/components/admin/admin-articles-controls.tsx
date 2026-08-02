"use client";

import { ChevronDown, FilterX, Search, X } from "lucide-react";

export type SortOption = "updated_desc" | "created_desc" | "title_asc" | "views_desc";
export type StatusFilter = "all" | "published" | "draft";

type CategoryOption = { id: string; name: string };

type AdminArticlesControlsProps = {
  search: string;
  onSearchChange: (value: string) => void;
  status: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  categoryId: string;
  onCategoryChange: (value: string) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  categories: CategoryOption[];
  onReset: () => void;
  hasActiveFilters: boolean;
  actions?: React.ReactNode;
};

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

export function AdminArticlesControls({
  search,
  onSearchChange,
  status,
  onStatusChange,
  categoryId,
  onCategoryChange,
  sort,
  onSortChange,
  categories,
  onReset,
  hasActiveFilters,
  actions,
}: AdminArticlesControlsProps) {
  return (
    <div className="mb-6 space-y-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ค้นหาบทความตามชื่อ บทสรุป เนื้อหา หรือ slug..."
            className="clay-card w-full rounded-2xl px-11 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="clay-bounce absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--clay-bg-soft)] text-[var(--text-muted)] motion-reduce:transition-none hover:text-[var(--text)]"
              aria-label="ล้างคำค้น"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => onStatusChange(opt.value)}
              className={
                status === opt.value
                  ? "clay-button clay-bounce bg-[var(--primary)]/25 px-4 py-2 text-sm font-medium text-[var(--text)] motion-reduce:transition-none"
                  : "clay-bounce rounded-full px-4 py-2 text-sm font-medium text-[var(--text-light)] motion-reduce:transition-none hover:bg-[var(--clay-bg-soft)] hover:text-[var(--text)]"
              }
            >
              {opt.label}
            </button>
          ))}
        </div>

        {actions && <div className="lg:ml-auto">{actions}</div>}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <select
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="clay-card appearance-none rounded-2xl px-4 py-2 pr-9 text-sm text-[var(--text)] outline-none"
          >
            <option value="">หมวดหมู่ทั้งหมด</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
        </div>

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="clay-card appearance-none rounded-2xl px-4 py-2 pr-9 text-sm text-[var(--text)] outline-none"
          >
            <option value="updated_desc">แก้ไขล่าสุด (ใหม่ - เก่า)</option>
            <option value="created_desc">สร้างล่าสุด (ใหม่ - เก่า)</option>
            <option value="title_asc">ชื่อบทความ (A - Z)</option>
            <option value="views_desc">ยอดเข้าชม (มาก - น้อย)</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="clay-button clay-bounce inline-flex items-center gap-1.5 bg-[var(--clay-bg-soft)] px-4 py-2 text-sm font-medium text-[var(--accent)] motion-reduce:transition-none"
          >
            <FilterX className="h-4 w-4" />
            ล้างตัวกรอง
          </button>
        )}
      </div>
    </div>
  );
}
