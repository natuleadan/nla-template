import { safeJsonLd } from "@/lib/utils";
import type { Graph, WebPage, BreadcrumbList, Thing } from "schema-dts";
import { brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/env";

interface JsonLdWebPageProps {
  pageUrl: string;
  pageName: string;
  pageDescription: string;
  datePublished?: string;
  dateModified?: string;
  breadcrumbs?: Array<{ name: string; item: string }>;
  locale?: string;
}

export function JsonLdWebPage({
  pageUrl,
  pageName,
  pageDescription,
  datePublished,
  dateModified,
  breadcrumbs = [],
  locale = "es",
}: JsonLdWebPageProps) {
  const baseUrl = getBaseUrl();

  const graph: Thing[] = [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}/#webpage`,
      url: pageUrl,
      name: pageName,
      description: pageDescription,
      publisher: { "@id": `${baseUrl}/#organization` },
      inLanguage: locale,
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: [".page-title", ".page-summary"],
      },
    } as Thing,
  ];

  if (datePublished) {
    graph.push({
      "@type": "BlogPosting",
      "@id": `${pageUrl}/#article`,
      headline: pageName,
      description: pageDescription,
      datePublished,
      dateModified: dateModified || datePublished,
      author: {
        "@type": "Organization",
        name: brand.name,
      },
      publisher: { "@id": `${baseUrl}/#organization` },
      mainEntityOfPage: { "@id": `${pageUrl}/#webpage` },
    } as any);
  }

  if (breadcrumbs.length > 0) {
    graph.push({
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.name,
        item: b.item,
      })),
    } as BreadcrumbList);
  }

  const jsonLd: Graph = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
    />
  );
}
