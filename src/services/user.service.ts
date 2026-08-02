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

/** Admin or Writer – allowed into the admin area (but not user management). */
export async function isStaff(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role === "admin" || user?.role === "writer";
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

export type AdminUser = {
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: "admin" | "writer" | "user";
};

/** Safe listing for the admin users page. Never exposes email or internal ids for display. */
export async function listAdminUsers(): Promise<AdminUser[]> {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      role: true,
      displayName: true,
      avatarUrl: true,
      profile: { select: { displayName: true, avatarUrl: true } },
    },
  });

  return users.map((u) => ({
    id: u.id,
    displayName: u.profile?.displayName ?? u.displayName,
    avatarUrl: u.profile?.avatarUrl ?? u.avatarUrl,
    role: u.role,
  }));
}

export async function listAuthors() {
  return prisma.user.findMany({
    where: { role: "writer" },
    orderBy: { email: "asc" },
    select: {
      id: true,
      email: true,
      displayName: true,
      avatarUrl: true,
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
