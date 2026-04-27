import { NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/env";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productSlug: string }> },
) {
  const { productSlug } = await params;
  return NextResponse.redirect(
    new URL(`/api/v1/inventario/${productSlug}`, getBaseUrl()),
  );
}
