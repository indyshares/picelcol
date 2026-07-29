import { createClient } from "./client";

const BUCKET = "media";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const MAGIC_BYTES: Record<string, Uint8Array> = {
  "image/jpeg": new Uint8Array([0xFF, 0xD8, 0xFF]),
  "image/png": new Uint8Array([0x89, 0x50, 0x4E, 0x47]),
  "image/webp": new Uint8Array([0x52, 0x49, 0x46, 0x46]),
  "image/gif": new Uint8Array([0x47, 0x49, 0x46, 0x38]),
};

async function validateFile(file: File): Promise<void> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 5MB)");
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("รองรับเฉพาะไฟล์รูปภาพประเภท JPEG, PNG, WebP และ GIF เท่านั้น");
  }

  const header = new Uint8Array(await file.slice(0, 4).arrayBuffer());

  const matchesMagic = Object.values(MAGIC_BYTES).some((magic) =>
    magic.every((byte, i) => header[i] === byte),
  );

  if (!matchesMagic) {
    throw new Error("ไฟล์ไม่ใช่รูปภาพที่ถูกต้อง");
  }
}

export async function uploadFile(file: File, folder: string): Promise<string> {
  await validateFile(file);

  const supabase = createClient();

  const ext = file.name.split(".").pop() ?? "png";
  const path = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
