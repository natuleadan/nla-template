import { NextResponse } from "next/server";
import { getCategories } from "@/lib/modules/categories";

export async function GET() {
  const data = await getCategories();
  return NextResponse.json(data);
}
