import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getArticleContent } from "@/services/article.service";
import { getArticleWithStats } from "@/services/engagement.service";
import { ArticleContent } from "@/features/article/components/article-content";
import { siteConfig } from "@/constants/site";
import { EngagementBar } from "@/features/engagement/components/engagement-bar";
import { CommentSection } from "@/features/comment/components/comment-section";
import { RelatedSection } from "@/features/related-articles/components/related-section";
import { estimateReadingTime } from "@/utils/reading-time";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleWithStats(slug);

  if (!article) {
    return { title: "ไม่พบบทความ" };
  }

  const url = `${siteConfig.url}/articles/${article.slug}`;

  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt ?? undefined,
      url,
      images: article.coverImage ? [{ url: article.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt ?? undefined,
      images: article.coverImage ? [article.coverImage] : undefined,
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
    <main className="mx-auto max-w-3xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
      <RelatedSection articleId={article.id} />
    </main>
  );
}
