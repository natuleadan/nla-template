import { NextResponse } from "next/server";
import { getPost, deletePost } from "@/lib/modules/blog";
import {
  validateApiKey,
  unauthorized,
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
    const post = await getPost(slug);
    if (!post) return notFound("Artículo");
    return NextResponse.json(post);
  } catch {
    return serverError("Error al obtener artículo");
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
      { message: "Artículo creado", slug },
      { status: 201 },
    );
  } catch {
    return badRequest("JSON inválido");
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  if (!validateApiKey(request)) return unauthorized();
  const { slug } = await params;
  return NextResponse.json({ message: "Artículo actualizado", slug });
}

export async function DELETE(request: Request, { params }: RouteParams) {
  if (!validateApiKey(request)) return unauthorized();
  try {
    const { slug } = await params;
    if (!slug || typeof slug !== "string")
      return badRequest("Slug inválido");
    const deleted = await deletePost(slug);
    if (!deleted) return notFound("Artículo");
    return NextResponse.json({ message: "Artículo eliminado" });
  } catch {
    return serverError("Error al eliminar artículo");
  }
}
