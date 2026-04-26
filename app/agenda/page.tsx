import { Suspense } from "react";
import { cacheLife } from "next/cache";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { WeeklyCalendar } from "@/components/agenda/weekly-calendar";
import { AgendaSkeleton } from "@/components/agenda/agenda-skeleton";
import { getWeekDays } from "@/lib/modules/agenda";
import { agenda, brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/config/env";
import { JsonLdBreadcrumb } from "@/components/metadata/breadcrumb-jsonld";
import { JsonLdAgendaList } from "@/components/metadata/agenda-list-jsonld";

async function getInitialData() {
  "use cache";
  cacheLife("hours");
  const days = await getWeekDays();
  return { days };
}

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getBaseUrl();
  const title = agenda.page.metaTitle;
  const description = agenda.page.metaDescription;
  const url = `${baseUrl}/agenda`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: brand.name,
      type: "website",
      url,
      images: [
        {
          url: `${baseUrl}/agenda/opengraph-image`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: `${baseUrl}/agenda/twitter-image`,
          width: 1200,
          height: 600,
          alt: title,
        },
      ],
    },
  };
}

export default async function AgendaPage() {
  const { days } = await getInitialData();
  const baseUrl = getBaseUrl();

  const availableSlots = days.flatMap((d) =>
    d.slots
      .filter((s) => s.available)
      .map((s) => ({
        day: d.name,
        time: s.time,
        type: s.type,
      })),
  );

  return (
    <>
      <JsonLdBreadcrumb
        levels={[
          { name: "Inicio", item: baseUrl },
          { name: agenda.page.title, item: `${baseUrl}/agenda` },
        ]}
      />
      <JsonLdAgendaList name={agenda.page.title} slots={availableSlots} baseUrl={baseUrl} />
      <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full py-8">
        <PageHeader
          title={agenda.page.title}
          description={agenda.page.description}
        />
        <Suspense fallback={<AgendaSkeleton />}>
          <WeeklyCalendar days={days} />
        </Suspense>
      </div>
    </>
  );
}
