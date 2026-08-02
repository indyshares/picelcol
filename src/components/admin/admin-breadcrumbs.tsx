"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const SEGMENT_LABELS: Record<string, string> = {
  admin: "Dashboard",
  articles: "Articles",
  users: "Users",
  new: "New",
  edit: "Edit",
};

function isDynamicSegment(segment: string) {
  return segment === "[id]" || /^[a-z0-9]{15,}$/.test(segment);
}

function humanize(segment: string) {
  return segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
}

export function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs: { label: string; href: string }[] = [];
  let acc = "";
  for (const segment of segments) {
    if (isDynamicSegment(segment)) continue;
    acc += `/${segment}`;
    crumbs.push({ label: SEGMENT_LABELS[segment] ?? humanize(segment), href: acc });
  }

  if (crumbs.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="clay-card inline-flex items-center rounded-full px-4 py-2 text-xs font-medium"
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={crumb.href} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-[var(--text-muted)]" />}
              {isLast ? (
                <span
                  aria-current="page"
                  className="inline-flex font-semibold text-[var(--text)]"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href as Route}
                  className="clay-bounce inline-flex rounded-full bg-[var(--primary)]/15 px-2.5 py-1 text-[var(--text)] motion-reduce:transition-none hover:bg-[var(--primary)]/25"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
