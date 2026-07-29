import type { MetadataRoute } from "next";
import { listArticleSitemapData } from "@/services/article.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eiei.picelcollections.site";

  let articles: { slug: string; updatedAt: Date }[] = [];
  try {
    articles = await listArticleSitemapData();
  } catch {
    // Database unavailable during build — return static entries only
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...articles.map((article) => ({
      url: `${baseUrl}/articles/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
