import { allProducts as productsData } from "@/lib/config/products";

export interface Product {
  id: string;
  slug: string;
  name: string;
  quantity: string;
  unit: string;
  price: number;
  originalPrice?: number;
  description: string;
  longDescription?: string;
  image: string;
  images?: string[];
  category: string;
  type?: "product" | "service";
  appointment?: boolean;
}

const allProducts: Product[] = [...productsData];

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

export async function createProduct(
  data: Record<string, unknown>,
): Promise<Product | null> {
  if (!data.name || !data.price) return null;
  const id = String(allProducts.length + 1);
  const slug = String(data.name).toLowerCase().replace(/\s+/g, "-");
  const product: Product = {
    id,
    slug,
    name: String(data.name),
    quantity: String(data.quantity || "1"),
    unit: String(data.unit || "u"),
    price: Number(data.price),
    description: String(data.description || ""),
    image: String(data.image || ""),
    category: String(data.category || "food"),
  };
  allProducts.push(product);
  return product;
}

export async function deleteProduct(slug: string): Promise<boolean> {
  const idx = allProducts.findIndex((p) => p.slug === slug);
  if (idx === -1) return false;
  allProducts.splice(idx, 1);
  return true;
}

export async function clearProducts(): Promise<void> {
  allProducts.length = 0;
}
