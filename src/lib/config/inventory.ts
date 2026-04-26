import type { InventoryItem } from "@/lib/modules/inventory";

export const inventoryData: Record<string, InventoryItem[]> = {
  "proteina-whey": [
    { location: "CDMX-Norte", quantity: 50, reserved: 5, available: 45 },
    { location: "GDL-Oeste", quantity: 30, reserved: 0, available: 30 },
  ],
  "creatina-monohidratada": [
    { location: "CDMX-Norte", quantity: 100, reserved: 10, available: 90 },
    { location: "GDL-Oeste", quantity: 80, reserved: 5, available: 75 },
  ],
  "bcaa-200-caps": [
    { location: "CDMX-Norte", quantity: 60, reserved: 0, available: 60 },
  ],
  "pechuga-de-pollo-1kg": [
    { location: "CDMX-Norte", quantity: 45, reserved: 5, available: 40 },
    { location: "GDL-Oeste", quantity: 40, reserved: 0, available: 40 },
  ],
  "arroz-integral-2kg": [
    { location: "CDMX-Norte", quantity: 200, reserved: 20, available: 180 },
  ],
  "avena-en-hojuelas": [
    { location: "GDL-Oeste", quantity: 50, reserved: 5, available: 45 },
  ],
};
