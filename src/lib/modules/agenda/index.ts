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

export interface Appointment {
  id: string;
  day: string;
  time: string;
  type: string;
  name: string;
  phone: string;
  status: "confirmed" | "cancelled" | "completed" | "noshow";
  createdAt: string;
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

export async function clearAgenda(): Promise<void> {
  days.length = 0;
}

export async function resetAgenda(): Promise<void> {
  days.length = 0;
  days.push(...agendaData);
}

// ─── Redis-backed agenda & appointments (for tools) ────

export async function getAvailableSlots(dayName: string): Promise<AgendaSlot[]> {
  try {
    const { isRedisConfigured, hashGetAll } = await import("@/lib/external/upstash/redis");
    const day = await getDayByName(dayName);
    if (!day) return [];

    if (!isRedisConfigured()) return day.slots.filter((s) => s.available);

    const statuses = await hashGetAll(`bus:agenda:${dayName}`);
    return day.slots.map((s) => ({
      ...s,
      available: statuses[s.time] !== "occupied",
    }));
  } catch { return (await getDayByName(dayName))?.slots.filter((s) => s.available) || []; }
}

export async function isSlotAvailable(dayName: string, time: string): Promise<boolean> {
  try {
    const { isRedisConfigured, hashGet } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) {
      const day = await getDayByName(dayName);
      return day?.slots.some((s) => s.time === time && s.available) || false;
    }
    const status = await hashGet(`bus:agenda:${dayName}`, time);
    return status !== "occupied";
  } catch { return false; }
}

export async function createAppointment(
  day: string, time: string, type: string, name: string, phone: string,
): Promise<Appointment | null> {
  try {
    const { isRedisConfigured, nextId, hashSet, setAdd, hashSet: hset } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) return null;

    const available = await isSlotAvailable(day, time);
    if (!available) return null;

    const id = String(await nextId("bus:appointment:id:counter"));
    const now = new Date().toISOString();
    await hashSet(`bus:appointment:${id}`, "day", day);
    await hashSet(`bus:appointment:${id}`, "time", time);
    await hashSet(`bus:appointment:${id}`, "type", type);
    await hashSet(`bus:appointment:${id}`, "name", name);
    await hashSet(`bus:appointment:${id}`, "phone", phone);
    await hashSet(`bus:appointment:${id}`, "status", "confirmed");
    await hashSet(`bus:appointment:${id}`, "createdAt", now);
    await hset(`bus:agenda:${day}`, time, "occupied");
    await setAdd(`bus:appointments:my:${phone}`, id);
    await setAdd("bus:appointments:all", id);
    return { id, day, time, type, name, phone, status: "confirmed", createdAt: now };
  } catch { return null; }
}

export async function getMyAppointments(phone: string): Promise<Appointment[]> {
  try {
    const { isRedisConfigured, setMembers, hashGetAll } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) return [];

    const ids = await setMembers(`bus:appointments:my:${phone}`);
    const apps: Appointment[] = [];
    for (const id of ids) {
      const h = await hashGetAll(`bus:appointment:${id}`);
      if (h) {
        apps.push({
          id, day: h.day || "", time: h.time || "", type: h.type || "",
          name: h.name || "", phone: h.phone || "",
          status: (h.status as Appointment["status"]) || "confirmed",
          createdAt: h.createdAt || "",
        });
      }
    }
    return apps;
  } catch { return []; }
}

export async function getAllAppointments(): Promise<Appointment[]> {
  try {
    const { isRedisConfigured, setMembers, hashGetAll } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) return [];

    const ids = await setMembers("bus:appointments:all");
    const apps: Appointment[] = [];
    for (const id of ids) {
      const h = await hashGetAll(`bus:appointment:${id}`);
      if (h) {
        apps.push({
          id, day: h.day || "", time: h.time || "", type: h.type || "",
          name: h.name || "", phone: h.phone || "",
          status: (h.status as Appointment["status"]) || "confirmed",
          createdAt: h.createdAt || "",
        });
      }
    }
    return apps;
  } catch { return []; }
}

export async function getAppointmentDetail(id: string): Promise<Appointment | null> {
  try {
    const { isRedisConfigured, hashGetAll } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) return null;

    const h = await hashGetAll(`bus:appointment:${id}`);
    if (!h || !h.day) return null;
    return {
      id, day: h.day, time: h.time, type: h.type || "",
      name: h.name || "", phone: h.phone || "",
      status: (h.status as Appointment["status"]) || "confirmed",
      createdAt: h.createdAt || "",
    };
  } catch { return null; }
}

export async function updateApptStatus(id: string, status: Appointment["status"]): Promise<boolean> {
  try {
    const { isRedisConfigured, hashGet, hashSet, hashDel } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) return false;

    await hashSet(`bus:appointment:${id}`, "status", status);

    if (status === "cancelled") {
      const day = await hashGet(`bus:appointment:${id}`, "day");
      const time = await hashGet(`bus:appointment:${id}`, "time");
      if (day && time) await hashDel(`bus:agenda:${day}`, time);
    }
    return true;
  } catch { return false; }
}
