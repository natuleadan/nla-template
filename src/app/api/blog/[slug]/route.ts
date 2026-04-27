import { NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/env";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const baseUrl = getBaseUrl();
  const { slug } = await params;
  return NextResponse.redirect(new URL(`/api/v1/blog/${slug}`, baseUrl));
}
