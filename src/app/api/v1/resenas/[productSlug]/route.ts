import { NextResponse } from "next/server";
import { getApprovedReviews } from "@/lib/modules/reviews";
import { badRequest } from "@/lib/env";

export async function GET(request: Request, { params }: { params: Promise<{ productSlug: string }> }) {
  try {
    const { productSlug } = await params;
    if (!productSlug) return badRequest("productSlug requerido");
    const reviews = await getApprovedReviews(productSlug);
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: "Error al obtener reseñas" }, { status: 500 });
  }
}
