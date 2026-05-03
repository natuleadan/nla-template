import { NextResponse } from "next/server";
import { getWeekDays, getAvailableSlots } from "@/lib/modules/agenda";
import { badRequest } from "@/lib/env";
import { getConfig } from "@/lib/locale/config";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const day = searchParams.get("day");
    const locale = searchParams.get("locale") || "es";
    if (day) {
      const slots = await getAvailableSlots(day, locale);
      return NextResponse.json({ day, slots });
    }
    const days = await getWeekDays(locale);
    return NextResponse.json({ days });
  } catch {
    return NextResponse.json({ error: getConfig("es").ui.api.serverErrorEntity("la agenda") }, { status: 500 });
  }
}
