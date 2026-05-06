import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getProduct } from "@/lib/modules/products";
import { getApprovedReviews } from "@/lib/modules/reviews";
import { getConfig } from "@/lib/locale/config";
import { badRequest, notFound, serverError } from "@/lib/api/response";
import { catalogRateLimit, getClientIp } from "@/lib/rate-limit";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const ip = createHash("sha256").update(getClientIp(request)).digest("hex").slice(0, 16);
  const { allowed } = catalogRateLimit.check(ip);
  if (!allowed) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." }, { status: 429 });
  }
  try {
    const { slug } = await params;
    const url = new URL(request.url);
    const locale = url.searchParams.get("locale") || "es";
    if (!slug || typeof slug !== "string")
      return badRequest(getConfig("es").ui.api.slugInvalid);
    const product = await getProduct(slug, locale);
    if (!product) return notFound("Producto");
    const reviews = await getApprovedReviews(slug, locale);
    return NextResponse.json({
      ...product,
      quantity: Number(product.quantity),
      reviews,
    });
  } catch {
    return serverError(getConfig("es").ui.api.serverErrorEntity("producto"));
  }
}
