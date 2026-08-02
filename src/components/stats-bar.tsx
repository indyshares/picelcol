const tones = ["var(--stat-1)", "var(--stat-2)", "var(--stat-3)", "var(--stat-2)"];

export function StatsBar({
  publishedCount,
  categoryCount,
  viewCount,
  likeCount,
}: {
  publishedCount: number;
  categoryCount: number;
  viewCount: number;
  likeCount: number;
}) {
  const stats = [
    { label: "บทความที่เผยแพร่", value: publishedCount.toLocaleString("th-TH") },
    { label: "หมวดหมู่", value: categoryCount.toLocaleString("th-TH") },
    { label: "อ่านทั้งหมด", value: `${viewCount.toLocaleString("th-TH")} ครั้ง` },
    { label: "หัวใจจากผู้อ่าน", value: `${likeCount.toLocaleString("th-TH")} ดวง` },
  ];

  return (
    <section className="border-y border-[var(--border)] bg-[var(--clay-bg-soft)]/60">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="clay-card clay-bounce flex flex-col items-center gap-1.5 px-4 py-6 text-center motion-reduce:transition-none"
              style={{
                background: `color-mix(in srgb, ${tones[i]} 16%, var(--clay-bg))`,
                boxShadow: "var(--clay-shadow-card)",
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: tones[i] }}
                aria-hidden
              />
              <span
                className="font-[var(--font-heading)] text-2xl font-bold"
                style={{ color: tones[i] }}
              >
                {stat.value}
              </span>
              <span className="text-sm text-[var(--text-light)]">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
