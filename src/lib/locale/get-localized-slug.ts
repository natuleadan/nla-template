import { LOCALES } from "./locales";
import { allProducts as productsEs } from "@/lib/config/data/products.es";
import { allProducts as productsEn } from "@/lib/config/data/products.en";
import { allProducts as productsAr } from "@/lib/config/data/products.ar";
import { blogPostsData as blogEs } from "@/lib/config/data/blog.es";
import { blogPostsData as blogEn } from "@/lib/config/data/blog.en";
import { blogPostsData as blogAr } from "@/lib/config/data/blog.ar";
import { paginasData as pagesEs } from "@/lib/config/data/paginas.es";
import { paginasData as pagesEn } from "@/lib/config/data/paginas.en";
import { paginasData as pagesAr } from "@/lib/config/data/paginas.ar";

type SlugEntity = { id: string; slug: string };

const datasets: Record<string, Record<string, SlugEntity[]>> = {
  store: { es: productsEs, en: productsEn, ar: productsAr },
  news: { es: blogEs, en: blogEn, ar: blogAr },
  pages: { es: pagesEs, en: pagesEn, ar: pagesAr },
};

export function getLocalizedSlug(
  pathname: string,
  toLocale: string,
): string | null {
  const localesPattern = LOCALES.join("|");
  const match = pathname.match(new RegExp(`^/(${localesPattern})\/(store|news|pages)\/(.+)$`));
  if (!match) return null;
  const fromLocale = match[1];
  const mod = match[2];
  const slug = match[3];

  const data = datasets[mod];
  if (!data) return null;

  const entry = data[fromLocale]?.find((e) => e.slug === slug);
  if (!entry) return null;

  const target = data[toLocale]?.find((e) => e.id === entry.id);
  return target?.slug ?? null;
}
