import { NextResponse } from "next/server";
import { getApprovedReviews } from "@/lib/modules/reviews";
import { badRequest } from "@/lib/env";
import { getConfig } from "@/lib/locale/config";

export async function GET(request: Request, { params }: { params: Promise<{ productSlug: string }> }) {
  try {
    const { productSlug } = await params;
    const url = new URL(request.url);
    const locale = url.searchParams.get("locale") || "es";
    if (!productSlug) return badRequest(getConfig("es").ui.api.missingParam("productSlug"));
    const reviews = await getApprovedReviews(productSlug, locale);
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json({ error: getConfig("es").ui.api.serverErrorEntity("reseñas") }, { status: 500 });
  }
}
