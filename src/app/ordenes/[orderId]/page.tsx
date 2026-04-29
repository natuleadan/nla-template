import { Suspense } from "react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderId } = await params;
  return { title: `Pedido ${orderId}` };
}

export default function OrderPage({ params }: Props) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Cargando...</div>}>
      <OrderContent params={params} />
    </Suspense>
  );
}

async function loadOrder(orderId: string) {
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
  } catch { return null; }
}

async function OrderContent({ params }: Props) {
  const { orderId } = await params;
  const order = await loadOrder(orderId);

  if (!order) {
    return <div className="max-w-2xl mx-auto p-6 text-center text-muted-foreground">Pedido no encontrado</div>;
  }

  const hasGps = order.deliveryGpsLat && order.deliveryGpsLng;
  const mapUrl = hasGps
    ? `https://www.google.com/maps?q=${order.deliveryGpsLat},${order.deliveryGpsLng}&z=15&output=embed`
    : null;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Pedido {orderId}</h1>
      <div className="grid gap-4 p-4 border rounded-lg">
        <Row label="Cliente" value={order.fullName} />
        <Row label="Email" value={order.email} />
        <Row label="Identificación" value={order.idNumber} />
        <Row label="Teléfono" value={order.phone} />
        <Row label="Dirección" value={order.deliveryAddress} />
        <Row label="Items" value={order.items} />
        <Row label="Total" value={order.total ? `$${order.total}` : undefined} />
        <Row label="Estado" value={order.status} />
        <Row label="Creado" value={order.createdAt && new Date(order.createdAt).toLocaleString("es-EC")} />
      </div>
      {mapUrl && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Ubicación de entrega</h2>
          <iframe src={mapUrl} width="100%" height="350" style={{ border: 0, borderRadius: "8px" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4">
      <span className="font-medium text-muted-foreground">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
