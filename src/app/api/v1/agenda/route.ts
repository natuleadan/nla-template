import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getWeekDays, getAvailableSlots } from "@/lib/modules/agenda";
import { getConfig } from "@/lib/locale/config";
import { agendaRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const ip = createHash("sha256").update(getClientIp(request)).digest("hex").slice(0, 16);
  const { allowed } = agendaRateLimit.check(ip);
  if (!allowed) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." }, { status: 429 });
  }
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const day = searchParams.get("day");
  const locale = searchParams.get("locale") || "es";
  try {
    if (day) {
      const slots = await getAvailableSlots(day, locale);
      return NextResponse.json({ day, slots });
    }
    const days = await getWeekDays(locale);
    return NextResponse.json({ days });
  } catch {
    return NextResponse.json(
      { error: getConfig(locale).ui.api.serverErrorEntity("la agenda") },
      { status: 500 },
    );
  }
}
