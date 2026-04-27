import { safeJsonLd } from "@/lib/utils";
import type { WithContext, CollectionPage } from "schema-dts";

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

export function JsonLdAgendaList({ name, slots, baseUrl, businessName }: JsonLdAgendaListProps) {
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
            ? `Cita de ${slot.type} - ${businessName}`
            : `Cita - ${businessName}`,
          description: slot.description || slot.type || "Cita disponible",
          startDate: slot.startDate,
          location: {
            "@type": "Place",
            name: businessName,
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
