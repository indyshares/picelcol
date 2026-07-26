import { prisma } from "@/lib/prisma";

// ---------- Likes ----------

export async function isLikedByUser(articleId: string, userId: string) {
  const like = await prisma.articleLike.findUnique({
    where: { articleId_userId: { articleId, userId } },
  });
  return Boolean(like);
}

export async function countLikes(articleId: string) {
  return prisma.articleLike.count({ where: { articleId } });
}

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

export async function isBookmarkedByUser(articleId: string, userId: string) {
  const bookmark = await prisma.bookmark.findUnique({
    where: { articleId_userId: { articleId, userId } },
  });
  return Boolean(bookmark);
}

export async function countBookmarks(articleId: string) {
  return prisma.bookmark.count({ where: { articleId } });
}

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

export async function listBookmarkedArticles(userId: string) {
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { article: true },
  });
  return bookmarks.map((b) => b.article);
}

// ---------- Views ----------

export async function recordView(articleId: string) {
  await prisma.articleView.create({ data: { articleId } });
}

export async function countViews(articleId: string) {
  return prisma.articleView.count({ where: { articleId } });
}

/** Most-viewed published articles in the last `days` days. */
export async function getTrendingArticles(days = 7, take = 5) {
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
  });

  const countById = new Map(grouped.map((g) => [g.articleId, g._count.articleId]));
  return articles
    .map((article) => ({ article, views: countById.get(article.id) ?? 0 }))
    .sort((a, b) => b.views - a.views);
}
