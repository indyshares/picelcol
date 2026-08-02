"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/lib/use-locale";
import { useEffect, useState } from "react";
import { siteConfig } from "@/constants/site";

const socialLinks = [
  {
    labelKey: "facebook",
    href: "https://www.facebook.com/picelcollections",
    ariaLabelKey: "facebookAria",
  },
  {
    labelKey: "instagram",
    href: "#",
    ariaLabelKey: "instagramAria",
  },
  {
    labelKey: "tiktok",
    href: "#",
    ariaLabelKey: "tiktokAria",
  },
];

export function SiteFooter() {
  const { dict, mounted } = useLocale();
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  if (!mounted) {
    return (
      <footer className="border-t border-[var(--border)] bg-[var(--surface)] text-sm">
        <div className="mx-auto max-w-5xl px-6 py-12" />
      </footer>
    );
  }

  const { footer, common } = dict;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] text-sm">

      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-12 md:grid-cols-4">
        <div className="space-y-3 md:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="eiei" width={36} height={36} className="h-8 w-auto" />
            <span className="font-[var(--font-heading)] text-base font-semibold text-[var(--text)]">
              by Picel Collections
            </span>
          </Link>
          <p className="text-xs leading-relaxed text-[var(--text-light)]">
            {footer.tagline}
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            {footer.copyright.replace("{year}", String(currentYear))}
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="font-[var(--font-heading)] text-sm font-semibold text-[var(--text)]">
            {common.nav.home}
          </h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="clay-bounce text-[var(--text-light)] motion-reduce:transition-none hover:text-[var(--link)]">
                {common.nav.home}
              </Link>
            </li>
            <li>
              <Link href="/articles" className="clay-bounce text-[var(--text-light)] motion-reduce:transition-none hover:text-[var(--link)]">
                {common.nav.articles}
              </Link>
            </li>
            <li>
              <Link href="/about" className="clay-bounce text-[var(--text-light)] motion-reduce:transition-none hover:text-[var(--link)]">
                {common.nav.about}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="clay-bounce text-[var(--text-light)] motion-reduce:transition-none hover:text-[var(--link)]">
                {footer.privacy}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="clay-bounce text-[var(--text-light)] motion-reduce:transition-none hover:text-[var(--link)]">
                {footer.terms}
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="clay-bounce text-[var(--text-light)] motion-reduce:transition-none hover:text-[var(--link)]">
                {footer.cookies}
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="font-[var(--font-heading)] text-sm font-semibold text-[var(--text)]">
            {footer.categories}
          </h3>
          {categories.length > 0 ? (
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/articles?cat=${cat.slug}`}
                    className="clay-bounce text-[var(--text-light)] motion-reduce:transition-none hover:text-[var(--link)]"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[var(--text-muted)]">—</p>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="font-[var(--font-heading)] text-sm font-semibold text-[var(--text)]">
            {footer.contact}
          </h3>
          <ul className="space-y-2">
            <li>
              <a
                href="mailto:eiei.picel.contact@gmail.com"
                className="clay-bounce text-[var(--text-light)] motion-reduce:transition-none hover:text-[var(--link)]"
              >
                eiei.picel.contact@gmail.com
              </a>
            </li>
          </ul>
          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.labelKey}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={(footer as Record<string, string>)[social.ariaLabelKey]}
                className="clay-bounce text-xs text-[var(--text-light)] underline decoration-dotted underline-offset-2 motion-reduce:transition-none hover:text-[var(--link)]"
              >
                {(footer as Record<string, string>)[social.labelKey]}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border)] py-4 text-center text-xs text-[var(--text-muted)]">
        {siteConfig.url !== "https://eiei.picelcollections.site" && (
          <span>{footer.brandUnder}</span>
        )}
      </div>
    </footer>
  );
}
