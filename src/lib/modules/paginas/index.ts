import { paginasData as paginasDataEs } from "@/lib/config/data/paginas.es";
import { paginasData as paginasDataEn } from "@/lib/config/data/paginas.en";
import { PaginaSchema } from "./schemas";

export interface PaginaPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  publishedAt: string;
  updatedAt?: string;
}

const pages = {
  es: PaginaSchema.array().parse([...paginasDataEs]),
  en: PaginaSchema.array().parse([...paginasDataEn]),
};

function getData(locale = "es") {
  return pages[locale as keyof typeof pages] || pages.es;
}

export async function getPaginas(
  page = 1,
  limit = 6,
  locale = "es",
): Promise<{ pages: PaginaPost[]; total: number; hasMore: boolean }> {
  const data = getData(locale);
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = data.slice(start, end);
  return {
    pages: paginated,
    total: data.length,
    hasMore: end < data.length,
  };
}

export async function getAllPaginas(locale = "es"): Promise<PaginaPost[]> {
  return getData(locale);
}

export async function getPagina(
  slug: string,
  locale = "es",
): Promise<PaginaPost | null> {
  if (!slug || typeof slug !== "string") return null;
  return getData(locale).find((p) => p.slug === slug) || null;
}
