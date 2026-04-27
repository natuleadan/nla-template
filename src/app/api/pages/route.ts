import { NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/env";

export async function GET() {
  return NextResponse.redirect(
    new URL("/api/v1/pages", getBaseUrl()),
  );
}
