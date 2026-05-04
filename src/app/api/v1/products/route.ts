import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { getAllProducts, getProducts } from "@/lib/modules/products";
import { getConfig } from "@/lib/locale/config";
import { catalogRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = createHash("sha256").update(getClientIp(request)).digest("hex").slice(0, 16);
  const { allowed } = catalogRateLimit.check(ip);
  if (!allowed) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." }, { status: 429 });
  }

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "8", 10);
    const locale = searchParams.get("locale") || "es";

    if (page > 1) {
      const result = await getProducts(page, limit, locale);
      return NextResponse.json(result);
    }

    const products = await getAllProducts(locale);
    return NextResponse.json({
      products,
      total: products.length,
      hasMore: false,
    });
  } catch {
    return NextResponse.json(
      { error: getConfig("es").ui.api.serverErrorEntity("productos") },
      { status: 500 },
    );
  }
}
