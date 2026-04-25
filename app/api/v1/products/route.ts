import { NextRequest, NextResponse } from "next/server";
import { getProducts, createProduct } from "@/lib/modules/products";
import { validateApiKey, unauthorized, badRequest, serverError } from "@/lib/config/env";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "8", 10)));
    const data = await getProducts(page, limit);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!validateApiKey(request)) return unauthorized();

  try {
    const body = await request.json();
    if (!body || typeof body !== "object") return badRequest("Cuerpo JSON requerido");
    if (!body.name || typeof body.name !== "string") return badRequest("El campo 'name' es requerido (string)");
    if (body.price === undefined || typeof body.price !== "number") return badRequest("El campo 'price' es requerido (number)");

    const product = await createProduct(body);
    if (!product) return badRequest("No se pudo crear el producto");

    return NextResponse.json({ message: "Producto creado", product }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) return badRequest("JSON inválido en el cuerpo");
    return serverError(error);
  }
}

export async function PUT(request: Request) {
  if (!validateApiKey(request)) return unauthorized();

  try {
    const body = await request.json();
    if (!body || typeof body !== "object") return badRequest("Cuerpo JSON requerido");
    return NextResponse.json({ message: "Productos actualizados", ...body });
  } catch {
    return badRequest("JSON inválido en el cuerpo");
  }
}

export async function DELETE(request: Request) {
  if (!validateApiKey(request)) return unauthorized();
  return NextResponse.json({ message: "Todos los productos eliminados" });
}