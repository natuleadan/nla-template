import { ImageResponse } from "next/og";
import { getBaseUrl } from "@/lib/env";
import { getConfig } from "@/lib/locale/config";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";
export const dynamic = "force-dynamic";

export default async function AppleIcon() {
  const cfg = getConfig("en");
  const logoUrl = `${getBaseUrl()}/design/logo.svg`;

  return new ImageResponse(
    (
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
          width={180}
          height={180}
          style={{
            objectFit: "contain",
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
