import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAuthUser } from "@/features/auth/get-current-user";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/features/profile/components/profile-form";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const authUser = await getCurrentAuthUser();

  if (!authUser) {
    redirect("/login?next=/profile");
  }

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      id: true,
      email: true,
      displayName: true,
      avatarUrl: true,
      role: true,
      profile: { select: { bio: true } },
    },
  });

  if (!user) {
    redirect("/login?next=/profile");
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-[var(--font-heading)] font-semibold text-[var(--text)]">
        Profile
      </h1>
      <ProfileForm user={user} />
    </main>
  );
}
