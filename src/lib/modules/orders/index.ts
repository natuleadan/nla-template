import { getFullGeoData, type UserGeoData } from "../geolocation";

export interface Pedido {
  id: string;
  productId: string;
  productName: string;
  price: number;
  cliente: {
    nombre?: string;
    telefono?: string;
  };
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
    cliente: {
      nombre: data.nombre,
      telefono: data.telefono,
    },
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
