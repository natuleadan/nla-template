import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getPost } from "@/lib/modules/blog";

export const size = {
  width: 1200,
  height: 600,
};

export const contentType = "image/png";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export default async function TwitterImage({ params }: RouteParams) {
  const { slug } = await params;
  const post = await getPost(slug);

  const [bgData, logoData] = await Promise.all([
    readFile(join(process.cwd(), "public/design/fondo.svg")),
    readFile(join(process.cwd(), "public/design/logo.svg")),
  ]);

  const bgBase64 = bgData.toString("base64");
  const logoBase64 = logoData.toString("base64");

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
          position: "relative",
        }}
      >
        <img
          src={`data:image/svg+xml;base64,${bgBase64}`}
          alt="background"
          width={1200}
          height={600}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <img
          src={`data:image/svg+xml;base64,${logoBase64}`}
          alt="logo"
          width={100}
          height={100}
          style={{
            position: "absolute",
            top: "24px",
            left: "50%",
            transform: "translateX(-50%)",
            borderRadius: "12px",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            zIndex: 1,
            padding: "0 48px",
            marginTop: 50,
          }}
        >
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#ffffff",
              textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
              marginBottom: 12,
              maxWidth: 800,
            }}
          >
            {post?.title || "Blog"}
          </div>
          {post?.excerpt && (
            <div
              style={{
                fontSize: 20,
                color: "#ffffff",
                textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
                textAlign: "center",
                maxWidth: 600,
                lineHeight: 1.4,
              }}
            >
              {post.excerpt.slice(0, 100)}
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
