import { z } from "zod";

export const InventoryItemSchema = z.object({
  location: z.string().min(1),
  quantity: z.number().min(0),
  reserved: z.number().min(0),
  available: z.number().min(0),
});
