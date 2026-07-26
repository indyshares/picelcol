import { prisma } from "@/lib/prisma";

export async function listCommentsForArticle(articleId: string) {
  return prisma.comment.findMany({
    where: { articleId },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { id: true, profile: true } } },
  });
}

export async function createComment(articleId: string, userId: string, content: string) {
  return prisma.comment.create({
    data: { articleId, userId, content },
  });
}

export async function deleteComment(id: string, userId: string) {
  // Only the comment's author may delete it.
  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment || comment.userId !== userId) {
    throw new Error("ไม่มีสิทธิ์ลบความคิดเห็นนี้");
  }
  return prisma.comment.delete({ where: { id } });
}
