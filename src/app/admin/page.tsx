import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Eye,
  FileText,
  Folder,
  ImageIcon,
  MessageSquare,
  Pencil,
  PenSquare,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { getCurrentAuthUser } from "@/features/auth/get-current-user";
import { getDashboardData } from "@/services/dashboard.service";
import { formatICTDate, formatICTDateTime } from "@/utils/date";
import { TrafficChart } from "@/components/admin/dashboard/traffic-chart";

export default async function AdminDashboardPage() {
  const [user, data] = await Promise.all([getCurrentAuthUser(), getDashboardData()]);
  const name =
    user?.user_metadata?.displayName ?? user?.email?.split("@")[0] ?? "Admin";

  const { stats } = data;

  return (
    <main className="mx-auto max-w-6xl py-6">
      {/* Hero */}
      <section className="clay-card mb-6 rounded-3xl p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold text-[var(--text)]">
                Welcome back, {name}!
              </h1>
              <span className="clay-badge inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                Database Connected
              </span>
            </div>
            <p className="mt-2 max-w-xl text-sm text-[var(--text-light)]">
              มีบทความทั้งหมด {stats.articles.total} บทความ (เผยแพร่{" "}
              {stats.articles.published} / แบบร่าง {stats.articles.drafts}) ยอดเข้าชมรวม{" "}
              {stats.views.total.toLocaleString()} ครั้ง และหมวดหมู่ทั้งหมด{" "}
              {stats.categories} หมวดหมู่
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/articles/new"
              className="clay-button clay-bounce inline-flex items-center gap-2 bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--accent-contrast)] motion-reduce:transition-none"
            >
              <PenSquare className="h-4 w-4" />
              เขียนบทความใหม่
            </Link>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="clay-button clay-bounce inline-flex items-center gap-2 bg-[var(--clay-bg-soft)] px-4 py-2.5 text-sm font-medium text-[var(--text)] motion-reduce:transition-none"
            >
              <ArrowUpRight className="h-4 w-4" />
              หน้าแรก
            </Link>
          </div>
        </div>
      </section>

      {/* KPI Stats */}
      <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={FileText}
          iconClass="bg-[var(--primary)]/20 text-[var(--link)]"
          label="บทความทั้งหมด"
          value={stats.articles.total.toLocaleString()}
          sub={
            <>
              เผยแพร่ <b className="font-semibold text-emerald-600 dark:text-emerald-400">{stats.articles.published}</b>
              {" · "}แบบร่าง <b className="font-semibold text-amber-600 dark:text-amber-400">{stats.articles.drafts}</b>
            </>
          }
        />
        <KpiCard
          icon={Eye}
          iconClass="bg-[var(--secondary)]/30 text-[var(--link)]"
          label="ยอดเข้าชมรวม"
          value={stats.views.total.toLocaleString()}
          sub={
            stats.views.growth > 0 ? (
              <span className="inline-flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5" />+{stats.views.growth}% เทียบกับสัปดาห์ก่อน
              </span>
            ) : stats.views.growth < 0 ? (
              <span className="inline-flex items-center gap-1 font-medium text-rose-500">
                <TrendingDown className="h-3.5 w-3.5" />
                {stats.views.growth}% เทียบกับสัปดาห์ก่อน
              </span>
            ) : (
              <span className="text-[var(--text-muted)]">คงที่เทียบกับสัปดาห์ก่อน</span>
            )
          }
        />
        <KpiCard
          icon={Folder}
          iconClass="bg-[var(--accent)]/20 text-[var(--accent)]"
          label="หมวดหมู่"
          value={stats.categories.toLocaleString()}
          sub="หมวดหมู่ทั้งหมดในระบบ"
        />
        <KpiCard
          icon={Users}
          iconClass="bg-[var(--clay-bg-soft)] text-[var(--text)]"
          label="ผู้ใช้"
          value={stats.users.total.toLocaleString()}
          sub={
            <>
              ผู้ดูแล <b className="font-semibold text-[var(--text)]">{stats.users.admins}</b>
              {" · "}สมาชิก <b className="font-semibold text-[var(--text)]">{stats.users.total - stats.users.admins}</b>
            </>
          }
        />
      </section>

      {/* Traffic chart */}
      <section className="clay-card mb-6 rounded-3xl p-6">
        <TrafficChart />
      </section>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="clay-card rounded-3xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--text)]">บทความยอดนิยม</h2>
            <Link
              href="/admin/articles"
              className="clay-bounce text-sm font-medium text-[var(--link)] motion-reduce:transition-none hover:text-[var(--link-hover)]"
            >
              ดูทั้งหมด
            </Link>
          </div>
          {data.topRead.length === 0 ? (
            <p className="py-4 text-sm text-[var(--text-light)]">ยังไม่มีบทความที่เผยแพร่</p>
          ) : (
            <ul className="space-y-2">
              {data.topRead.map((a) => {
                const coverUrl = a.coverImage ?? a.coverMediaUrl;
                return (
                  <li key={a.id}>
                    <Link
                      href={`/admin/articles/${a.id}/edit`}
                      className="clay-bounce group flex items-center gap-3 rounded-2xl p-2 motion-reduce:transition-none hover:bg-[var(--clay-bg-soft)]"
                    >
                      <div className="clay-well shrink-0 rounded-xl p-1">
                        <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-[var(--clay-bg-soft)]">
                          {coverUrl ? (
                            <Image
                              src={coverUrl}
                              alt={a.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--primary)]/30 to-[var(--secondary)]/30 text-[var(--text-muted)]">
                              <ImageIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[var(--text)] group-hover:text-[var(--link)]">
                          {a.title}
                        </p>
                        <p className="truncate text-xs text-[var(--text-muted)]">/{a.slug}</p>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-[var(--text-light)]">
                        <Eye className="h-3.5 w-3.5" />
                        {a.views.toLocaleString()}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="clay-card rounded-3xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--text)]">แบบร่างล่าสุด</h2>
            <Link
              href="/admin/articles"
              className="clay-bounce text-sm font-medium text-[var(--link)] motion-reduce:transition-none hover:text-[var(--link-hover)]"
            >
              ดูทั้งหมด
            </Link>
          </div>
          {data.drafts.length === 0 ? (
            <p className="py-4 text-sm text-[var(--text-light)]">ไม่มีแบบร่าง</p>
          ) : (
            <ul className="space-y-2">
              {data.drafts.map((d) => (
                <li key={d.id} className="flex items-center gap-3 rounded-2xl p-2 hover:bg-[var(--clay-bg-soft)]">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--text)]">{d.title}</p>
                    <p className="truncate text-xs text-[var(--text-muted)]">
                      แก้ไขเมื่อ {formatICTDate(d.updatedAt)}
                    </p>
                  </div>
                  <Link
                    href={`/admin/articles/${d.id}/edit`}
                    title="แก้ไขแบบร่าง"
                    className="clay-button clay-bounce inline-flex shrink-0 items-center gap-1.5 bg-[var(--clay-bg-soft)] px-3 py-1.5 text-xs font-medium text-[var(--text)] motion-reduce:transition-none"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    แก้ไข
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 border-t border-[var(--border)] pt-4">
            <h3 className="mb-3 text-sm font-semibold text-[var(--text)]">กิจกรรมล่าสุด</h3>
            {data.activity.length === 0 ? (
              <p className="text-sm text-[var(--text-light)]">ยังไม่มีกิจกรรมล่าสุด</p>
            ) : (
              <ul className="space-y-3">
                {data.activity.map((ev) => (
                  <li key={ev.id} className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--secondary)]/30 text-[var(--text-light)]">
                      <MessageSquare className="h-3 w-3" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm leading-snug text-[var(--text)]">
                        <span className="font-medium">{ev.authorName}</span> แสดงความคิดเห็นใน{" "}
                        <Link
                          href={`/articles/${ev.articleSlug}`}
                          className="text-[var(--link)] hover:underline"
                        >
                          {ev.articleTitle}
                        </Link>
                      </p>
                      <time className="text-xs text-[var(--text-muted)]">
                        {formatICTDateTime(ev.createdAt)}
                      </time>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function KpiCard({
  icon: Icon,
  iconClass,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  iconClass: string;
  label: string;
  value: string;
  sub?: React.ReactNode;
}) {
  return (
    <div className="clay-card clay-bounce rounded-3xl p-5 motion-reduce:transition-none">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--text-light)]">{label}</p>
          <p className="mt-1 text-3xl font-semibold text-[var(--text)]">{value}</p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {sub && <div className="mt-3 text-xs text-[var(--text-muted)]">{sub}</div>}
    </div>
  );
}
