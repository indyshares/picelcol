"use client";

"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getCommentsData } from "@/features/comment/actions";
import { CommentForm } from "./comment-form";
import { CommentList } from "./comment-list";

type CommentSectionProps = {
  articleId: string;
  articleSlug: string;
};

export function CommentSection({ articleId, articleSlug }: CommentSectionProps) {
  const [data, setData] = useState<{ comments: Awaited<ReturnType<typeof getCommentsData>>["comments"]; currentUserId: string | null } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCommentsData(articleId).then((result) => {
      setData(result);
      setLoading(false);
    });
  }, [articleId]);

  return (
    <section className="mt-10 border-t border-[var(--border)] pt-8">
      <h2 className="mb-4 font-[var(--font-heading)] text-xl font-semibold text-[var(--text)]">
        ความคิดเห็น
      </h2>
      <div className="mb-6">
        <CommentForm articleId={articleId} articleSlug={articleSlug} />
      </div>
      {loading ? (
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <Loader2 className="h-4 w-4 animate-spin" />
          กำลังโหลดความคิดเห็น...
        </div>
      ) : data ? (
        <CommentList
          articleSlug={articleSlug}
          comments={data.comments}
          currentUserId={data.currentUserId}
        />
      ) : null}
    </section>
  );
}
