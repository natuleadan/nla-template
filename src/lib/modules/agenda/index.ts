import { agendaData } from "@/lib/config/agenda";

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

const days: AgendaDay[] = [...agendaData];

export async function getWeekDays(): Promise<AgendaDay[]> {
  return days;
}

export async function getDayByIndex(index: number): Promise<AgendaDay | null> {
  return days.find((d) => d.dayOfWeek === index) || null;
}

export async function getDayByName(name: string): Promise<AgendaDay | null> {
  return days.find((d) => d.name === name) || null;
}

export async function clearAgenda(): Promise<void> {
  days.length = 0;
}

export async function resetAgenda(): Promise<void> {
  days.length = 0;
  days.push(...agendaData);
}
