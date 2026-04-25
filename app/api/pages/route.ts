import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect(new URL("/api/v1/pages", "http://localhost:3000"));
}