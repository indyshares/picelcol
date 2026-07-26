import { prisma } from "@/lib/prisma";

/**
 * Finds published articles that share a category or tag with the given
 * article, ranked by overlap count. This is the Phase 2 heuristic —
 * Phase 3 (Knowledge Graph / entity relations) can replace or augment
 * this with a smarter `related_articles` table.
 */
export async function getRelatedArticles(articleId: string, take = 3) {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    include: { categories: true, tags: true },
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
    include: { categories: true, tags: true },
    take: 20,
  });

  const scored = candidates.map((candidate) => {
    const sharedCategories = candidate.categories.filter((c) =>
      categoryIds.includes(c.categoryId),
    ).length;
    const sharedTags = candidate.tags.filter((t) => tagIds.includes(t.tagId)).length;
    return { article: candidate, score: sharedCategories * 2 + sharedTags };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, take)
    .map((s) => s.article);
}
