"use client";

import { useActionState, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { ArticleFormState } from "@/features/article/actions";
import { slugify } from "@/utils/slugify";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/lib/supabase/storage";
import { ArticleFormSidebar } from "./article-form-sidebar";

const ArticleEditor = dynamic(() => import("./article-editor").then((m) => m.ArticleEditor), {
  ssr: false,
  loading: () => (
    <div className="min-h-[320px] rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-[var(--text-light)]">
      Loading editor...
    </div>
  ),
});

type CategoryOption = { id: string; name: string };
type TagOption = { id: string; name: string };
type EntityOption = { id: string; name: string; type: string };
type UserOption = { id: string; email: string; profile: { displayName: string | null } | null };

type ArticleFormProps = {
  action: (state: ArticleFormState, formData: FormData) => Promise<ArticleFormState>;
  categories: CategoryOption[];
  tags: TagOption[];
  entities: EntityOption[];
  users: UserOption[];
  defaultValues?: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    published?: boolean;
    categoryIds?: string[];
    tagNames?: string[];
    keywords?: string[];
    entityIds?: string[];
  };
  submitLabel?: string;
};

export function ArticleForm({
  action,
  categories,
  tags,
  entities,
  users,
  defaultValues,
  submitLabel = "บันทึกบทความ",
}: ArticleFormProps) {
  const [state, formAction, isPending] = useActionState<ArticleFormState, FormData>(action, {});
  const [title, setTitle] = useState(defaultValues?.title ?? "");
  const [slug, setSlug] = useState(defaultValues?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(defaultValues?.slug));
  const [markdown, setMarkdown] = useState(defaultValues?.content ?? "");
  const [coverImage, setCoverImage] = useState(defaultValues?.coverImage ?? "");
  const [coverUploading, setCoverUploading] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);

  return (
    <form action={formAction}>
      {state.error && (
        <p className="mb-6 rounded-[var(--radius-input)] border border-[var(--accent)] bg-[var(--accent)]/10 px-4 py-2 text-sm text-[var(--accent)]">
          {state.error}
        </p>
      )}

      <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label htmlFor="title" className="text-sm font-medium text-[var(--text)]">
              ชื่อบทความ
            </label>
            <input
              id="title"
              name="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
              className="rounded-[var(--radius-input)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] outline-none focus:border-[var(--primary)]"
              required
            />
            {state.fieldErrors?.title && (
              <p className="text-sm text-[var(--accent)]">{state.fieldErrors.title[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="slug" className="text-sm font-medium text-[var(--text)]">
              Slug
            </label>
            <input
              id="slug"
              name="slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              className="rounded-[var(--radius-input)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] outline-none focus:border-[var(--primary)]"
              required
            />
            {state.fieldErrors?.slug && (
              <p className="text-sm text-[var(--accent)]">{state.fieldErrors.slug[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="excerpt" className="text-sm font-medium text-[var(--text)]">
              คำโปรย (excerpt)
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              defaultValue={defaultValues?.excerpt}
              rows={2}
              className="rounded-[var(--radius-input)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] outline-none focus:border-[var(--primary)]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text)]">Cover Image</label>
            <input
              ref={coverRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setCoverUploading(true);
                try {
                  const url = await uploadFile(file, "articles/covers");
                  setCoverImage(url);
                } catch {
                  alert("อัปโหลดรูปภาพไม่สำเร็จ");
                } finally {
                  setCoverUploading(false);
                }
              }}
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={coverUploading}
                onClick={() => coverRef.current?.click()}
                className="rounded-[var(--radius-input)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--hover-bg)] disabled:opacity-50"
              >
                {coverUploading ? "กำลังอัปโหลด..." : coverImage ? "เปลี่ยนรูปภาพ" : "เลือกรูปภาพ"}
              </button>
              {coverImage && (
                <button
                  type="button"
                  onClick={() => setCoverImage("")}
                  className="text-sm text-[var(--accent)]"
                >
                  ลบ
                </button>
              )}
            </div>
            <input type="hidden" name="coverImage" value={coverImage} />
            {coverImage && (
              <div className="relative mt-1 h-40 w-full max-w-sm overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)]">
                <Image
                  src={coverImage}
                  alt="Cover preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            {state.fieldErrors?.coverImage && (
              <p className="text-sm text-[var(--accent)]">{state.fieldErrors.coverImage[0]}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-[var(--text)]">เนื้อหา</span>
            <ArticleEditor markdown={markdown} onChange={setMarkdown} />
            <input type="hidden" name="content" value={markdown} />
            {state.fieldErrors?.content && (
              <p className="text-sm text-[var(--accent)]">{state.fieldErrors.content[0]}</p>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-[var(--text)]">
            <input type="checkbox" name="published" defaultChecked={defaultValues?.published} />
            เผยแพร่บทความนี้
          </label>

          <Button type="submit" disabled={isPending} className="self-start">
            {isPending ? "กำลังบันทึก..." : submitLabel}
          </Button>
        </div>

        <div className="mt-8 lg:mt-0">
          <div className="lg:sticky lg:top-24 space-y-6 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5">
            <ArticleFormSidebar
              categories={categories}
              tags={tags}
              entities={entities}
              users={users}
              defaultValues={
                defaultValues
                  ? {
                      categoryIds: defaultValues.categoryIds,
                      tagNames: defaultValues.tagNames,
                      keywords: defaultValues.keywords,
                      entityIds: defaultValues.entityIds,
                    }
                  : undefined
              }
            />
          </div>
        </div>
      </div>
    </form>
  );
}
