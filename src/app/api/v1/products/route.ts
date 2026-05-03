import { NextRequest, NextResponse } from "next/server";
import { getAllProducts, getProducts } from "@/lib/modules/products";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "8", 10);

    if (page > 1) {
      const result = await getProducts(page, limit);
      return NextResponse.json(result);
    }

    const products = await getAllProducts();
    return NextResponse.json({ products, total: products.length, hasMore: false });
  } catch {
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}
