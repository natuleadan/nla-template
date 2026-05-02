import { notFound } from "next/navigation";
import { ProductDetails } from "@/components/products/product-details";
import { getProduct } from "@/lib/modules/products";
import { getReviews } from "@/lib/modules/reviews";
import { getInventory } from "@/lib/modules/inventory";
import type { Product } from "@/lib/modules/products";
import type { Review } from "@/lib/modules/reviews";
import type { InventoryItem } from "@/lib/modules/inventory";
import { brand, store } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/env";
import { JsonLdProduct } from "@/components/metadata/product-jsonld";
import { JsonLdBreadcrumb } from "@/components/metadata/breadcrumb-jsonld";

interface ProductoContentProps {
  params: Promise<{ slug: string }>;
}

export async function ProductoContent({ params }: ProductoContentProps) {
  const { slug } = await params;
  const baseUrl = getBaseUrl();

  const product = await getProduct(slug);
  if (!product) return notFound();

  const [reviews, inventory] = await Promise.all([
    getReviews(slug),
    getInventory(slug),
  ]);

  const { quantity: _q, unit: _u, ...rest } = product;
  const productWithReviews: Omit<Product, "quantity" | "unit"> & {
    reviews: Review[];
    quantity: number;
    unit: string;
  } = {
    ...rest,
    quantity: Number(_q),
    unit: _u,
    reviews,
  };

  return (
    <>
      <JsonLdBreadcrumb
        levels={[
          { name: "Inicio", item: baseUrl },
          { name: store.page.title, item: `${baseUrl}/tienda` },
          { name: product.name, item: `${baseUrl}/tienda/${slug}` },
        ]}
      />
      <JsonLdProduct
        name={product.name}
        description={product.description || ""}
        image={product.image ? `${baseUrl}${product.image}` : `${baseUrl}/design/fallback.svg`}
        url={`${baseUrl}/tienda/${slug}`}
        price={product.price}
        inStock={inventory.length > 0}
        sku={product.id}
        category={product.category}
        brandName={brand.name}
        brandUrl={baseUrl}
        breadcrumbs={[
          { name: "Inicio", item: baseUrl },
          { name: "Tienda", item: `${baseUrl}/tienda` },
          { name: product.name, item: `${baseUrl}/tienda/${slug}` },
        ]}
        ratingValue={4}
        reviewCount={reviews.length}
      />
      <ProductDetails product={productWithReviews} initialInventory={inventory} />
    </>
  );
}
