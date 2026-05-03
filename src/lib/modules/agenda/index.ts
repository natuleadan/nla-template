import { agendaData as agendaDataEs } from "@/lib/config/data/agenda.es";
import { agendaData as agendaDataEn } from "@/lib/config/data/agenda.en";
import { AgendaDaySchema } from "./schemas";

export interface AgendaSlot {
  time: string;
  available: boolean;
  type?: string;
}

export interface AgendaDay {
  name: string;
  nameShort: string;
  dayOfWeek: number;
  slots: AgendaSlot[];
}

const days = {
  es: AgendaDaySchema.array().parse([...agendaDataEs]),
  en: AgendaDaySchema.array().parse([...agendaDataEn]),
};

function getData(locale = "es") {
  return days[locale as keyof typeof days] || days.es;
}

export async function getWeekDays(locale = "es"): Promise<AgendaDay[]> {
  return getData(locale);
}

export async function getDayByIndex(index: number, locale = "es"): Promise<AgendaDay | null> {
  return getData(locale).find((d) => d.dayOfWeek === index) || null;
}

export async function getDayByName(name: string, locale = "es"): Promise<AgendaDay | null> {
  return getData(locale).find((d) => d.name === name) || null;
}

export async function getAvailableSlots(dayName: string, locale = "es"): Promise<AgendaSlot[]> {
  const day = await getDayByName(dayName, locale);
  if (!day) return [];
  return day.slots.filter((s) => s.available);
}
