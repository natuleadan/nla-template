import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getApprovedReviews } from "@/lib/modules/reviews";
import { badRequest } from "@/lib/api/response";
import { getConfig } from "@/lib/locale/config";
import { reviewRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productSlug: string }> },
) {
  const ip = createHash("sha256").update(getClientIp(request)).digest("hex").slice(0, 16);
  const { allowed } = reviewRateLimit.check(ip);
  if (!allowed) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." }, { status: 429 });
  }
  const url = new URL(request.url);
  const locale = url.searchParams.get("locale") || "es";
  try {
    const { productSlug } = await params;
    if (!productSlug)
      return badRequest(getConfig(locale).ui.api.missingParam("productSlug"));
    const reviews = await getApprovedReviews(productSlug, locale);
    return NextResponse.json(reviews);
  } catch {
    return NextResponse.json(
      { error: getConfig(locale).ui.api.serverErrorEntity("reseñas") },
      { status: 500 },
    );
  }
}
