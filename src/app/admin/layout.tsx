import { redirect } from "next/navigation";
import { getCurrentAuthUser } from "@/features/auth/get-current-user";
import { isAdmin } from "@/services/user.service";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentAuthUser();

  if (!user) {
    redirect("/login?next=/admin/articles");
  }

  if (!(await isAdmin(user.id))) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="lg:flex lg:min-h-screen">
        <AdminSidebar user={{ email: user.email ?? "" }} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
