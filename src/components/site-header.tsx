import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { AuthNav } from "@/features/auth/components/auth-nav";
import { LanguageSwitcher } from "@/components/language-switcher";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex shrink-0 items-center">
          <Image src="/logo.svg" alt="eiei" width={40} height={40} className="h-9 w-auto" />
        </Link>

        <SearchBar />

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="font-medium text-[var(--text)] hover:text-[var(--link)]">
            หน้าแรก
          </Link>
          <Link href="/articles" className="font-medium text-[var(--text)] hover:text-[var(--link)]">
            บทความ
          </Link>
          <Link href="/about" className="font-medium text-[var(--text)] hover:text-[var(--link)]">
            เกี่ยวกับ
          </Link>
          <LanguageSwitcher />
          <AuthNav />
        </nav>
      </div>
    </header>
  );
}
