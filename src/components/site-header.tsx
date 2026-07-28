import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { AuthNav } from "@/features/auth/components/auth-nav";

export function SiteHeader() {
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

        <SearchBar />

        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/"
            className="font-medium text-[var(--text)] hover:text-[var(--link)]"
          >
            หน้าแรก
          </Link>
          <Link
            href="/articles"
            className="font-medium text-[var(--text)] hover:text-[var(--link)]"
          >
            บทความ
          </Link>
          <AuthNav />
        </nav>
      </div>
    </header>
  );
}
