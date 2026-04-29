import { NextResponse } from "next/server";
import {
  validateApiKey,
  unauthorized,
  badRequest,
  serverError,
} from "@/lib/env";
import { getOrders, createOrder, createBusOrder, getAllOrders } from "@/lib/modules/orders";

export async function GET(request: Request) {
  if (!validateApiKey(request)) return unauthorized();

  const orders = (await getAllOrders().catch(() => null)) || (await getOrders());
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data || typeof data !== "object")
      return badRequest("Cuerpo JSON requerido");

    // Redis-based bus order (nuevo formato)
    if (data.items && data.total && data.email && data.idNumber && data.fullName && data.deliveryAddress) {
      const order = await createBusOrder({
        items: data.items,
        total: data.total,
        email: data.email,
        idNumber: data.idNumber,
        fullName: data.fullName,
        deliveryAddress: data.deliveryAddress,
        phone: data.phone || "unknown",
      });
      if (!order) return serverError("Redis no disponible");
      return NextResponse.json({ success: true, order });
    }

    // Legacy in-memory order
    if (!data.productId || typeof data.productId !== "string") {
      return badRequest("El campo 'productId' es requerido (string)");
    }
    if (!data.productName || typeof data.productName !== "string") {
      return badRequest("El campo 'productName' es requerido (string)");
    }
    if (data.price === undefined || typeof data.price !== "number") {
      return badRequest("El campo 'price' es requerido (number)");
    }

    const pedido = await createOrder({
      productId: data.productId,
      productName: data.productName,
      price: data.price,
      nombre: data.nombre,
      telefono: data.telefono,
    });

    return NextResponse.json({
      success: true,
      pedido,
      message: "Pedido registrado correctamente",
    });
  } catch (error) {
    if (error instanceof SyntaxError)
      return badRequest("JSON inválido en el cuerpo");
    return serverError(error);
  }
}

export async function PUT(request: Request) {
  if (!validateApiKey(request)) return unauthorized();

  try {
    const body = await request.json();
    if (!body || typeof body !== "object")
      return badRequest("Cuerpo JSON requerido");
    return NextResponse.json({ message: "Pedidos actualizados", ...body });
  } catch (error) {
    if (error instanceof SyntaxError) return badRequest("JSON inválido");
    return serverError(error);
  }
}

export async function DELETE(request: Request) {
  if (!validateApiKey(request)) return unauthorized();
  return NextResponse.json({ message: "Todos los pedidos eliminados" });
}
