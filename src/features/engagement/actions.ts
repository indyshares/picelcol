"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAuthUser } from "@/features/auth/get-current-user";
import { ensureUser } from "@/services/user.service";
import {
  getArticleWithStats,
  recordView,
  toggleBookmark,
  toggleLike,
} from "@/services/engagement.service";

async function requireUserId() {
  const authUser = await getCurrentAuthUser();
  if (!authUser) return null;
  const user = await ensureUser(authUser.id, authUser.email ?? "");
  return user.id;
}

export async function toggleLikeAction(articleId: string, articleSlug: string) {
  const userId = await requireUserId();
  if (!userId) {
    return { error: "ต้องเข้าสู่ระบบก่อนจึงจะกดถูกใจได้" as const };
  }

  const result = await toggleLike(articleId, userId);
  revalidatePath(`/articles/${articleSlug}`);

  return result;
}

export async function toggleBookmarkAction(articleId: string, articleSlug: string) {
  const userId = await requireUserId();
  if (!userId) {
    return { error: "ต้องเข้าสู่ระบบก่อนจึงจะบันทึกบทความได้" as const };
  }

  const result = await toggleBookmark(articleId, userId);
  revalidatePath(`/articles/${articleSlug}`);

  return result;
}

export async function recordViewAction(articleId: string) {
  await recordView(articleId);
}

export async function getEngagementData(slug: string) {
  const authUser = await getCurrentAuthUser();
  const article = await getArticleWithStats(slug, authUser?.id);
  if (!article) return null;
  return {
    likeCount: article._count.likes,
    bookmarkCount: article._count.bookmarks,
    viewCount: article._count.views,
    liked: article.likes.length > 0,
    bookmarked: article.bookmarks.length > 0,
    articleId: article.id,
  };
}
