import type { Metadata } from "next";
import { DynamicPage } from "@/components/layout/dynamic-page";
import { pages, brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/config/env";
import { JsonLdContact } from "@/components/metadata/contact-jsonld";
import { JsonLdBreadcrumb } from "@/components/metadata/breadcrumb-jsonld";

export const metadata: Metadata = {
  title: `${pages.contacto.title} - ${brand.name}`,
  description: pages.contacto.description,
  openGraph: {
    title: `${pages.contacto.title} - ${brand.name}`,
    description: pages.contacto.description,
    siteName: brand.name,
    type: "website",
    url: `${getBaseUrl()}/contacto`,
    images: [{ url: `${getBaseUrl()}/contacto/opengraph-image`, width: 1200, height: 630, alt: pages.contacto.title }],
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: `${pages.contacto.title} - ${brand.name}`,
    description: pages.contacto.description,
    images: [{ url: `${getBaseUrl()}/contacto/twitter-image`, width: 1200, height: 600, alt: pages.contacto.title }],
  },
  other: {
    "og:logo": `${getBaseUrl()}/design/logo.svg`,
  },
};

export default function ContactoPage() {
  return (
    <>
      <JsonLdBreadcrumb
        levels={[
          { name: "Inicio", item: getBaseUrl() },
          { name: pages.contacto.title, item: `${getBaseUrl()}/contacto` },
        ]}
      />
      <JsonLdContact />
      <DynamicPage pageName="contacto" />
    </>
  );
}
