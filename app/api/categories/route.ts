import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect(new URL("/api/v1/categories", "http://localhost:3000"));
}