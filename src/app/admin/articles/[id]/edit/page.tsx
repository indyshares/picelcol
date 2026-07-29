import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ArticleForm } from "@/features/article/components/article-form";
import { updateArticleAction } from "@/features/article/actions";
import { getArticleById } from "@/services/article.service";
import { listCategories, listTags, listEntities } from "@/services/taxonomy.service";
import { listAuthors } from "@/services/user.service";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const [article, categories, tags, entities, users] = await Promise.all([
    getArticleById(id),
    listCategories(),
    listTags(),
    listEntities(),
    listAuthors(),
  ]);

  if (!article) {
    notFound();
  }

  let coverAlt = "";
  if (article.coverImageMediaId) {
    const media = await prisma.media.findUnique({
      where: { id: article.coverImageMediaId },
      select: { alt: true },
    });
    coverAlt = media?.alt ?? "";
  }

  const boundAction = updateArticleAction.bind(null, id);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-semibold text-[var(--text)]">แก้ไขบทความ</h1>
      <ArticleForm
        action={boundAction}
        categories={categories}
        tags={tags}
        entities={entities}
        users={users}
        submitLabel="บันทึกการแก้ไข"
        defaultValues={{
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt ?? undefined,
          content: article.content,
          coverImage: article.coverImage ?? undefined,
          coverImageMediaId: article.coverImageMediaId ?? undefined,
          coverAlt,
          updatedAt: article.updatedAt.toISOString(),
          published: article.published,
          categoryIds: article.categories.map((c) => c.categoryId),
          tagNames: article.tags.map((t) => t.tag.name),
          keywords: article.keywords.map((k) => k.keyword),
          entityIds: article.entities.map((e) => e.entityId),
        }}
      />
    </main>
  );
}
