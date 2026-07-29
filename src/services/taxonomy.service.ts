import { prisma } from "@/lib/prisma";

export async function listCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function listTags() {
  return prisma.tag.findMany({ orderBy: { name: "asc" } });
}

export async function listEntities() {
  return prisma.entity.findMany({ orderBy: { name: "asc" } });
}

export async function upsertTagByName(name: string) {
  const slug = name.toLowerCase().replace(/\s+/g, "-");
  return prisma.tag.upsert({
    where: { slug },
    update: { name },
    create: { name, slug },
  });
}
