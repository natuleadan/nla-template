import { NextResponse } from "next/server";
import { getPagina } from "@/lib/modules/paginas";
import {
  badRequest,
  notFound,
  serverError,
} from "@/lib/env";

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
