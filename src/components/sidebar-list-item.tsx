import Link from "next/link";
import { formatICTDate } from "@/utils/date";

type Item = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  publishedAt: Date | null;
  categories?: { category: { name: string } }[];
};

export function SidebarListItem({ article }: { article: Item }) {
  const category = article.categories?.[0]?.category.name;
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group block border-l-2 border-transparent py-2 pl-3 transition hover:border-[var(--primary)] hover:bg-[var(--bg)]"
    >
      {category && (
        <span className="mb-0.5 inline-block text-[11px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
          {category}
        </span>
      )}
      <h3 className="text-sm font-medium leading-snug text-[var(--text)] transition group-hover:text-[var(--link)]">
        {article.title}
      </h3>
      {article.publishedAt && (
        <time className="mt-0.5 block text-xs text-[var(--text-muted)]">
          {formatICTDate(article.publishedAt)}
        </time>
      )}
    </Link>
  );
}
