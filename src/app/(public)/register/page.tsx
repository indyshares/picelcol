import Link from "next/link";
import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/auth-form";
import { signUpAction } from "@/features/auth/actions";
import { DecorativeBlobs } from "@/components/decorative-blobs";

export const metadata: Metadata = { title: "สมัครสมาชิก" };

export default function RegisterPage() {
  return (
    <main className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 py-16">
      <DecorativeBlobs variant="subtle" />
      <div className="relative flex flex-col items-center gap-6">
        <h1 className="font-[var(--font-heading)] text-2xl font-semibold text-[var(--text)]">
          สมัครสมาชิก
        </h1>
        <AuthForm action={signUpAction} submitLabel="สมัครสมาชิก" />
        <p className="text-sm text-[var(--text-light)]">
          มีบัญชีอยู่แล้ว?{" "}
          <Link href="/login" className="font-medium text-[var(--link)] hover:text-[var(--link-hover)]">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </main>
  );
}
