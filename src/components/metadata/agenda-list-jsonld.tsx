"use client";

import { safeJsonLd } from "@/lib/utils";
import type { WithContext, CollectionPage } from "schema-dts";
import { useLang } from "@/hooks/use-lang";
import { getConfig } from "@/lib/locale/config";

interface SlotItem {
  startDate: string;
  type?: string;
  description?: string;
}

interface JsonLdAgendaListProps {
  name: string;
  slots: SlotItem[];
  baseUrl: string;
  businessName: string;
}

export function JsonLdAgendaList({
  name,
  slots,
  baseUrl,
  businessName,
}: JsonLdAgendaListProps) {
  const lang = useLang();
  const cfg = getConfig(lang);
  const jsonLd: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: slots.length,
      itemListElement: slots.map((slot, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Event",
          name: slot.type
            ? cfg.agenda.jsonld.citaDe(slot.type, businessName)
            : cfg.agenda.jsonld.cita(businessName),
          description:
            slot.description || slot.type || cfg.agenda.jsonld.citaDisponible,
          startDate: slot.startDate,
          location: {
            "@type": "Place",
            name: businessName,
          },
          offers: {
            "@type": "Offer",
            url: `${baseUrl}/${lang}/schedule`,
            availability: "https://schema.org/InStock",
          },
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
    />
  );
}
