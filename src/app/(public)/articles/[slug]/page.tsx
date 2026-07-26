import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Eye } from "lucide-react";
import { getArticleBySlug } from "@/services/article.service";
import { ArticleContent } from "@/features/article/components/article-content";
import { siteConfig } from "@/constants/site";
import { getCurrentAuthUser } from "@/features/auth/get-current-user";
import {
  countBookmarks,
  countLikes,
  countViews,
  isBookmarkedByUser,
  isLikedByUser,
} from "@/services/engagement.service";
import { LikeButton } from "@/features/engagement/components/like-button";
import { BookmarkButton } from "@/features/engagement/components/bookmark-button";
import { ViewTracker } from "@/features/engagement/components/view-tracker";
import { CommentForm } from "@/features/comment/components/comment-form";
import { CommentList } from "@/features/comment/components/comment-list";
import { RelatedArticles } from "@/features/related-articles/components/related-articles";
import { estimateReadingTime } from "@/utils/reading-time";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || !article.published) {
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
  const article = await getArticleBySlug(slug);

  if (!article || !article.published) {
    notFound();
  }

  const url = `${siteConfig.url}/articles/${article.slug}`;

  const authUser = await getCurrentAuthUser();
  const [likeCount, bookmarkCount, viewCount, liked, bookmarked] = await Promise.all([
    countLikes(article.id),
    countBookmarks(article.id),
    countViews(article.id),
    authUser ? isLikedByUser(article.id, authUser.id) : Promise.resolve(false),
    authUser ? isBookmarkedByUser(article.id, authUser.id) : Promise.resolve(false),
  ]);

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
      <ViewTracker articleId={article.id} />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
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
        <span aria-hidden>·</span>
        <span className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          {viewCount.toLocaleString("th-TH")} ครั้ง
        </span>
      </div>

      {article.coverImage && (
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
          <Image src={article.coverImage} alt={article.title} fill className="object-cover" />
        </div>
      )}

      <div className="mt-10">
        <ArticleContent markdown={article.content} />
      </div>

      <div className="mt-10 flex items-center gap-3 border-t border-[var(--border)] pt-6">
        <LikeButton articleId={article.id} initialLiked={liked} initialCount={likeCount} />
        <BookmarkButton articleId={article.id} initialBookmarked={bookmarked} />
        <span className="text-sm text-[var(--text-muted)]">บันทึกไว้ {bookmarkCount} คน</span>
      </div>

      <section className="mt-10 border-t border-[var(--border)] pt-8">
        <h2 className="mb-4 font-[var(--font-heading)] text-xl font-semibold text-[var(--text)]">
          ความคิดเห็น
        </h2>
        <div className="mb-6">
          <CommentForm articleId={article.id} />
        </div>
        <CommentList articleId={article.id} articleSlug={article.slug} />
      </section>

      <RelatedArticles articleId={article.id} />
    </main>
  );
}
