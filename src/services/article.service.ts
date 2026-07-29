import { cache } from "react";
import { prisma } from "@/lib/prisma";
import type { ArticleInput } from "@/schemas/article.schema";
import type { Prisma } from "@prisma/client";
import { storeRelatedArticles } from "@/services/related-articles.service";

type ArticleInclude = {
  author: { select: { profile: true } };
  categories: { include: { category: true } };
  tags: { include: { tag: true } };
};

type ArticleWithRelations = Prisma.ArticleGetPayload<{ include: ArticleInclude }>;

export async function listArticles({
  onlyPublished = true,
  skip,
  take,
}: { onlyPublished?: boolean; skip?: number; take?: number } = {}): Promise<ArticleWithRelations[]> {
  return prisma.article.findMany({
    where: onlyPublished ? { published: true } : undefined,
    orderBy: { publishedAt: "desc" },
    skip,
    take,
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
export async function searchArticles(query: string): Promise<ArticleWithRelations[]> {
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

export async function getArticleBySlug(slug: string): Promise<ArticleWithRelations | null> {
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
      keywords: { select: { keyword: true } },
      entities: { select: { entityId: true } },
    },
  });
}

export async function createArticle(authorId: string, data: ArticleInput) {
  const { categoryIds, tagNames, keywords, entityIds, coverImageMediaId, ...articleData } = data;

  const [created] = await prisma.$transaction(async (tx) => {
    const tagRecords = await Promise.all(
      tagNames.map((name) => {
        const slug = name.toLowerCase().replace(/\s+/g, "-");
        return tx.tag.upsert({
          where: { slug },
          update: { name },
          create: { name, slug },
        });
      }),
    );

    const createdArticle = await tx.article.create({
      data: {
        ...articleData,
        authorId,
        publishedAt: articleData.published ? new Date() : null,
        coverImageMediaId: coverImageMediaId ?? undefined,
        categories: {
          create: categoryIds.map((categoryId) => ({ categoryId })),
        },
        tags: {
          create: tagRecords.map((tag) => ({ tagId: tag.id })),
        },
        keywords: {
          create: keywords.map((keyword) => ({ keyword })),
        },
        entities: {
          create: entityIds.map((entityId) => ({ entityId })),
        },
      },
    });

    return [createdArticle];
  });

  await storeRelatedArticles(created.id);
  return created;
}

export async function updateArticle(id: string, data: ArticleInput) {
  const { categoryIds, tagNames, keywords, entityIds, coverImageMediaId, ...articleData } = data;

  await prisma.$transaction(async (tx) => {
    const tagRecords = await Promise.all(
      tagNames.map((name) => {
        const slug = name.toLowerCase().replace(/\s+/g, "-");
        return tx.tag.upsert({
          where: { slug },
          update: { name },
          create: { name, slug },
        });
      }),
    );

    await tx.articleCategory.deleteMany({ where: { articleId: id } });
    await tx.articleTag.deleteMany({ where: { articleId: id } });
    await tx.articleKeyword.deleteMany({ where: { articleId: id } });
    await tx.articleEntity.deleteMany({ where: { articleId: id } });

    await tx.article.update({
      where: { id },
      data: {
        ...articleData,
        publishedAt: articleData.published ? new Date() : null,
        coverImageMediaId: coverImageMediaId ?? null,
        categories: { create: categoryIds.map((categoryId) => ({ categoryId })) },
        tags: { create: tagRecords.map((tag) => ({ tagId: tag.id })) },
        keywords: { create: keywords.map((keyword) => ({ keyword })) },
        entities: { create: entityIds.map((entityId) => ({ entityId })) },
      },
    });
  });

  await storeRelatedArticles(id);
}

export async function createMedia(data: { url: string; alt?: string | null }) {
  return prisma.media.create({
    data: { url: data.url, alt: data.alt ?? null },
    select: { id: true, url: true, alt: true },
  });
}

export async function deleteArticle(id: string) {
  return prisma.article.delete({ where: { id } });
}

export const getArticleMetadata = cache(async (slug: string) => {
  return prisma.article.findUnique({
    where: { slug },
    select: {
      title: true,
      excerpt: true,
      slug: true,
      coverImage: true,
      publishedAt: true,
      updatedAt: true,
      categories: { select: { category: { select: { name: true } } }, take: 1 },
      keywords: { select: { keyword: true } },
    },
  });
});

export async function getArticleContent(slug: string) {
  return prisma.article.findUnique({
    where: { slug, published: true },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      coverImage: true,
      coverMedia: { select: { id: true, url: true, alt: true } },
      publishedAt: true,
      updatedAt: true,
      author: {
        select: {
          id: true,
          email: true,
          displayName: true,
          avatarUrl: true,
          profile: true,
        },
      },
      categories: { include: { category: true } },
      tags: { include: { tag: true } },
      keywords: { select: { keyword: true } },
      entities: {
        select: {
          entity: {
            select: { id: true, name: true, type: true },
          },
        },
      },
    },
  });
}

/**
 * Lean list for admin table view – avoids fetching large `content` and
 * unnecessary joins.
 */
export async function listArticlesForAdmin({ take = 50 }: { take?: number } = {}) {
  return prisma.article.findMany({
    orderBy: { publishedAt: "desc" },
    take,
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
    },
  });
}

export async function listArticleSitemapData() {
  return prisma.article.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function isSlugTaken(slug: string, excludeId?: string) {
  const existing = await prisma.article.findUnique({ where: { slug } });
  return Boolean(existing && existing.id !== excludeId);
}
