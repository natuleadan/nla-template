import { NextRequest, NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/config/env";

export async function GET() {
  const baseUrl = getBaseUrl();
  return NextResponse.redirect(new URL("/api/v1/blog", baseUrl));
}
