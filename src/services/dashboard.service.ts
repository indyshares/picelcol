import { prisma } from "@/lib/prisma";

export type TrafficGranularity = "hour" | "day" | "month";
export type TrafficRange = "24h" | "7d" | "30d" | "year" | "all";

export type TrafficPoint = {
  label: string;
  count: number;
  ts: number;
};

export type TrafficStats = {
  total: number;
  average: number;
  growth: number | null;
};

export type TrafficData = {
  granularity: TrafficGranularity;
  points: TrafficPoint[];
  stats: TrafficStats;
};

export type TrafficParams = { range?: TrafficRange; from?: string; to?: string };

export type ActivityItem = {
  id: string;
  content: string;
  createdAt: Date;
  authorName: string;
  authorAvatar: string | null;
  articleTitle: string;
  articleSlug: string;
};

export type ActivityPage = {
  items: ActivityItem[];
  page: number;
  totalPages: number;
  total: number;
  unread: number;
};

export type DashboardData = {
  stats: {
    articles: { total: number; published: number; drafts: number };
    views: { total: number; growth: number };
    categories: number;
    users: { total: number; admins: number };
  };
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
};

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function startOfDay(ts: number) {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function parseLocalDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function floorBucket(ts: number, g: TrafficGranularity) {
  const d = new Date(ts);
  if (g === "hour") {
    d.setMinutes(0, 0, 0);
    return d.getTime();
  }
  if (g === "day") {
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
}

function nextBucket(ts: number, g: TrafficGranularity) {
  const d = new Date(ts);
  if (g === "hour") return d.getTime() + HOUR;
  if (g === "day") return d.getTime() + DAY;
  return new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime();
}

function bucketLabel(ts: number, g: TrafficGranularity, withYear: boolean) {
  const d = new Date(ts);
  if (g === "hour") {
    return d.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
  }
  if (g === "day") {
    return d.toLocaleDateString("en-US", { month: "numeric", day: "numeric" });
  }
  return d.toLocaleDateString("th-TH", {
    month: "short",
    ...(withYear ? { year: "2-digit" } : {}),
  });
}

function pickGranularity(spanMs: number): TrafficGranularity {
  if (spanMs <= 2 * DAY) return "hour";
  if (spanMs <= 62 * DAY) return "day";
  return "month";
}

export async function getTrafficData(params?: TrafficParams): Promise<TrafficData> {
  const now = new Date();
  const { range = "30d", from, to } = params ?? {};

  let start: number;
  let end: number;
  let granularity: TrafficGranularity;

  if (from && to) {
    const f = parseLocalDate(from).getTime();
    const t = parseLocalDate(to).getTime() + DAY;
    if (t <= f) throw new Error("Invalid date range");
    start = f;
    end = t;
    granularity = pickGranularity(end - start);
  } else {
    switch (range) {
      case "24h":
        end = now.getTime();
        start = end - 24 * HOUR;
        granularity = "hour";
        break;
      case "7d":
        end = startOfDay(now.getTime()) + DAY;
        start = end - 7 * DAY;
        granularity = "day";
        break;
      case "year":
        start = new Date(now.getFullYear(), 0, 1).getTime();
        end = now.getTime();
        granularity = "month";
        break;
      case "all":
        start = 0;
        end = now.getTime();
        granularity = "month";
        break;
      case "30d":
      default:
        end = startOfDay(now.getTime()) + DAY;
        start = end - 30 * DAY;
        granularity = "day";
        break;
    }
  }

  const prevStart = range === "all" && !(from && to) ? null : start - (end - start);
  const fetchStart = prevStart ?? start;

  const views = await prisma.articleView.findMany({
    where: { viewedAt: { gte: new Date(fetchStart), lt: new Date(end) } },
    select: { viewedAt: true },
  });

  const map = new Map<number, number>();
  let firstTs = Number.POSITIVE_INFINITY;
  for (const v of views) {
    const k = floorBucket(v.viewedAt.getTime(), granularity);
    map.set(k, (map.get(k) ?? 0) + 1);
    if (v.viewedAt.getTime() < firstTs) firstTs = v.viewedAt.getTime();
  }

  let bStart = floorBucket(start, granularity);
  if (prevStart === null) {
    bStart = Number.isFinite(firstTs)
      ? floorBucket(firstTs, granularity)
      : floorBucket(now.getTime(), granularity);
  }
  const bEnd = floorBucket(end - 1, granularity);
  const withYear =
    granularity === "month" &&
    new Date(bEnd).getFullYear() !== new Date(bStart).getFullYear();

  const points: TrafficPoint[] = [];
  for (let cur = bStart; cur <= bEnd; cur = nextBucket(cur, granularity)) {
    points.push({
      ts: cur,
      count: map.get(cur) ?? 0,
      label: bucketLabel(cur, granularity, withYear),
    });
  }

  const total = points.reduce((sum, p) => sum + p.count, 0);
  const average = points.length ? Math.round(total / points.length) : 0;

  let growth: number | null = null;
  if (prevStart !== null) {
    const prevFrom = floorBucket(prevStart, granularity);
    let prevSum = 0;
    for (const [k, c] of map) {
      if (k >= prevFrom && k < bStart) prevSum += c;
    }
    growth = prevSum === 0 ? (total > 0 ? 100 : 0) : Math.round(((total - prevSum) / prevSum) * 100);
  }

  return { granularity, points, stats: { total, average, growth } };
}

export async function getActivityPage({
  page = 1,
  pageSize = 6,
  since,
}: { page?: number; pageSize?: number; since?: number } = {}): Promise<ActivityPage> {
  const safePage = Math.max(1, page);
  const [total, comments, unread] = await Promise.all([
    prisma.comment.count(),
    prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      skip: (safePage - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            email: true,
            displayName: true,
            avatarUrl: true,
            profile: { select: { displayName: true, avatarUrl: true } },
          },
        },
        article: { select: { title: true, slug: true } },
      },
    }),
    since
      ? prisma.comment.count({ where: { createdAt: { gt: new Date(since) } } })
      : Promise.resolve(0),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    items: comments.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      authorName:
        c.user.profile?.displayName ?? c.user.displayName ?? c.user.email.split("@")[0] ?? "user",
      authorAvatar: c.user.profile?.avatarUrl ?? c.user.avatarUrl,
      articleTitle: c.article.title,
      articleSlug: c.article.slug,
    })),
    page: safePage,
    totalPages,
    total,
    unread,
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  const [
    traffic7d,
    published,
    drafts,
    totalViews,
    categories,
    totalUsers,
    admins,
    topRead,
    recentDrafts,
  ] = await Promise.all([
    getTrafficData({ range: "7d" }),
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
  ]);

  return {
    stats: {
      articles: { total: published + drafts, published, drafts },
      views: { total: totalViews, growth: traffic7d.stats.growth ?? 0 },
      categories,
      users: { total: totalUsers, admins },
    },
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
  };
}
