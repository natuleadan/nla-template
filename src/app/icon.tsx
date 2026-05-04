import { ImageResponse } from "next/og";
import { getBaseUrl } from "@/lib/env";
import { getConfig } from "@/lib/locale/config";
import { detectLocale } from "@/lib/locale/detect";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function Icon() {
  const lang = await detectLocale();
  const cfg = getConfig(lang);
  const logoUrl = `${getBaseUrl()}/design/logo.svg`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={logoUrl}
        alt={cfg.ui.og.logoAlt}
        width={32}
        height={32}
        style={{
          objectFit: "contain",
        }}
      />
    </div>,
    {
      ...size,
    },
  );
}
