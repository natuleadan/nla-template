import { NextResponse } from "next/server";
import { cacheLife, cacheTag } from "next/cache";
import {
  validateApiKey,
  unauthorized,
  badRequest,
  notFound,
} from "@/lib/config/env";
import { getPageContent, getAllPages, createPage } from "@/lib/modules/pages";

async function getPageData(pageName: string) {
  "use cache";
  cacheLife("days");
  cacheTag("pages", pageName);
  return getPageContent(pageName);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");

  if (!page || typeof page !== "string")
    return badRequest("El parámetro 'page' es requerido");

  const pagesData = getAllPages();
  if (!pagesData[page]) return notFound("Página");

  try {
    const data = await getPageData(page);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener página" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!validateApiKey(request)) return unauthorized();

  try {
    const body = await request.json();
    if (!body || typeof body !== "object")
      return badRequest("Cuerpo JSON requerido");
    if (!body.title || typeof body.title !== "string")
      return badRequest("El campo 'title' es requerido");
    if (!body.page || typeof body.page !== "string")
      return badRequest("El campo 'page' es requerido");

    const newPage = createPage(body.page, {
      title: body.title,
      description: body.description || "Página creada",
      content: body.content || [],
    });

    return NextResponse.json(
      { message: "Página creada", ...newPage },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof SyntaxError) return badRequest("JSON inválido");
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!validateApiKey(request)) return unauthorized();

  try {
    const body = await request.json();
    if (!body || typeof body !== "object")
      return badRequest("Cuerpo JSON requerido");
    return NextResponse.json({ message: "Páginas actualizadas", ...body });
  } catch (error) {
    if (error instanceof SyntaxError) return badRequest("JSON inválido");
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!validateApiKey(request)) return unauthorized();
  return NextResponse.json({ message: "Páginas eliminadas" });
}
