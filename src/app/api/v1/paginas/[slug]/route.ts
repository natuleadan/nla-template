import { NextResponse } from "next/server";
import { getPagina, deletePagina } from "@/lib/modules/paginas";
import {
  validateApiKey,
  unauthorized,
  badRequest,
  notFound,
  serverError,
} from "@/lib/config/env";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    if (!slug || typeof slug !== "string")
      return badRequest("Slug inválido");
    const page = await getPagina(slug);
    if (!page) return notFound("Página");
    return NextResponse.json(page);
  } catch {
    return serverError("Error al obtener página");
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  if (!validateApiKey(request)) return unauthorized();
  try {
    const { slug } = await params;
    if (!slug || typeof slug !== "string")
      return badRequest("Slug inválido");
    await request.json();
    return NextResponse.json(
      { message: "Página creada", slug },
      { status: 201 },
    );
  } catch {
    return badRequest("JSON inválido");
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  if (!validateApiKey(request)) return unauthorized();
  const { slug } = await params;
  return NextResponse.json({ message: "Página actualizada", slug });
}

export async function DELETE(request: Request, { params }: RouteParams) {
  if (!validateApiKey(request)) return unauthorized();
  try {
    const { slug } = await params;
    if (!slug || typeof slug !== "string")
      return badRequest("Slug inválido");
    const deleted = await deletePagina(slug);
    if (!deleted) return notFound("Página");
    return NextResponse.json({ message: "Página eliminada" });
  } catch {
    return serverError("Error al eliminar página");
  }
}
