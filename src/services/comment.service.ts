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
  const { count } = await prisma.comment.deleteMany({ where: { id, userId } });
  if (count === 0) {
    throw new Error("ไม่มีสิทธิ์ลบความคิดเห็นนี้");
  }
}
