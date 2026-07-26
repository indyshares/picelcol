import { createClient } from "./client";

const BUCKET = "media";

export async function uploadFile(file: File, folder: string): Promise<string> {
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
