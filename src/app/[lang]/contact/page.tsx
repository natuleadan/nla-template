import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ContactForm } from "@/components/forms/contact-form";
import {
  IconMapPin,
  IconPhone,
  IconMail,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import { getBaseUrl, getWhatsappNumber } from "@/lib/env";
import { getConfig, getLocaleFromLang } from "@/lib/locale/config";
import { getAlternateLanguages } from "@/lib/locale/seo";
import { JsonLdContact } from "@/components/metadata/contact-jsonld";
import { JsonLdBreadcrumb } from "@/components/metadata/breadcrumb-jsonld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const cfg = getConfig(lang);
  const baseUrl = getBaseUrl();

  return {
    alternates: getAlternateLanguages(lang, "/contact", baseUrl),
    title: `${cfg.pages.contacto.title} | ${cfg.brand.name}`,
    description: cfg.pages.contacto.description,
    openGraph: {
      title: `${cfg.pages.contacto.title} | ${cfg.brand.name}`,
      description: cfg.pages.contacto.description,
      siteName: cfg.brand.name,
      type: "website",
      url: `${baseUrl}/${lang}/contact`,
      images: [
        {
          url: `${baseUrl}/${lang}/contact/opengraph-image`,
          width: 1200,
          height: 630,
          alt: cfg.pages.contacto.title,
        },
      ],
      locale: getLocaleFromLang(lang),
    },
    twitter: {
      card: "summary_large_image",
      title: `${cfg.pages.contacto.title} | ${cfg.brand.name}`,
      description: cfg.pages.contacto.description,
      images: [
        {
          url: `${baseUrl}/${lang}/contact/twitter-image`,
          width: 1200,
          height: 600,
          alt: cfg.pages.contacto.title,
        },
      ],
    },
    other: { "og:logo": `${baseUrl}/design/logo.svg` },
  };
}

export default async function ContactoPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const cfg = getConfig(lang);

  return (
    <>
      <JsonLdBreadcrumb
        levels={[
          { name: cfg.nav.items[0].label, item: `${getBaseUrl()}/${lang}` },
          {
            name: cfg.pages.contacto.title,
            item: `${getBaseUrl()}/${lang}/contact`,
          },
        ]}
      />
      <JsonLdContact locale={lang} />
      <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full py-8">
        <PageHeader
          title={cfg.pages.contacto.title}
          description={cfg.pages.contacto.description}
          className="mb-8"
        />
        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mt-8 mb-4">
              {cfg.pages.contacto.findUs}
            </h2>
            <div className="flex items-start gap-4 py-3">
              <IconMapPin className="size-5 mt-1 text-primary" />
              <div>
                <p className="font-medium">{cfg.pages.contacto.address}</p>
                <p className="text-sm text-muted-foreground">{cfg.brand.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 py-3">
              <IconPhone className="size-5 mt-1 text-primary" />
              <div>
                <p className="font-medium">{cfg.pages.contacto.phoneLabel}</p>
                <p className="text-sm text-muted-foreground">
                  {getWhatsappNumber() || cfg.brand.phone}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 py-3">
              <IconMail className="size-5 mt-1 text-primary" />
              <div>
                <p className="font-medium">
                  {cfg.pages.contacto.emailLabel || "Email"}
                </p>
                <p className="text-sm text-muted-foreground">{cfg.brand.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-4 py-3">
              <IconBrandWhatsapp className="size-5 mt-1 text-primary" />
              <div>
                <p className="font-medium">
                  {cfg.pages.contacto.whatsappLabel || "WhatsApp"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {getWhatsappNumber() || cfg.brand.phone}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mt-8 mb-4">
              {cfg.pages.contacto.writeUs}
            </h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
}
