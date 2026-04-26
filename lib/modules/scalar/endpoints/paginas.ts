import type { OpenApiPath } from "../types";

export function getPaginasPaths(examples: {
  pages: unknown[];
}): Record<string, OpenApiPath> {
  return {
    "/api/v1/paginas": {
      get: {
        tags: ["Páginas"],
        summary: "Lista todas las páginas",
        description:
          "Retorna un array con todas las páginas. Endpoint público.",
        security: [],
        responses: {
          "200": {
            description: "Lista de páginas",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/PaginaPost" },
                },
                example: examples.pages,
              },
            },
          },
        },
      },
      post: {
        tags: ["Páginas"],
        summary: "Crea una nueva página",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string" },
                  excerpt: { type: "string" },
                  content: { type: "string" },
                  category: { type: "string" },
                },
              },
              example: {
                title: "Nueva Página",
                excerpt: "Resumen de la página",
                content: "<p>Contenido</p>",
                category: "legal",
              },
            },
          },
        },
        responses: {
          "201": { description: "Página creada exitosamente" },
          "400": { description: "Datos inválidos" },
          "401": { description: "API key inválida" },
        },
      },
      put: {
        tags: ["Páginas"],
        summary: "Actualiza páginas",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          "200": { description: "Páginas actualizadas" },
          "401": { description: "API key inválida" },
        },
      },
      delete: {
        tags: ["Páginas"],
        summary: "Elimina todas las páginas",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          "200": { description: "Páginas eliminadas" },
          "401": { description: "API key inválida" },
        },
      },
    },
    "/api/v1/paginas/{slug}": {
      get: {
        tags: ["Páginas"],
        summary: "Obtiene una página por slug",
        description: "Retorna una página específica por su slug. Endpoint público.",
        security: [],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: (examples.pages[0] as { slug?: string })?.slug || "terminos",
            description: "Slug de la página",
          },
        ],
        responses: {
          "200": {
            description: "Página encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PaginaPost" },
                example: examples.pages[0],
              },
            },
          },
          "404": { description: "Página no encontrada" },
        },
      },
      post: {
        tags: ["Páginas"],
        summary: "Crea una página con slug específico",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Slug de la página",
          },
        ],
        responses: {
          "201": { description: "Página creada" },
          "400": { description: "Datos inválidos" },
          "401": { description: "API key inválida" },
        },
      },
      put: {
        tags: ["Páginas"],
        summary: "Actualiza una página por slug",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Slug de la página",
          },
        ],
        responses: {
          "200": { description: "Página actualizada" },
          "401": { description: "API key inválida" },
          "404": { description: "Página no encontrada" },
        },
      },
      delete: {
        tags: ["Páginas"],
        summary: "Elimina una página por slug",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Slug de la página",
          },
        ],
        responses: {
          "200": { description: "Página eliminada" },
          "401": { description: "API key inválida" },
          "404": { description: "Página no encontrada" },
        },
      },
    },
  };
}
