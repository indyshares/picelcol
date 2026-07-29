"use client";

import { useEffect, useActionState, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import type { ArticleFormState } from "@/features/article/actions";
import { slugify } from "@/utils/slugify";
import { siteConfig } from "@/constants/site";
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
};

export function ArticleForm({
  action,
  categories,
  tags,
  entities,
  users,
  defaultValues,
}: ArticleFormProps) {
  const [state, formAction, isPending] = useActionState<ArticleFormState, FormData>(action, {});
  const formRef = useRef<HTMLFormElement>(null);
  const publishedRef = useRef<HTMLInputElement>(null);
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

  function handleSubmit(published: boolean) {
    if (publishedRef.current) {
      publishedRef.current.value = published ? "on" : "";
    }
    formRef.current?.requestSubmit();
  }

  return (
    <TooltipProvider delayDuration={300}>
      <form ref={formRef} action={formAction}>
        {defaultValues?.articleId && (
          <input type="hidden" name="articleId" value={defaultValues.articleId} />
        )}
        <input ref={publishedRef} type="hidden" name="published" defaultValue={defaultValues?.published ? "on" : ""} />

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
              <div className="flex items-center rounded-[var(--radius-input)] border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--text-muted)]">
                <span className="whitespace-nowrap shrink-0">{siteConfig.url}/article/</span>
                <input
                  id="slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(slugify(e.target.value));
                  }}
                  className="bg-transparent text-[var(--text)] flex-1 py-2 pl-1 outline-none"
                  required
                />
              </div>
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
                coverImage={coverImage}
                coverImageMediaId={coverImageMediaId}
                coverAlt={coverAlt}
                onOpenCoverPicker={() => setCoverPickerOpen(true)}
                onRemoveCover={() => { setCoverImage(""); setCoverImageMediaId(""); }}
                onCoverAltChange={setCoverAlt}
                onCoverSelect={(url, mediaId, alt) => {
                  setCoverImage(url);
                  setCoverImageMediaId(mediaId);
                  setCoverAlt(alt ?? "");
                }}
                isPending={isPending}
                published={defaultValues?.published ?? false}
                updatedAt={defaultValues?.updatedAt}
                onPublish={() => handleSubmit(true)}
                onSaveDraft={() => handleSubmit(false)}
              />
            </div>
          </div>
        </div>

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
      </form>
    </TooltipProvider>
  );
}
