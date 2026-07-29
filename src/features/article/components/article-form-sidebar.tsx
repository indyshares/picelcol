"use client";

import { useState } from "react";
import { createCategoryAction, findOrCreateEntityAction } from "@/features/article/actions";
import { SectionGuide } from "@/components/section-guide";
import { TooltipProvider } from "@/components/ui/tooltip";

type Category = { id: string; name: string };
type Tag = { id: string; name: string };
type Entity = { id: string; name: string; type: string };
type UserOption = { id: string; email: string; displayName: string | null; role: string };

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
};

function Badge({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/15 px-2.5 py-0.5 text-xs font-medium text-[var(--text)]">
      {label}
      <button type="button" onClick={onRemove} className="hover:text-[var(--accent)]">&times;</button>
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

export function ArticleFormSidebar({
  categories,
  tags: allTags,
  entities: _entities,
  users,
  fieldErrors,
  defaultValues,
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
        {/* Author */}
        <section>
          <SectionTitle label="ผู้เขียน" guide="Select an author with the role of Admin or Writer." />
          <select
            name="authorId"
            defaultValue={defaultValues ? undefined : ""}
            className="w-full rounded-[var(--radius-input)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]"
          >
            <option value="" disabled>เลือกผู้เขียน</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.displayName ? `${u.displayName} (${u.role})` : `${u.email} (${u.role})`}
              </option>
            ))}
          </select>
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
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    selected
                      ? "border-[var(--primary)] bg-[var(--primary)]/15 text-[var(--text)]"
                      : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-light)] hover:border-[var(--primary)]"
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
                className="flex-1 rounded-[var(--radius-input)] border border-[var(--border)] bg-[var(--background)] px-2.5 py-1.5 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)] disabled:opacity-40"
              />
              <button
                type="button"
                onClick={handleCreateCategory}
                disabled={creatingCategory || !categoryInput.trim()}
                className="rounded-[var(--radius-btn)] bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-40"
              >
                {creatingCategory ? "..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => { setShowCategoryInput(false); setCategoryInput(""); }}
                className="rounded-[var(--radius-btn)] border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text)] hover:bg-[var(--hover-bg)]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowCategoryInput(true)}
              className="mt-1 text-xs font-medium text-[var(--accent)] hover:underline"
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
              className="rounded-[var(--radius-btn)] bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-40"
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
              className="rounded-[var(--radius-btn)] bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-40"
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
              className="rounded-[var(--radius-btn)] bg-[var(--accent)] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[var(--accent-hover)] disabled:opacity-40"
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
      </aside>
    </TooltipProvider>
  );
}
