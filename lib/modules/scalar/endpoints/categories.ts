import type { OpenApiPath } from "../types";

export function getCategoriesPaths(examples: {
  categories: unknown[];
}): Record<string, OpenApiPath> {
  return {
    "/api/v1/categories": {
      get: {
        tags: ["Categories"],
        summary: "Lista categorías",
        description:
          "Retorna todas las categorías disponibles. Endpoint público.",
        security: [],
        responses: {
          "200": {
            description: "Lista de categorías",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Category" },
                },
                example: examples.categories,
              },
            },
          },
        },
      },
      post: {
        tags: ["Categories"],
        summary: "Crea una categoría",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "slug"],
                properties: {
                  name: { type: "string" },
                  slug: { type: "string" },
                  icon: { type: "string" },
                },
              },
              example: { name: "Proteínas", slug: "proteinas", icon: "flask" },
            },
          },
        },
        responses: {
          "201": { description: "Categoría creada" },
          "400": { description: "Datos inválidos" },
          "401": { description: "API key inválida" },
        },
      },
      put: {
        tags: ["Categories"],
        summary: "Actualiza categorías",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          "200": { description: "Categorías actualizadas" },
          "401": { description: "API key inválida" },
        },
      },
      delete: {
        tags: ["Categories"],
        summary: "Elimina categorías",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          "200": { description: "Categorías eliminadas" },
          "401": { description: "API key inválida" },
        },
      },
    },
  };
}
