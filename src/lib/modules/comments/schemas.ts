import { z } from "zod";

export const CommentSchema = z.object({
  id: z.string().min(1),
  postSlug: z.string().min(1),
  name: z.string().min(1),
  comment: z.string().min(1),
  createdAt: z.string(),
  status: z.enum(["pending", "approved", "published"]),
  visibility: z.enum(["public", "private"]).optional(),
  phone: z.string().optional(),
});
