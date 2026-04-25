import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/products/product-details";
import { getProduct } from "@/lib/modules/products";
import { getReviews } from "@/lib/modules/reviews";
import { getInventory } from "@/lib/modules/inventory";
import type { Product } from "@/lib/modules/products";
import type { Review } from "@/lib/modules/reviews";
import type { InventoryItem } from "@/lib/modules/inventory";

interface ProductoContentProps {
  params: Promise<{ slug: string }>;
}

export async function ProductoContent({ params }: ProductoContentProps) {
  const { slug } = await params;
  
  const product = await getProduct(slug);
  if (!product) return notFound();

  const [reviews, inventory] = await Promise.all([
    getReviews(slug),
    getInventory(slug),
  ]);

  const productWithReviews: Product & { reviews: Review[]; quantity: number; unit: string } = {
    ...product,
    quantity: Number(product.quantity),
    unit: product.unit,
    reviews,
  };

  return <ProductDetails product={productWithReviews} initialInventory={inventory} />;
}