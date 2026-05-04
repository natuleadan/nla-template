import { z } from "zod";

export const AttachmentSchema = z.object({
  name: z.string().min(1),
  url: z.string().min(1),
  size: z.string().optional(),
});

export const BlogPostSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  image: z.string().min(1),
  author: z.string().min(1),
  category: z.string().min(1),
  tags: z.array(z.string()).optional(),
  publishedAt: z.string(),
  updatedAt: z.string().optional(),
  readingTime: z.number().min(0),
  attachments: z.array(AttachmentSchema).optional(),
});
