import { z } from "zod";

export const CategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  icon: z.string().optional(),
});
