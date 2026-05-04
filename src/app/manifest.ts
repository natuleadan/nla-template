import type { MetadataRoute } from "next";
import { getConfig } from "@/lib/locale/config";
import { detectLocale } from "@/lib/locale/detect";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const lang = await detectLocale();
  const cfg = getConfig(lang);
  return {
    name: cfg.brand.name,
    short_name: cfg.brand.name,
    description: cfg.brand.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fcfcfc",
    theme_color: "#b32323",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
