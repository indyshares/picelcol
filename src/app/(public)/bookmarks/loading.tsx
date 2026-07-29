function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)]">
      <div className="aspect-[16/9] w-full animate-pulse bg-[var(--border)]" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-4 w-3/4 animate-pulse rounded-full bg-[var(--border)]" />
        <div className="h-3 w-full animate-pulse rounded-full bg-[var(--border)]" />
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-[var(--border)]" />
      </div>
    </div>
  );
}

export default function BookmarksLoading() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8 h-8 w-48 animate-pulse rounded-full bg-[var(--border)]" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
