import Link from "next/link";
import { prisma } from "@/lib/prisma";

export async function CategoriesBar() {
  let categories: { slug: string; name: string }[] = [];
  try {
    categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  } catch {
    // DB unavailable
  }

  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-6 pb-4">
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <span className="mr-2 text-sm font-medium text-[var(--text-light)]">หมวดหมู่:</span>
        <Link
          href="/articles"
          className="clay-badge clay-bounce bg-[var(--clay-bg-soft)] px-4 py-1.5 text-sm font-medium text-[var(--text)] motion-reduce:transition-none hover:text-[var(--link)]"
        >
          ทั้งหมด
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/articles?cat=${cat.slug}`}
            className="clay-badge clay-bounce bg-[var(--clay-bg-soft)] px-4 py-1.5 text-sm font-medium text-[var(--text)] motion-reduce:transition-none hover:text-[var(--link)]"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
