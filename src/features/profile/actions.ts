"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentAuthUser } from "@/features/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";

type State = { error?: string } | null;

export async function updateProfileAction(_prev: State, formData: FormData): Promise<State> {
  try {
    const authUser = await getCurrentAuthUser();
    if (!authUser) {
      return { error: "ต้องเข้าสู่ระบบก่อน" };
    }

    const displayName = formData.get("displayName") ? String(formData.get("displayName")).trim() : null;
    const avatarFile = formData.get("avatar") as File | null;

    let avatarUrl: string | null = null;

    if (avatarFile && avatarFile.size > 0) {
      const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!allowed.includes(avatarFile.type)) {
        return { error: "รองรับเฉพาะไฟล์รูปภาพ JPEG, PNG, WebP, GIF" };
      }
      if (avatarFile.size > 5 * 1024 * 1024) {
        return { error: "ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 5MB)" };
      }

      const supabase = await createClient();
      const ext = avatarFile.name.split(".").pop() ?? "png";
      const path = `avatars/${authUser.id}_${Date.now()}.${ext}`;

      const { error } = await supabase.storage.from("avatars").upload(path, avatarFile, {
        cacheControl: "3600",
        upsert: true,
      });

      if (error) return { error: "อัปโหลดรูปไม่สำเร็จ" };

      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      avatarUrl = data.publicUrl;
    }

    const updateData: Record<string, string | null> = {};
    if (displayName !== null) updateData.displayName = displayName;
    if (avatarUrl !== null) updateData.avatarUrl = avatarUrl;

    if (Object.keys(updateData).length > 0) {
      await prisma.user.update({
        where: { id: authUser.id },
        data: updateData,
      });
    }

    revalidatePath("/profile");
    return { error: undefined };
  } catch {
    return { error: "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง" };
  }
}
