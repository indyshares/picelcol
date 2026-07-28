"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { articleSchema } from "@/schemas/article.schema";
import {
  createArticle,
  deleteArticle,
  isSlugTaken,
  searchArticles,
  updateArticle,
} from "@/services/article.service";
import { getCurrentAuthUser } from "@/features/auth/get-current-user";
import { ensureUser } from "@/services/user.service";

export type ArticleFormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

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
    published: formData.get("published") === "on",
    categoryIds: formData.getAll("categoryIds").map(String),
    tagIds: formData.getAll("tagIds").map(String),
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

  return {};
}

export async function deleteArticleAction(id: string) {
  await deleteArticle(id);
  revalidatePath("/articles");
  revalidatePath("/admin/articles");
}

export async function searchArticlesAction(q: string) {
  return searchArticles(q);
}
