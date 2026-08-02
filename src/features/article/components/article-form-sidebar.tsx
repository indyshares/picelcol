"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, ChevronDown } from "lucide-react";
import { createCategoryAction, findOrCreateEntityAction, updateMediaAltAction } from "@/features/article/actions";
import { SectionGuide } from "@/components/section-guide";
import { TooltipProvider } from "@/components/ui/tooltip";
import { formatICTDateTime } from "@/utils/date";

type Category = { id: string; name: string };
type Tag = { id: string; name: string };
type Entity = { id: string; name: string; type: string };
type UserOption = { id: string; email: string; displayName: string | null; avatarUrl: string | null; role: string };

type ArticleFormSidebarProps = {
  categories: Category[];
  tags: Tag[];
  entities: Entity[];
  users: UserOption[];
  fieldErrors?: Record<string, string[]>;
  defaultValues?: {
    categoryIds?: string[];
    tagNames?: string[];
    keywords?: string[];
    entityIds?: string[];
  };
  coverImage: string;
  coverImageMediaId: string;
  coverAlt: string;
  onOpenCoverPicker: () => void;
  onRemoveCover: () => void;
  onCoverAltChange: (alt: string) => void;
  onCoverSelect: (url: string, mediaId: string, alt: string | null) => void;
  isPending: boolean;
  published: boolean;
  updatedAt?: string;
  onPublish: () => void;
  onSaveDraft: () => void;
};

function Badge({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="clay-badge inline-flex items-center gap-1 bg-[var(--primary)]/20 px-2.5 py-0.5 text-xs font-medium text-[var(--text)]">
      {label}
      <button type="button" onClick={onRemove} className="clay-bounce motion-reduce:transition-none hover:text-[var(--accent)]">&times;</button>
    </span>
  );
}

function SectionTitle({ label, guide }: { label: string; guide: string }) {
  return (
    <h3 className="mb-2 text-sm font-semibold text-[var(--text)]">
      {label} <SectionGuide text={guide} />
    </h3>
  );
}

function userDisplayName(user: UserOption) {
  return user.displayName ?? user.email.split("@")[0] ?? "ผู้เขียน";
}

function ClayAvatar({ user, size }: { user: UserOption; size: string }) {
  const name = userDisplayName(user);
  return (
    <span
      className={`clay-card inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ${size}`}
    >
      {user.avatarUrl ? (
        <span className="relative h-full w-full">
          <Image src={user.avatarUrl} alt={name} fill className="object-cover" unoptimized />
        </span>
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-xs font-bold text-[var(--accent-contrast)]">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </span>
  );
}

function AuthorSelect({ users }: { users: UserOption[] }) {
  const [authorId, setAuthorId] = useState("");
  const [open, setOpen] = useState(false);
  const selected = users.find((u) => u.id === authorId) ?? null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="clay-card clay-bounce flex w-full items-center gap-2.5 rounded-2xl p-2.5 text-left text-sm text-[var(--text)] motion-reduce:transition-none"
      >
        {selected ? (
          <>
            <ClayAvatar user={selected} size="h-7 w-7" />
            <span className="min-w-0 flex-1 truncate font-medium">{userDisplayName(selected)}</span>
          </>
        ) : (
          <span className="flex-1 text-[var(--text-muted)]">เลือกผู้เขียน</span>
        )}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        />
      </button>
      <input type="hidden" name="authorId" value={authorId} />
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div
            role="listbox"
            className="clay-card absolute left-0 right-0 top-full z-40 mt-2 rounded-2xl p-2 shadow-xl backdrop-blur-md"
          >
            {users.length === 0 ? (
              <p className="px-3 py-2 text-sm text-[var(--text-muted)]">ไม่มีผู้เขียนที่ใช้งานได้</p>
            ) : (
              users.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  role="option"
                  aria-selected={u.id === authorId}
                  onClick={() => {
                    setAuthorId(u.id);
                    setOpen(false);
                  }}
                  className="clay-bounce flex w-full items-center gap-2.5 rounded-xl px-2 py-1.5 text-left text-sm text-[var(--text)] transition-colors motion-reduce:transition-none hover:bg-[var(--clay-bg-soft)]"
                >
                  <ClayAvatar user={u} size="h-7 w-7" />
                  <span className="min-w-0 flex-1 truncate">{userDisplayName(u)}</span>
                  {u.id === authorId && <Check className="h-4 w-4 shrink-0 text-[var(--accent)]" />}
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function ArticleFormSidebar({
  categories,
  tags: allTags,
  entities: _entities,
  users,
  fieldErrors,
  defaultValues,
  coverImage,
  coverImageMediaId,
  coverAlt,
  onOpenCoverPicker,
  onRemoveCover,
  onCoverAltChange,
  isPending,
  published,
  updatedAt,
  onPublish,
  onSaveDraft,
}: ArticleFormSidebarProps) {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(defaultValues?.categoryIds ?? []);
  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [categoryInput, setCategoryInput] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tagNames, setTagNames] = useState<string[]>(defaultValues?.tagNames ?? []);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>(defaultValues?.keywords ?? []);
  const [selectedEntityIds, setSelectedEntityIds] = useState<string[]>(defaultValues?.entityIds ?? []);
  const [entityInput, setEntityInput] = useState("");
  const [creatingEntity, setCreatingEntity] = useState(false);
  const [entityNames, setEntityNames] = useState<string[]>(() => {
    const ids = defaultValues?.entityIds ?? [];
    if (ids.length === 0) return [];
    return _entities.filter((e) => ids.includes(e.id)).map((e) => e.name);
  });

  const availableTags = allTags.filter((t) => !tagNames.includes(t.name));

  const allCategoryOptions = Array.from(
    new Map([...categories, ...localCategories].map((c) => [c.id, c])).values(),
  );

  function addTag(name: string) {
    const n = name.trim();
    if (n && !tagNames.includes(n) && tagNames.length < 5) {
      setTagNames([...tagNames, n]);
    }
    setTagInput("");
  }

  function addKeyword() {
    const k = keywordInput.trim();
    if (k && !keywords.includes(k) && keywords.length < 5) {
      setKeywords([...keywords, k]);
    }
    setKeywordInput("");
  }

  function toggleCategory(id: string) {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function handleCreateCategory() {
    const name = categoryInput.trim();
    if (!name || selectedCategoryIds.length >= 2) return;
    setCreatingCategory(true);
    const result = await createCategoryAction(name);
    setCreatingCategory(false);
    if ("error" in result) return;
    setLocalCategories((prev) => [...prev, { id: result.id, name: result.name }]);
    setSelectedCategoryIds((prev) => [...prev, result.id]);
    setCategoryInput("");
    setShowCategoryInput(false);
  }

  async function handleAddEntity(name: string) {
    const trimmed = name.trim();
    if (!trimmed || selectedEntityIds.length >= 4) return;
    if (entityNames.includes(trimmed)) {
      setEntityInput("");
      return;
    }
    setCreatingEntity(true);
    const result = await findOrCreateEntityAction(trimmed);
    setCreatingEntity(false);
    if ("error" in result) return;
    setSelectedEntityIds((prev) => [...prev, result.id]);
    setEntityNames((prev) => [...prev, result.name]);
    setEntityInput("");
  }

  function removeEntity(name: string) {
    const idx = entityNames.indexOf(name);
    if (idx === -1) return;
    setEntityNames((prev) => prev.filter((_, i) => i !== idx));
    setSelectedEntityIds((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <TooltipProvider delayDuration={300}>
      <aside className="space-y-6">
        {/* Cover Image */}
        <section>
          <SectionTitle label="Cover Image" guide="Select an image to display as the article cover image." />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenCoverPicker}
              className="clay-button clay-bounce bg-[var(--clay-bg-soft)] px-3 py-2 text-sm text-[var(--text)] motion-reduce:transition-none"
            >
              {coverImage ? "เปลี่ยนรูปภาพ" : "เลือกรูปภาพ"}
            </button>
            {coverImage && (
              <button
                type="button"
                onClick={onRemoveCover}
                className="text-sm text-[var(--accent)] motion-reduce:transition-none"
              >
                ลบ
              </button>
            )}
          </div>
          <input type="hidden" name="coverImage" value={coverImage} />
          <input type="hidden" name="coverImageMediaId" value={coverImageMediaId} />
          {coverImage && (
            <>
              <div className="clay-well relative mt-2 p-1.5">
                <div className="relative h-32 w-full overflow-hidden rounded-xl">
                  <Image
                    src={coverImage}
                    alt={coverAlt || "Cover preview"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
              <input
                value={coverAlt}
                onChange={(e) => onCoverAltChange(e.target.value)}
                onBlur={() => {
                  if (coverImageMediaId) {
                    updateMediaAltAction(coverImageMediaId, coverAlt);
                  }
                }}
                placeholder="Alt Text สำหรับรูปภาพปก"
                maxLength={300}
                className="clay-input mt-2 w-full rounded-xl bg-[var(--clay-bg)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)]"
              />
            </>
          )}
          {fieldErrors?.coverImage && (
            <p className="text-sm text-[var(--accent)]">{fieldErrors.coverImage[0]}</p>
          )}
        </section>

        {/* Author */}
        <section>
          <SectionTitle label="ผู้เขียน" guide="Select an author with the role of Writer." />
          <AuthorSelect users={users} />
          {fieldErrors?.authorId && (
            <p className="mt-1 text-sm text-[var(--accent)]">{fieldErrors.authorId[0]}</p>
          )}
        </section>

        {/* Categories */}
        <section>
          <SectionTitle label="หมวดหมู่" guide="Select the main category of the article (1-2 categories)." />
          <div className="flex flex-wrap gap-2 mb-2">
            {allCategoryOptions.map((c) => {
              const selected = selectedCategoryIds.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleCategory(c.id)}
                  className={`clay-badge clay-bounce px-3 py-1 text-xs font-medium motion-reduce:transition-none ${
                    selected
                      ? "bg-[var(--primary)]/20 text-[var(--text)]"
                      : "bg-[var(--clay-bg-soft)] text-[var(--text-light)]"
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
          {selectedCategoryIds.map((id) => (
            <input key={id} type="hidden" name="categoryIds" value={id} />
          ))}
          {showCategoryInput ? (
            <div className="flex gap-1 mt-1">
              <input
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (e.nativeEvent.isComposing) return;
                    e.preventDefault();
                    handleCreateCategory();
                  }
                }}
                placeholder="พิมพ์ชื่อหมวดหมู่ใหม่"
                disabled={creatingCategory}
                className="clay-input flex-1 rounded-xl bg-[var(--clay-bg)] px-2.5 py-1.5 text-xs text-[var(--text)] outline-none disabled:opacity-40"
              />
              <button
                type="button"
                onClick={handleCreateCategory}
                disabled={creatingCategory || !categoryInput.trim()}
                className="clay-button clay-bounce bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-[var(--accent-contrast)] motion-reduce:transition-none disabled:opacity-40"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => { setShowCategoryInput(false); setCategoryInput(""); }}
                className="clay-button clay-bounce bg-[var(--clay-bg-soft)] px-3 py-1.5 text-xs font-medium text-[var(--text)] motion-reduce:transition-none"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowCategoryInput(true)}
              className="clay-bounce mt-1 text-xs font-medium text-[var(--accent)] motion-reduce:transition-none hover:underline"
            >
              + Add New Category
            </button>
          )}
          {fieldErrors?.categoryIds && (
            <p className="mt-1 text-sm text-[var(--accent)]">{fieldErrors.categoryIds[0]}</p>
          )}
        </section>

        {/* Tags */}
        <section>
          <SectionTitle label="แท็ก" guide="Type keywords to group sub-articles and press Enter to add." />
          <span className="mb-2 block text-[10px] text-[var(--text-muted)]">สูงสุด 5</span>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tagNames.map((t) => (
              <Badge key={t} label={t} onRemove={() => setTagNames(tagNames.filter((x) => x !== t))} />
            ))}
          </div>
          <div className="flex gap-1">
            <input
              list="tag-suggestions"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (e.nativeEvent.isComposing) return;
                  e.preventDefault();
                  addTag(tagInput);
                }
              }}
              placeholder="พิมพ์แล้วกด Enter"
              disabled={tagNames.length >= 5}
              className="flex-1 rounded-[var(--radius-input)] border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)] disabled:opacity-40"
            />
            <button
              type="button"
              onClick={() => addTag(tagInput)}
              disabled={tagNames.length >= 5 || !tagInput.trim()}
                className="clay-bounce rounded-[var(--radius-btn)] bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-[var(--accent-contrast)] motion-reduce:transition-none hover:bg-[var(--accent-hover)] disabled:opacity-40"
            >
              +
            </button>
          </div>
          <datalist id="tag-suggestions">
            {availableTags.map((t) => (
              <option key={t.id} value={t.name} />
            ))}
          </datalist>
          {tagNames.map((t) => (
            <input key={t} type="hidden" name="tagNames" value={t} />
          ))}
          {fieldErrors?.tagNames && (
            <p className="mt-1 text-sm text-[var(--accent)]">{fieldErrors.tagNames[0]}</p>
          )}
        </section>

        {/* Keywords */}
        <section>
          <SectionTitle label="คีย์เวิร์ด SEO" guide="Enter important keywords for SEO to help rank higher on search engines." />
          <span className="mb-2 block text-[10px] text-[var(--text-muted)]">สูงสุด 5</span>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {keywords.map((k) => (
              <Badge key={k} label={k} onRemove={() => setKeywords(keywords.filter((x) => x !== k))} />
            ))}
          </div>
          <div className="flex gap-1">
            <input
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (e.nativeEvent.isComposing) return;
                  e.preventDefault();
                  addKeyword();
                }
              }}
              placeholder="พิมพ์แล้วกด Enter"
              disabled={keywords.length >= 5}
              className="flex-1 rounded-[var(--radius-input)] border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)] disabled:opacity-40"
            />
            <button
              type="button"
              onClick={addKeyword}
              disabled={keywords.length >= 5 || !keywordInput.trim()}
                className="clay-bounce rounded-[var(--radius-btn)] bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-[var(--accent-contrast)] motion-reduce:transition-none hover:bg-[var(--accent-hover)] disabled:opacity-40"
            >
              +
            </button>
          </div>
          {keywords.map((k) => (
            <input key={k} type="hidden" name="keywords" value={k} />
          ))}
          {fieldErrors?.keywords && (
            <p className="mt-1 text-sm text-[var(--accent)]">{fieldErrors.keywords[0]}</p>
          )}
        </section>

        {/* Entities */}
        <section>
          <SectionTitle label="เอนทิตี" guide="Enter important elements, people, or things (Knowledge Graph) and press Enter to add." />
          <span className="mb-2 block text-[10px] text-[var(--text-muted)]">สูงสุด 4</span>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {entityNames.map((n) => (
              <Badge key={n} label={n} onRemove={() => removeEntity(n)} />
            ))}
          </div>
          <div className="flex gap-1">
            <input
              value={entityInput}
              onChange={(e) => setEntityInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (e.nativeEvent.isComposing) return;
                  e.preventDefault();
                  handleAddEntity(entityInput);
                }
              }}
              placeholder="พิมพ์แล้วกด Enter"
              disabled={creatingEntity || selectedEntityIds.length >= 4}
              className="flex-1 rounded-[var(--radius-input)] border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)] disabled:opacity-40"
            />
            <button
              type="button"
              onClick={() => handleAddEntity(entityInput)}
              disabled={creatingEntity || selectedEntityIds.length >= 4 || !entityInput.trim()}
                className="clay-bounce rounded-[var(--radius-btn)] bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-[var(--accent-contrast)] motion-reduce:transition-none hover:bg-[var(--accent-hover)] disabled:opacity-40"
            >
              {creatingEntity ? "..." : "+"}
            </button>
          </div>
          {selectedEntityIds.map((id) => (
            <input key={id} type="hidden" name="entityIds" value={id} />
          ))}
          {fieldErrors?.entityIds && (
            <p className="mt-1 text-sm text-[var(--accent)]">{fieldErrors.entityIds[0]}</p>
          )}
        </section>

        {/* Status */}
        <section className="border-t border-[var(--border)] pt-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[var(--text-muted)]">Status</span>
            <span
              className={`clay-badge inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${
                published
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              }`}
            >
              {published ? "Published" : "Draft"}
            </span>
          </div>
        </section>

        {/* Publish */}
        <section>
          <button
            type="button"
            onClick={onPublish}
            disabled={isPending}
            className="clay-button clay-bounce w-full bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--accent-contrast)] motion-reduce:transition-none disabled:opacity-50"
          >
            {isPending ? "กำลังบันทึก..." : "Publish"}
          </button>
        </section>

        {/* Save Draft */}
        <section>
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isPending}
            className="clay-button clay-bounce w-full bg-[var(--clay-bg-soft)] px-4 py-2.5 text-sm font-medium text-[var(--text)] motion-reduce:transition-none disabled:opacity-50"
          >
            {isPending ? "กำลังบันทึก..." : "Save as Draft"}
          </button>
        </section>

        {/* Last Updated */}
        {updatedAt && (
          <section>
            <p className="text-xs text-[var(--text-muted)] border-t border-[var(--border)] pt-4">
              แก้ไขล่าสุด: {formatICTDateTime(updatedAt)}
            </p>
          </section>
        )}
      </aside>
    </TooltipProvider>
  );
}
