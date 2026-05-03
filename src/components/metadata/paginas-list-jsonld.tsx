import { safeJsonLd } from "@/lib/utils";
import type { WithContext, CollectionPage } from "schema-dts";

interface PageItem {
  title: string;
  url: string;
}

interface JsonLdPaginasListProps {
  name: string;
  total: number;
  pages: PageItem[];
}

export function JsonLdPaginasList({
  name,
  total,
  pages,
}: JsonLdPaginasListProps) {
  const jsonLd: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: total,
      itemListElement: pages.map((p, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: p.url,
        name: p.title,
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
