import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";

const playpenSansThai = localFont({
  src: [
    { path: "../../public/fonts/PlaypenSansThai/PlaypenSansThai-Regular.ttf", weight: "400" },
    { path: "../../public/fonts/PlaypenSansThai/PlaypenSansThai-Medium.ttf", weight: "500" },
    { path: "../../public/fonts/PlaypenSansThai/PlaypenSansThai-SemiBold.ttf", weight: "600" },
    { path: "../../public/fonts/PlaypenSansThai/PlaypenSansThai-Bold.ttf", weight: "700" },
  ],
  variable: "--font-playpen",
  display: "swap",
});

const kanit = localFont({
  src: [
    { path: "../../public/fonts/Kanit/Kanit-Medium.ttf", weight: "500" },
    { path: "../../public/fonts/Kanit/Kanit-SemiBold.ttf", weight: "600" },
    { path: "../../public/fonts/Kanit/Kanit-Bold.ttf", weight: "700" },
  ],
  variable: "--font-kanit",
  display: "swap",
});

const sarabun = localFont({
  src: [
    { path: "../../public/fonts/Sarabun/Sarabun-Regular.ttf", weight: "400" },
    { path: "../../public/fonts/Sarabun/Sarabun-Medium.ttf", weight: "500" },
  ],
  variable: "--font-sarabun",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Eiei App",
    template: "%s | Eiei App",
  },
  description: "เว็บไซต์บทความแบรนด์ — เขียนโดยแอดมิน อ่านง่าย ค้นหาได้ SEO ครบ",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body
        className={`${playpenSansThai.variable} ${kanit.variable} ${sarabun.variable} antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
