import { safeJsonLd } from "@/lib/utils";
import type { Graph, BlogPosting, BreadcrumbList } from "schema-dts";
import { brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/config/env";

interface JsonLdBlogPostProps {
  title: string;
  description: string;
  image: string;
  url: string;
  author: string;
  publishedAt: string;
  readingTime: number;
  breadcrumbs?: Array<{ name: string; item: string }>;
}

export function JsonLdBlogPost({
  title,
  description,
  image,
  url,
  author,
  publishedAt,
  readingTime,
  breadcrumbs = [],
}: JsonLdBlogPostProps) {
  const baseUrl = getBaseUrl();

  const jsonLd: Graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: title,
        description,
        image,
        datePublished: publishedAt,
        author: {
          "@type": "Person",
          name: author,
        },
        publisher: {
          "@type": "Organization",
          name: brand.name,
          url: baseUrl,
        },
        mainEntityOfPage: { "@id": url },
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
