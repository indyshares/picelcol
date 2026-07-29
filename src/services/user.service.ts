import { prisma } from "@/lib/prisma";

/**
 * Ensures a Prisma `User` row exists for the given Supabase auth user,
 * creating one on first sign-in. The Prisma `User.id` is kept equal to
 * the Supabase auth user id so the two stay trivially joinable.
 */
export async function ensureUser(authUserId: string, email: string) {
  return prisma.user.upsert({
    where: { id: authUserId },
    update: { email },
    create: { id: authUserId, email },
  });
}

export async function getUserWithProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });
}

export async function isAdmin(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role === "admin";
}

export async function getUserRole(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role ?? "user";
}

export async function listUsers() {
  return prisma.user.findMany({
    orderBy: { email: "asc" },
    include: { profile: true },
  });
}

export async function listAuthors() {
  return prisma.user.findMany({
    where: { role: { in: ["admin", "writer"] } },
    orderBy: { email: "asc" },
    select: {
      id: true,
      email: true,
      displayName: true,
      role: true,
    },
  });
}

/** Promote a user to admin (useful for setting up the first admin). */
export async function setAdminRole(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { role: "admin" },
  });
}
