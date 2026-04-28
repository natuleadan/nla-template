import { z } from "zod";

export const GetItemsInputSchema = z.object({
  query: z.string().optional().describe("Término de búsqueda opcional"),
  category: z.string().optional().describe("Filtrar por categoría"),
  limit: z.number().optional().default(10).describe("Límite de resultados"),
});

export const GetDetailInputSchema = z.object({
  slug: z.string().describe("Slug único del producto"),
});

export const SearchHistoryInputSchema = z.object({
  limit: z.number().optional().default(10).describe("Cuantos mensajes recuperar del historial"),
});

export const SaveLongMemoryInputSchema = z.object({
  key: z.string().describe("Nombre del dato a recordar (ej: talla_ropa, alergias, preferencia)"),
  value: z.string().describe("Valor del dato a recordar (ej: M, maní, envío rápido)"),
  override: z.boolean().optional().default(false).describe("Si true, sobreescribe el key existente"),
});

export const GetAgendaInputSchema = z.object({
  day: z.string().optional().describe("Nombre del día (ej: Lunes, Martes) para filtrar"),
});
