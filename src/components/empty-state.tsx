type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="clay-card flex flex-col items-center gap-4 border border-dashed border-[var(--border)] px-6 py-16 text-center">
      <div className="relative h-16 w-16" aria-hidden>
        <span
          className="absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle, #FFC5D6 0%, transparent 70%)" }}
        />
        <span
          className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
          style={{ borderColor: "var(--primary)" }}
        />
        <span
          className="absolute left-[60%] top-[60%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "var(--accent)" }}
        />
      </div>
      <div>
        <p className="font-[var(--font-heading)] font-semibold text-[var(--text)]">{title}</p>
        {description && <p className="mt-1 text-sm text-[var(--text-light)]">{description}</p>}
      </div>
    </div>
  );
}
