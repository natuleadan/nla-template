import { NextResponse } from "next/server";
import { getProduct, createProduct } from "@/lib/modules/products";
import { getReviews } from "@/lib/modules/reviews";
import { validateApiKey, unauthorized, badRequest, notFound, serverError } from "@/lib/config/env";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    if (!slug || typeof slug !== "string") return badRequest("Slug inválido");

    const product = await getProduct(slug);
    if (!product) return notFound("Producto");

    const reviews = await getReviews(slug);
    return NextResponse.json({ ...product, quantity: Number(product.quantity), reviews });
  } catch {
    return serverError("Error al obtener producto");
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    if (!slug) return badRequest("Slug inválido");

    const body = await request.json();
    if (!body || typeof body !== "object") return badRequest("Cuerpo JSON requerido");

    if (!body.name || typeof body.name !== "string") {
      return badRequest("El campo 'name' es requerido (string)");
    }
    if (!body.price || typeof body.price !== "number") {
      return badRequest("El campo 'price' es requerido (number)");
    }

    const product = await createProduct({ ...body, slug });
    if (!product) return badRequest("Error al crear producto");

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) return badRequest("JSON inválido");
    return serverError(error);
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  if (!validateApiKey(request)) return unauthorized();

  try {
    const { slug } = await params;
    if (!slug) return badRequest("Slug inválido");

    const body = await request.json();
    if (!body || typeof body !== "object") return badRequest("Cuerpo JSON requerido");

    return NextResponse.json({ message: `Producto ${slug} actualizado`, ...body });
  } catch (error) {
    if (error instanceof SyntaxError) return badRequest("JSON inválido");
    return serverError(error);
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  if (!validateApiKey(request)) return unauthorized();

  try {
    const { slug } = await params;
    if (!slug) return badRequest("Slug inválido");

    return NextResponse.json({ message: `Producto ${slug} eliminado` });
  } catch {
    return serverError("Error al eliminar producto");
  }
}