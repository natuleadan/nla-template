import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.redirect(
    new URL("/api/v1/formulario", "http://localhost:3000"),
  );
}
