"use client";

import Image from "next/image";
import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { AuthNav } from "@/features/auth/components/auth-nav";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLocale } from "@/lib/use-locale";

export function SiteHeader() {
  const { dict, mounted } = useLocale();

  if (!mounted) {
    return (
      <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <div className="h-9 w-9 rounded-full bg-[var(--border)]" />
          <div className="flex items-center gap-4">
            <div className="h-4 w-12 rounded bg-[var(--border)]" />
            <div className="h-4 w-16 rounded bg-[var(--border)]" />
            <div className="h-4 w-12 rounded bg-[var(--border)]" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--surface)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="flex shrink-0 items-center">
          <Image src="/logo.svg" alt={dict.common.nav.home} width={40} height={40} className="h-9 w-auto" />
        </Link>

        <SearchBar />

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="font-medium text-[var(--text)] hover:text-[var(--link)]">
            {dict.common.nav.home}
          </Link>
          <Link href="/articles" className="font-medium text-[var(--text)] hover:text-[var(--link)]">
            {dict.common.nav.articles}
          </Link>
          <Link href="/about" className="font-medium text-[var(--text)] hover:text-[var(--link)]">
            {dict.common.nav.about}
          </Link>
          <LanguageSwitcher />
          <AuthNav />
        </nav>
      </div>
    </header>
  );
}
