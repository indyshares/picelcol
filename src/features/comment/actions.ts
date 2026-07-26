"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentAuthUser } from "@/features/auth/get-current-user";
import { ensureUser } from "@/services/user.service";
import { createComment, deleteComment } from "@/services/comment.service";
import { prisma } from "@/lib/prisma";

export type CommentFormState = {
  error?: string;
};

const commentSchema = z.object({
  content: z.string().trim().min(1, "กรุณากรอกความคิดเห็น").max(2000),
});

async function requireUserId() {
  const authUser = await getCurrentAuthUser();
  if (!authUser) return null;
  const user = await ensureUser(authUser.id, authUser.email ?? "");
  return user.id;
}

export async function addCommentAction(
  articleId: string,
  _prevState: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  const userId = await requireUserId();
  if (!userId) {
    return { error: "ต้องเข้าสู่ระบบก่อนจึงจะแสดงความคิดเห็นได้" };
  }

  const parsed = commentSchema.safeParse({ content: formData.get("content") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" };
  }

  await createComment(articleId, userId, parsed.data.content);

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { slug: true },
  });
  if (article) revalidatePath(`/articles/${article.slug}`);

  return {};
}

export async function deleteCommentAction(commentId: string, articleSlug: string) {
  const userId = await requireUserId();
  if (!userId) return;

  await deleteComment(commentId, userId);
  revalidatePath(`/articles/${articleSlug}`);
}
