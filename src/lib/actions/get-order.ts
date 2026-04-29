"use server";

export async function getOrderData(orderId: string) {
  try {
    const mod = await import("@/lib/external/upstash/redis");
    if (!mod.isRedisConfigured()) return null;

    const h = await mod.hashGetAll(`bus:order:${orderId}`);
    if (!h || !h.phone) return null;

    return {
      fullName: h.fullName || null,
      email: h.email || null,
      idNumber: h.idNumber || null,
      phone: h.phone || null,
      deliveryAddress: h.deliveryAddress || null,
      items: h.items || null,
      total: h.total || null,
      status: h.status || null,
      createdAt: h.createdAt || null,
      deliveryGpsLat: h.deliveryGpsLat || null,
      deliveryGpsLng: h.deliveryGpsLng || null,
    };
  } catch {
    return null;
  }
}
