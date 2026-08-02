"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoreVertical,
  Search,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { updateUserRole, type UserRoleName } from "@/features/admin/actions";
import type { AdminUser } from "@/services/user.service";

type Role = UserRoleName;

const ROLE_STYLES: Record<
  Role,
  { label: string; badge: string; dot: string; cardActive: string }
> = {
  admin: {
    label: "Admin",
    badge:
      "border-orange-300/60 bg-orange-100/80 text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/15 dark:text-orange-300",
    dot: "bg-orange-500",
    cardActive:
      "border-orange-300/70 bg-orange-50 shadow-orange-500/10 dark:border-orange-500/40 dark:bg-orange-500/15",
  },
  writer: {
    label: "Writer",
    badge:
      "border-amber-300/60 bg-amber-100/80 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300",
    dot: "bg-amber-500",
    cardActive:
      "border-amber-300/70 bg-amber-50 shadow-amber-500/10 dark:border-amber-500/40 dark:bg-amber-500/15",
  },
  user: {
    label: "User",
    badge:
      "border-sky-300/60 bg-sky-100/80 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/15 dark:text-sky-300",
    dot: "bg-sky-500",
    cardActive:
      "border-sky-300/70 bg-sky-50 shadow-sky-500/10 dark:border-sky-500/40 dark:bg-sky-500/15",
  },
};

const ROLE_ORDER: Role[] = ["admin", "writer", "user"];

const PER_PAGE_OPTIONS: { value: string; label: string }[] = [
  { value: "10", label: "10" },
  { value: "20", label: "20" },
  { value: "50", label: "50" },
  { value: "100", label: "100" },
  { value: "1000", label: "1,000" },
  { value: "all", label: "All" },
];

function ClayAvatar({ user }: { user: AdminUser }) {
  const name = user.displayName ?? "?";
  return (
    <span className="clay-card inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--clay-bg-soft)]">
      {user.avatarUrl ? (
        <span className="relative h-full w-full">
          <Image src={user.avatarUrl} alt={name} fill className="object-cover" unoptimized />
        </span>
      ) : (
        <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] text-sm font-bold text-[var(--accent-contrast)]">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </span>
  );
}

function RoleBadge({ role }: { role: Role }) {
  const cfg = ROLE_STYLES[role];
  return (
    <span
      className={`clay-badge inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cfg.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function ClaySelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="clay-card clay-bounce flex items-center gap-2 rounded-2xl px-3 py-2 text-sm text-[var(--text)] motion-reduce:transition-none"
      >
        <span className="text-[var(--text-light)]">{label}</span>
        <span className="font-medium">{selected?.label}</span>
        <ChevronDown
          className={`h-4 w-4 text-[var(--text-muted)] transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div
            role="listbox"
            className="clay-card absolute left-0 top-full z-40 mt-2 w-full min-w-40 rounded-2xl p-2 shadow-xl backdrop-blur-md"
          >
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={o.value === value}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                className="clay-bounce flex w-full items-center justify-between gap-2 rounded-xl px-3 py-1.5 text-left text-sm text-[var(--text)] transition-colors motion-reduce:transition-none hover:bg-[var(--clay-bg-soft)]"
              >
                {o.label}
                {o.value === value && <Check className="h-4 w-4 text-[var(--accent)]" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function AdminUsers({ users: initialUsers }: { users: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [perPage, setPerPage] = useState("10");
  const [page, setPage] = useState(1);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: users.length, admin: 0, writer: 0, user: 0 };
    for (const u of users) c[u.role] += 1;
    return c;
  }, [users]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((u) => {
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      const matchesQuery =
        q.length === 0 || (u.displayName ?? "").toLowerCase().includes(q);
      return matchesRole && matchesQuery;
    });
  }, [users, roleFilter, query]);

  const limit = perPage === "all" ? Infinity : Number(perPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * limit;
  const paginated = filtered.slice(start, start + limit);
  const end = filtered.length === 0 ? 0 : Math.min(start + limit, filtered.length);

  function setFilter(next: string, resetPage = true) {
    setRoleFilter(next);
    if (resetPage) setPage(1);
  }

  function handleRoleChange(user: AdminUser, newRole: Role) {
    if (newRole === user.role) return;
    setPendingId(user.id);
    startTransition(async () => {
      const result = await updateUserRole(user.id, newRole);
      setPendingId(null);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)),
      );
      toast.success(
        `The role of ${user.displayName ?? "user"} has been successfully updated`,
      );
    });
  }

  const overviewCards: {
    key: string;
    label: string;
    icon: React.ReactNode;
    count: number;
    activeClass: string;
  }[] = [
    {
      key: "all",
      label: "All Users",
      icon: <Users className="h-5 w-5" />,
      count: counts.all,
      activeClass:
        "border-[var(--primary)]/40 bg-[var(--primary)]/10 shadow-[var(--primary)]/10 dark:bg-[var(--primary)]/15",
    },
    ...ROLE_ORDER.map((r) => ({
      key: r,
      label: ROLE_STYLES[r].label,
      icon: <span className={`h-3 w-3 rounded-full ${ROLE_STYLES[r].dot}`} />,
      count: counts[r],
      activeClass: ROLE_STYLES[r].cardActive,
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Section 1: Role overview cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {overviewCards.map((card) => {
          const active = roleFilter === card.key;
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => setFilter(card.key)}
              className={`clay-card clay-bounce flex items-center gap-3 rounded-2xl border p-4 text-left transition-all motion-reduce:transition-none ${
                active
                  ? `${card.activeClass} shadow-lg`
                  : "hover:bg-[var(--clay-bg-soft)]"
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--clay-bg-soft)] text-[var(--text-muted)]">
                {card.icon}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-[var(--text)]">
                  {card.label}
                </span>
                <span className="block text-xs text-[var(--text-light)]">
                  {card.count.toLocaleString()} users
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Section 2: Search & filter toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="ค้นหาชื่อผู้ใช้..."
            className="clay-input w-full rounded-2xl bg-[var(--clay-bg)] py-2 pl-9 pr-3 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none"
          />
        </div>
        <ClaySelect
          label="Role"
          value={roleFilter}
          onChange={(v) => setFilter(v)}
          options={[
            { value: "all", label: "All" },
            { value: "admin", label: "Admin" },
            { value: "writer", label: "Writer" },
            { value: "user", label: "User" },
          ]}
        />
        <ClaySelect
          label="Per page"
          value={perPage}
          onChange={(v) => {
            setPerPage(v);
            setPage(1);
          }}
          options={PER_PAGE_OPTIONS}
        />
      </div>

      {/* Section 3: Users table */}
      <div className="clay-card overflow-hidden rounded-3xl">
        {paginated.length === 0 ? (
          <div className="clay-well m-4 flex flex-col items-center gap-2 rounded-2xl p-8 text-center">
            <Users className="h-8 w-8 text-[var(--text-light)]" />
            <p className="text-sm text-[var(--text-light)]">ไม่พบผู้ใช้ที่ตรงกับเงื่อนไข</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wide text-[var(--text-muted)]">
                  <th className="px-4 py-3 font-medium">ผู้ใช้</th>
                  <th className="px-4 py-3 font-medium">บทบาท</th>
                  <th className="px-4 py-3 text-right font-medium">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-[var(--border)] transition-colors last:border-0 hover:bg-[var(--clay-bg-soft)]/60"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ClayAvatar user={u} />
                        <span className="font-medium text-[var(--text)]">
                          {u.displayName ?? "ผู้ใช้"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <RowActions
                        user={u}
                        pending={pendingId === u.id}
                        onRoleChange={(r) => handleRoleChange(u, r)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Section 4: Pagination controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--text-muted)]">
          Showing {filtered.length === 0 ? 0 : start + 1}-{end} of{" "}
          {filtered.length.toLocaleString()} users
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage <= 1}
            aria-label="หน้าก่อนหน้า"
            className="clay-button clay-bounce flex h-9 w-9 items-center justify-center rounded-full bg-[var(--clay-bg-soft)] text-[var(--text)] motion-reduce:transition-none disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs font-medium text-[var(--text-muted)]">
            หน้า {safePage}/{totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage >= totalPages}
            aria-label="หน้าถัดไป"
            className="clay-button clay-bounce flex h-9 w-9 items-center justify-center rounded-full bg-[var(--clay-bg-soft)] text-[var(--text)] motion-reduce:transition-none disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function PortalMenu({
  anchorRef,
  open,
  onClose,
  widthClass,
  children,
}: {
  anchorRef: React.RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  widthClass: string;
  children: React.ReactNode;
}) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const menuWidth = menuRef.current?.offsetWidth ?? 176;
    const top = rect.bottom + 8;
    const left = Math.max(8, rect.right - menuWidth);
    const maxLeft = window.innerWidth - menuWidth - 8;
    setPos({ top, left: Math.min(left, maxLeft) });
  }, [anchorRef]);

  useEffect(() => {
    if (!open) return;
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        ref={menuRef}
        role="menu"
        className={`clay-card fixed z-50 rounded-2xl p-2 shadow-xl backdrop-blur-md ${widthClass}`}
        style={pos ? { top: pos.top, left: pos.left } : { visibility: "hidden" }}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}

function RowActions({
  user,
  pending,
  onRoleChange,
}: {
  user: AdminUser;
  pending: boolean;
  onRoleChange: (role: Role) => void;
}) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        disabled={pending}
        aria-label="จัดการบทบาท"
        aria-haspopup="menu"
        aria-expanded={open}
        className="clay-button clay-bounce flex h-9 w-9 items-center justify-center rounded-full bg-[var(--clay-bg-soft)] text-[var(--text)] motion-reduce:transition-none disabled:opacity-50"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MoreVertical className="h-4 w-4" />
        )}
      </button>
      <PortalMenu
        anchorRef={anchorRef}
        open={open}
        onClose={() => setOpen(false)}
        widthClass="w-44"
      >
        <p className="px-3 py-1 text-xs font-medium text-[var(--text-muted)]">
          เปลี่ยนบทบาท
        </p>
        {ROLE_ORDER.map((r) => (
          <button
            key={r}
            type="button"
            role="menuitem"
            disabled={pending}
            onClick={() => {
              setOpen(false);
              onRoleChange(r);
            }}
            className="clay-bounce flex w-full items-center justify-between gap-2 rounded-xl px-3 py-1.5 text-left text-sm text-[var(--text)] transition-colors motion-reduce:transition-none hover:bg-[var(--clay-bg-soft)] disabled:opacity-50"
          >
            <span className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${ROLE_STYLES[r].dot}`} />
              {ROLE_STYLES[r].label}
            </span>
            {r === user.role && <Check className="h-4 w-4 text-[var(--accent)]" />}
          </button>
        ))}
      </PortalMenu>
    </>
  );
}
