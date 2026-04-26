import { paginasData } from "@/lib/config/paginas";

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

const pages: PaginaPost[] = [...paginasData];

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

export async function createPagina(
  data: Record<string, unknown>,
): Promise<PaginaPost | null> {
  if (!data.title) return null;
  const id = String(pages.length + 1);
  const slug = String(data.title).toLowerCase().replace(/\s+/g, "-");
  const page: PaginaPost = {
    id,
    slug,
    title: String(data.title),
    excerpt: String(data.excerpt || ""),
    content: String(data.content || ""),
    category: String(data.category || ""),
    publishedAt: String(
      data.publishedAt || new Date().toISOString().split("T")[0],
    ),
  };
  pages.push(page);
  return page;
}

export async function deletePagina(slug: string): Promise<boolean> {
  const idx = pages.findIndex((p) => p.slug === slug);
  if (idx === -1) return false;
  pages.splice(idx, 1);
  return true;
}

export async function clearPaginas(): Promise<void> {
  pages.length = 0;
}
