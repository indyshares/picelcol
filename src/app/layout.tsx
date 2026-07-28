import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { fontKanit, fontSarabun, fontPlaypen } from "@/lib/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "eiei",
    template: "%s | eiei",
  },
  description: "สติ๊กเกอร์ เครื่องเขียน และของเล็กๆ น้อยๆ ที่ทำให้วันของคุณน่ารักขึ้น",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${fontKanit.variable} ${fontSarabun.variable} ${fontPlaypen.variable}`}
      suppressHydrationWarning
    >
      <body className="font-body antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
