"use client";

import { useCallback, useEffect, useState } from "react";
import { Calendar, Eye, Loader2, TrendingDown, TrendingUp } from "lucide-react";
import type {
  TrafficData,
  TrafficGranularity,
  TrafficRange,
} from "@/services/dashboard.service";

const WIDTH = 800;
const HEIGHT = 240;
const PAD = { top: 20, right: 16, bottom: 28, left: 8 };
const PLOT_W = WIDTH - PAD.left - PAD.right;
const PLOT_H = HEIGHT - PAD.top - PAD.bottom;

const RANGE_OPTIONS: { value: TrafficRange; label: string }[] = [
  { value: "24h", label: "24 ชม." },
  { value: "7d", label: "7 วัน" },
  { value: "30d", label: "30 วัน" },
  { value: "year", label: "ปีนี้" },
  { value: "all", label: "ทั้งหมด" },
];

const PERIOD_LABEL: Record<TrafficRange, string> = {
  "24h": "24 ชั่วโมงที่ผ่านมา",
  "7d": "7 วันที่ผ่านมา",
  "30d": "30 วันที่ผ่านมา",
  year: "ปีนี้",
  all: "ทั้งหมด",
};

const GRANULARITY_LABEL: Record<TrafficGranularity, string> = {
  hour: "รายชั่วโมง",
  day: "รายวัน",
  month: "รายเดือน",
};

const PER_UNIT: Record<TrafficGranularity, string> = {
  hour: "ต่อชั่วโมง",
  day: "ต่อวัน",
  month: "ต่อเดือน",
};

function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatThaiDate(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function TrafficChart() {
  const [range, setRange] = useState<TrafficRange>("30d");
  const [customRange, setCustomRange] = useState<{ from: string; to: string } | null>(null);
  const [customOpen, setCustomOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [data, setData] = useState<TrafficData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const load = useCallback(async (p: { range?: TrafficRange; from?: string; to?: string }) => {
    setLoading(true);
    setError(null);
    setHovered(null);
    try {
      const qs = new URLSearchParams();
      if (p.range) qs.set("range", p.range);
      if (p.from && p.to) {
        qs.set("from", p.from);
        qs.set("to", p.to);
      }
      const res = await fetch(`/api/admin/traffic?${qs.toString()}`);
      if (!res.ok) throw new Error("bad");
      setData((await res.json()) as TrafficData);
    } catch {
      setError("ไม่สามารถโหลดข้อมูลได้");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load({ range: "30d" });
  }, [load]);

  function onRange(value: TrafficRange) {
    setCustomOpen(false);
    setCustomRange(null);
    setRange(value);
    void load({ range: value });
  }

  function openCustom() {
    const now = new Date();
    const from = new Date(now);
    from.setDate(from.getDate() - 29);
    setCustomFrom(customRange?.from ?? toISODate(from));
    setCustomTo(customRange?.to ?? toISODate(now));
    setCustomOpen((o) => !o);
  }

  const validCustom =
    customFrom && customTo && new Date(`${customTo}T00:00:00`) >= new Date(`${customFrom}T00:00:00`);

  function applyCustom() {
    if (!validCustom) return;
    setCustomRange({ from: customFrom, to: customTo });
    setCustomOpen(false);
    setRange("30d");
    void load({ from: customFrom, to: customTo });
  }

  const granularity = data?.granularity ?? "day";
  const subtitle = customRange
    ? `จาก ${formatThaiDate(customRange.from)} ถึง ${formatThaiDate(customRange.to)} · ${
        GRANULARITY_LABEL[granularity]
      }`
    : `${GRANULARITY_LABEL[granularity]} · ${PERIOD_LABEL[range]}`;

  const points = data?.points ?? [];
  const max = Math.max(...points.map((p) => p.count), 1);
  const band = PLOT_W / Math.max(points.length, 1);
  const barW = Math.min(band * 0.6, 34);
  const labelEvery = Math.max(1, Math.ceil(points.length / 12));
  const showValues = points.length <= 16;

  const hoverPoint =
    hovered !== null && hovered < points.length ? points[hovered] : null;
  let tooltipStyle: React.CSSProperties | undefined;
  if (hoverPoint) {
    const cx = PAD.left + hovered! * band + band / 2;
    const barTopY = PAD.top + PLOT_H - (hoverPoint.count / max) * PLOT_H;
    let leftPct = (cx / WIDTH) * 100;
    let topPct = (barTopY / HEIGHT) * 100;
    leftPct = Math.max(14, Math.min(86, leftPct));
    topPct = Math.max(28, Math.min(58, topPct));
    tooltipStyle = { left: `${leftPct}%`, top: `${topPct}%` };
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-[var(--text)]">ยอดเข้าชม</h2>
            <span className="clay-badge inline-flex items-center gap-1.5 rounded-full bg-[var(--primary)]/20 px-3 py-1 text-xs font-medium text-[var(--text)]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Live
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--text-muted)]">{subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="clay-card inline-flex items-center gap-1 rounded-full p-1 text-xs">
            {RANGE_OPTIONS.map(({ value, label }) => {
              const active = range === value && !customRange;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onRange(value)}
                  aria-pressed={active}
                  className={
                    active
                      ? "clay-button clay-bounce rounded-full bg-[var(--primary)]/25 px-3 py-1.5 font-medium text-[var(--text)] motion-reduce:transition-none"
                      : "clay-bounce rounded-full px-3 py-1.5 font-medium text-[var(--text-light)] motion-reduce:transition-none hover:bg-[var(--clay-bg-soft)] hover:text-[var(--text)]"
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={openCustom}
              className={`clay-button clay-bounce inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[var(--text)] motion-reduce:transition-none ${
                customRange ? "bg-[var(--primary)]/25" : "bg-[var(--clay-bg-soft)]"
              }`}
            >
              <Calendar className="h-3.5 w-3.5" />
              {customRange ? "ช่วงเวลาเอง" : "กำหนดเอง"}
            </button>

            {customOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setCustomOpen(false)} />
                <div className="clay-card absolute right-0 top-full z-30 mt-2 w-72 rounded-2xl p-4 shadow-xl">
                  <p className="mb-3 text-sm font-semibold text-[var(--text)]">เลือกช่วงวันที่</p>
                  <div className="space-y-3">
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-[var(--text-light)]">
                        จาก
                      </span>
                      <input
                        type="date"
                        value={customFrom}
                        onChange={(e) => setCustomFrom(e.target.value)}
                        className="clay-card w-full appearance-none rounded-2xl px-4 py-2 text-sm text-[var(--text)] outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1 block text-xs font-medium text-[var(--text-light)]">
                        ถึง
                      </span>
                      <input
                        type="date"
                        value={customTo}
                        onChange={(e) => setCustomTo(e.target.value)}
                        className="clay-card w-full appearance-none rounded-2xl px-4 py-2 text-sm text-[var(--text)] outline-none"
                      />
                    </label>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomOpen(false)}
                      className="clay-button clay-bounce flex-1 bg-[var(--clay-bg-soft)] px-3 py-2 text-xs font-medium text-[var(--text)] motion-reduce:transition-none"
                    >
                      ปิด
                    </button>
                    <button
                      type="button"
                      onClick={applyCustom}
                      disabled={!validCustom}
                      className="clay-button clay-bounce flex-1 bg-[var(--accent)] px-3 py-2 text-xs font-medium text-[var(--accent-contrast)] motion-reduce:transition-none disabled:opacity-50"
                    >
                      {customRange ? "อัปเดต" : "นำไปใช้"}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {data && (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Stat label="ยอดเข้าชม" value={data.stats.total.toLocaleString()} />
          <Stat label={`เฉลี่ย${PER_UNIT[data.granularity]}`} value={data.stats.average.toLocaleString()} />
          <Stat label="เทียบกับช่วงก่อนหน้า" growth={data.stats.growth} />
        </div>
      )}

      <div className="relative mt-6">
        {data && (
          <>
            <svg
              viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
              className="block h-auto w-full"
              role="img"
              aria-label="กราฟยอดเข้าชม"
            >
              <defs>
                <linearGradient id="traffic-bar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" />
                  <stop offset="100%" stopColor="var(--secondary)" />
                </linearGradient>
              </defs>

              {[0.25, 0.5, 0.75, 1].map((f) => {
                const y = PAD.top + PLOT_H * (1 - f);
                return (
                  <line
                    key={f}
                    x1={PAD.left}
                    x2={WIDTH - PAD.right}
                    y1={y}
                    y2={y}
                    stroke="var(--border)"
                    strokeWidth={1}
                    strokeDasharray="4 6"
                  />
                );
              })}

              {points.map((p, i) => {
                const h = (p.count / max) * PLOT_H;
                const x = PAD.left + i * band + (band - barW) / 2;
                const y = PAD.top + PLOT_H - h;
                const isHovered = hovered === i;
                return (
                  <g
                    key={p.ts}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <rect
                      x={x}
                      y={y}
                      width={barW}
                      height={Math.max(h, 3)}
                      rx={Math.min(barW / 2, 8)}
                      fill="url(#traffic-bar)"
                      style={{
                        cursor: "pointer",
                        filter: isHovered
                          ? "brightness(1.06) drop-shadow(0 2px 6px rgba(140,170,238,0.4))"
                          : undefined,
                      }}
                      className={`transition-all duration-150 hover:-translate-y-0.5 ${
                        hovered === null || isHovered ? "opacity-100" : "opacity-50"
                      }`}
                    />
                    {showValues && p.count > 0 && (
                      <text
                        x={x + barW / 2}
                        y={y - 6}
                        textAnchor="middle"
                        className="fill-[var(--text-light)] text-[10px] font-medium"
                      >
                        {p.count}
                      </text>
                    )}
                  </g>
                );
              })}

              {points.map((p, i) =>
                i % labelEvery === 0 ? (
                  <text
                    key={`label-${p.ts}`}
                    x={PAD.left + i * band + band / 2}
                    y={HEIGHT - 10}
                    textAnchor="middle"
                    className="fill-[var(--text-muted)] text-[10px]"
                  >
                    {p.label}
                  </text>
                ) : null,
              )}
            </svg>

            {hoverPoint && tooltipStyle && (
              <div
                className="clay-card pointer-events-none absolute z-10 rounded-2xl p-3 shadow-xl"
                style={{ ...tooltipStyle, transform: "translate(-50%, -100%)" }}
              >
                <p className="whitespace-nowrap text-xs font-semibold text-[var(--text)]">
                  {hoverPoint.label}
                </p>
                <p className="mt-1 flex items-center gap-1 whitespace-nowrap text-sm font-medium text-[var(--accent)]">
                  <Eye className="h-3.5 w-3.5" />
                  {hoverPoint.count.toLocaleString()}
                  <span className="text-[var(--text-muted)]">views</span>
                </p>
              </div>
            )}
          </>
        )}

        {!data && !error && (
          <div className="flex h-56 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--text-muted)]" />
          </div>
        )}

        {loading && data && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-[var(--surface)]/40 backdrop-blur-sm">
            <span className="clay-badge animate-pulse rounded-full bg-[var(--clay-bg-soft)] px-4 py-2 text-sm text-[var(--text-muted)]">
              กำลังโหลด...
            </span>
          </div>
        )}
      </div>

      {error && !data && (
        <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-rose-200/60 bg-rose-50/60 p-6 text-sm text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => {
              if (customRange) void load({ from: customRange.from, to: customRange.to });
              else void load({ range });
            }}
            className="clay-button clay-bounce bg-[var(--clay-bg-soft)] px-4 py-2 text-[var(--text)] motion-reduce:transition-none"
          >
            ลองใหม่
          </button>
        </div>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  growth,
}: {
  label: string;
  value?: string;
  growth?: number | null;
}) {
  return (
    <div className="clay-well rounded-2xl p-4">
      <p className="text-xs font-medium text-[var(--text-light)]">{label}</p>
      {growth !== undefined ? (
        growth === null ? (
          <p className="mt-1 text-2xl font-semibold text-[var(--text-muted)]">—</p>
        ) : growth === 0 ? (
          <p className="mt-1 text-2xl font-semibold text-[var(--text-muted)]">คงที่</p>
        ) : growth > 0 ? (
          <p className="mt-1 flex items-center gap-1.5 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="h-5 w-5" />+{growth}%
          </p>
        ) : (
          <p className="mt-1 flex items-center gap-1.5 text-2xl font-semibold text-rose-500">
            <TrendingDown className="h-5 w-5" />
            {growth}%
          </p>
        )
      ) : (
        <p className="mt-1 text-2xl font-semibold text-[var(--text)]">{value}</p>
      )}
    </div>
  );
}
