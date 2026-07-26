import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json([]);
  }

  try {
    const articles = await prisma.article.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { excerpt: { contains: q, mode: "insensitive" } },
        ],
      },
      select: { slug: true, title: true, excerpt: true },
      take: 8,
    });
    return NextResponse.json(articles);
  } catch {
    return NextResponse.json([]);
  }
}
