import { ArticleForm } from "@/features/article/components/article-form";
import { createArticleAction } from "@/features/article/actions";
import { listCategories, listTags } from "@/services/taxonomy.service";

export default async function NewArticlePage() {
  const [categories, tags] = await Promise.all([listCategories(), listTags()]);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-semibold text-[var(--text)]">สร้างบทความใหม่</h1>
      <ArticleForm
        action={createArticleAction}
        categories={categories}
        tags={tags}
        submitLabel="สร้างบทความ"
      />
    </main>
  );
}
