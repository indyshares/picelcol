import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/constants/site";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/picelcollections",
    ariaLabel: "ติดตามเราบน Facebook",
  },
  {
    label: "Instagram",
    href: "#",
    ariaLabel: "ติดตามเราบน Instagram",
  },
  {
    label: "TikTok",
    href: "#",
    ariaLabel: "ติดตามเราบน TikTok",
  },
];

export async function SiteFooter() {
  let categories: { slug: string; name: string }[] = [];
  try {
    categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      take: 6,
    });
  } catch {
    // DB unavailable
  }

  const currentYear = new Date().getFullYear();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "eiei",
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.svg`,
    sameAs: [
      "https://www.facebook.com/picelcollections",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "eiei.picel.contact@gmail.com",
      contactType: "customer service",
    },
  };

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] text-sm">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto grid max-w-5xl gap-10 px-6 py-12 md:grid-cols-4">
        {/* Zone 1: Brand & E-E-A-T */}
        <div className="space-y-3 md:col-span-1">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.svg" alt="eiei" width={36} height={36} className="h-8 w-auto" />
            <span className="font-[var(--font-heading)] text-base font-semibold text-[var(--text)]">
              eiei
            </span>
          </Link>
          <p className="text-xs leading-relaxed text-[var(--text-light)]">
            ของเล็กๆ ที่ทำให้วันของคุณน่ารักขึ้น — stickers, stationery, and little things that make your day cuter.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            &copy; {currentYear} eiei. All rights reserved.
          </p>
        </div>

        {/* Zone 2: Important Pages */}
        <div className="space-y-3">
          <h3 className="font-[var(--font-heading)] text-sm font-semibold text-[var(--text)]">
            หน้าแรก
          </h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-[var(--text-light)] transition hover:text-[var(--link)]">
                หน้าแรก
              </Link>
            </li>
            <li>
              <Link href="/articles" className="text-[var(--text-light)] transition hover:text-[var(--link)]">
                บทความ
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-[var(--text-light)] transition hover:text-[var(--link)]">
                เกี่ยวกับ
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-[var(--text-light)] transition hover:text-[var(--link)]">
                นโยบายความเป็นส่วนตัว
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-[var(--text-light)] transition hover:text-[var(--link)]">
                ข้อกำหนดการใช้งาน
              </Link>
            </li>
            <li>
              <Link href="/cookies" className="text-[var(--text-light)] transition hover:text-[var(--link)]">
                นโยบายคุกกี้
              </Link>
            </li>
          </ul>
        </div>

        {/* Zone 3: Top Categories */}
        <div className="space-y-3">
          <h3 className="font-[var(--font-heading)] text-sm font-semibold text-[var(--text)]">
            หมวดหมู่
          </h3>
          {categories.length > 0 ? (
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/articles?cat=${cat.slug}`}
                    className="text-[var(--text-light)] transition hover:text-[var(--link)]"
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

        {/* Zone 4: Contact & Social */}
        <div className="space-y-3">
          <h3 className="font-[var(--font-heading)] text-sm font-semibold text-[var(--text)]">
            ติดต่อเรา
          </h3>
          <ul className="space-y-2">
            <li>
              <a
                href="mailto:eiei.picel.contact@gmail.com"
                className="text-[var(--text-light)] transition hover:text-[var(--link)]"
              >
                eiei.picel.contact@gmail.com
              </a>
            </li>
          </ul>
          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.ariaLabel}
                className="text-xs text-[var(--text-light)] underline decoration-dotted underline-offset-2 transition hover:text-[var(--link)]"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--border)] py-4 text-center text-xs text-[var(--text-muted)]">
        {siteConfig.url !== "https://example.com" && (
          <span>eiei is a brand under Picel Collections.</span>
        )}
      </div>
    </footer>
  );
}
