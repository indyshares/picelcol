"use client";

import { useActionState } from "react";
import { addCommentAction, type CommentFormState } from "@/features/comment/actions";
import { Button } from "@/components/ui/button";

export function CommentForm({ articleId, articleSlug }: { articleId: string; articleSlug: string }) {
  const boundAction = addCommentAction.bind(null, articleId, articleSlug);
  const [state, formAction, isPending] = useActionState<CommentFormState, FormData>(
    boundAction,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-2">
      {state.error && <p className="text-sm text-[var(--accent)]">{state.error}</p>}
      <textarea
        name="content"
        rows={3}
        required
        placeholder="แสดงความคิดเห็น..."
        className="clay-input rounded-2xl px-3 py-2 text-[var(--text)] placeholder:text-[var(--text-muted)]"
      />
      <Button type="submit" disabled={isPending} size="sm" className="self-start">
        {isPending ? "กำลังส่ง..." : "ส่งความคิดเห็น"}
      </Button>
    </form>
  );
}
