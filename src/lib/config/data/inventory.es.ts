export interface InventoryItem {
  location: string;
  quantity: number;
  reserved: number;
  available: number;
}

export const inventoryData: Record<string, InventoryItem[]> = {
  "001": [
    { location: "CDMX-Norte", quantity: 80, reserved: 5, available: 75 },
    { location: "GDL-Oeste", quantity: 40, reserved: 2, available: 38 },
  ],
  "002": [
    { location: "CDMX-Norte", quantity: 200, reserved: 15, available: 185 },
    { location: "GDL-Oeste", quantity: 150, reserved: 10, available: 140 },
  ],
  "003": [
    { location: "CDMX-Norte", quantity: 300, reserved: 20, available: 280 },
  ],
  "004": [
    { location: "CDMX-Norte", quantity: 60, reserved: 3, available: 57 },
    { location: "GDL-Oeste", quantity: 35, reserved: 1, available: 34 },
  ],
  "005": [
    { location: "CDMX-Norte", quantity: 250, reserved: 12, available: 238 },
    { location: "GDL-Oeste", quantity: 180, reserved: 8, available: 172 },
  ],
  "006": [
    { location: "CDMX-Norte", quantity: 90, reserved: 0, available: 90 },
  ],
  "007": [
    { location: "CDMX-Norte", quantity: 120, reserved: 5, available: 115 },
    { location: "GDL-Oeste", quantity: 70, reserved: 2, available: 68 },
  ],
  "008": [
    { location: "CDMX-Norte", quantity: 400, reserved: 30, available: 370 },
  ],
  "009": [
    { location: "CDMX-Norte", quantity: 500, reserved: 40, available: 460 },
    { location: "GDL-Oeste", quantity: 350, reserved: 25, available: 325 },
  ],
  "010": [
    { location: "CDMX-Norte", quantity: 180, reserved: 10, available: 170 },
  ],
  "011": [
    { location: "CDMX-Norte", quantity: 100, reserved: 8, available: 92 },
    { location: "GDL-Oeste", quantity: 60, reserved: 4, available: 56 },
  ],
  "012": [
    { location: "CDMX-Norte", quantity: 220, reserved: 15, available: 205 },
  ],
  "013": [
    { location: "CDMX-Norte", quantity: 160, reserved: 10, available: 150 },
    { location: "GDL-Oeste", quantity: 120, reserved: 5, available: 115 },
  ],
  "014": [
    { location: "CDMX-Norte", quantity: 45, reserved: 2, available: 43 },
  ],
  "015": [
    { location: "CDMX-Norte", quantity: 70, reserved: 5, available: 65 },
    { location: "GDL-Oeste", quantity: 40, reserved: 0, available: 40 },
  ],
  "016": [
    { location: "CDMX-Norte", quantity: 130, reserved: 8, available: 122 },
  ],
};
