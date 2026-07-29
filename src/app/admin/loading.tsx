function RowSkeleton() {
  return (
    <div className="flex items-center justify-between gap-4 p-4">
      <div className="flex flex-col gap-2">
        <div className="h-4 w-56 animate-pulse rounded-full bg-[var(--border)]" />
        <div className="h-3 w-32 animate-pulse rounded-full bg-[var(--border)]" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-4 w-10 animate-pulse rounded-full bg-[var(--border)]" />
        <div className="h-4 w-10 animate-pulse rounded-full bg-[var(--border)]" />
      </div>
    </div>
  );
}

export default function AdminLoading() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div className="h-8 w-40 animate-pulse rounded-full bg-[var(--border)]" />
        <div className="h-10 w-36 animate-pulse rounded-full bg-[var(--border)]" />
      </div>
      <div className="flex flex-col divide-y divide-[var(--border)] rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)]">
        {Array.from({ length: 5 }).map((_, i) => (
          <RowSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
