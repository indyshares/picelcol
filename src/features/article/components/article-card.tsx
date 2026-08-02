import Link from "next/link";
import Image from "next/image";
import type { ArticleSummary } from "@/types";
import { formatICTDate } from "@/utils/date";

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
      className="clay-card clay-bounce group flex flex-col overflow-hidden motion-reduce:transition-none"
    >
      <div className="p-3 pb-0">
        <div className="clay-well p-2">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-[var(--bg)]">
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
              <span className="clay-badge absolute left-3 top-3 bg-white/90 px-3 py-1 text-xs font-medium text-[var(--text)] backdrop-blur">
                {category}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5 pt-4">
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
              {formatICTDate(article.publishedAt)}
            </time>
          )}
        </div>
      </div>
    </Link>
  );
}
