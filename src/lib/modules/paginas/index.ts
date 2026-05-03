import { paginasData } from "@/lib/config/data/paginas";
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

const pages: PaginaPost[] = PaginaSchema.array().parse([...paginasData]);

export async function getPaginas(
  page = 1,
  limit = 6,
): Promise<{ pages: PaginaPost[]; total: number; hasMore: boolean }> {
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = pages.slice(start, end);
  return {
    pages: paginated,
    total: pages.length,
    hasMore: end < pages.length,
  };
}

export async function getAllPaginas(): Promise<PaginaPost[]> {
  return pages;
}

export async function getPagina(slug: string): Promise<PaginaPost | null> {
  if (!slug || typeof slug !== "string") return null;
  return pages.find((p) => p.slug === slug) || null;
}
