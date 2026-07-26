export const siteConfig = {
  name: "Eiei App",
  description: "เว็บไซต์บทความแบรนด์ — เขียนโดยแอดมิน อ่านง่าย ค้นหาได้ SEO ครบ",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  locale: "th",
} as const;

export const themeTokens = {
  radius: {
    button: "14px",
    card: "20px",
    input: "14px",
    modal: "24px",
  },
  transition: "250ms ease",
} as const;
