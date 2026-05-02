import { agendaData } from "@/lib/config/data/agenda";
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

const days: AgendaDay[] = AgendaDaySchema.array().parse([...agendaData]);

export async function getWeekDays(): Promise<AgendaDay[]> {
  return days;
}

export async function getDayByIndex(index: number): Promise<AgendaDay | null> {
  return days.find((d) => d.dayOfWeek === index) || null;
}

export async function getDayByName(name: string): Promise<AgendaDay | null> {
  return days.find((d) => d.name === name) || null;
}

export async function getAvailableSlots(dayName: string): Promise<AgendaSlot[]> {
  const day = await getDayByName(dayName);
  if (!day) return [];
  return day.slots.filter((s) => s.available);
}

export async function clearAgenda(): Promise<void> {
  days.length = 0;
}

export async function resetAgenda(): Promise<void> {
  days.length = 0;
  days.push(...agendaData);
}
