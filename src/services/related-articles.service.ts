import { prisma } from "@/lib/prisma";

async function computeRelatedArticleIds(articleId: string) {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: {
      categories: { select: { categoryId: true } },
      tags: { select: { tagId: true } },
    },
  });

  if (!article) return [];

  const categoryIds = article.categories.map((c) => c.categoryId);
  const tagIds = article.tags.map((t) => t.tagId);

  if (categoryIds.length === 0 && tagIds.length === 0) return [];

  const candidates = await prisma.article.findMany({
    where: {
      id: { not: articleId },
      published: true,
      OR: [
        { categories: { some: { categoryId: { in: categoryIds } } } },
        { tags: { some: { tagId: { in: tagIds } } } },
      ],
    },
    select: {
      id: true,
      categories: { select: { categoryId: true } },
      tags: { select: { tagId: true } },
    },
    take: 20,
  });

  const scored = candidates.map((c) => {
    const sharedCategories = c.categories.filter((cat) =>
      categoryIds.includes(cat.categoryId),
    ).length;
    const sharedTags = c.tags.filter((t) => tagIds.includes(t.tagId)).length;
    return { id: c.id, score: sharedCategories * 2 + sharedTags };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => ({ relatedArticleId: s.id, score: s.score }));
}

export async function storeRelatedArticles(articleId: string) {
  const related = await computeRelatedArticleIds(articleId);

  await prisma.$transaction([
    prisma.relatedArticle.deleteMany({ where: { articleId } }),
    ...related.map((r) =>
      prisma.relatedArticle.create({
        data: { articleId, relatedArticleId: r.relatedArticleId, score: r.score },
      }),
    ),
  ]);
}

export async function getRelatedArticles(articleId: string) {
  const related = await prisma.relatedArticle.findMany({
    where: { articleId },
    orderBy: { score: "desc" },
    include: {
      relatedArticle: {
        include: {
          author: { select: { profile: true } },
          categories: { include: { category: true } },
        },
      },
    },
  });

  return related.map((r) => r.relatedArticle);
}
