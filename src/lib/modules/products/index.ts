import { allProducts as productsDataEs } from "@/lib/config/data/products.es";
import { allProducts as productsDataEn } from "@/lib/config/data/products.en";
import { allProducts as productsDataAr } from "@/lib/config/data/products.ar";
import { ProductSchema, type Product } from "./schemas";

export type { Product };

const allProducts = {
  es: ProductSchema.array().parse([...productsDataEs]),
  en: ProductSchema.array().parse([...productsDataEn]),
  ar: ProductSchema.array().parse([...productsDataAr]),
};

function getData(locale = "es"): Product[] {
  return allProducts[locale as keyof typeof allProducts] || allProducts.es;
}

export async function getProducts(
  page = 1,
  limit = 8,
  locale = "es",
): Promise<{ products: Product[]; total: number; hasMore: boolean }> {
  const data = getData(locale);
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = data.slice(start, end);
  return {
    products: paginated,
    total: data.length,
    hasMore: end < data.length,
  };
}

export async function getAllProducts(locale = "es"): Promise<Product[]> {
  return getData(locale);
}

export async function getProduct(
  slug: string,
  locale = "es",
): Promise<Product | null> {
  if (!slug || typeof slug !== "string") return null;
  return getData(locale).find((p) => p.slug === slug) || null;
}

export async function getProductSlugById(
  id: string,
  locale = "es",
): Promise<string | undefined> {
  return getData(locale).find((p) => p.id === id)?.slug;
}

export function getProductMap(locale = "es"): Record<string, { name: string; price: number; slug: string }> {
  return getData(locale).reduce((acc, p) => {
    acc[p.id] = { name: p.name, price: p.price, slug: p.slug };
    return acc;
  }, {} as Record<string, { name: string; price: number; slug: string }>);
}
