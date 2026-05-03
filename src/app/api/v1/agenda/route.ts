import { NextResponse } from "next/server";
import { getWeekDays, getAvailableSlots } from "@/lib/modules/agenda";
import { badRequest } from "@/lib/env";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const day = searchParams.get("day");
    if (day) {
      const slots = await getAvailableSlots(day);
      return NextResponse.json({ day, slots });
    }
    const days = await getWeekDays();
    return NextResponse.json({ days });
  } catch {
    return NextResponse.json(
      { error: "Error al obtener la agenda" },
      { status: 500 },
    );
  }
}
