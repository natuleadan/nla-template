import { allProducts as productsData } from "@/lib/config/data/products";
import { ProductSchema, type Product } from "./schemas";

export type { Product };

const allProducts: Product[] = ProductSchema.array().parse([...productsData]);

export async function getProducts(
  page = 1,
  limit = 8,
): Promise<{ products: Product[]; total: number; hasMore: boolean }> {
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = allProducts.slice(start, end);
  return {
    products: paginated,
    total: allProducts.length,
    hasMore: end < allProducts.length,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  return allProducts;
}

export async function getProduct(slug: string): Promise<Product | null> {
  if (!slug || typeof slug !== "string") return null;
  return allProducts.find((p) => p.slug === slug) || null;
}
