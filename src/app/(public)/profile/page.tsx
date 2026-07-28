import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentAuthUser } from "@/features/auth/get-current-user";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const authUser = await getCurrentAuthUser();

  if (!authUser) {
    redirect("/login?next=/profile");
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-8 text-3xl font-[var(--font-heading)] font-semibold text-[var(--text)]">
        Profile
      </h1>
      <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-sm text-[var(--text-muted)]">Email</p>
        <p className="mt-1 text-[var(--text)]">{authUser.email ?? "—"}</p>
      </div>
    </main>
  );
}
