import type { MetadataRoute } from "next";
import { getConfig } from "@/lib/locale/config";

export default function manifest(): MetadataRoute.Manifest {
  const cfg = getConfig("en");
  return {
    name: cfg.brand.name,
    short_name: cfg.brand.name,
    description: cfg.brand.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
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
