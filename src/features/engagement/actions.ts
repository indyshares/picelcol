"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAuthUser } from "@/features/auth/get-current-user";
import { ensureUser } from "@/services/user.service";
import {
  recordView,
  toggleBookmark,
  toggleLike,
} from "@/services/engagement.service";
import { prisma } from "@/lib/prisma";

async function requireUserId() {
  const authUser = await getCurrentAuthUser();
  if (!authUser) return null;
  const user = await ensureUser(authUser.id, authUser.email ?? "");
  return user.id;
}

export async function toggleLikeAction(articleId: string) {
  const userId = await requireUserId();
  if (!userId) {
    return { error: "ต้องเข้าสู่ระบบก่อนจึงจะกดถูกใจได้" as const };
  }

  const result = await toggleLike(articleId, userId);
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { slug: true },
  });
  if (article) revalidatePath(`/articles/${article.slug}`);

  return result;
}

export async function toggleBookmarkAction(articleId: string) {
  const userId = await requireUserId();
  if (!userId) {
    return { error: "ต้องเข้าสู่ระบบก่อนจึงจะบันทึกบทความได้" as const };
  }

  const result = await toggleBookmark(articleId, userId);
  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { slug: true },
  });
  if (article) revalidatePath(`/articles/${article.slug}`);

  return result;
}

export async function recordViewAction(articleId: string) {
  await recordView(articleId);
}
