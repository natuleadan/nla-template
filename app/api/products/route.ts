import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect(new URL("/api/v1/products", "http://localhost:3000"));
}

export async function POST() {
  return NextResponse.redirect(new URL("/api/v1/products", "http://localhost:3000"));
}