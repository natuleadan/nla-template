import { z } from "zod";

export const PaginaSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  category: z.string().min(1),
  publishedAt: z.string(),
  updatedAt: z.string().optional(),
});
