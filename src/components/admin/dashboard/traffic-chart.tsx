import type { DashboardChartPoint } from "@/services/dashboard.service";

const WIDTH = 800;
const HEIGHT = 220;
const PAD = { top: 16, right: 16, bottom: 28, left: 8 };
const PLOT_W = WIDTH - PAD.left - PAD.right;
const PLOT_H = HEIGHT - PAD.top - PAD.bottom;

export function TrafficChart({ data }: { data: DashboardChartPoint[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const band = PLOT_W / Math.max(data.length, 1);
  const barW = Math.min(band * 0.6, 34);

  return (
    <div className="mt-6">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full"
        role="img"
        aria-label="ยอดเข้าชมในช่วง 14 วันที่ผ่านมา"
      >
        <defs>
          <linearGradient id="clay-bar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--primary)" />
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

        {data.map((point, i) => {
          const h = (point.count / max) * PLOT_H;
          const x = PAD.left + i * band + (band - barW) / 2;
          const y = PAD.top + PLOT_H - h;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={Math.max(h, 3)}
                rx={Math.min(barW / 2, 8)}
                fill="url(#clay-bar)"
                className="transition-all"
              />
              <text
                x={PAD.left + i * band + band / 2}
                y={HEIGHT - 10}
                textAnchor="middle"
                className="fill-[var(--text-muted)] text-[10px]"
              >
                {point.label}
              </text>
              {point.count > 0 && (
                <text
                  x={PAD.left + i * band + band / 2}
                  y={y - 6}
                  textAnchor="middle"
                  className="fill-[var(--text-light)] text-[10px] font-medium"
                >
                  {point.count}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
