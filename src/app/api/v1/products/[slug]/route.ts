import { NextResponse } from "next/server";
import { getProduct } from "@/lib/modules/products";
import { getApprovedReviews } from "@/lib/modules/reviews";
import { badRequest, notFound, serverError } from "@/lib/env";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    if (!slug || typeof slug !== "string") return badRequest("Slug inválido");
    const product = await getProduct(slug);
    if (!product) return notFound("Producto");
    const reviews = await getApprovedReviews(slug);
    return NextResponse.json({ ...product, quantity: Number(product.quantity), reviews });
  } catch {
    return serverError("Error al obtener producto");
  }
}
