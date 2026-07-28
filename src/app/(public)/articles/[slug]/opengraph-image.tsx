import { ImageResponse } from "next/og";
import { getArticleWithStats } from "@/services/engagement.service";

// Uses the Node.js runtime (not edge) so it can query Prisma directly.
export const runtime = "nodejs";
export const alt = "Article cover image";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ArticleOpengraphImage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleWithStats(slug);
  const title = article?.title ?? "บทความ";
  const category = article?.categories[0]?.category.name;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #98D8F4 0%, #FFC5D6 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {category ? (
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "8px 20px",
              borderRadius: 999,
              background: "#FF7E5F",
              color: "#FFFFFF",
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            {category}
          </div>
        ) : (
          <div />
        )}

        <div
          style={{
            display: "flex",
            padding: "40px 48px",
            borderRadius: 28,
            background: "#FFFDF6",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}
        >
          <span
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "#2F4255",
              lineHeight: 1.2,
            }}
          >
            {title}
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
