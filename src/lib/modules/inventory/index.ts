import { inventoryData as seedData } from "@/lib/config/data/inventory";

export interface InventoryItem {
  location: string;
  quantity: number;
  reserved: number;
  available: number;
}

let inventoryData: Record<string, InventoryItem[]> = JSON.parse(
  JSON.stringify(seedData),
);

export async function getInventory(
  productSlug: string,
): Promise<InventoryItem[]> {
  if (!productSlug || typeof productSlug !== "string") return [];
  return inventoryData[productSlug] || [];
}

export async function getAllInventorySlugs(): Promise<string[]> {
  return Object.keys(inventoryData);
}

export async function updateInventory(
  productSlug: string,
  locations: InventoryItem[],
): Promise<InventoryItem[]> {
  if (!productSlug) throw new Error("productSlug requerido");
  if (!Array.isArray(locations)) throw new Error("locations debe ser un array");
  inventoryData[productSlug] = locations;
  return inventoryData[productSlug];
}

export async function deleteInventory(productSlug: string): Promise<boolean> {
  if (!inventoryData[productSlug]) return false;
  delete inventoryData[productSlug];
  return true;
}

export async function createInventory(
  productSlug: string,
  locations: InventoryItem[],
): Promise<InventoryItem[]> {
  if (!productSlug) throw new Error("productSlug requerido");
  if (!Array.isArray(locations)) throw new Error("locations debe ser un array");
  inventoryData[productSlug] = locations;
  return inventoryData[productSlug];
}
