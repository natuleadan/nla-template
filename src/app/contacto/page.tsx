import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ContactForm } from "@/components/forms/contact-form";
import { IconMapPin, IconPhone, IconMail, IconBrandWhatsapp } from "@tabler/icons-react";
import { pages, brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/env";
import { JsonLdContact } from "@/components/metadata/contact-jsonld";
import { JsonLdBreadcrumb } from "@/components/metadata/breadcrumb-jsonld";

export const metadata: Metadata = {
  title: `${pages.contacto.title} | ${brand.name}`,
  description: pages.contacto.description,
  openGraph: {
    title: `${pages.contacto.title} | ${brand.name}`,
    description: pages.contacto.description,
    siteName: brand.name,
    type: "website",
    url: `${getBaseUrl()}/contacto`,
    images: [{ url: `${getBaseUrl()}/contacto/opengraph-image`, width: 1200, height: 630, alt: pages.contacto.title }],
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: `${pages.contacto.title} | ${brand.name}`,
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
      <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full py-8">
        <PageHeader title={pages.contacto.title} description={pages.contacto.description} />

        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mt-8 mb-4">{pages.contacto.findUs}</h2>

            <div className="flex items-start gap-4 py-3">
              <IconMapPin className="size-5 mt-1 text-primary" />
              <div>
                <p className="font-medium">Dirección</p>
                <p className="text-sm text-muted-foreground">{brand.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 py-3">
              <IconPhone className="size-5 mt-1 text-primary" />
              <div>
                <p className="font-medium">Teléfono</p>
                <p className="text-sm text-muted-foreground">{brand.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 py-3">
              <IconMail className="size-5 mt-1 text-primary" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{brand.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 py-3">
              <IconBrandWhatsapp className="size-5 mt-1 text-primary" />
              <div>
                <p className="font-medium">WhatsApp</p>
                <p className="text-sm text-muted-foreground">{brand.phone}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold mt-8 mb-4">{pages.contacto.writeUs}</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}
