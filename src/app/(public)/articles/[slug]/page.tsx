import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getArticleContent, getArticleMetadata } from "@/services/article.service";
import { ArticleContent } from "@/features/article/components/article-content";
import { ArticleSidebar } from "@/features/article/components/article-sidebar";
import { siteConfig } from "@/constants/site";
import { EngagementBar } from "@/features/engagement/components/engagement-bar";
import { CommentSection } from "@/features/comment/components/comment-section";
import { estimateReadingTime } from "@/utils/reading-time";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const articles = await prisma.article.findMany({
      where: { published: true },
      select: { slug: true },
    });
    return articles.map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = await getArticleMetadata(slug);

  if (!meta) {
    return { title: "ไม่พบบทความ" };
  }

  const url = `${siteConfig.url}/articles/${meta.slug}`;

  return {
    title: meta.title,
    description: meta.excerpt ?? undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: meta.title,
      description: meta.excerpt ?? undefined,
      url,
      images: meta.coverImage ? [{ url: meta.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.excerpt ?? undefined,
      images: meta.coverImage ? [meta.coverImage] : undefined,
    },
  };
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleContent(slug);

  if (!article) {
    notFound();
  }

  const url = `${siteConfig.url}/articles/${article.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt ?? undefined,
    image: article.coverImage ?? undefined,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    mainEntityOfPage: url,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
        <article>
          {article.categories.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {article.categories.map(({ category }) => (
                <span
                  key={category.id}
                  className="rounded-full bg-[var(--primary)]/15 px-3 py-1 text-xs font-medium text-[var(--text)]"
                >
                  {category.name}
                </span>
              ))}
            </div>
          )}

          <h1 className="font-[var(--font-heading)] text-3xl font-semibold leading-tight text-[var(--text)] sm:text-4xl">
            {article.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[var(--text-muted)]">
            {article.publishedAt && (
              <time dateTime={article.publishedAt.toISOString()}>
                {new Date(article.publishedAt).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
            <span aria-hidden>·</span>
            <span>อ่าน {estimateReadingTime(article.content)} นาที</span>
          </div>

          {article.coverImage && (
            <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
              <Image src={article.coverImage} alt={article.title} fill className="object-cover" />
            </div>
          )}

          <div className="mt-10">
            <ArticleContent markdown={article.content} />
          </div>

          <EngagementBar slug={article.slug} articleId={article.id} />
          <CommentSection articleId={article.id} articleSlug={article.slug} />
        </article>

        <div className="mt-12 lg:mt-0">
          <div className="lg:sticky lg:top-24">
            <ArticleSidebar articleId={article.id} />
          </div>
        </div>
      </div>
    </main>
  );
}
