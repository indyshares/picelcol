"use client";

import { useState } from "react";

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

export function ArticleFormSidebar({
  categories,
  tags: allTags,
  entities,
  users,
  fieldErrors,
  defaultValues,
}: ArticleFormSidebarProps) {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(defaultValues?.categoryIds ?? []);
  const [tagInput, setTagInput] = useState("");
  const [tagNames, setTagNames] = useState<string[]>(defaultValues?.tagNames ?? []);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>(defaultValues?.keywords ?? []);
  const [selectedEntityIds, setSelectedEntityIds] = useState<string[]>(defaultValues?.entityIds ?? []);

  const availableTags = allTags.filter((t) => !tagNames.includes(t.name));

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

  function toggleEntity(id: string) {
    setSelectedEntityIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  return (
    <aside className="space-y-6">
      {/* Author */}
      <section>
        <h3 className="mb-2 text-sm font-semibold text-[var(--text)]">ผู้เขียน</h3>
        <select
          name="authorId"
          defaultValue={defaultValues ? undefined : ""}
          className="w-full rounded-[var(--radius-input)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-[var(--primary)]"
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
        <h3 className="mb-2 text-sm font-semibold text-[var(--text)]">
          หมวดหมู่ <span className="text-[var(--text-muted)] font-normal">(เลือก 1-2)</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
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
        {fieldErrors?.categoryIds && (
          <p className="mt-1 text-sm text-[var(--accent)]">{fieldErrors.categoryIds[0]}</p>
        )}
      </section>

      {/* Tags */}
      <section>
        <h3 className="mb-2 text-sm font-semibold text-[var(--text)]">
          แท็ก <span className="text-[var(--text-muted)] font-normal">(สูงสุด 5)</span>
        </h3>
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
                e.preventDefault();
                addTag(tagInput);
              }
            }}
            placeholder="พิมพ์แล้วกด Enter"
            disabled={tagNames.length >= 5}
            className="flex-1 rounded-[var(--radius-input)] border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)] disabled:opacity-40"
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
        <h3 className="mb-2 text-sm font-semibold text-[var(--text)]">
          คีย์เวิร์ด SEO <span className="text-[var(--text-muted)] font-normal">(สูงสุด 5)</span>
        </h3>
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
                e.preventDefault();
                addKeyword();
              }
            }}
            placeholder="พิมพ์แล้วกด Enter"
            disabled={keywords.length >= 5}
            className="flex-1 rounded-[var(--radius-input)] border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)] disabled:opacity-40"
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
        <h3 className="mb-2 text-sm font-semibold text-[var(--text)]">
          เอนทิตี <span className="text-[var(--text-muted)] font-normal">(สูงสุด 4, Knowledge Graph)</span>
        </h3>
        <div className="flex flex-wrap gap-2">
          {entities.map((e) => {
            const selected = selectedEntityIds.includes(e.id);
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => toggleEntity(e.id)}
                disabled={!selected && selectedEntityIds.length >= 4}
                className={`rounded-full border px-2.5 py-1 text-xs font-medium transition disabled:opacity-30 ${
                  selected
                    ? "border-[var(--primary)] bg-[var(--primary)]/15 text-[var(--text)]"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-light)] hover:border-[var(--primary)]"
                }`}
              >
                {e.name}
                <span className="ml-1 text-[10px] text-[var(--text-muted)]">{e.type}</span>
              </button>
            );
          })}
        </div>
        {selectedEntityIds.map((id) => (
          <input key={id} type="hidden" name="entityIds" value={id} />
        ))}
        {fieldErrors?.entityIds && (
          <p className="mt-1 text-sm text-[var(--accent)]">{fieldErrors.entityIds[0]}</p>
        )}
      </section>
    </aside>
  );
}
