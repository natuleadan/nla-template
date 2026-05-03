import { NextRequest, NextResponse } from "next/server";
import { getPaginas } from "@/lib/modules/paginas";
import { getConfig } from "@/lib/locale/config";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "6", 10)),
    );
    const locale = searchParams.get("locale") || "es";
    const data = await getPaginas(page, limit, locale);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: getConfig("es").ui.api.serverErrorEntity("páginas") },
      { status: 500 },
    );
  }
}
