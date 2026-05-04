import { z } from "zod";

export const CertificateItemSchema = z.object({
  id: z.string(),
  code: z.string(),
  type: z.enum(["aprobacion", "asistencia", "participacion"]),
  course: z.string(),
  hours: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  expiryDate: z.string().nullable(),
  instructor: z.string(),
  description: z.string(),
  medias: z.string().optional(),
});

export const CertificatesResponseSchema = z.object({
  error: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  certificates: z.array(CertificateItemSchema).optional(),
});

export type CertificateItem = z.infer<typeof CertificateItemSchema>;
export type CertificatesResponse = z.infer<typeof CertificatesResponseSchema>;
