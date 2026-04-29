import { NextResponse } from "next/server";
import { getWeekDays, clearAgenda, getAvailableSlots } from "@/lib/modules/agenda";
import {
  validateApiKey,
  unauthorized,
  badRequest,
  serverError,
} from "@/lib/env";

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

export async function POST(request: Request) {
  if (!validateApiKey(request)) return unauthorized();
  try {
    const body = await request.json();
    if (!body || typeof body !== "object")
      return badRequest("RequestBody inválido");
    return NextResponse.json(
      { message: "Semana creada" },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof SyntaxError)
      return badRequest("JSON inválido");
    return serverError(error);
  }
}

export async function PUT(request: Request) {
  if (!validateApiKey(request)) return unauthorized();
  try {
    await request.json();
    return NextResponse.json({ message: "Semana actualizada" });
  } catch {
    return badRequest("JSON inválido");
  }
}

export async function DELETE() {
  clearAgenda();
  return NextResponse.json({ message: "Agenda eliminada" });
}
