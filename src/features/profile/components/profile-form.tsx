"use client";

import { useRef, useState, useActionState } from "react";
import Image from "next/image";
import { updateProfileAction } from "@/features/profile/actions";

type Props = {
  user: {
    id: string;
    email: string;
    displayName: string | null;
    avatarUrl: string | null;
    role: string;
    profile: { bio: string | null } | null;
  };
};

export function ProfileForm({ user }: Props) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [state, formAction, pending] = useActionState(updateProfileAction, null);

  const src = avatarPreview ?? user.avatarUrl;
  const initials = (user.displayName ?? user.email).slice(0, 2).toUpperCase();

  return (
    <form action={formAction} className="space-y-8">
      <div className="clay-card p-6 space-y-6">
        <div className="flex items-center gap-6">
          <div className="clay-badge relative size-20 shrink-0 overflow-hidden rounded-full bg-[var(--clay-bg-soft)]">
            {src ? (
              <Image src={src} alt="" fill className="object-cover" unoptimized />
            ) : (
              <span className="flex size-full items-center justify-center text-lg font-semibold text-[var(--text-muted)]">
                {initials}
              </span>
            )}
          </div>
          <div>
            <label htmlFor="avatar" className="cursor-pointer text-sm font-medium text-[var(--accent)] hover:underline">
              {user.avatarUrl ? "เปลี่ยนรูปโปรไฟล์" : "อัปโหลดรูปโปรไฟล์"}
            </label>
            <input
              ref={fileRef}
              id="avatar"
              name="avatar"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setAvatarPreview(URL.createObjectURL(file));
              }}
            />
            <p className="mt-1 text-xs text-[var(--text-muted)]">JPEG, PNG, WebP, GIF สูงสุด 5MB</p>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[var(--text-muted)]">Email</label>
          <input
            id="email"
            type="email"
            value={user.email}
            disabled
            className="clay-input mt-1 block w-full rounded-2xl px-3 py-2 text-sm text-[var(--text-muted)] disabled:opacity-70"
          />
        </div>

        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-[var(--text-muted)]">ชื่อที่แสดง</label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            defaultValue={user.displayName ?? ""}
            placeholder="ชื่อของคุณ"
            maxLength={100}
            className="clay-input mt-1 block w-full rounded-2xl px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-[var(--text-muted)]">บทบาท</label>
          <input
            id="role"
            type="text"
            value={user.role}
            disabled
            className="clay-input mt-1 block w-full rounded-2xl px-3 py-2 text-sm text-[var(--text-muted)] disabled:opacity-70"
          />
        </div>
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="clay-button clay-bounce bg-[var(--accent)] px-6 py-2 text-sm font-medium text-[var(--accent-contrast)] motion-reduce:transition-none disabled:opacity-50"
      >
        {pending ? "กำลังบันทึก…" : "บันทึก"}
      </button>
    </form>
  );
}
