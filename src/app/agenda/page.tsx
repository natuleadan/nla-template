import { Suspense } from "react";
import { cacheLife } from "next/cache";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { WeeklyCalendar } from "@/components/agenda/weekly-calendar";
import { CurrentTime } from "@/components/agenda/current-time";
import { AgendaSkeleton } from "@/components/agenda/agenda-skeleton";
import { getWeekDays } from "@/lib/modules/agenda";
import { agenda, brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/config/env";
import { JsonLdBreadcrumb } from "@/components/metadata/breadcrumb-jsonld";
import { JsonLdAgendaList } from "@/components/metadata/agenda-list-jsonld";

function getNextDateForDay(dayName: string, time: string): string {
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const dayIndex = days.indexOf(dayName);
  if (dayIndex === -1) return "";
  const now = new Date();
  const todayDay = now.getDay();
  let diff = dayIndex - todayDay;
  if (diff <= 0) diff += 7;
  const next = new Date(now);
  next.setDate(now.getDate() + diff);
  const dateStr = next.toISOString().split("T")[0];
  return `${dateStr}T${time}:00`;
}

async function getInitialData() {
  "use cache";
  cacheLife("hours");
  const days = await getWeekDays();
  const availableSlots = days.flatMap((d) =>
    d.slots
      .filter((s) => s.available)
      .map((s) => ({
        startDate: getNextDateForDay(d.name, s.time),
        type: s.type,
        description: s.type ? `Cita de ${s.type}` : "Cita disponible",
      })),
  );
  return { days, availableSlots };
}

export async function generateMetadata(): Promise<Metadata> {
  const days = await getWeekDays();
  const baseUrl = getBaseUrl();
  const totalSlots = days.reduce((sum, d) => sum + d.slots.filter((s) => s.available).length, 0);
  const title = agenda.page.metaTitle(totalSlots);
  const description = agenda.page.metaDescription(totalSlots);
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
      locale: "es_ES",
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
    other: {
      "og:logo": `${baseUrl}/design/logo.svg`,
    },
  };
}

export default async function AgendaPage() {
  const { days, availableSlots } = await getInitialData();
  const baseUrl = getBaseUrl();

  return (
    <>
      <JsonLdBreadcrumb
        levels={[
          { name: "Inicio", item: baseUrl },
          { name: agenda.page.title, item: `${baseUrl}/agenda` },
        ]}
      />
      <JsonLdAgendaList
        name={agenda.page.title}
        slots={availableSlots}
        baseUrl={baseUrl}
        businessName={brand.name}
      />
      <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full py-8">
        <div className="flex flex-row items-start justify-between mb-8 gap-4">
          <div className="flex-1 min-w-0">
            <PageHeader
              title={agenda.page.title}
              description={agenda.page.description}
              className=""
            />
          </div>
          <div className="shrink-0 pt-1">
            <CurrentTime />
          </div>
        </div>
        <Suspense fallback={<AgendaSkeleton />}>
          <WeeklyCalendar days={days} />
        </Suspense>
      </div>
    </>
  );
}
