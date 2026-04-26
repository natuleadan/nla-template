import { safeJsonLd } from "@/lib/utils";
import type { WithContext, CollectionPage } from "schema-dts";
import { store } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/config/env";

interface ProductItem {
  name: string;
  url: string;
  image?: string;
}

interface JsonLdProductListProps {
  name: string;
  products: ProductItem[];
}

export function JsonLdProductList({ name, products }: JsonLdProductListProps) {
  const jsonLd: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: product.url,
        name: product.name,
        image: product.image,
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
    />
  );
}
