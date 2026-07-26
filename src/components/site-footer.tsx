import Link from "next/link";
import { siteConfig } from "@/constants/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-6 py-10 text-center">
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: "linear-gradient(135deg, #98D8F4, #FFC5D6)" }}
          />
          <span className="font-[var(--font-heading)] font-semibold text-[var(--text)]">
            {siteConfig.name}
          </span>
        </div>
        <p className="text-sm text-[var(--text-light)]">{siteConfig.description}</p>
        <nav className="flex gap-4 text-sm text-[var(--text-light)]">
          <Link href="/articles" className="hover:text-[var(--link)]">
            บทความ
          </Link>
          <Link href="/login" className="hover:text-[var(--link)]">
            เข้าสู่ระบบ
          </Link>
        </nav>
        <p className="text-xs text-[var(--text-muted)]">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
