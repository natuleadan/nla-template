import { safeJsonLd } from "@/lib/utils";
import type { WithContext, ContactPage, Organization } from "schema-dts";
import { brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/config/env";

export function JsonLdContact() {
  const baseUrl = getBaseUrl();

  const jsonLd: WithContext<ContactPage> = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `${brand.name} - Contacto`,
    description: brand.description,
    url: `${baseUrl}/contacto`,
    mainEntity: {
      "@type": "Organization",
      name: brand.name,
      url: baseUrl,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: brand.phone,
        email: brand.email,
        contactType: "customer service",
        availableLanguage: ["es"],
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
