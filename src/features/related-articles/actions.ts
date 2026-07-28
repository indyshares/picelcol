"use server";

import { getRelatedArticles } from "@/services/related-articles.service";

export async function getRelatedData(articleId: string) {
  return getRelatedArticles(articleId);
}
