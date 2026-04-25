import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  return NextResponse.redirect(
    new URL(`/api/v1/products/${slug}`, "http://localhost:3000"),
  );
}
