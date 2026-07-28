"use client";

import { useState, useEffect } from "react";
import { Eye, Bookmark, Loader2 } from "lucide-react";
import { getEngagementData } from "@/features/engagement/actions";
import { LikeButton } from "./like-button";
import { BookmarkButton } from "./bookmark-button";
import { ViewTracker } from "./view-tracker";

type EngagementBarProps = {
  slug: string;
  articleId: string;
};

export function EngagementBar({ slug, articleId }: EngagementBarProps) {
  const [data, setData] = useState<{
    likeCount: number;
    bookmarkCount: number;
    viewCount: number;
    liked: boolean;
    bookmarked: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEngagementData(slug).then((result) => {
      if (result) {
        setData({
          likeCount: result.likeCount,
          bookmarkCount: result.bookmarkCount,
          viewCount: result.viewCount,
          liked: result.liked,
          bookmarked: result.bookmarked,
        });
      }
      setLoading(false);
    });
  }, [slug]);

  return (
    <>
      <ViewTracker articleId={articleId} />
      <div className="mt-10 flex items-center gap-3 border-t border-[var(--border)] pt-6">
        {loading ? (
          <>
            <div className="flex items-center gap-2 rounded-[var(--radius-btn)] border border-[var(--border)] px-4 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-[var(--text-muted)]" />
            </div>
            <div className="flex items-center gap-2 rounded-[var(--radius-btn)] border border-[var(--border)] px-4 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-[var(--text-muted)]" />
            </div>
            <span className="text-sm text-[var(--text-muted)]">
              <Loader2 className="mr-1 inline h-3 w-3 animate-spin" />
              กำลังโหลด...
            </span>
          </>
        ) : data ? (
          <>
            <LikeButton
              articleId={articleId}
              articleSlug={slug}
              initialLiked={data.liked}
              initialCount={data.likeCount}
            />
            <BookmarkButton
              articleId={articleId}
              articleSlug={slug}
              initialBookmarked={data.bookmarked}
            />
            <span className="flex items-center gap-1 text-sm text-[var(--text-muted)]">
              <Bookmark className="h-3.5 w-3.5" />
              {data.bookmarkCount.toLocaleString("th-TH")}
            </span>
            <span className="ml-auto flex items-center gap-1 text-sm text-[var(--text-muted)]">
              <Eye className="h-4 w-4" />
              {data.viewCount.toLocaleString("th-TH")} ครั้ง
            </span>
          </>
        ) : null}
      </div>
    </>
  );
}
