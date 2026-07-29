import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { listArticles } from "@/services/article.service";
import { CategoriesBar } from "@/components/categories-bar";
import { HomeClient } from "./home-client";
import { siteConfig } from "@/constants/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  alternates: { canonical: siteConfig.url },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default async function HomePage() {
  let latest: Awaited<ReturnType<typeof listArticles>> = [];
  let publishedCount = 0;
  let categoryCount = 0;
  let viewCount = 0;
  let likeCount = 0;

  try {
    const [articles, [pubCount, catCount, views, likes]] = await Promise.all([
      listArticles({ onlyPublished: true, take: 3 }),
      prisma.$transaction([
        prisma.article.count({ where: { published: true } }),
        prisma.category.count(),
        prisma.articleView.count(),
        prisma.articleLike.count(),
      ]),
    ]);
    latest = articles;
    publishedCount = pubCount;
    categoryCount = catCount;
    viewCount = views;
    likeCount = likes;
  } catch {
    // DB unavailable
  }

  return (
    <HomeClient
      latest={latest}
      publishedCount={publishedCount}
      categoryCount={categoryCount}
      viewCount={viewCount}
      likeCount={likeCount}
    >
      <CategoriesBar />
    </HomeClient>
  );
}
