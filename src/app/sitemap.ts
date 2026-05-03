import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/env";
import { getAllProducts } from "@/lib/modules/products";

export const dynamic = "force-dynamic";
export const revalidate = 300;

const LOCALES = ["es", "en"];

function alternatesFor(path: string, baseUrl: string) {
  return { languages: Object.fromEntries(LOCALES.map((l) => [l, `${baseUrl}/${l}${path}`])) };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rawBaseUrl = getBaseUrl();
  const baseUrl = rawBaseUrl.endsWith("/")
    ? rawBaseUrl.slice(0, -1)
    : rawBaseUrl;

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    const products = await getAllProducts(locale);
    const l = (path: string) => `${baseUrl}/${locale}${path}`;

    entries.push({
      url: l(""),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
      alternates: alternatesFor("", baseUrl),
    });
    entries.push({
      url: l("/tienda"),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
      alternates: alternatesFor("/tienda", baseUrl),
    });
    entries.push({
      url: l("/contacto"),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
      alternates: alternatesFor("/contacto", baseUrl),
    });
    entries.push({
      url: l("/paginas/privacidad"),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
      alternates: alternatesFor("/paginas/privacidad", baseUrl),
    });
    entries.push({
      url: l("/paginas/terminos"),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
      alternates: alternatesFor("/paginas/terminos", baseUrl),
    });

    for (const product of products) {
      entries.push({
        url: `${baseUrl}/${locale}/tienda/${product.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
        alternates: alternatesFor(`/tienda/${product.slug}`, baseUrl),
      });
    }
  }

  return entries;
}
