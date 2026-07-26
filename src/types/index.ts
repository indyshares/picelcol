export type ArticleSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | null;
};

export type Theme = "light" | "dark" | "system";
