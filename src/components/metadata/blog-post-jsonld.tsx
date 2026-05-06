import { safeJsonLd } from "@/lib/utils";
import type { Graph, BlogPosting, BreadcrumbList } from "schema-dts";
import { getBaseUrl } from "@/lib/env";
import { getConfig } from "@/lib/locale/config";

interface JsonLdBlogPostProps {
  title: string;
  description: string;
  image: string;
  url: string;
  author: string;
  publishedAt: string;
  dateModified?: string;
  readingTime: number;
  breadcrumbs?: Array<{ name: string; item: string }>;
  locale?: string;
}

export function JsonLdBlogPost({
  title,
  description,
  image,
  url,
  author,
  publishedAt,
  dateModified,
  readingTime,
  breadcrumbs = [],
  locale = "es",
}: JsonLdBlogPostProps) {
  const baseUrl = getBaseUrl();
  const cfg = getConfig(locale);

  const jsonLd: Graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}/#article`,
        headline: title,
        description,
        image,
        datePublished: publishedAt,
        ...(dateModified && { dateModified }),
        author: {
          "@type": "Person",
          name: author,
        },
        publisher: {
          "@type": "Organization",
          name: cfg.brand.name,
          url: baseUrl,
        },
        mainEntityOfPage: { "@id": url },
        inLanguage: locale,
        timeRequired: `PT${readingTime}M`,
      } as BlogPosting,
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
