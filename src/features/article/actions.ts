"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { articleSchema } from "@/schemas/article.schema";
import { prisma } from "@/lib/prisma";
import {
  createArticle,
  createMedia,
  deleteArticle,
  isSlugTaken,
  searchArticles,
  updateArticle,
} from "@/services/article.service";
import { getCurrentAuthUser } from "@/features/auth/get-current-user";
import { ensureUser, isAdmin } from "@/services/user.service";
import { createClient } from "@/lib/supabase/server";

export type ArticleFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
  success?: number;
};

export type MediaResult = { id: string; url: string; alt: string | null } | { error: string };

async function getCurrentUserId() {
  const authUser = await getCurrentAuthUser();

  if (!authUser) {
    throw new Error("ต้องเข้าสู่ระบบก่อนจึงจะสร้าง/แก้ไขบทความได้");
  }

  const user = await ensureUser(authUser.id, authUser.email ?? "");
  return user.id;
}

function parseFormData(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    excerpt: formData.get("excerpt") ? String(formData.get("excerpt")) : undefined,
    content: String(formData.get("content") ?? ""),
    coverImage: formData.get("coverImage") ? String(formData.get("coverImage")) : undefined,
    coverImageMediaId: formData.get("coverImageMediaId") ? String(formData.get("coverImageMediaId")) : undefined,
    published: formData.get("published") === "on",
    categoryIds: formData.getAll("categoryIds").map(String),
    tagNames: formData.getAll("tagNames").map(String),
    keywords: formData.getAll("keywords").map(String),
    entityIds: formData.getAll("entityIds").map(String),
  };
}

export async function createArticleAction(
  _prevState: ArticleFormState,
  formData: FormData,
): Promise<ArticleFormState> {
  const parsed = articleSchema.safeParse(parseFormData(formData));

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  if (await isSlugTaken(parsed.data.slug)) {
    return { fieldErrors: { slug: ["slug นี้ถูกใช้ไปแล้ว"] } };
  }

  let articleId: string;
  try {
    const authorId = await getCurrentUserId();
    const article = await createArticle(authorId, parsed.data);
    articleId = article.id;
  } catch (error) {
    return { error: error instanceof Error ? error.message : "เกิดข้อผิดพลาด" };
  }

  revalidatePath("/articles");
  revalidatePath("/admin/articles");
  redirect(`/admin/articles/${articleId}/edit`);
}

export async function updateArticleAction(
  id: string,
  _prevState: ArticleFormState,
  formData: FormData,
): Promise<ArticleFormState> {
  const authUser = await getCurrentAuthUser();
  if (!authUser || !(await isAdmin(authUser.id))) {
    return { error: "เฉพาะผู้ดูแลระบบเท่านั้นที่แก้ไขบทความได้" };
  }

  const parsed = articleSchema.safeParse(parseFormData(formData));

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  if (await isSlugTaken(parsed.data.slug, id)) {
    return { fieldErrors: { slug: ["slug นี้ถูกใช้ไปแล้ว"] } };
  }

  try {
    await updateArticle(id, parsed.data);
    revalidatePath("/articles");
    revalidatePath(`/articles/${parsed.data.slug}`);
    revalidatePath("/admin/articles");
  } catch (error) {
    return { error: error instanceof Error ? error.message : "เกิดข้อผิดพลาด" };
  }

  return { success: Date.now() };
}

export async function deleteArticleAction(id: string) {
  const authUser = await getCurrentAuthUser();
  if (!authUser || !(await isAdmin(authUser.id))) {
    throw new Error("เฉพาะผู้ดูแลระบบเท่านั้นที่ลบบทความได้");
  }

  await deleteArticle(id);
  revalidatePath("/articles");
  revalidatePath("/admin/articles");
}

export async function uploadMediaAction(formData: FormData): Promise<MediaResult> {
  try {
    const authUser = await getCurrentAuthUser();
    if (!authUser) {
      return { error: "ต้องเข้าสู่ระบบก่อน" };
    }

    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) {
      return { error: "กรุณาเลือกรูปภาพ" };
    }

    const alt = formData.get("alt") ? String(formData.get("alt")).trim() : null;

    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowed.includes(file.type)) {
      return { error: "รองรับเฉพาะไฟล์รูปภาพ JPEG, PNG, WebP, GIF" };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { error: "ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 5MB)" };
    }

    const supabase = await createClient();
    const ext = file.name.split(".").pop() ?? "png";
    const path = `media/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("media").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) return { error: "อัปโหลดรูปไม่สำเร็จ" };

    const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
    const url = urlData.publicUrl;

    const media = await createMedia({ url, alt });

    return { id: media.id, url: media.url, alt: media.alt };
  } catch {
    return { error: "เกิดข้อผิดพลาด กรุณาลองอีกครั้ง" };
  }
}

export async function getMediaGalleryAction() {
  try {
    return await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, url: true, alt: true },
    });
  } catch {
    return [];
  }
}

export async function updateMediaAltAction(mediaId: string, alt: string) {
  try {
    await prisma.media.update({
      where: { id: mediaId },
      data: { alt: alt || null },
    });
    return { success: true };
  } catch {
    return { success: false, error: "ไม่สามารถอัปเดต Alt Text ได้" };
  }
}

export async function searchArticlesAction(q: string) {
  return searchArticles(q);
}
