import { safeJsonLd } from "@/lib/utils";
import type { Graph, Product, Offer, BreadcrumbList } from "schema-dts";

interface JsonLdProductProps {
  name: string;
  description: string;
  image: string;
  url: string;
  price: number;
  currency?: string;
  inStock?: boolean;
  sku?: string;
  brandName: string;
  brandUrl: string;
  breadcrumbs?: Array<{ name: string; item: string }>;
  ratingValue?: number;
  reviewCount?: number;
}

export function JsonLdProduct({
  name,
  description,
  image,
  url,
  price,
  currency = "USD",
  inStock = true,
  sku,
  brandName,
  brandUrl,
  breadcrumbs = [],
  ratingValue,
  reviewCount,
}: JsonLdProductProps) {
  const offer: Offer = {
    "@type": "Offer",
    price,
    priceCurrency: currency,
    priceValidUntil: new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
    )
      .toISOString()
      .split("T")[0],
    availability: inStock
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    url,
    seller: { "@id": `${brandUrl}/#organization` },
  };

  const jsonLd: Graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name,
        description,
        image,
        sku,
        brand: { "@id": `${brandUrl}/#organization` },
        offers: offer,
        aggregateRating:
          reviewCount && reviewCount > 0
            ? {
                "@type": "AggregateRating",
                ratingValue: ratingValue || 0,
                reviewCount,
              }
            : undefined,
      } as Product,
      {
        "@type": "Organization",
        "@id": `${brandUrl}/#organization`,
        name: brandName,
        url: brandUrl,
      },
      ...(breadcrumbs.length > 0
        ? [
            {
              "@type": "BreadcrumbList",
              itemListElement: breadcrumbs.map((b, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: b.name,
                item: b.item,
              })),
            } as BreadcrumbList,
          ]
        : []),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
    />
  );
}
