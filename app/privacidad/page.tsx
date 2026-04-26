import type { Metadata } from "next";
import { DynamicPage } from "@/components/layout/dynamic-page";
import { pages, brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/config/env";
import { JsonLdWebPage } from "@/components/metadata/page-jsonld";
import { JsonLdBreadcrumb } from "@/components/metadata/breadcrumb-jsonld";

export const metadata: Metadata = {
  title: `${pages.privacidad.title} - ${brand.name}`,
  description: pages.privacidad.description,
  openGraph: {
    title: `${pages.privacidad.title} - ${brand.name}`,
    description: pages.privacidad.description,
    siteName: brand.name,
    type: "website",
    url: `${getBaseUrl()}/privacidad`,
    images: [{ url: `${getBaseUrl()}/privacidad/opengraph-image`, width: 1200, height: 630, alt: pages.privacidad.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${pages.privacidad.title} - ${brand.name}`,
    description: pages.privacidad.description,
    images: [{ url: `${getBaseUrl()}/privacidad/twitter-image`, width: 1200, height: 600, alt: pages.privacidad.title }],
  },
};

export default function PrivacidadPage() {
  return (
    <>
      <JsonLdBreadcrumb
        levels={[
          { name: "Inicio", item: getBaseUrl() },
          { name: pages.privacidad.title, item: `${getBaseUrl()}/privacidad` },
        ]}
      />
      <JsonLdWebPage
        pageUrl={`${getBaseUrl()}/privacidad`}
        pageName={pages.privacidad.title}
        pageDescription={pages.privacidad.description}
        breadcrumbs={[
          { name: "Inicio", item: getBaseUrl() },
          { name: pages.privacidad.title, item: `${getBaseUrl()}/privacidad` },
        ]}
      />
      <DynamicPage pageName="privacidad" />
    </>
  );
}
