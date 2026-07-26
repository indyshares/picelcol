import { notFound } from "next/navigation";
import { ArticleForm } from "@/features/article/components/article-form";
import { updateArticleAction } from "@/features/article/actions";
import { getArticleById } from "@/services/article.service";
import { listCategories, listTags } from "@/services/taxonomy.service";
type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const [article, categories, tags] = await Promise.all([
    getArticleById(id),
    listCategories(),
    listTags(),
  ]);

  if (!article) {
    notFound();
  }

  const boundAction = updateArticleAction.bind(null, id);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-semibold text-[var(--text)]">แก้ไขบทความ</h1>
      <ArticleForm
        action={boundAction}
        categories={categories}
        tags={tags}
        submitLabel="บันทึกการแก้ไข"
        defaultValues={{
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt ?? undefined,
          content: article.content,
          coverImage: article.coverImage ?? undefined,
          published: article.published,
          categoryIds: article.categories.map((c) => c.categoryId),
          tagIds: article.tags.map((t) => t.tagId),
        }}
      />
    </main>
  );
}
