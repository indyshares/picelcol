export const siteConfig = {
  name: "eiei",
  description: "สติ๊กเกอร์ เครื่องเขียน และของเล็กๆ น้อยๆ ที่ทำให้วันของคุณน่ารักขึ้น — Little things that make your day cuter.",
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
