import { redirect } from "next/navigation";
import { getCurrentAuthUser } from "@/features/auth/get-current-user";
import { getUserRole, getUserWithProfile } from "@/services/user.service";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminBreadcrumbs } from "@/components/admin/admin-breadcrumbs";
import { AdminActivityBell } from "@/components/admin/admin-activity-bell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentAuthUser();

  if (!user) {
    redirect("/login?next=/admin/articles");
  }

  const role = await getUserRole(user.id);
  if (role !== "admin" && role !== "writer") {
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
          <div className="mb-6 flex items-center justify-between gap-3">
            <AdminBreadcrumbs />
            <AdminActivityBell />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
