import { Suspense } from "react";
import { cacheLife } from "next/cache";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { WeeklyCalendar } from "@/components/agenda/weekly-calendar";
import { CurrentTime } from "@/components/agenda/current-time";
import { AgendaSkeleton } from "@/components/agenda/agenda-skeleton";
import { getWeekDays } from "@/lib/modules/agenda";
import { brand } from "@/lib/config/site";
import { getBaseUrl } from "@/lib/env";
import { getConfig, getLocaleFromLang } from "@/lib/locale/config";
import { getAlternateLanguages } from "@/lib/locale/seo";
import { JsonLdBreadcrumb } from "@/components/metadata/breadcrumb-jsonld";
import { JsonLdAgendaList } from "@/components/metadata/agenda-list-jsonld";

function getNextDateForDay(
  dayName: string,
  time: string,
  names: string[],
): string {
  const dayIndex = names.indexOf(dayName);
  if (dayIndex === -1) return "";
  const now = new Date();
  const todayDay = now.getDay();
  let diff = dayIndex - todayDay;
  if (diff <= 0) diff += 7;
  const next = new Date(now);
  next.setDate(now.getDate() + diff);
  return `${next.toISOString().split("T")[0]}T${time}:00`;
}

async function getInitialData(locale: string) {
  "use cache";
  cacheLife("hours");
  const cfg = getConfig(locale);
  const days = await getWeekDays(locale);
  const names = cfg.dayList;
  const availableSlots = days.flatMap((d) =>
    d.slots
      .filter((s) => s.available)
      .map((s) => ({
        startDate: getNextDateForDay(d.name, s.time, names),
        type: s.type,
        description: s.type
          ? cfg.agenda.jsonld.citaDe(s.type, brand.name)
          : cfg.agenda.jsonld.citaDisponible,
      })),
  );
  return { days, availableSlots };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const cfg = getConfig(lang);
  const days = await getWeekDays(lang);
  const baseUrl = getBaseUrl();
  const totalSlots = days.reduce(
    (sum, d) => sum + d.slots.filter((s) => s.available).length,
    0,
  );
  const title = cfg.agenda.page.metaTitle(totalSlots);
  const description = cfg.agenda.page.metaDescription(totalSlots);
  const url = `${baseUrl}/${lang}/schedule`;

  return {
    alternates: getAlternateLanguages(lang, "/schedule", baseUrl),
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
          url: `${baseUrl}/${lang}/schedule/opengraph-image`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: getLocaleFromLang(lang),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        {
          url: `${baseUrl}/${lang}/schedule/twitter-image`,
          width: 1200,
          height: 600,
          alt: title,
        },
      ],
    },
    other: { "og:logo": `${baseUrl}/design/logo.svg` },
  };
}

export default async function AgendaPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const cfg = getConfig(lang);
  const { days, availableSlots } = await getInitialData(lang);
  const baseUrl = getBaseUrl();

  return (
    <>
      <JsonLdBreadcrumb
        levels={[
          { name: cfg.nav.items[0].label, item: `${baseUrl}/${lang}` },
          { name: cfg.agenda.page.title, item: `${baseUrl}/${lang}/schedule` },
        ]}
      />
      <JsonLdAgendaList
        name={cfg.agenda.page.title}
        slots={availableSlots}
        baseUrl={baseUrl}
        businessName={brand.name}
      />
      <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto w-full py-8">
        <div className="flex flex-row items-start justify-between mb-8 gap-4">
          <div className="flex-1 min-w-0">
            <PageHeader
              title={cfg.agenda.page.title}
              description={cfg.agenda.page.description}
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
