"use client";

import { LayoutGrid, List, Newspaper, Table } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type ViewMode = "grid" | "list" | "table" | "feed";

const VIEWS: { value: ViewMode; label: string; icon: typeof LayoutGrid }[] = [
  { value: "grid", label: "Grid Card", icon: LayoutGrid },
  { value: "list", label: "Slim List", icon: List },
  { value: "table", label: "Table", icon: Table },
  { value: "feed", label: "Feed", icon: Newspaper },
];

export function ViewSwitcher({
  viewMode,
  onChange,
}: {
  viewMode: ViewMode;
  onChange: (value: ViewMode) => void;
}) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="clay-card inline-flex items-center gap-1 rounded-full p-1">
        {VIEWS.map(({ value, label, icon: Icon }) => {
          const active = viewMode === value;
          return (
            <Tooltip key={value}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => onChange(value)}
                  aria-pressed={active}
                  className={
                    active
                      ? "clay-button clay-bounce flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800 motion-reduce:transition-none dark:bg-amber-950 dark:text-amber-300"
                      : "clay-bounce flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-light)] motion-reduce:transition-none hover:bg-[var(--clay-bg-soft)] hover:text-[var(--text)]"
                  }
                >
                  <Icon className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
