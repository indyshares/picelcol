"use client";

import { useActionState } from "react";
import type { AuthFormState } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { GoogleAuthButton } from "./google-auth-button";

type AuthFormProps = {
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
  submitLabel: string;
};

export function AuthForm({ action, submitLabel }: AuthFormProps) {
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(action, {});

  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <GoogleAuthButton label={submitLabel === "เข้าสู่ระบบ" ? "เข้าสู่ระบบด้วย Google" : "สมัครสมาชิกด้วย Google"} />

      <div className="relative flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--border)]" />
        <span className="text-xs text-[var(--text-muted)]">หรือ</span>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <form
        action={formAction}
        className="clay-card flex flex-col gap-4 p-6"
      >
        {state.error && (
          <p className="rounded-[var(--radius-input)] border border-[var(--accent)] bg-[var(--accent)]/10 px-4 py-2 text-sm text-[var(--accent)]">
            {state.error}
          </p>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-[var(--text)]">
            อีเมล
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="clay-input px-3 py-2 text-[var(--text)] placeholder:text-[var(--text-muted)]"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="text-sm font-medium text-[var(--text)]">
            รหัสผ่าน
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="current-password"
            className="clay-input px-3 py-2 text-[var(--text)] placeholder:text-[var(--text-muted)]"
          />
        </div>

        <Button type="submit" disabled={isPending} className="mt-2 w-full">
          {isPending ? "กำลังดำเนินการ..." : submitLabel}
        </Button>
      </form>
    </div>
  );
}
