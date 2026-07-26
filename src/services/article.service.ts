import { prisma } from "@/lib/prisma";
import type { ArticleInput } from "@/schemas/article.schema";

export async function listArticles({
  onlyPublished = true,
}: { onlyPublished?: boolean } = {}) {
  return prisma.article.findMany({
    where: onlyPublished ? { published: true } : undefined,
    orderBy: { publishedAt: "desc" },
    include: {
      author: { select: { profile: true } },
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
  });
}

/**
 * Basic search over published articles (title/excerpt, case-insensitive).
 * Matches the "PostgreSQL Full Text Search" Phase 1 roadmap item at a
 * simple level — swap for `to_tsvector`/`websearch_to_tsquery` later if
 * ranked full-text search becomes necessary.
 */
export async function searchArticles(query: string) {
  const q = query.trim();
  if (!q) return listArticles({ onlyPublished: true });

  return prisma.article.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { excerpt: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { publishedAt: "desc" },
    include: {
      author: { select: { profile: true } },
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
  });
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({
    where: { slug },
    include: {
      author: { select: { profile: true } },
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
  });
}

export async function getArticleById(id: string) {
  return prisma.article.findUnique({
    where: { id },
    include: {
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
    },
  });
}

export async function createArticle(authorId: string, data: ArticleInput) {
  const { categoryIds, tagIds, ...article } = data;

  return prisma.article.create({
    data: {
      ...article,
      authorId,
      publishedAt: article.published ? new Date() : null,
      categories: {
        create: categoryIds.map((categoryId) => ({ categoryId })),
      },
      tags: {
        create: tagIds.map((tagId) => ({ tagId })),
      },
    },
  });
}

export async function updateArticle(id: string, data: ArticleInput) {
  const { categoryIds, tagIds, ...article } = data;

  return prisma.$transaction([
    prisma.articleCategory.deleteMany({ where: { articleId: id } }),
    prisma.articleTag.deleteMany({ where: { articleId: id } }),
    prisma.article.update({
      where: { id },
      data: {
        ...article,
        publishedAt: article.published ? new Date() : null,
        categories: { create: categoryIds.map((categoryId) => ({ categoryId })) },
        tags: { create: tagIds.map((tagId) => ({ tagId })) },
      },
    }),
  ]);
}

export async function deleteArticle(id: string) {
  return prisma.article.delete({ where: { id } });
}

export async function isSlugTaken(slug: string, excludeId?: string) {
  const existing = await prisma.article.findUnique({ where: { slug } });
  return Boolean(existing && existing.id !== excludeId);
}
