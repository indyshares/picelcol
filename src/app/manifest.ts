import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Eiei App",
    short_name: "Eiei",
    description: "เว็บไซต์บทความ SEO + User System + Knowledge Graph + AI Ready",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFDF6",
    theme_color: "#98D8F4",
    icons: [
      {
        src: "/android-chrome-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
