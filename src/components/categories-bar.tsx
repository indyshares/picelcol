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
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="mr-2 text-sm font-medium text-[var(--text-light)]">หมวดหมู่:</span>
        <Link
          href="/articles"
          className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-sm text-[var(--text)] transition hover:border-[var(--primary)] hover:bg-[var(--primary)]/10"
        >
          ทั้งหมด
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/articles?cat=${cat.slug}`}
            className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-sm text-[var(--text)] transition hover:border-[var(--primary)] hover:bg-[var(--primary)]/10"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
