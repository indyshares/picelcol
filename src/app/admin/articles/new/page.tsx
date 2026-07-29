import { ArticleForm } from "@/features/article/components/article-form";
import { createArticleAction } from "@/features/article/actions";
import { listCategories, listTags, listEntities } from "@/services/taxonomy.service";
import { listAuthors } from "@/services/user.service";

export default async function NewArticlePage() {
  const [categories, tags, entities, users] = await Promise.all([
    listCategories(),
    listTags(),
    listEntities(),
    listAuthors(),
  ]);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-semibold text-[var(--text)]">สร้างบทความใหม่</h1>
      <ArticleForm
        action={createArticleAction}
        categories={categories}
        tags={tags}
        entities={entities}
        users={users}
      />
    </main>
  );
}
