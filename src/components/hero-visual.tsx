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
          <div className="absolute inset-4 rounded-full bg-[var(--bg)]/80 backdrop-blur" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="flex -space-x-2">
              <div className="h-10 w-10 rounded-full border-2 border-[var(--surface)] bg-gradient-to-br from-[#98D8F4] to-[#4DB6E8]" />
              <div className="h-10 w-10 rounded-full border-2 border-[var(--surface)] bg-gradient-to-br from-[#FFC5D6] to-[#FF7E5F]" />
              <div className="h-10 w-10 rounded-full border-2 border-[var(--surface)] bg-gradient-to-br from-[#FF7E5F] to-[#FF6B47]" />
            </div>
            <div className="flex flex-wrap justify-center gap-1.5">
              <span className="rounded-md bg-[var(--primary)]/20 px-2 py-1 text-[10px] font-medium text-[var(--text)]">
                การตลาด
              </span>
              <span className="rounded-md bg-[var(--secondary)]/20 px-2 py-1 text-[10px] font-medium text-[var(--text)]">
                เทคโนโลยี
              </span>
              <span className="rounded-md bg-[var(--accent)]/20 px-2 py-1 text-[10px] font-medium text-[var(--text)]">
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
