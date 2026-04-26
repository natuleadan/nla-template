import { NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/config/env";

export async function GET() {
  return NextResponse.redirect(
    new URL("/api/v1/categories", getBaseUrl()),
  );
}
