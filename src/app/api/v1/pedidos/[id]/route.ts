import { NextRequest } from "next/server";
import { getOrderDetail } from "@/lib/modules/orders";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const order = await getOrderDetail(id);
    if (!order) {
      return Response.json({ error: "Pedido no encontrado" }, { status: 404 });
    }
    return Response.json(order);
  } catch {
    return Response.json({ error: "Error interno" }, { status: 500 });
  }
}
