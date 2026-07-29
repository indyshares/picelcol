import Link from "next/link";
import Image from "next/image";
import type { ArticleSummary } from "@/types";
import { formatBangkokDate } from "@/utils/date";

type ArticleCardArticle = ArticleSummary & {
  categories?: { category: { name: string } }[];
  author?: { profile: { displayName: string | null } | null } | null;
};

export function ArticleCard({ article }: { article: ArticleCardArticle }) {
  const category = article.categories?.[0]?.category.name;
  const authorName = article.author?.profile?.displayName;

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)]"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--bg)]">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, #98D8F4 0%, #FFC5D6 100%)" }}
          />
        )}
        {category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-[var(--text)] shadow-sm backdrop-blur">
            {category}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <h2 className="font-[var(--font-heading)] text-lg font-semibold leading-snug text-[var(--text)]">
          {article.title}
        </h2>
        {article.excerpt && (
          <p className="line-clamp-2 text-sm text-[var(--text-light)]">{article.excerpt}</p>
        )}
        <div className="mt-auto flex items-center gap-2 pt-2 text-xs text-[var(--text-muted)]">
          {authorName && <span>{authorName}</span>}
          {authorName && article.publishedAt && <span aria-hidden>·</span>}
          {article.publishedAt && (
            <time dateTime={article.publishedAt.toISOString()}>
              {formatBangkokDate(article.publishedAt)}
            </time>
          )}
        </div>
      </div>
    </Link>
  );
}
