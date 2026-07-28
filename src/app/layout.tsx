import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { fontKanit, fontSarabun, fontPlaypen } from "@/lib/fonts";
import { getLocale } from "@/lib/i18n";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "eiei",
    template: "%s | eiei",
  },
  description: "สติ๊กเกอร์ เครื่องเขียน และของเล็กๆ น้อยๆ ที่ทำให้วันของคุณน่ารักขึ้น",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${fontKanit.variable} ${fontSarabun.variable} ${fontPlaypen.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
