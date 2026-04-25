export interface InventoryItem {
  location: string;
  quantity: number;
  reserved: number;
  available: number;
}

let inventoryData: Record<string, InventoryItem[]> = {
  "proteina-whey": [
    { location: "CDMX-Norte", quantity: 50, reserved: 5, available: 45 },
    { location: "GDL-Oeste", quantity: 30, reserved: 0, available: 30 },
  ],
  "creatina-monohidratada": [
    { location: "CDMX-Norte", quantity: 100, reserved: 10, available: 90 },
    { location: "GDL-Oeste", quantity: 80, reserved: 5, available: 75 },
  ],
  "pollo-deshuesado": [
    { location: "CDMX-Norte", quantity: 45, reserved: 5, available: 40 },
    { location: "GDL-Oeste", quantity: 40, reserved: 0, available: 40 },
  ],
  "huevos-gallinas": [
    { location: "CDMX-Norte", quantity: 200, reserved: 20, available: 180 },
  ],
  "chicken-breast": [
    { location: "CDMX-Norte", quantity: 60, reserved: 0, available: 60 },
    { location: "GDL-Oeste", quantity: 50, reserved: 5, available: 45 },
  ],
};

export async function getInventory(productSlug: string): Promise<InventoryItem[]> {
  if (!productSlug || typeof productSlug !== "string") return [];
  return inventoryData[productSlug] || [];
}

export async function getAllInventorySlugs(): Promise<string[]> {
  return Object.keys(inventoryData);
}

export async function updateInventory(
  productSlug: string,
  locations: InventoryItem[]
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
  locations: InventoryItem[]
): Promise<InventoryItem[]> {
  if (!productSlug) throw new Error("productSlug requerido");
  if (!Array.isArray(locations)) throw new Error("locations debe ser un array");
  inventoryData[productSlug] = locations;
  return inventoryData[productSlug];
}