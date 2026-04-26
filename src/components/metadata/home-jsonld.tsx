import { safeJsonLd } from "@/lib/utils";
import { brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/config/env";
import type { Graph, Organization, WebSite, WebPage, BreadcrumbList } from "schema-dts";

export function HomeJsonLd() {
  const baseUrl = getBaseUrl();

  const jsonLd: Graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: brand.name,
        url: baseUrl,
        description: brand.description,
        logo: `${baseUrl}/design/logo.svg`,
        contactPoint: {
          "@type": "ContactPoint",
          telephone: brand.phone,
          email: brand.email,
          contactType: "customer service",
        },
      } as unknown as Organization,
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        name: brand.name,
        url: baseUrl,
        description: brand.description,
        inLanguage: "es",
        publisher: { "@id": `${baseUrl}/#organization` },
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${baseUrl}/tienda?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        ],
      } as unknown as WebSite,
      {
        "@type": "WebPage",
        "@id": `${baseUrl}/#webpage`,
        url: baseUrl,
        name: brand.name,
        isPartOf: { "@id": `${baseUrl}/#website` },
        about: { "@id": `${baseUrl}/#organization` },
        inLanguage: "es",
      } as unknown as WebPage,
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Inicio",
            item: baseUrl,
          },
        ],
      } as unknown as BreadcrumbList,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
    />
  );
}
