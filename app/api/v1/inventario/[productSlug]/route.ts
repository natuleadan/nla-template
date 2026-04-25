import { NextResponse } from "next/server";
import {
  getInventory,
  updateInventory,
  deleteInventory,
  createInventory,
} from "@/lib/modules/inventory";
import {
  validateApiKey,
  unauthorized,
  badRequest,
  serverError,
} from "@/lib/config/env";

interface RouteParams {
  params: Promise<{ productSlug: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { productSlug } = await params;
    if (!productSlug || typeof productSlug !== "string")
      return badRequest("productSlug invalido");

    const inventory = await getInventory(productSlug);
    const total = inventory.reduce((sum, item) => sum + item.available, 0);

    return NextResponse.json({ productSlug, total, locations: inventory });
  } catch {
    return serverError("Error al obtener inventario");
  }
}

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { productSlug } = await params;
    if (!productSlug || typeof productSlug !== "string")
      return badRequest("productSlug invalido");

    const body = await request.json();
    if (!body || typeof body !== "object")
      return badRequest("Cuerpo JSON requerido");
    if (!Array.isArray(body.locations))
      return badRequest("El campo locations debe ser un array");

    const locations = body.locations.map((loc: unknown, idx: number) => {
      if (!loc || typeof loc !== "object")
        throw new Error("locations[" + idx + "] debe ser un objeto");
      const l = loc as Record<string, unknown>;
      if (typeof l.location !== "string")
        throw new Error("locations[" + idx + "].location debe ser string");
      if (typeof l.quantity !== "number")
        throw new Error("locations[" + idx + "].quantity debe ser number");
      return {
        location: l.location,
        quantity: l.quantity,
        reserved: Number(l.reserved) || 0,
        available: Number(l.available) || l.quantity,
      };
    });

    const created = await createInventory(productSlug, locations);
    const msg = "Inventario de " + productSlug + " creado";
    return NextResponse.json(
      { message: msg, locations: created },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof SyntaxError) return badRequest("JSON invalido");
    if (error instanceof Error) return badRequest(error.message);
    return serverError(error);
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  if (!validateApiKey(request)) return unauthorized();

  try {
    const { productSlug } = await params;
    if (!productSlug || typeof productSlug !== "string")
      return badRequest("productSlug invalido");

    const body = await request.json();
    if (!body || typeof body !== "object")
      return badRequest("Cuerpo JSON requerido");
    if (!Array.isArray(body.locations))
      return badRequest("El campo locations debe ser un array");

    const locations = body.locations.map((loc: unknown, idx: number) => {
      if (!loc || typeof loc !== "object")
        throw new Error("locations[" + idx + "] debe ser un objeto");
      const l = loc as Record<string, unknown>;
      if (typeof l.location !== "string")
        throw new Error("locations[" + idx + "].location debe ser string");
      if (typeof l.quantity !== "number")
        throw new Error("locations[" + idx + "].quantity debe ser number");
      if (typeof l.reserved !== "number")
        throw new Error("locations[" + idx + "].reserved debe ser number");
      if (typeof l.available !== "number")
        throw new Error("locations[" + idx + "].available debe ser number");
      return {
        location: l.location,
        quantity: l.quantity,
        reserved: l.reserved,
        available: l.available,
      };
    });

    const updated = await updateInventory(productSlug, locations);
    const msg = "Inventario de " + productSlug + " actualizado";
    return NextResponse.json({ message: msg, locations: updated });
  } catch (error) {
    if (error instanceof SyntaxError) return badRequest("JSON invalido");
    if (error instanceof Error) return badRequest(error.message);
    return serverError(error);
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  if (!validateApiKey(request)) return unauthorized();

  try {
    const { productSlug } = await params;
    if (!productSlug) return badRequest("productSlug invalido");

    const deleted = await deleteInventory(productSlug);
    if (!deleted) return badRequest("Inventario no encontrado");

    const msg = "Inventario de " + productSlug + " eliminado";
    return NextResponse.json({ message: msg });
  } catch {
    return serverError("Error al eliminar inventario");
  }
}
