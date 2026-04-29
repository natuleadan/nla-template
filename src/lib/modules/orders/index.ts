import { getFullGeoData, type UserGeoData } from "../geolocation";

export type OrderStatus = "pending_payment" | "awaiting_verification" | "paid" | "rejected" | "shipping" | "delivered" | "cancelled";

export interface Pedido {
  id: string;
  productId: string;
  productName: string;
  price: number;
  cliente: { nombre?: string; telefono?: string };
  geo: UserGeoData;
  fecha: string;
  estado: "pendiente" | "completado" | "cancelado";
}

const pedidos: Pedido[] = [];

export async function getOrders(): Promise<Pedido[]> {
  return pedidos;
}

export async function createOrder(data: {
  productId: string;
  productName: string;
  price: number;
  nombre?: string;
  telefono?: string;
}): Promise<Pedido> {
  const geo = await getFullGeoData();
  const pedido: Pedido = {
    id: Date.now().toString(),
    productId: data.productId,
    productName: data.productName,
    price: data.price,
    cliente: { nombre: data.nombre, telefono: data.telefono },
    geo,
    fecha: new Date().toISOString(),
    estado: "pendiente",
  };
  pedidos.push(pedido);
  return pedido;
}

export function updateOrders(data: Partial<Pedido>[]): Pedido[] {
  return pedidos;
}

export function deleteOrders(): void {
  pedidos.length = 0;
}

// ─── Redis-backed order operations (for tools) ────────

export interface BusOrder {
  id: string;
  items: string;
  total: string;
  email: string;
  idNumber: string;
  fullName: string;
  deliveryAddress: string;
  deliveryGpsLat?: string;
  deliveryGpsLng?: string;
  phone: string;
  status: OrderStatus;
  createdAt: string;
}

export async function createBusOrder(data: {
  items: string; total: string; email: string; idNumber: string;
  fullName: string; deliveryAddress: string; phone: string;
}): Promise<BusOrder | null> {
  try {
    const { isRedisConfigured, strIncrBy, hashSet, setAdd } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) return null;

    const today = new Date();
    const ymd = today.getFullYear().toString() +
      String(today.getMonth() + 1).padStart(2, "0") +
      String(today.getDate()).padStart(2, "0");
    const counterKey = `bus:order:counter:${ymd}`;
    const seq = String(await strIncrBy(counterKey, 1)).padStart(3, "0");
    const id = `ORD${ymd}${seq}`;
    const now = new Date().toISOString();
    await hashSet(`bus:order:${id}`, "items", data.items);
    await hashSet(`bus:order:${id}`, "total", data.total);
    await hashSet(`bus:order:${id}`, "email", data.email);
    await hashSet(`bus:order:${id}`, "idNumber", data.idNumber);
    await hashSet(`bus:order:${id}`, "fullName", data.fullName);
    await hashSet(`bus:order:${id}`, "deliveryAddress", data.deliveryAddress);
    await hashSet(`bus:order:${id}`, "phone", data.phone);
    await hashSet(`bus:order:${id}`, "status", "pending_payment");
    await hashSet(`bus:order:${id}`, "createdAt", now);
    await setAdd(`bus:orders:my:${data.phone}`, id);
    await setAdd("bus:orders:all", id);
    return { ...data, id, status: "pending_payment", createdAt: now };
  } catch {
    return null;
  }
}

export async function getMyOrders(phone: string): Promise<BusOrder[]> {
  try {
    const { isRedisConfigured, setMembers } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) return [];

    const ids = await setMembers(`bus:orders:my:${phone}`);
    return await loadOrders(ids);
  } catch {
    return [];
  }
}

export async function getAllOrders(): Promise<BusOrder[]> {
  try {
    const { isRedisConfigured, setMembers } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) return [];
    const ids = await setMembers("bus:orders:all");
    return await loadOrders(ids);
  } catch {
    return [];
  }
}

export async function getOrderDetail(id: string): Promise<BusOrder | null> {
  try {
    const { isRedisConfigured, hashGetAll } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) return null;
    const h = await hashGetAll(`bus:order:${id}`);
    if (!h || !h.phone) return null;
    return orderFromHash(id, h);
  } catch {
    return null;
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<boolean> {
  try {
    const { isRedisConfigured, hashSet } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) return false;
    await hashSet(`bus:order:${id}`, "status", status);
    return true;
  } catch {
    return false;
  }
}

export async function setOrderDeliveryGps(id: string, lat: string, lng: string): Promise<boolean> {
  try {
    const { isRedisConfigured, hashSet } = await import("@/lib/external/upstash/redis");
    if (!isRedisConfigured()) return false;
    await hashSet(`bus:order:${id}`, "deliveryGpsLat", lat);
    await hashSet(`bus:order:${id}`, "deliveryGpsLng", lng);
    return true;
  } catch {
    return false;
  }
}

// ─── Internal helpers ──────────────────────────────────

function orderFromHash(id: string, h: Record<string, string>): BusOrder {
  return {
    id, items: h.items || "", total: h.total || "", email: h.email || "",
    idNumber: h.idNumber || "", fullName: h.fullName || "",
    deliveryAddress: h.deliveryAddress || "", phone: h.phone || "",
    status: (h.status as OrderStatus) || "pending_payment",
    createdAt: h.createdAt || "",
    deliveryGpsLat: h.deliveryGpsLat, deliveryGpsLng: h.deliveryGpsLng,
  };
}

async function loadOrders(ids: string[]): Promise<BusOrder[]> {
  const { hashGetAll } = await import("@/lib/external/upstash/redis");
  const orders: BusOrder[] = [];
  for (const id of ids) {
    const h = await hashGetAll(`bus:order:${id}`);
    if (h && h.phone) orders.push(orderFromHash(id, h));
  }
  return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
