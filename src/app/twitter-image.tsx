import { ImageResponse } from "next/og";
import { siteConfig } from "@/constants/site";

export const runtime = "edge";
export const alt = "Eiei App";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #98D8F4 0%, #FFC5D6 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            padding: "24px 56px",
            borderRadius: 32,
            background: "#FFFDF6",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}
        >
          <span style={{ fontSize: 72, fontWeight: 700, color: "#2F4255" }}>
            {siteConfig.name}
          </span>
        </div>
        <span style={{ marginTop: 28, fontSize: 30, color: "#2F4255" }}>
          {siteConfig.description}
        </span>
      </div>
    ),
    { ...size },
  );
}
