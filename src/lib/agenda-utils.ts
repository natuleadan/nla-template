import { getWeekDays, type AgendaDay, type AgendaSlot } from "@/lib/modules/agenda";

export interface AgendaSlotInfo {
  dayName: string;
  time: string;
  type: string;
}

export function getAppointmentTypes(days: AgendaDay[]): string[] {
  const types = new Set<string>();
  for (const day of days) {
    for (const slot of day.slots) {
      if (slot.available && slot.type) types.add(slot.type);
    }
  }
  return Array.from(types);
}

export function getUpcomingSlots(days: AgendaDay[], limit = 10): AgendaSlotInfo[] {
  const now = new Date();
  const todayDayOfWeek = now.getDay();
  const cutoffMinutes = now.getHours() * 60 + now.getMinutes() + 30;

  const daysOrdered = [0, 1, 2, 3, 4, 5, 6]
    .map((offset) => {
      const d = new Date(now);
      d.setDate(d.getDate() + offset);
      return days.find((day) => day.dayOfWeek === d.getDay());
    })
    .filter(Boolean) as AgendaDay[];

  const result: AgendaSlotInfo[] = [];

  for (const day of daysOrdered) {
    if (result.length >= limit) break;
    const isToday = day.dayOfWeek === todayDayOfWeek;

    const slots = day.slots.filter((s) => {
      if (!s.available) return false;
      if (!isToday) return true;
      const [h, m] = s.time.split(":").map(Number);
      return h * 60 + m >= cutoffMinutes;
    });

    for (const slot of slots) {
      if (result.length >= limit) break;
      result.push({
        dayName: day.name,
        time: slot.time,
        type: slot.type || "",
      });
    }
  }

  return result;
}

export function getNextAvailableDaySlots(
  days: AgendaDay[],
  maxItems = 3,
): { slots: AgendaSlotInfo[]; title: string } {
  const upcoming = getUpcomingSlots(days, maxItems);
  if (upcoming.length === 0) return { slots: [], title: "Agenda" };

  const now = new Date();
  const today = days.find((d) => d.dayOfWeek === now.getDay());
  const hasTodaySlots = upcoming.filter((s) => s.dayName === today?.name);
  if (hasTodaySlots.length > 0) {
    return { slots: hasTodaySlots.slice(0, maxItems), title: "Agenda" };
  }

  const firstDayName = upcoming[0].dayName;
  return { slots: upcoming.slice(0, maxItems), title: `Agenda para ${firstDayName}` };
}

export function getSlotsByType(days: AgendaDay[], type: string): AgendaSlotInfo[] {
  const now = new Date();
  const todayDayOfWeek = now.getDay();
  const cutoffMinutes = now.getHours() * 60 + now.getMinutes() + 30;

  const daysOrdered = [0, 1, 2, 3, 4, 5, 6]
    .map((offset) => {
      const d = new Date(now);
      d.setDate(d.getDate() + offset);
      return days.find((day) => day.dayOfWeek === d.getDay());
    })
    .filter(Boolean) as AgendaDay[];

  const result: AgendaSlotInfo[] = [];

  for (const day of daysOrdered) {
    const isToday = day.dayOfWeek === todayDayOfWeek;

    const slots = day.slots.filter((s) => {
      if (!s.available || s.type !== type) return false;
      if (!isToday) return true;
      const [h, m] = s.time.split(":").map(Number);
      return h * 60 + m >= cutoffMinutes;
    });

    for (const slot of slots) {
      result.push({
        dayName: day.name,
        time: slot.time,
        type: slot.type || "",
      });
    }
  }

  return result;
}
