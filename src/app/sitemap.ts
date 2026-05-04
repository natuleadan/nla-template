import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/lib/env";
import {
  getAllProducts,
  getProductSlugById,
} from "@/lib/modules/products";
import { getAllPosts, getPostSlugById } from "@/lib/modules/blog";
import { getAllPaginas, getPaginaSlugById } from "@/lib/modules/paginas";

const LOCALES = ["es", "en"];

export const dynamic = "force-dynamic";
export const revalidate = 300;

function alternatesFor(path: string, baseUrl: string) {
  return {
    languages: Object.fromEntries(
      LOCALES.map((l) => [l, `${baseUrl}/${l}${path}`]),
    ),
  };
}

async function alternatesForEntity<T>(
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rawBaseUrl = getBaseUrl();
  const baseUrl = rawBaseUrl.endsWith("/")
    ? rawBaseUrl.slice(0, -1)
    : rawBaseUrl;

  const entries: MetadataRoute.Sitemap = [];

  const staticPages = [
    { path: "", priority: 1, changeFreq: "daily" as const },
    { path: "/store", priority: 0.9, changeFreq: "daily" as const },
    { path: "/news", priority: 0.9, changeFreq: "daily" as const },
    { path: "/schedule", priority: 0.6, changeFreq: "weekly" as const },
    { path: "/contact", priority: 0.5, changeFreq: "monthly" as const },
    { path: "/certificates", priority: 0.4, changeFreq: "monthly" as const },
  ];

  for (const page of staticPages) {
    entries.push({
      url: `${baseUrl}/es${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFreq,
      priority: page.priority,
      alternates: alternatesFor(page.path, baseUrl),
    });
  }

  const allProductsEs = await getAllProducts("es");
  for (const product of allProductsEs) {
    entries.push({
      url: `${baseUrl}/es/store/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: await alternatesForEntity(
        product.id,
        "/store/",
        getProductSlugById,
        baseUrl,
      ),
    });
  }

  const allPostsEs = await getAllPosts("es");
  for (const post of allPostsEs) {
    entries.push({
      url: `${baseUrl}/es/news/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: await alternatesForEntity(
        post.id,
        "/news/",
        getPostSlugById,
        baseUrl,
      ),
    });
  }

  const allPaginasEs = await getAllPaginas("es");
  for (const page of allPaginasEs) {
    entries.push({
      url: `${baseUrl}/es/pages/${page.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
      alternates: await alternatesForEntity(
        page.id,
        "/pages/",
        getPaginaSlugById,
        baseUrl,
      ),
    });
  }

  return entries;
}
