export function HeroVisual() {
  return (
    <div aria-hidden className="pointer-events-none relative hidden lg:block lg:w-1/2">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative h-80 w-80">
          <div
            className="absolute inset-0 animate-pulse rounded-full opacity-20"
            style={{
              background:
                "conic-gradient(from 0deg, #98D8F4, #FFC5D6, #FF7E5F, #98D8F4)",
              animationDuration: "8s",
            }}
          />
          {/* Raised tactile clay disc — "article preview card" */}
          <div className="clay-card absolute inset-2 flex flex-col items-center justify-center gap-3 rounded-full p-8 text-center">
            <div className="flex -space-x-2">
              <div className="clay-badge h-10 w-10 border-2 border-[var(--surface)] bg-gradient-to-br from-[#98D8F4] to-[#4DB6E8]" />
              <div className="clay-badge h-10 w-10 border-2 border-[var(--surface)] bg-gradient-to-br from-[#FFC5D6] to-[#FF7E5F]" />
              <div className="clay-badge h-10 w-10 border-2 border-[var(--surface)] bg-gradient-to-br from-[#FF7E5F] to-[#FF6B47]" />
            </div>
            <div className="flex flex-wrap justify-center gap-1.5">
              <span className="clay-badge bg-[var(--primary)]/25 px-2 py-1 text-[10px] font-medium text-[var(--text)]">
                การตลาด
              </span>
              <span className="clay-badge bg-[var(--secondary)]/25 px-2 py-1 text-[10px] font-medium text-[var(--text)]">
                เทคโนโลยี
              </span>
              <span className="clay-badge bg-[var(--accent)]/25 px-2 py-1 text-[10px] font-medium text-[var(--text)]">
                ดีไซน์
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <div className="h-1.5 w-24 rounded-full bg-[var(--border)]" />
              <div className="h-1.5 w-16 rounded-full bg-[var(--border)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
