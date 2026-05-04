import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/env";
import { getAllProducts, getProductSlugById } from "@/lib/modules/products";
import { getAllPosts, getPostSlugById } from "@/lib/modules/blog";
import { getAllPaginas, getPaginaSlugById } from "@/lib/modules/paginas";
import { staticRoutes, entityRoutes } from "@/lib/locale/routes";

const LOCALES = ["es", "en"];

export const dynamic = "force-dynamic";
export const revalidate = 300;

function alternatesFor(path: string, baseUrl: string) {
  return {
    languages: Object.fromEntries(LOCALES.map((l) => [l, `${baseUrl}/${l}${path}`])),
  };
}

async function alternatesForEntity(
  id: string,
  prefix: string,
  getSlug: (id: string, locale: string) => Promise<string | undefined>,
  baseUrl: string,
) {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    const slug = await getSlug(id, locale);
    languages[locale] = `${baseUrl}/${locale}${prefix}${slug}`;
  }
  return { languages };
}

const entities: Record<string, {
  getAll: (locale: string) => Promise<Array<{ id: string; slug: string }>>;
  getSlugById: (id: string, locale: string) => Promise<string | undefined>;
}> = {
  "/store/": { getAll: getAllProducts, getSlugById: getProductSlugById },
  "/news/": { getAll: getAllPosts, getSlugById: getPostSlugById },
  "/pages/": { getAll: getAllPaginas, getSlugById: getPaginaSlugById },
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rawBaseUrl = getBaseUrl();
  const baseUrl = rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticRoutes) {
    entries.push({
      url: `${baseUrl}/es${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFreq,
      priority: page.priority,
      alternates: alternatesFor(page.path, baseUrl),
    });
  }

  for (const group of entityRoutes) {
    const entity = entities[group.prefix];
    if (!entity) continue;
    const data = await entity.getAll("es");
    for (const item of data) {
      entries.push({
        url: `${baseUrl}/es${group.prefix}${item.slug}`,
        lastModified: new Date(),
        changeFrequency: group.changeFreq,
        priority: group.priority,
        alternates: await alternatesForEntity(item.id, group.prefix, entity.getSlugById, baseUrl),
      });
    }
  }

  return entries;
}
