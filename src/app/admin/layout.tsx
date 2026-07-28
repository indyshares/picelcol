import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentAuthUser } from "@/features/auth/get-current-user";
import { signOutAction } from "@/features/auth/actions";
import { isAdmin } from "@/services/user.service";

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
      <header className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-6 py-4">
        <nav className="flex items-center gap-5">
          <Link href="/admin/articles" className="font-heading font-semibold text-[var(--text)]">
            Admin
          </Link>
          <Link
            href="/admin/articles"
            className="text-sm font-medium text-[var(--text-light)] hover:text-[var(--text)]"
          >
            บทความ
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-[var(--text-light)] hover:text-[var(--text)]"
          >
            กลับหน้าแรก
          </Link>
        </nav>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-[var(--text-light)]">{user.email}</span>
          <form action={signOutAction}>
            <button type="submit" className="font-medium text-[var(--accent)]">
              ออกจากระบบ
            </button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
