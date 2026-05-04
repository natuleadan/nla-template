import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import {
  getProductCategories,
  getBlogCategories,
  getPageCategories,
} from "@/lib/modules/categories";
import { categoryRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = createHash("sha256").update(getClientIp(request)).digest("hex").slice(0, 16);
  const { allowed } = categoryRateLimit.check(ip);
  if (!allowed) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." }, { status: 429 });
  }
  const locale = request.nextUrl.searchParams.get("locale") || "es";
  const type = request.nextUrl.searchParams.get("type") || "products";

  let data;
  if (type === "blog") {
    data = await getBlogCategories(locale);
  } else if (type === "pages") {
    data = await getPageCategories(locale);
  } else {
    data = await getProductCategories(locale);
  }

  return NextResponse.json(data);
}
