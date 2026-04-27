import type { MetadataRoute } from "next";
import { getBaseUrl, getIndexingEnabled } from "@/lib/env";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  if (!getIndexingEnabled()) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/tienda",
          "/tienda/*",
          "/contacto",
          "/privacidad",
          "/terminos",
          "/datos",
          "/llms.txt",
          "/sitemap.xml",
          "/robots.txt",
          "/manifest.webmanifest",
          "/favicon.ico",
        ],
        disallow: [
          "/api/",
          "/api/*",
          "/_next/",
          "/_next/*",
          "/static/",
          "/static/*",
          "/*?*",
          "/*sort=",
          "/*filter=",
        ],
        crawlDelay: 1,
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "CCBot", "Google-Extended"],
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
