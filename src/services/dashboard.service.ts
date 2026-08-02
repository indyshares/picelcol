import { prisma } from "@/lib/prisma";

export type DashboardChartPoint = { label: string; count: number };

export type DashboardData = {
  stats: {
    articles: { total: number; published: number; drafts: number };
    views: { total: number; growth: number };
    categories: number;
    users: { total: number; admins: number };
  };
  chart: DashboardChartPoint[];
  topRead: {
    id: string;
    slug: string;
    title: string;
    coverImage: string | null;
    coverMediaUrl: string | null;
    views: number;
  }[];
  drafts: {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    updatedAt: Date;
  }[];
  activity: {
    id: string;
    content: string;
    createdAt: Date;
    authorName: string;
    articleTitle: string;
    articleSlug: string;
  }[];
};

const CHART_DAYS = 14;

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export async function getDashboardData(): Promise<DashboardData> {
  const now = new Date();
  const since = new Date(now);
  since.setDate(since.getDate() - (CHART_DAYS - 1));
  since.setHours(0, 0, 0, 0);

  const [
    published,
    drafts,
    totalViews,
    categories,
    totalUsers,
    admins,
    topRead,
    recentDrafts,
    recentViews,
    recentComments,
  ] = await Promise.all([
    prisma.article.count({ where: { published: true } }),
    prisma.article.count({ where: { published: false } }),
    prisma.articleView.count(),
    prisma.category.count(),
    prisma.user.count(),
    prisma.user.count({ where: { role: "admin" } }),
    prisma.article.findMany({
      where: { published: true },
      orderBy: { views: { _count: "desc" } },
      take: 5,
      select: {
        id: true,
        slug: true,
        title: true,
        coverImage: true,
        coverMedia: { select: { url: true } },
        _count: { select: { views: true } },
      },
    }),
    prisma.article.findMany({
      where: { published: false },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        updatedAt: true,
      },
    }),
    prisma.articleView.findMany({
      where: { viewedAt: { gte: since } },
      select: { viewedAt: true },
      orderBy: { viewedAt: "asc" },
    }),
    prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            email: true,
            profile: { select: { displayName: true } },
          },
        },
        article: { select: { title: true, slug: true } },
      },
    }),
  ]);

  // Bucket views by (local) day, then grow %: last 7 days vs previous 7 days.
  const buckets = new Map<number, number>();
  for (const v of recentViews) {
    const key = startOfDay(v.viewedAt);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  const chart: DashboardChartPoint[] = [];
  for (let i = CHART_DAYS - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = startOfDay(d);
    chart.push({
      label: d.toLocaleDateString("en-US", { month: "numeric", day: "numeric" }),
      count: buckets.get(key) ?? 0,
    });
  }

  const currentViews = chart.slice(-7).reduce((sum, p) => sum + p.count, 0);
  const prevViews = chart.slice(0, 7).reduce((sum, p) => sum + p.count, 0);
  const growth =
    prevViews === 0
      ? currentViews > 0
        ? 100
        : 0
      : Math.round(((currentViews - prevViews) / prevViews) * 100);

  return {
    stats: {
      articles: { total: published + drafts, published, drafts },
      views: { total: totalViews, growth },
      categories,
      users: { total: totalUsers, admins },
    },
    chart,
    topRead: topRead.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      coverImage: a.coverImage,
      coverMediaUrl: a.coverMedia?.url ?? null,
      views: a._count.views,
    })),
    drafts: recentDrafts.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      updatedAt: a.updatedAt,
    })),
    activity: recentComments.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      authorName: c.user.profile?.displayName ?? c.user.email.split("@")[0] ?? "ผู้ใช้",
      articleTitle: c.article.title,
      articleSlug: c.article.slug,
    })),
  };
}
