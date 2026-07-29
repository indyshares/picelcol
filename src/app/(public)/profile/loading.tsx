export default function ProfileLoading() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-8 h-8 w-24 animate-pulse rounded-full bg-[var(--border)]" />
      <div className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="mb-2 h-3 w-12 animate-pulse rounded-full bg-[var(--border)]" />
        <div className="h-4 w-48 animate-pulse rounded-full bg-[var(--border)]" />
      </div>
    </main>
  );
}
