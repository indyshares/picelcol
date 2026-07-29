"use client";

import { useEffect, useActionState, useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import type { ArticleFormState } from "@/features/article/actions";
import { updateMediaAltAction } from "@/features/article/actions";
import { slugify } from "@/utils/slugify";
import { formatICTDateTime } from "@/utils/date";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArticleFormSidebar } from "./article-form-sidebar";
import { MediaPickerModal } from "@/components/media-picker-modal";
import { SectionGuide } from "@/components/section-guide";
import { TooltipProvider } from "@/components/ui/tooltip";

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
type UserOption = { id: string; email: string; displayName: string | null; role: string };

type ArticleFormProps = {
  action: (state: ArticleFormState, formData: FormData) => Promise<ArticleFormState>;
  categories: CategoryOption[];
  tags: TagOption[];
  entities: EntityOption[];
  users: UserOption[];
  defaultValues?: {
    articleId?: string;
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string;
    coverImageMediaId?: string;
    coverAlt?: string;
    updatedAt?: string;
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
  const [coverImageMediaId, setCoverImageMediaId] = useState(defaultValues?.coverImageMediaId ?? "");
  const [coverAlt, setCoverAlt] = useState(defaultValues?.coverAlt ?? "");
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);

  useEffect(() => {
    if (state.success) {
      toast.success("บันทึกบทความสำเร็จ");
    } else if (state.fieldErrors) {
      toast.error("กรุณาตรวจสอบข้อมูลที่กรอก");
    } else if (state.error) {
      toast.error("ไม่สามารถบันทึก: " + state.error);
    }
  }, [state.success, state.error, state.fieldErrors]);

  return (
    <TooltipProvider delayDuration={300}>
      <form action={formAction}>
        {defaultValues?.articleId && (
          <input type="hidden" name="articleId" value={defaultValues.articleId} />
        )}

        {state.error && (
          <p className="mb-6 rounded-[var(--radius-input)] border border-[var(--accent)] bg-[var(--accent)]/10 px-4 py-2 text-sm text-[var(--accent)]">
            {state.error}
          </p>
        )}

        <div className="lg:grid lg:grid-cols-[1fr_300px] lg:gap-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <label htmlFor="title" className="text-sm font-medium text-[var(--text)]">
                ชื่อบทความ <SectionGuide text="Used for the main title and URL slug of the article." />
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
                Slug <SectionGuide text="Used for the main title and URL slug of the article." />
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
              <label className="text-sm font-medium text-[var(--text)]">
                Cover Image <SectionGuide text="Select an image to display as the article cover image." />
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCoverPickerOpen(true)}
                  className="rounded-[var(--radius-input)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--hover-bg)]"
                >
                  {coverImage ? "เปลี่ยนรูปภาพ" : "เลือกรูปภาพ"}
                </button>
                {coverImage && (
                  <button
                    type="button"
                    onClick={() => { setCoverImage(""); setCoverImageMediaId(""); }}
                    className="text-sm text-[var(--accent)]"
                  >
                    ลบ
                  </button>
                )}
              </div>
              <input type="hidden" name="coverImage" value={coverImage} />
              <input type="hidden" name="coverImageMediaId" value={coverImageMediaId} />
              {coverImage && (
                <>
                  <div className="relative mt-1 h-40 w-full max-w-sm overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)]">
                    <Image
                      src={coverImage}
                      alt={coverAlt || "Cover preview"}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <input
                    value={coverAlt}
                    onChange={(e) => setCoverAlt(e.target.value)}
                    onBlur={() => {
                      if (coverImageMediaId) {
                        updateMediaAltAction(coverImageMediaId, coverAlt);
                      }
                    }}
                    placeholder="Alt Text สำหรับรูปภาพปก"
                    maxLength={300}
                    className="mt-2 w-full max-w-sm rounded-[var(--radius-input)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)]"
                  />
                </>
              )}
              {state.fieldErrors?.coverImage && (
                <p className="text-sm text-[var(--accent)]">{state.fieldErrors.coverImage[0]}</p>
              )}
              {coverPickerOpen && (
                <MediaPickerModal
                  onSelect={(result) => {
                    if (result) {
                      setCoverImage(result.url);
                      setCoverImageMediaId(result.mediaId);
                      setCoverAlt(result.alt ?? "");
                    }
                    setCoverPickerOpen(false);
                  }}
                  onClose={() => setCoverPickerOpen(false)}
                />
              )}
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-[var(--text)]">
                เนื้อหา <SectionGuide text="Rich Text Editor for typing content. Insert images, code, tables here." />
              </span>
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

            <div className="flex items-center gap-4">
              <Button type="submit" disabled={isPending} className="self-start">
                {isPending ? "กำลังบันทึก..." : submitLabel}
              </Button>
              {defaultValues?.updatedAt && (
                <span className="text-xs text-[var(--text-muted)]">
                  แก้ไขล่าสุด: {formatICTDateTime(defaultValues.updatedAt)}
                </span>
              )}
            </div>
          </div>

          <div className="mt-8 lg:mt-0">
            <div className="lg:sticky lg:top-24 space-y-6 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5">
              <ArticleFormSidebar
                categories={categories}
                tags={tags}
                entities={entities}
                users={users}
                fieldErrors={state.fieldErrors}
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
    </TooltipProvider>
  );
}
