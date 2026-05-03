import { NextResponse } from "next/server";
import { getPost } from "@/lib/modules/blog";
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
    const url = new URL(request.url);
    const locale = url.searchParams.get("locale") || "es";
    if (!slug || typeof slug !== "string") return badRequest("Slug inválido");
    const post = await getPost(slug, locale);
    if (!post) return notFound("Artículo");
    return NextResponse.json(post);
  } catch {
    return serverError("Error al obtener artículo");
  }
}
