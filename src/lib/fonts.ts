import localFont from "next/font/local";

export const fontKanit = localFont({
  src: [
    {
      path: "../../public/fonts/Kanit/Kanit-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Kanit/Kanit-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Kanit/Kanit-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Kanit/Kanit-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-kanit",
  display: "swap",
});

export const fontSarabun = localFont({
  src: [
    {
      path: "../../public/fonts/Sarabun/Sarabun-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Sarabun/Sarabun-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Sarabun/Sarabun-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sarabun",
  display: "swap",
});

export const fontPlaypen = localFont({
  src: [
    {
      path: "../../public/fonts/PlaypenSansThai/PlaypenSansThai-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/PlaypenSansThai/PlaypenSansThai-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/PlaypenSansThai/PlaypenSansThai-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/PlaypenSansThai/PlaypenSansThai-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-playpen",
  display: "swap",
});
