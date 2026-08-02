import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentAuthUser } from "@/features/auth/get-current-user";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const BUCKET = "avatars";

function extractAvatarPath(publicUrl: string): string | null {
  try {
    const url = new URL(publicUrl);
    const match = url.pathname.match(/\/storage\/v1\/object\/public\/avatars\/(.+)$/);
    return match ? decodeURIComponent(match[1]) : null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const authUser = await getCurrentAuthUser();
  if (!authUser) {
    return NextResponse.json({ error: "ต้องเข้าสู่ระบบก่อน" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "ไม่พบไฟล์รูปภาพ" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "รองรับเฉพาะไฟล์รูปภาพ JPEG, PNG, WebP, GIF" },
      { status: 400 },
    );
  }

  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 5MB)" }, { status: 400 });
  }

  const supabase = await createClient();

  const dbUser = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: { avatarUrl: true },
  });

  const path = `avatars/${authUser.id}-${Date.now()}.webp`;
  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: file.type,
  });

  if (uploadError) {
    return NextResponse.json({ error: "อัปโหลดรูปไม่สำเร็จ กรุณาลองอีกครั้ง" }, { status: 500 });
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const newAvatarUrl = data.publicUrl;

  const oldPath = dbUser?.avatarUrl ? extractAvatarPath(dbUser.avatarUrl) : null;
  const isOwnFile =
    oldPath?.startsWith(`avatars/${authUser.id}-`) ||
    oldPath?.startsWith(`avatars/${authUser.id}_`);

  if (oldPath && isOwnFile && oldPath !== path) {
    try {
      await supabase.storage.from(BUCKET).remove([oldPath]);
    } catch {
      // Deleting the old avatar is best-effort; ignore lingering errors.
    }
  }

  await prisma.user.update({
    where: { id: authUser.id },
    data: { avatarUrl: newAvatarUrl },
  });

  revalidatePath("/profile");
  return NextResponse.json({ avatarUrl: newAvatarUrl });
}
