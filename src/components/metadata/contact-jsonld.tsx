import { safeJsonLd } from "@/lib/utils";
import type { WithContext, ContactPage, Organization } from "schema-dts";
import { getBaseUrl } from "@/lib/env";
import { getConfig } from "@/lib/locale/config";

export function JsonLdContact({ locale = "es" }: { locale?: string }) {
  const baseUrl = getBaseUrl();
  const cfg = getConfig(locale);
  const brand = cfg.brand;

  const jsonLd: WithContext<ContactPage> = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `${brand.name}`,
    description: brand.description,
    url: `${baseUrl}/${locale}/contact`,
    mainEntity: {
      "@type": "Organization",
      name: brand.name,
      url: baseUrl,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: brand.phone,
        email: brand.email,
        contactType: "customer service",
        availableLanguage: [locale],
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: brand.address,
        addressCountry: brand.addressCountry,
      },
    } as Organization,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
    />
  );
}
