import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(1, "กรุณากรอกชื่อบทความ").max(120, "Text exceeds the limit"),
  slug: z
    .string()
    .min(1)
    .max(80, "Text exceeds the limit")
    .regex(/^[a-z0-9-]+$/, "slug ต้องเป็นตัวพิมพ์เล็ก ตัวเลข และ - เท่านั้น"),
  excerpt: z.string().max(250, "Text exceeds the limit").optional(),
  content: z
    .string()
    .min(1, "กรุณากรอกเนื้อหาบทความ")
    .max(50000, "Text exceeds the limit"),
  coverImage: z.string().url().optional(),
  coverImageMediaId: z.string().optional(),
  published: z.boolean().default(false),
  categoryIds: z.array(z.string()).min(1, "เลือกอย่างน้อย 1 หมวดหมู่").max(2, "เลือกได้สูงสุด 2 หมวดหมู่"),
  tagNames: z.array(z.string().min(1)).max(5, "เพิ่มได้สูงสุด 5 แท็ก").default([]),
  keywords: z.array(z.string().min(1)).max(5, "เพิ่มได้สูงสุด 5 คีย์เวิร์ด").default([]),
  entityIds: z.array(z.string()).max(4, "เลือกได้สูงสุด 4 เอนทิตี").default([]),
});

export type ArticleInput = z.infer<typeof articleSchema>;
