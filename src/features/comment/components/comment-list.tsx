"use client";

import { useTransition } from "react";
import { deleteCommentAction } from "@/features/comment/actions";

type CommentListProps = {
  articleSlug: string;
  comments: {
    id: string;
    content: string;
    createdAt: Date;
    userId: string;
    user: { id: string; profile: { displayName: string | null } | null };
  }[];
  currentUserId: string | null;
};

export function CommentList({ articleSlug, comments, currentUserId }: CommentListProps) {
  const [isPending, startTransition] = useTransition();

  if (comments.length === 0) {
    return <p className="text-sm text-[var(--text-light)]">ยังไม่มีความคิดเห็น เป็นคนแรกเลย!</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {comments.map((comment) => (
        <li
          key={comment.id}
          className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text)]">
              {comment.user.profile?.displayName ?? "ผู้ใช้"}
            </span>
            <div className="flex items-center gap-3">
              <time className="text-xs text-[var(--text-muted)]">
                {new Date(comment.createdAt).toLocaleDateString("th-TH", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              {currentUserId === comment.userId && (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    startTransition(async () => {
                      await deleteCommentAction(comment.id, articleSlug);
                    });
                  }}
                  className="text-xs font-medium text-[var(--accent)] disabled:opacity-50"
                >
                  {isPending ? "กำลังลบ..." : "ลบ"}
                </button>
              )}
            </div>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--text)]">{comment.content}</p>
        </li>
      ))}
    </ul>
  );
}
