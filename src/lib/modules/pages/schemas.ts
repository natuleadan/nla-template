import { z } from "zod";

export const PageSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  content: z.array(z.record(z.string(), z.unknown())),
});
