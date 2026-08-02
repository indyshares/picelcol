"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateProfileAction } from "@/features/profile/actions";
import { compressImage } from "@/lib/image-compressor";

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

const ACCEPT = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SOURCE_MB = 20;

export function ProfileForm({ user }: Props) {
  const router = useRouter();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatarUrl);
  const [compressing, setCompressing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const busy = compressing || uploading;
  const src = avatarPreview ?? avatarUrl;
  const initials = (user.displayName ?? user.email).slice(0, 2).toUpperCase();

  async function uploadAvatar(file: File) {
    setUploading(true);
    const toastId = toast.loading("กำลังอัปโหลดรูปโปรไฟล์...");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/profile/avatar", { method: "POST", body: fd });
      const json = (await res.json()) as { error?: string; avatarUrl?: string };
      if (!res.ok || !json.avatarUrl) {
        throw new Error(json.error ?? "upload failed");
      }
      setAvatarUrl(json.avatarUrl);
      setAvatarPreview(null);
      toast.dismiss(toastId);
      toast.success("Profile picture updated successfully");
      router.refresh();
    } catch {
      setAvatarPreview(null);
      toast.dismiss(toastId);
      toast.error("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPT.includes(file.type)) {
      toast.error("รองรับเฉพาะไฟล์รูปภาพ JPEG, PNG, WebP, GIF");
      return;
    }
    if (file.size > MAX_SOURCE_MB * 1024 * 1024) {
      toast.error(`ไฟล์มีขนาดใหญ่เกินไป (สูงสุด ${MAX_SOURCE_MB}MB)`);
      return;
    }

    const resizeToast = toast.loading("Resizing image...");
    setCompressing(true);
    let compressed: File;
    try {
      compressed = await compressImage(file, 200, 600);
    } catch {
      setCompressing(false);
      toast.dismiss(resizeToast);
      toast.error("ไม่สามารถปรับขนาดรูปภาพได้");
      return;
    }
    setCompressing(false);
    toast.dismiss(resizeToast);

    const previewUrl = URL.createObjectURL(compressed);
    setAvatarPreview(previewUrl);

    try {
      await uploadAvatar(compressed);
    } finally {
      URL.revokeObjectURL(previewUrl);
      e.target.value = "";
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const textForm = new FormData(e.currentTarget);
      const state = await updateProfileAction(null, textForm);
      if (state?.error) {
        toast.error(state.error);
        return;
      }
      toast.success("บันทึกข้อมูลเรียบร้อย");
      router.refresh();
    } catch {
      toast.error("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <div className="clay-card space-y-6 p-6">
        <div className="flex items-center gap-6">
          <div className="clay-badge relative size-20 shrink-0 overflow-hidden rounded-full bg-[var(--clay-bg-soft)]">
            {src ? (
              <Image
                src={src}
                alt=""
                fill
                className={`object-cover transition-all ${busy ? "blur-sm" : ""}`}
                unoptimized
              />
            ) : (
              <span className="flex size-full items-center justify-center text-lg font-semibold text-[var(--text-muted)]">
                {initials}
              </span>
            )}
            {busy && (
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </span>
            )}
          </div>
          <div>
            <label
              htmlFor="avatar"
              className="cursor-pointer text-sm font-medium text-[var(--accent)] hover:underline"
            >
              {user.avatarUrl ? "เปลี่ยนรูปโปรไฟล์" : "อัปโหลดรูปโปรไฟล์"}
            </label>
            <input
              id="avatar"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              JPEG, PNG, WebP, GIF · ระบบบีบอัดอัตโนมัติให้เหลือเล็ก (&lt;200KB)
            </p>
            {uploading && (
              <p className="mt-1 text-xs font-medium text-[var(--accent)]">กำลังอัปโหลด...</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[var(--text-muted)]">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={user.email}
            disabled
            className="clay-input mt-1 block w-full rounded-2xl px-3 py-2 text-sm text-[var(--text-muted)] disabled:opacity-70"
          />
        </div>

        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-[var(--text-muted)]">
            ชื่อที่แสดง
          </label>
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
          <label htmlFor="role" className="block text-sm font-medium text-[var(--text-muted)]">
            บทบาท
          </label>
          <input
            id="role"
            type="text"
            value={user.role}
            disabled
            className="clay-input mt-1 block w-full rounded-2xl px-3 py-2 text-sm text-[var(--text-muted)] disabled:opacity-70"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving || busy}
        className="clay-button clay-bounce bg-[var(--accent)] px-6 py-2 text-sm font-medium text-[var(--accent-contrast)] motion-reduce:transition-none disabled:opacity-50"
      >
        {saving ? "กำลังบันทึก…" : "บันทึก"}
      </button>
    </form>
  );
}
