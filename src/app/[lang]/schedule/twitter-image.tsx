import { ImageResponse } from "next/og";
import { getConfig } from "@/lib/locale/config";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = {
  width: 1200,
  height: 600,
};

export const contentType = "image/png";

export const dynamic = "force-dynamic";

export default async function TwitterImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const cfg = getConfig(lang);

  const [bgData, logoData] = await Promise.all([
    readFile(join(process.cwd(), "public/design/fondo.svg")),
    readFile(join(process.cwd(), "public/design/logo.svg")),
  ]);

  const bgBase64 = bgData.toString("base64");
  const logoBase64 = logoData.toString("base64");

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
      }}
    >
      <img
        src={`data:image/svg+xml;base64,${bgBase64}`}
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
      <img
        src={`data:image/svg+xml;base64,${logoBase64}`}
        alt={cfg.ui.og.logoAlt}
        width={160}
        height={160}
        style={{
          position: "absolute",
          top: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          borderRadius: "16px",
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
          marginTop: 70,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: "#ffffff",
            textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
            marginBottom: 16,
          }}
        >
          {cfg.agenda.page.title}
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#ffffff",
            textShadow: "1px 1px 4px rgba(0,0,0,0.7)",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
          }}
        >
          {cfg.agenda.page.description}
        </div>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
