import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(1, "กรุณากรอกชื่อบทความ").max(200),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "slug ต้องเป็นตัวพิมพ์เล็ก ตัวเลข และ - เท่านั้น"),
  excerpt: z.string().max(300).optional(),
  content: z.string().min(1, "กรุณากรอกเนื้อหาบทความ").max(100000, "เนื้อหาบทความยาวเกิน 100,000 ตัวอักษร"),
  coverImage: z.string().url().optional(),
  published: z.boolean().default(false),
  categoryIds: z.array(z.string()).default([]),
  tagIds: z.array(z.string()).default([]),
});

export type ArticleInput = z.infer<typeof articleSchema>;
