import type { OpenApiPath } from "../types"

export function getPagesPaths(examples: { page: unknown }): Record<string, OpenApiPath> {
  return {
    "/api/v1/pages": {
      get: {
        tags: ["Pages"],
        summary: "Obtiene contenido de página",
        description: "Retorna el contenido de una página estática. Endpoint público.",
        security: [],
        parameters: [{ name: "page", in: "query", required: true, schema: { type: "string" }, example: "inicio", description: "Nombre de la página" }],
        responses: {
          "200": {
            description: "Contenido de página",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Page" }, example: examples.page } },
            "400": { description: "Parámetro 'page' requerido" },
            "404": { description: "Página no encontrada" },
          },
        },
      },
      post: {
        tags: ["Pages"],
        summary: "Crea una página",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", required: ["title", "page"], properties: { title: { type: "string" }, page: { type: "string" }, content: { type: "string" } } },
              example: { title: "Nueva Página", page: "nueva-pagina", content: "Contenido de la página" },
            },
          },
        },
        responses: { "201": { description: "Página creada" }, "400": { description: "Datos inválidos" }, "401": { description: "API key inválida" } },
      },
      put: {
        tags: ["Pages"],
        summary: "Actualiza páginas",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        responses: { "200": { description: "Páginas actualizadas" }, "401": { description: "API key inválida" } },
      },
      delete: {
        tags: ["Pages"],
        summary: "Elimina páginas",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        responses: { "200": { description: "Páginas eliminadas" }, "401": { description: "API key inválida" } },
      },
    },
  }
}