import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAuthUser } from "@/features/auth/get-current-user";
import { listBookmarkedArticles } from "@/services/engagement.service";
import { ArticleCard } from "@/features/article/components/article-card";
import { EmptyState } from "@/components/empty-state";

export const metadata: Metadata = { title: "บทความที่บันทึกไว้" };

export default async function BookmarksPage() {
  const authUser = await getCurrentAuthUser();

  if (!authUser) {
    redirect("/login?next=/bookmarks");
  }

  const articles = await listBookmarkedArticles(authUser.id);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-[var(--font-heading)] font-semibold text-[var(--text)]">
        บทความที่บันทึกไว้
      </h1>

      {articles.length === 0 ? (
        <EmptyState title="ยังไม่มีบทความที่บันทึกไว้" description="กดบันทึกบทความที่ชอบไว้อ่านทีหลังได้เลย" />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}
