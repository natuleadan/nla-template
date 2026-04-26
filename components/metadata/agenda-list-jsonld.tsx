import { safeJsonLd } from "@/lib/utils";
import type { WithContext, CollectionPage } from "schema-dts";

interface SlotItem {
  day: string;
  time: string;
  type?: string;
}

interface JsonLdAgendaListProps {
  name: string;
  slots: SlotItem[];
  baseUrl: string;
}

export function JsonLdAgendaList({ name, slots, baseUrl }: JsonLdAgendaListProps) {
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
          name: `Cita ${slot.day} ${slot.time}`,
          description: slot.type || "Cita",
          startDate: slot.day,
          location: {
            "@type": "Place",
            name: baseUrl,
          },
          offers: {
            "@type": "Offer",
            url: `${baseUrl}/agenda`,
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
