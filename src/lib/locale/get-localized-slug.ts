import { allProducts as productsEs } from "@/lib/config/data/products.es";
import { allProducts as productsEn } from "@/lib/config/data/products.en";
import { blogPostsData as blogEs } from "@/lib/config/data/blog.es";
import { blogPostsData as blogEn } from "@/lib/config/data/blog.en";
import { paginasData as pagesEs } from "@/lib/config/data/paginas.es";
import { paginasData as pagesEn } from "@/lib/config/data/paginas.en";

type SlugEntity = { id: string; slug: string };

const datasets: Record<string, Record<string, SlugEntity[]>> = {
  tienda: { es: productsEs, en: productsEn },
  blog: { es: blogEs, en: blogEn },
  paginas: { es: pagesEs, en: pagesEn },
};

export function getLocalizedSlug(
  pathname: string,
  toLocale: string,
): string | null {
  const match = pathname.match(/^\/(en|es)\/(tienda|blog|paginas)\/(.+)$/);
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
