import { cacheLife } from "next/cache";
import { ProductDetails } from "@/components/products/product-details";
import { getProduct } from "@/lib/modules/products";
import { getReviews } from "@/lib/modules/reviews";
import type { Product } from "@/lib/modules/products";
import type { Review } from "@/lib/modules/reviews";
import type { InventoryItem } from "@/lib/config/data/inventory";
import { inventoryData } from "@/lib/config/data/inventory";
import { brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/env";
import { getConfig } from "@/lib/locale/config";
import { resolveSlug } from "@/lib/locale/slug-resolver";
import { JsonLdProduct } from "@/components/metadata/product-jsonld";
import { JsonLdBreadcrumb } from "@/components/metadata/breadcrumb-jsonld";

interface ProductoContentProps {
  params: Promise<{ lang: string; slug: string }>;
}

export async function ProductoContent({ params }: ProductoContentProps) {
  "use cache";
  cacheLife("hours");
  const { lang, slug } = await params;
  const cfg = getConfig(lang);
  const baseUrl = getBaseUrl();

  const { data: product } = await resolveSlug(
    slug,
    lang,
    getProduct,
    "/store",
  );

  const [reviews] = await Promise.all([getReviews(slug, lang)]);
  const inventory = inventoryData[product.id] || [];

  const { quantity: _q, unit: _u, ...rest } = product;
  const productWithReviews: Omit<Product, "quantity" | "unit"> & {
    reviews: Review[];
    quantity: number;
    unit: string;
  } = { ...rest, quantity: Number(_q), unit: _u, reviews };

  return (
    <>
      <JsonLdBreadcrumb
        levels={[
          { name: cfg.nav.items[0].label, item: `${baseUrl}/${lang}` },
          { name: cfg.store.page.title, item: `${baseUrl}/${lang}/store` },
          { name: product.name, item: `${baseUrl}/${lang}/store/${slug}` },
        ]}
      />
      <JsonLdProduct
        name={product.name}
        description={product.description || ""}
        image={
          product.image
            ? `${baseUrl}${product.image}`
            : `${baseUrl}/design/fallback.svg`
        }
        url={`${baseUrl}/${lang}/store/${slug}`}
        price={product.price}
        inStock={inventory.length > 0}
        sku={product.id}
        category={product.category}
        brandName={brand.name}
        brandUrl={baseUrl}
        breadcrumbs={[
          { name: cfg.nav.items[0].label, item: `${baseUrl}/${lang}` },
          { name: cfg.store.page.title, item: `${baseUrl}/${lang}/store` },
          { name: product.name, item: `${baseUrl}/${lang}/store/${slug}` },
        ]}
        ratingValue={4}
        reviewCount={reviews.length}
      />
      <ProductDetails
        product={productWithReviews}
        initialInventory={inventory}
      />
    </>
  );
}
