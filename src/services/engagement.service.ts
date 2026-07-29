import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const getArticleWithStats = cache(async (slug: string, userId?: string | null) => {
  return prisma.article.findUnique({
    where: { slug },
    include: {
      author: { select: { profile: true } },
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      _count: {
        select: { likes: true, bookmarks: true, views: true },
      },
      likes: { where: { userId: userId ?? "" }, take: 1 },
      bookmarks: { where: { userId: userId ?? "" }, take: 1 },
    },
  });
});

const trendingInclude = {
  author: { select: { profile: true } },
  categories: { include: { category: true } },
} as const;

type TrendingArticle = Prisma.ArticleGetPayload<{ include: typeof trendingInclude }>;

// ---------- Likes ----------

export async function toggleLike(articleId: string, userId: string) {
  const existing = await prisma.articleLike.findUnique({
    where: { articleId_userId: { articleId, userId } },
  });

  if (existing) {
    await prisma.articleLike.delete({ where: { articleId_userId: { articleId, userId } } });
    return { liked: false };
  }

  await prisma.articleLike.create({ data: { articleId, userId } });
  return { liked: true };
}

// ---------- Bookmarks ----------

export async function toggleBookmark(articleId: string, userId: string) {
  const existing = await prisma.bookmark.findUnique({
    where: { articleId_userId: { articleId, userId } },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { articleId_userId: { articleId, userId } } });
    return { bookmarked: false };
  }

  await prisma.bookmark.create({ data: { articleId, userId } });
  return { bookmarked: true };
}

const bookmarkArticleSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  coverImage: true,
  publishedAt: true,
  author: { select: { profile: { select: { displayName: true } } } },
  categories: { select: { category: { select: { name: true } } }, take: 1 },
} as const;

export async function listBookmarkedArticles(userId: string) {
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      article: {
        select: bookmarkArticleSelect,
      },
    },
  });
  return bookmarks.map((b) => b.article);
}

// ---------- Views ----------

export async function recordView(articleId: string) {
  await prisma.articleView.create({ data: { articleId } });
}

/** Most-viewed published articles in the last `days` days. */
export async function getTrendingArticles(days = 7, take = 5): Promise<{ article: TrendingArticle; views: number }[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const grouped = await prisma.articleView.groupBy({
    by: ["articleId"],
    where: { viewedAt: { gte: since } },
    _count: { articleId: true },
    orderBy: { _count: { articleId: "desc" } },
    take,
  });

  const articles = await prisma.article.findMany({
    where: { id: { in: grouped.map((g) => g.articleId) }, published: true },
    include: trendingInclude,
  });

  const countById = new Map(grouped.map((g) => [g.articleId, g._count.articleId]));
  return articles
    .map((article) => ({ article, views: countById.get(article.id) ?? 0 }))
    .sort((a, b) => b.views - a.views);
}
