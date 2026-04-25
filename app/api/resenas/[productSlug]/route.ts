import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productSlug: string }> },
) {
  const { productSlug } = await params;
  return NextResponse.redirect(
    new URL(`/api/v1/resenas/${productSlug}`, "http://localhost:3000"),
  );
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ productSlug: string }> },
) {
  const { productSlug } = await params;
  return NextResponse.redirect(
    new URL(`/api/v1/resenas/${productSlug}`, "http://localhost:3000"),
  );
}
