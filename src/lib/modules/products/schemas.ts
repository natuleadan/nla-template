import { z } from "zod";

export const ProductVariantSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  image: z.string().optional(),
});

export const ProductSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  quantity: z.string(),
  unit: z.string(),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  description: z.string(),
  longDescription: z.string().optional(),
  image: z.string(),
  images: z.array(z.string()).optional(),
  category: z.string().min(1),
  type: z.enum(["product", "service"]).optional(),
  appointment: z.boolean().optional(),
  variants: z.array(ProductVariantSchema).optional(),
});

export type Product = z.infer<typeof ProductSchema>;
