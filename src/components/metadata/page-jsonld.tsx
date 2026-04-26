import { safeJsonLd } from "@/lib/utils";
import type { Graph, WebPage, BlogPosting, BreadcrumbList } from "schema-dts";
import { brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/config/env";

interface JsonLdWebPageProps {
  pageUrl: string;
  pageName: string;
  pageDescription: string;
  datePublished?: string;
  dateModified?: string;
  breadcrumbs?: Array<{ name: string; item: string }>;
}

export function JsonLdWebPage({
  pageUrl,
  pageName,
  pageDescription,
  datePublished,
  dateModified,
  breadcrumbs = [],
}: JsonLdWebPageProps) {
  const baseUrl = getBaseUrl();

  const blogPosting = {
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
  } as BlogPosting;

  const jsonLd: Graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}/#webpage`,
        url: pageUrl,
        name: pageName,
        description: pageDescription,
        publisher: { "@id": `${baseUrl}/#organization` },
        inLanguage: "es",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: [".page-title", ".page-summary"],
        },
      } as WebPage,
      blogPosting,
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
