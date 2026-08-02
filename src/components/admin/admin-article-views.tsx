"use client";

import Link from "next/link";
import Image from "next/image";
import { Crown, Eye, ImageIcon, Medal, Pencil, Trash2 } from "lucide-react";
import { formatICTDate } from "@/utils/date";

export type AdminArticle = {
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
  views: number;
};

type ViewsProps = {
  articles: AdminArticle[];
  onDelete: (article: AdminArticle) => void;
  showRanks?: boolean;
};

function RankBadge({ rank }: { rank: number }) {
  const styles: Record<number, string> = {
    1: "bg-amber-200 text-amber-900 ring-amber-300/80 dark:bg-amber-400/25 dark:text-amber-300 dark:ring-amber-300/30",
    2: "bg-slate-200 text-slate-700 ring-slate-300/80 dark:bg-slate-400/25 dark:text-slate-300 dark:ring-slate-300/30",
    3: "bg-orange-200 text-orange-800 ring-orange-300/80 dark:bg-orange-400/25 dark:text-orange-300 dark:ring-orange-300/30",
  };

  const Icon = rank === 1 ? Crown : Medal;

  return (
    <span
      title={`อันดับ ${rank} ยอดเข้าชมสูงสุด`}
      className={`clay-badge inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold ring-2 ring-inset ${styles[rank] ?? ""}`}
    >
      <Icon className="h-3 w-3" />
      #{rank}
    </span>
  );
}

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      title={published ? "เผยแพร่แล้ว" : "แบบร่าง"}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        published
          ? "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
          : "bg-amber-100/80 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
      }`}
    >
      <span
        aria-hidden
        className={`h-2 w-2 animate-pulse rounded-full ${
          published ? "bg-emerald-500" : "bg-amber-500"
        }`}
      />
      {published ? "Published" : "Draft"}
    </span>
  );
}

function CoverThumb({
  article,
  className,
}: {
  article: AdminArticle;
  className: string;
}) {
  const coverUrl = article.coverImage ?? article.coverMedia?.url;
  return (
    <div className={`relative overflow-hidden bg-[var(--clay-bg-soft)] ${className}`}>
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
  );
}

function RowActions({
  article,
  onDelete,
  compact = false,
}: {
  article: AdminArticle;
  onDelete: (article: AdminArticle) => void;
  compact?: boolean;
}) {
  const base =
    "clay-button clay-bounce inline-flex items-center justify-center gap-1.5 text-xs font-medium motion-reduce:transition-none";
  const size = compact ? "h-8 w-8" : "px-3 py-1.5";
  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/articles/${article.slug}`}
        title="ดูบทความ"
        className={`${base} ${size} bg-[var(--primary)]/20 text-[var(--text)]`}
      >
        <Eye className="h-3.5 w-3.5" />
        {!compact && "ดู"}
      </Link>
      <Link
        href={`/admin/articles/${article.id}/edit`}
        title="แก้ไข"
        className={`${base} ${size} bg-[var(--clay-bg-soft)] text-[var(--text)]`}
      >
        <Pencil className="h-3.5 w-3.5" />
        {!compact && "แก้ไข"}
      </Link>
      <button
        type="button"
        onClick={() => onDelete(article)}
        title="ลบ"
        className={`${base} ${size} bg-[var(--accent)]/20 text-[var(--accent)]`}
      >
        <Trash2 className="h-3.5 w-3.5" />
        {!compact && "ลบ"}
      </button>
    </div>
  );
}

export function ArticleGrid({ articles, onDelete, showRanks }: ViewsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, i) => (
        <div
          key={article.id}
          className="clay-card clay-bounce flex flex-col overflow-hidden rounded-3xl p-3 motion-reduce:transition-none"
        >
          <div className="clay-well rounded-2xl p-2">
            <CoverThumb article={article} className="aspect-[16/9] w-full rounded-xl" />
          </div>
          <div className="flex flex-1 flex-col gap-2 p-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="line-clamp-2 text-base font-semibold leading-snug text-[var(--text)]">
                {article.title}
              </h3>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                <StatusBadge published={article.published} />
                {showRanks && i < 3 && <RankBadge rank={i + 1} />}
              </div>
            </div>
            {article.excerpt && (
              <p className="line-clamp-2 text-sm text-[var(--text-light)]">{article.excerpt}</p>
            )}
            <div className="mt-auto flex items-center justify-between gap-2 pt-2">
              <span className="truncate text-xs text-[var(--text-muted)]">/{article.slug}</span>
              <RowActions article={article} onDelete={onDelete} compact />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ArticleSlimList({ articles, onDelete, showRanks }: ViewsProps) {
  return (
    <div>
      {articles.map((article, i) => (
        <div
          key={article.id}
          className="clay-card mb-2 flex items-center gap-3 rounded-2xl p-3"
        >
          <div className="clay-well shrink-0 rounded-xl p-1">
            <CoverThumb article={article} className="h-12 w-12 rounded-lg" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold text-[var(--text)]">{article.title}</h3>
            <p className="truncate text-xs text-[var(--text-muted)]">/{article.slug}</p>
          </div>
          <StatusBadge published={article.published} />
          {showRanks && i < 3 && <RankBadge rank={i + 1} />}
          <RowActions article={article} onDelete={onDelete} compact />
        </div>
      ))}
    </div>
  );
}

export function ArticleTable({ articles, onDelete, showRanks }: ViewsProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-y-2 text-left">
        <thead>
          <tr className="text-xs text-[var(--text-muted)]">
            <th className="px-4 py-2 font-medium">Cover</th>
            <th className="px-4 py-2 font-medium">ชื่อบทความ</th>
            <th className="px-4 py-2 font-medium">สถานะ</th>
            <th className="px-4 py-2 font-medium">แก้ไขล่าสุด</th>
            <th className="px-4 py-2 text-right font-medium">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article, i) => (
            <tr key={article.id} className="clay-card rounded-2xl">
              <td className="rounded-l-2xl px-4 py-3">
                <div className="clay-well w-max rounded-xl p-1">
                  <CoverThumb article={article} className="h-12 w-16 rounded-lg" />
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {showRanks && i < 3 && <RankBadge rank={i + 1} />}
                  <div className="min-w-0">
                    <p className="max-w-[14rem] truncate font-medium text-[var(--text)]">
                      {article.title}
                    </p>
                    <p className="truncate text-xs text-[var(--text-muted)]">/{article.slug}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">
                <StatusBadge published={article.published} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-[var(--text-light)]">
                {formatICTDate(article.updatedAt)}
              </td>
              <td className="rounded-r-2xl px-4 py-3 text-right">
                <RowActions article={article} onDelete={onDelete} compact />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ArticleFeed({ articles, onDelete, showRanks }: ViewsProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {articles.map((article, i) => (
        <article
          key={article.id}
          className="clay-card clay-bounce flex flex-col overflow-hidden rounded-3xl motion-reduce:transition-none"
        >
          <CoverThumb article={article} className="h-64 w-full" />
          <div className="flex flex-1 flex-col gap-3 p-6">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-bold text-[var(--text)]">{article.title}</h3>
              <div className="flex shrink-0 items-center gap-2">
                {showRanks && i < 3 && <RankBadge rank={i + 1} />}
                <StatusBadge published={article.published} />
              </div>
            </div>
            {article.excerpt && (
              <p className="line-clamp-3 text-sm text-[var(--text-light)]">{article.excerpt}</p>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
              <div className="text-xs text-[var(--text-muted)]">
                <span>/{article.slug}</span>
                <span aria-hidden> · </span>
                <span>แก้ไขเมื่อ {formatICTDate(article.updatedAt)}</span>
              </div>
              <RowActions article={article} onDelete={onDelete} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
