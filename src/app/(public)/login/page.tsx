import Link from "next/link";
import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/auth-form";
import { signInAction } from "@/features/auth/actions";
import { DecorativeBlobs } from "@/components/decorative-blobs";

export const metadata: Metadata = { title: "เข้าสู่ระบบ" };

export default function LoginPage() {
  return (
    <main className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 py-16">
      <DecorativeBlobs variant="subtle" />
      <div className="relative flex flex-col items-center gap-6">
        <h1 className="font-[var(--font-heading)] text-2xl font-semibold text-[var(--text)]">
          เข้าสู่ระบบ
        </h1>
        <AuthForm action={signInAction} submitLabel="เข้าสู่ระบบ" />
        <p className="text-sm text-[var(--text-light)]">
          ยังไม่มีบัญชี?{" "}
          <Link href="/register" className="font-medium text-[var(--link)] hover:text-[var(--link-hover)]">
            สมัครสมาชิก
          </Link>
        </p>
      </div>
    </main>
  );
}
