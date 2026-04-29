import { z } from "zod";

export const ReviewSchema = z.object({
  id: z.string().min(1),
  productSlug: z.string().min(1),
  name: z.string().min(1),
  comment: z.string().min(1),
  rating: z.number().min(1).max(5),
  createdAt: z.string(),
  status: z.enum(["pending", "approved", "published"]),
  visibility: z.enum(["public", "private"]).optional(),
  phone: z.string().optional(),
});
