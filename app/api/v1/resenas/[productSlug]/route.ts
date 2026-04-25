import { NextResponse } from "next/server";
import { getReviews, createReview } from "@/lib/modules/reviews";
import {
  validateApiKey,
  unauthorized,
  badRequest,
  serverError,
} from "@/lib/config/env";

interface RouteParams {
  params: Promise<{ productSlug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { productSlug } = await params;
    if (!productSlug || typeof productSlug !== "string")
      return badRequest("productSlug inválido");

    const reviews = await getReviews(productSlug);
    return NextResponse.json(reviews);
  } catch {
    return serverError("Error al obtener reseñas");
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { productSlug } = await params;
    if (!productSlug || typeof productSlug !== "string")
      return badRequest("productSlug inválido");

    const body = await request.json();
    if (!body || typeof body !== "object")
      return badRequest("Cuerpo JSON requerido");

    const { name, comment, rating } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return badRequest("El campo 'name' es requerido (string, no vacío)");
    }
    if (
      !comment ||
      typeof comment !== "string" ||
      comment.trim().length === 0
    ) {
      return badRequest("El campo 'comment' es requerido (string, no vacío)");
    }
    if (rating === undefined || typeof rating !== "number") {
      return badRequest("El campo 'rating' es requerido (number)");
    }
    if (rating < 1 || rating > 5) {
      return badRequest("El campo 'rating' debe estar entre 1 y 5");
    }

    const newReview = await createReview(productSlug, {
      name: name.trim(),
      comment: comment.trim(),
      rating: Math.round(rating),
    });
    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError)
      return badRequest("JSON inválido en el cuerpo");
    return serverError(error);
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  if (!validateApiKey(request)) return unauthorized();

  try {
    const { productSlug } = await params;
    if (!productSlug) return badRequest("productSlug inválido");

    const body = await request.json();
    if (!body || typeof body !== "object")
      return badRequest("Cuerpo JSON requerido");

    return NextResponse.json({
      message: `Reseñas de ${productSlug} actualizadas`,
      ...body,
    });
  } catch (error) {
    if (error instanceof SyntaxError) return badRequest("JSON inválido");
    return serverError(error);
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  if (!validateApiKey(request)) return unauthorized();

  try {
    const { productSlug } = await params;
    if (!productSlug) return badRequest("productSlug inválido");

    return NextResponse.json({
      message: `Reseñas de ${productSlug} eliminadas`,
    });
  } catch {
    return serverError("Error al eliminar reseñas");
  }
}
