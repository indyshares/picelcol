import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DecorativeBlobs } from "@/components/decorative-blobs";
import { HeroVisual } from "@/components/hero-visual";
import { StatsBar } from "@/components/stats-bar";
import { CategoriesBar } from "@/components/categories-bar";
import { buttonVariants } from "@/components/ui/button";
import { ArticleCard } from "@/features/article/components/article-card";
import { FeaturedArticleCard } from "@/features/article/components/featured-article-card";
import { listArticles } from "@/services/article.service";
import { siteConfig } from "@/constants/site";

export default async function HomePage() {
  let latest: Awaited<ReturnType<typeof listArticles>> = [];
  let publishedCount = 0;
  let categoryCount = 0;
  let viewCount = 0;
  let likeCount = 0;

  try {
    const [articles, pubCount, catCount, views, likes] = await Promise.all([
      listArticles({ onlyPublished: true }),
      prisma.article.count({ where: { published: true } }),
      prisma.category.count(),
      prisma.articleView.count(),
      prisma.articleLike.count(),
    ]);
    latest = articles.slice(0, 3);
    publishedCount = pubCount;
    categoryCount = catCount;
    viewCount = views;
    likeCount = likes;
  } catch {
    // DB unavailable
  }

  const featured = latest[0];

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "var(--hero-gradient)", opacity: 0.5 }}
        />
        <DecorativeBlobs />
        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-24 lg:flex-row lg:gap-12 lg:text-left">
          <div className="flex flex-col items-center gap-6 lg:items-start lg:w-1/2">
            <span className="rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-[var(--text)] shadow-sm backdrop-blur">
              {siteConfig.name}
            </span>
            <h1 className="font-[var(--font-heading)] text-4xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">
              เรื่องราวน่ารักๆ
              <br />
              ที่เขียนด้วยใจ
            </h1>
            <p className="max-w-xl text-[var(--text-light)]">{siteConfig.description}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link href="/articles" className={buttonVariants({ size: "lg" })}>
                อ่านบทความ
              </Link>
              <Link
                href="/articles"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                ดูหมวดหมู่
              </Link>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      {/* ── Stats ── */}
      <StatsBar
        publishedCount={publishedCount}
        categoryCount={categoryCount}
        viewCount={viewCount}
        likeCount={likeCount}
      />

      {/* ── Featured Article ── */}
      {featured && (
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-[var(--text)]">
              บทความแนะนำ
            </h2>
          </div>
          <FeaturedArticleCard article={featured} />
        </section>
      )}

      {/* ── Categories ── */}
      <CategoriesBar />

      {/* ── Latest Articles ── */}
      {latest.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-[var(--text)]">
              บทความล่าสุด
            </h2>
            <Link
              href="/articles"
              className="text-sm font-medium text-[var(--link)] hover:text-[var(--link-hover)]"
            >
              ดูทั้งหมด →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
