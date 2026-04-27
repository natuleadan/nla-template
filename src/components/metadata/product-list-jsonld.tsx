import { safeJsonLd } from "@/lib/utils";
import type { WithContext, CollectionPage } from "schema-dts";


interface ProductItem {
  name: string;
  url: string;
  image?: string;
}

interface JsonLdProductListProps {
  name: string;
  total: number;
  products: ProductItem[];
}

export function JsonLdProductList({ name, total, products }: JsonLdProductListProps) {
  const jsonLd: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: total,
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
