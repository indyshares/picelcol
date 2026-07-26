import Link from "next/link";
import { DecorativeBlobs } from "@/components/decorative-blobs";
import { buttonVariants } from "@/components/ui/button";
import { ArticleCard } from "@/features/article/components/article-card";
import { listArticles } from "@/services/article.service";
import { siteConfig } from "@/constants/site";

export default async function HomePage() {
  const latest = (await listArticles({ onlyPublished: true })).slice(0, 3);

  return (
    <main>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "var(--hero-gradient)", opacity: 0.5 }}
        />
        <DecorativeBlobs />
        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 py-24 text-center">
          <span className="rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-[var(--text)] shadow-sm backdrop-blur">
            {siteConfig.name}
          </span>
          <h1 className="font-[var(--font-heading)] text-4xl font-semibold leading-tight text-[var(--text)] sm:text-5xl">
            เรื่องราวน่ารักๆ
            <br />
            ที่เขียนด้วยใจ
          </h1>
          <p className="max-w-xl text-[var(--text-light)]">{siteConfig.description}</p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <Link href="/articles" className={buttonVariants({ size: "lg" })}>
              อ่านบทความ
            </Link>
          </div>
        </div>
      </section>

      {latest.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="font-[var(--font-heading)] text-2xl font-semibold text-[var(--text)]">
              บทความล่าสุด
            </h2>
            <Link
              href="/articles"
              className="text-sm font-medium text-[var(--link)] hover:text-[var(--link-hover)]"
            >
              ดูทั้งหมด →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
