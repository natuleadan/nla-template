import { NextRequest, NextResponse } from "next/server";
import {
  getPosts,
  createPost,
  clearPosts,
} from "@/lib/modules/blog";
import {
  validateApiKey,
  unauthorized,
  badRequest,
  serverError,
} from "@/lib/env";

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
    const data = await getPosts(page, limit);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener artículos" },
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
    const post = await createPost(body);
    if (!post) return badRequest("Error al crear el artículo");
    return NextResponse.json(
      { message: "Artículo creado", post },
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
    return NextResponse.json({ message: "Artículos actualizados" });
  } catch {
    return badRequest("JSON inválido");
  }
}

export async function DELETE(request: Request) {
  if (!validateApiKey(request)) return unauthorized();
  clearPosts();
  return NextResponse.json({ message: "Artículos eliminados" });
}
