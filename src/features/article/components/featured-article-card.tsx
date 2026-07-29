import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { ArticleSummary } from "@/types";
import { formatBangkokDate } from "@/utils/date";

type FeaturedArticle = ArticleSummary & {
  categories?: { category: { name: string } }[];
  author?: { profile: { displayName: string | null } | null } | null;
};

export function FeaturedArticleCard({ article, priority }: { article: FeaturedArticle; priority?: boolean }) {
  const category = article.categories?.[0]?.category.name;
  const authorName = article.author?.profile?.displayName;

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.1)] md:flex-row"
    >
      <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-[var(--bg)] md:aspect-auto md:w-2/5">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            priority={priority}
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, #98D8F4 0%, #FFC5D6 100%)" }}
          />
        )}
      </div>
      <div className="flex flex-1 flex-col justify-center gap-3 p-6 md:p-8">
        {category && (
          <span className="self-start rounded-full bg-[var(--primary)]/15 px-3 py-1 text-xs font-medium text-[var(--text)]">
            {category}
          </span>
        )}
        <h2 className="font-[var(--font-heading)] text-xl font-semibold leading-snug text-[var(--text)] md:text-2xl">
          {article.title}
        </h2>
        {article.excerpt && (
          <p className="line-clamp-2 text-sm text-[var(--text-light)]">{article.excerpt}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          {authorName && <span>{authorName}</span>}
          {authorName && article.publishedAt && <span aria-hidden>·</span>}
          {article.publishedAt && (
            <time dateTime={article.publishedAt.toISOString()}>
              {formatBangkokDate(article.publishedAt)}
            </time>
          )}
        </div>
        <span className="mt-2 flex items-center gap-1 text-sm font-medium text-[var(--link)] group-hover:text-[var(--link-hover)]">
          อ่านต่อ <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
