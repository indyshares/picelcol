import { listAdminUsers } from "@/services/user.service";
import { AdminUsers } from "@/components/admin/admin-users";

export default async function AdminUsersPage() {
  const users = await listAdminUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text)]">จัดการผู้ใช้</h1>
        <p className="mt-1 text-sm text-[var(--text-light)]">
          จัดการบทบาทของผู้ใช้ทั้งหมด
        </p>
      </div>
      <AdminUsers users={users} />
    </div>
  );
}
