"use client";

import { useEffect, useRef } from "react";
import { recordViewAction } from "@/features/engagement/actions";

export function ViewTracker({ articleId }: { articleId: string }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    void recordViewAction(articleId);
  }, [articleId]);

  return null;
}
