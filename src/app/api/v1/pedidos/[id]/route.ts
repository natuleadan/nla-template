import { NextRequest } from "next/server";
import { validateApiKey, unauthorized } from "@/lib/env";
import { getOrders } from "@/lib/modules/orders";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!validateApiKey(req)) return unauthorized();
  const { id } = await params;
  const orders = await getOrders();
  const order = orders.find((o) => o.id === id);
  if (!order) {
    return Response.json({ error: "Pedido no encontrado" }, { status: 404 });
  }
  return Response.json(order);
}
