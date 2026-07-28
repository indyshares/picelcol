"use client";

import { useState, useTransition } from "react";
import { Bookmark } from "lucide-react";
import { toggleBookmarkAction } from "@/features/engagement/actions";
import { cn } from "@/lib/utils";

type BookmarkButtonProps = {
  articleId: string;
  articleSlug: string;
  initialBookmarked: boolean;
};

export function BookmarkButton({ articleId, articleSlug, initialBookmarked }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    const next = !bookmarked;
    setBookmarked(next);
    setError(null);

    startTransition(async () => {
      const result = await toggleBookmarkAction(articleId, articleSlug);
      if ("error" in result) {
        setBookmarked(!next);
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={cn(
          "flex items-center gap-2 rounded-[var(--radius-btn)] border px-4 py-2 text-sm font-medium transition",
          bookmarked
            ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--text)]"
            : "border-[var(--border)] text-[var(--text)] hover:border-[var(--primary)]",
        )}
      >
        <Bookmark className="h-4 w-4" fill={bookmarked ? "currentColor" : "none"} />
        <span>{bookmarked ? "บันทึกแล้ว" : "บันทึก"}</span>
      </button>
      {error && <p className="text-xs text-[var(--accent)]">{error}</p>}
    </div>
  );
}
