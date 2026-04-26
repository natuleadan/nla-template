import { safeJsonLd } from "@/lib/utils";
import type { WithContext, BreadcrumbList } from "schema-dts";

interface BreadcrumbLevel {
  name: string;
  item: string;
}

interface JsonLdBreadcrumbProps {
  levels: BreadcrumbLevel[];
}

export function JsonLdBreadcrumb({ levels }: JsonLdBreadcrumbProps) {
  const jsonLd: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: levels.map((level, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: level.name,
      item: level.item,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
    />
  );
}
