"use client";

import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function SectionGuide({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-block align-middle cursor-help">
          <Info className="h-4 w-4 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors" />
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" align="center" className="max-w-[260px]">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}
