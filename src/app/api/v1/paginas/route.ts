import { NextRequest, NextResponse } from "next/server";
import {
  getPaginas,
  createPagina,
  clearPaginas,
} from "@/lib/modules/paginas";
import {
  validateApiKey,
  unauthorized,
  badRequest,
  serverError,
} from "@/lib/config/env";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(
      1,
      parseInt(searchParams.get("page") || "1", 10),
    );
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "6", 10)),
    );
    const data = await getPaginas(page, limit);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener páginas" },
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
    if (!body.title || typeof body.title !== "string")
      return badRequest("title es requerido");
    const page = await createPagina(body);
    if (!page) return badRequest("Error al crear la página");
    return NextResponse.json(
      { message: "Página creada", page },
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
    return NextResponse.json({ message: "Páginas actualizadas" });
  } catch {
    return badRequest("JSON inválido");
  }
}

export async function DELETE() {
  clearPaginas();
  return NextResponse.json({ message: "Páginas eliminadas" });
}
