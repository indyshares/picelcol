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
    <section className="border-y border-[var(--border)] bg-[var(--surface)]/50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
              <span className="font-[var(--font-heading)] text-2xl font-bold text-[var(--text)]">
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
