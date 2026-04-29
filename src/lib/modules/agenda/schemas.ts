import { z } from "zod";

export const AgendaSlotSchema = z.object({
  time: z.string().min(1),
  available: z.boolean(),
  type: z.string().optional(),
});

export const AgendaDaySchema = z.object({
  name: z.string().min(1),
  nameShort: z.string().min(1),
  dayOfWeek: z.number(),
  slots: z.array(AgendaSlotSchema),
});
