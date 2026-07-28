"use client";

import Link from "next/link";
import { DecorativeBlobs } from "@/components/decorative-blobs";
import { HeroVisual } from "@/components/hero-visual";
import { StatsBar } from "@/components/stats-bar";
import { buttonVariants } from "@/components/ui/button";
import { ArticleCard } from "@/features/article/components/article-card";
import { FeaturedArticleCard } from "@/features/article/components/featured-article-card";
import { useLocale } from "@/lib/use-locale";
import { siteConfig } from "@/constants/site";

type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
  author: { profile: { id: string; userId: string; displayName: string | null; avatarUrl: string | null; bio: string | null } | null };
  categories: { category: { id: string; name: string; slug: string } }[];
  tags: { tag: { id: string; name: string; slug: string } }[];
};

type HomeClientProps = {
  latest: Article[];
  publishedCount: number;
  categoryCount: number;
  viewCount: number;
  likeCount: number;
  categoriesBar?: React.ReactNode;
};

export function HomeClient({ latest, publishedCount, categoryCount, viewCount, likeCount, categoriesBar }: HomeClientProps) {
  const { dict } = useLocale();
  const featured = latest[0];

  return (
    <main>
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
            <h1 className="font-[var(--font-heading)] text-4xl font-semibold leading-tight text-[var(--text)] sm:text-5xl whitespace-pre-line">
              {dict.home.title}
            </h1>
            <p className="max-w-xl text-[var(--text-light)]">
              {dict.home.siteDescription}
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link href="/articles" className={buttonVariants({ size: "lg" })}>
                {dict.home.readArticles}
              </Link>
              <Link
                href="/articles"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                {dict.home.viewCategories}
              </Link>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      <StatsBar
        publishedCount={publishedCount}
        categoryCount={categoryCount}
        viewCount={viewCount}
        likeCount={likeCount}
      />

      {featured && (
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-[var(--text)]">
              {dict.home.featured}
            </h2>
          </div>
          <FeaturedArticleCard article={featured} />
        </section>
      )}

      {categoriesBar}

      {latest.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-[var(--text)]">
              {dict.home.latest}
            </h2>
            <Link
              href="/articles"
              className="text-sm font-medium text-[var(--link)] hover:text-[var(--link-hover)]"
            >
              {dict.home.viewAll}
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
