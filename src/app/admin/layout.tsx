import { redirect } from "next/navigation";
import { getCurrentAuthUser } from "@/features/auth/get-current-user";
import { getUserWithProfile, isAdmin } from "@/services/user.service";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentAuthUser();

  if (!user) {
    redirect("/login?next=/admin/articles");
  }

  if (!(await isAdmin(user.id))) {
    redirect("/");
  }

  const dbUser = await getUserWithProfile(user.id);

  return (
    <div className="h-screen overflow-hidden bg-[var(--bg)]">
      <div className="flex h-full flex-col lg:flex-row">
        <AdminSidebar
          user={{
            email: user.email ?? "",
            displayName: dbUser?.profile?.displayName ?? dbUser?.displayName ?? null,
            avatarUrl: dbUser?.profile?.avatarUrl ?? dbUser?.avatarUrl ?? null,
            role: dbUser?.role ?? "user",
          }}
        />
        <main className="clay-scroll flex-1 min-h-0 overflow-y-auto p-6">
          <div className="mb-6">
            <AdminBreadcrumbs />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
