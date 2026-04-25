import { NextResponse } from "next/server";
import { getBaseUrl } from "@/lib/config/env";

export async function POST() {
  return NextResponse.redirect(
    new URL("/api/v1/pedidos", getBaseUrl()),
  );
}
