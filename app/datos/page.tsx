import type { Metadata } from "next";
import { DynamicPage } from "@/components/layout/dynamic-page";
import { pages, brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/config/env";
import { JsonLdWebPage } from "@/components/metadata/page-jsonld";
import { JsonLdBreadcrumb } from "@/components/metadata/breadcrumb-jsonld";

export const metadata: Metadata = {
  title: `${pages.datos.title} - ${brand.name}`,
  description: pages.datos.description,
  openGraph: {
    title: `${pages.datos.title} - ${brand.name}`,
    description: pages.datos.description,
    siteName: brand.name,
    type: "website",
    url: `${getBaseUrl()}/datos`,
    images: [{ url: `${getBaseUrl()}/datos/opengraph-image`, width: 1200, height: 630, alt: pages.datos.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pages.datos.title} - ${brand.name}`,
    description: pages.datos.description,
    images: [{ url: `${getBaseUrl()}/datos/twitter-image`, width: 1200, height: 600, alt: pages.datos.title }],
  },
};

export default function DatosPage() {
  return (
    <>
      <JsonLdBreadcrumb
        levels={[
          { name: "Inicio", item: getBaseUrl() },
          { name: pages.datos.title, item: `${getBaseUrl()}/datos` },
        ]}
      />
      <JsonLdWebPage
        pageUrl={`${getBaseUrl()}/datos`}
        pageName={pages.datos.title}
        pageDescription={pages.datos.description}
        breadcrumbs={[
          { name: "Inicio", item: getBaseUrl() },
          { name: pages.datos.title, item: `${getBaseUrl()}/datos` },
        ]}
      />
      <DynamicPage pageName="datos" />
    </>
  );
}
