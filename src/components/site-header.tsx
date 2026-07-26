import Link from "next/link";
import { Search, Bookmark } from "lucide-react";
import { getCurrentAuthUser } from "@/features/auth/get-current-user";
import { signOutAction } from "@/features/auth/actions";

export async function SiteHeader() {
  const user = await getCurrentAuthUser();

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-3 w-3 rounded-full"
            style={{ background: "linear-gradient(135deg, #98D8F4, #FFC5D6)" }}
          />
          <span className="font-[var(--font-heading)] text-lg font-semibold text-[var(--text)]">
            Eiei
          </span>
        </Link>

        <form
          action="/articles"
          className="hidden flex-1 max-w-xs items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 py-2 sm:flex"
        >
          <Search className="h-4 w-4 shrink-0 text-[var(--text-muted)]" />
          <input
            type="search"
            name="q"
            placeholder="ค้นหาบทความ..."
            className="w-full bg-transparent text-sm text-[var(--text)] outline-none placeholder:text-[var(--text-muted)]"
          />
        </form>

        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/articles"
            className="font-medium text-[var(--text)] hover:text-[var(--link)]"
          >
            บทความ
          </Link>
          {user ? (
            <>
              <Link
                href="/bookmarks"
                className="flex items-center gap-1 font-medium text-[var(--text)] hover:text-[var(--link)]"
              >
                <Bookmark className="h-4 w-4" />
                <span className="hidden sm:inline">บันทึก</span>
              </Link>
              <form action={signOutAction}>
                <button type="submit" className="font-medium text-[var(--text-light)] hover:text-[var(--accent)]">
                  ออกจากระบบ
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-[var(--radius-btn)] bg-[var(--accent)] px-4 py-2 font-medium text-white transition hover:bg-[var(--accent-hover)]"
            >
              เข้าสู่ระบบ
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
