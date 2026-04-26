import type { Metadata } from "next";
import { DynamicPage } from "@/components/layout/dynamic-page";
import { pages, brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/config/env";
import { JsonLdWebPage } from "@/components/metadata/page-jsonld";
import { JsonLdBreadcrumb } from "@/components/metadata/breadcrumb-jsonld";

export const metadata: Metadata = {
  title: `${pages.terminos.title} - ${brand.name}`,
  description: pages.terminos.description,
  openGraph: {
    title: `${pages.terminos.title} - ${brand.name}`,
    description: pages.terminos.description,
    siteName: brand.name,
    type: "website",
    url: `${getBaseUrl()}/terminos`,
    images: [{ url: `${getBaseUrl()}/terminos/opengraph-image`, width: 1200, height: 630, alt: pages.terminos.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pages.terminos.title} - ${brand.name}`,
    description: pages.terminos.description,
    images: [{ url: `${getBaseUrl()}/terminos/twitter-image`, width: 1200, height: 600, alt: pages.terminos.title }],
  },
};

export default function TerminosPage() {
  return (
    <>
      <JsonLdBreadcrumb
        levels={[
          { name: "Inicio", item: getBaseUrl() },
          { name: pages.terminos.title, item: `${getBaseUrl()}/terminos` },
        ]}
      />
      <JsonLdWebPage
        pageUrl={`${getBaseUrl()}/terminos`}
        pageName={pages.terminos.title}
        pageDescription={pages.terminos.description}
        breadcrumbs={[
          { name: "Inicio", item: getBaseUrl() },
          { name: pages.terminos.title, item: `${getBaseUrl()}/terminos` },
        ]}
      />
      <DynamicPage pageName="terminos" />
    </>
  );
}
