import { NextRequest, NextResponse } from "next/server";
import {
  getProductCategories,
  getBlogCategories,
  getPageCategories,
} from "@/lib/modules/categories";

export async function GET(request: NextRequest) {
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
