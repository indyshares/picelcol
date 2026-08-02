"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function PermissionToast() {
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("denied") === "1") {
      toast.error("You do not have permission to access this page.");
    }
  }, [params]);

  return null;
}
