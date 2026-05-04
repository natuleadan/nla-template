import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { getPagina } from "@/lib/modules/paginas";
import { getConfig } from "@/lib/locale/config";

export const size = {
  width: 1200,
  height: 600,
};

export const contentType = "image/png";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ lang: string; slug: string }>;
}

export default async function TwitterImage({ params }: RouteParams) {
  const { lang, slug } = await params;
  const cfg = getConfig(lang);

  let pageName = cfg.paginas.og.fallbackTitle;
  let pageDesc = "";

  try {
    const page = await getPagina(slug, lang);
    if (page) {
      pageName = page.title || cfg.paginas.og.fallbackTitle;
      pageDesc = page.excerpt || "";
    }
  } catch {}

  const [logoData, fallbackData] = await Promise.all([
    readFile(join(process.cwd(), "public/design/logo.svg")),
    readFile(join(process.cwd(), "public/design/fallback.svg")),
  ]);

  const logoBase64 = logoData.toString("base64");
  const fallbackBase64 = fallbackData.toString("base64");

  return new ImageResponse(
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
            {pageName}
          </div>
          {pageDesc && (
            <div
              style={{
                fontSize: 21,
                maxWidth: 700,
                color: "rgba(255, 255, 255, 0.85)",
                lineHeight: "1.2",
              }}
            >
              {pageDesc.slice(0, 120)}
            </div>
          )}
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
