import { listCommentsForArticle } from "@/services/comment.service";
import { getCurrentAuthUser } from "@/features/auth/get-current-user";
import { deleteCommentAction } from "@/features/comment/actions";

type CommentListProps = {
  articleId: string;
  articleSlug: string;
};

export async function CommentList({ articleId, articleSlug }: CommentListProps) {
  const [comments, authUser] = await Promise.all([
    listCommentsForArticle(articleId),
    getCurrentAuthUser(),
  ]);

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
              {authUser?.id === comment.userId && (
                <form
                  action={async () => {
                    "use server";
                    await deleteCommentAction(comment.id, articleSlug);
                  }}
                >
                  <button type="submit" className="text-xs font-medium text-[var(--accent)]">
                    ลบ
                  </button>
                </form>
              )}
            </div>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-[var(--text)]">{comment.content}</p>
        </li>
      ))}
    </ul>
  );
}
