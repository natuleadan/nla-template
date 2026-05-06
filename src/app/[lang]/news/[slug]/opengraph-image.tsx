import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getPost } from "@/lib/modules/blog";
import { getConfig } from "@/lib/locale/config";
import { createImageResponse } from "@/lib/api/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ lang: string; slug: string }>;
}

export default async function OpenGraphImage({ params }: RouteParams) {
  const { lang, slug } = await params;
  const cfg = getConfig(lang);

  let postTitle = cfg.blog.og.fallbackTitle;
  let postDesc = "";

  try {
    const post = await getPost(slug, lang);
    if (post) {
      postTitle = post.title || cfg.blog.og.fallbackTitle;
      postDesc = post.excerpt || "";
    }
  } catch {}

  const [logoData, fallbackData] = await Promise.all([
    readFile(join(process.cwd(), "public/design/logo.svg")),
    readFile(join(process.cwd(), "public/design/fallback.svg")),
  ]);

  const logoBase64 = logoData.toString("base64");
  const fallbackBase64 = fallbackData.toString("base64");

  return createImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        backgroundColor: "#ffffff",
      }}
    >
      <img
        src={`data:image/svg+xml;base64,${fallbackBase64}`}
        alt={cfg.ui.og.backgroundAlt}
        width={1200}
        height={630}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          borderRadius: 75,
          padding: "10px",
          position: "absolute",
          bottom: "30px",
          left: "30px",
          maxWidth: 840,
        }}
      >
        <img
          src={`data:image/svg+xml;base64,${logoBase64}`}
          alt={cfg.ui.og.logoAlt}
          width={90}
          height={90}
          style={{
            borderRadius: 75,
            marginRight: 24,
            objectFit: "contain",
            backgroundColor: "white",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 33,
              fontWeight: 700,

              maxWidth: 700,
              color: "#ffffff",
              lineHeight: 1.1,
            }}
          >
            {postTitle}
          </div>
          {postDesc && (
            <div
              style={{
                fontSize: 21,
                maxWidth: 700,
                color: "rgba(255, 255, 255, 0.85)",
                lineHeight: "1.2",
              }}
            >
              {postDesc.slice(0, 120)}
            </div>
          )}
        </div>
      </div>
    </div>,
    size,
  );
}
