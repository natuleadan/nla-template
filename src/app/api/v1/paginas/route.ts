import { NextRequest, NextResponse } from "next/server";
import { getPaginas } from "@/lib/modules/paginas";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(
      1,
      parseInt(searchParams.get("page") || "1", 10),
    );
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "6", 10)),
    );
    const data = await getPaginas(page, limit);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener páginas" },
      { status: 500 },
    );
  }
}
