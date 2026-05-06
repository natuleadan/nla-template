import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getPosts } from "@/lib/modules/blog";
import { getConfig } from "@/lib/locale/config";
import { catalogRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(request: NextRequest) {
  const ip = createHash("sha256").update(getClientIp(request)).digest("hex").slice(0, 16);
  const { allowed } = catalogRateLimit.check(ip);
  if (!allowed) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Intenta de nuevo en un minuto." }, { status: 429 });
  }
  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(
    50,
    Math.max(1, parseInt(searchParams.get("limit") || "6", 10)),
  );
  const locale = searchParams.get("locale") || "es";
  try {
    const data = await getPosts(page, limit, locale);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: getConfig(locale).ui.api.serverErrorEntity("artículos") },
      { status: 500 },
    );
  }
}
