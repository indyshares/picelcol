"use client";

import { useActionState } from "react";
import { addCommentAction, type CommentFormState } from "@/features/comment/actions";
import { Button } from "@/components/ui/button";

export function CommentForm({ articleId }: { articleId: string }) {
  const boundAction = addCommentAction.bind(null, articleId);
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
        className="rounded-[var(--radius-input)] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[var(--text)] outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/30"
      />
      <Button type="submit" disabled={isPending} size="sm" className="self-start">
        {isPending ? "กำลังส่ง..." : "ส่งความคิดเห็น"}
      </Button>
    </form>
  );
}
