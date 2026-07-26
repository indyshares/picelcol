"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleLikeAction } from "@/features/engagement/actions";
import { cn } from "@/lib/utils";

type LikeButtonProps = {
  articleId: string;
  initialLiked: boolean;
  initialCount: number;
};

export function LikeButton({ articleId, initialLiked, initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    // optimistic update
    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((c) => c + (nextLiked ? 1 : -1));
    setError(null);

    startTransition(async () => {
      const result = await toggleLikeAction(articleId);
      if ("error" in result) {
        // revert on failure (e.g. not logged in)
        setLiked(!nextLiked);
        setCount((c) => c + (nextLiked ? -1 : 1));
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
          liked
            ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
            : "border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)]",
        )}
      >
        <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
        <span>{count}</span>
      </button>
      {error && <p className="text-xs text-[var(--accent)]">{error}</p>}
    </div>
  );
}
