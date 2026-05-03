import type { OpenApiPath } from "../types";

export function getPaginasPaths(examples: {
  pages: unknown[];
}): Record<string, OpenApiPath> {
  return {
    "/api/v1/paginas": {
      get: {
        tags: ["Páginas"],
        summary: "Lista las páginas institucionales",
        description: "Retorna las páginas de contenido. Endpoint público.",
        security: [],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer" },
            example: "1",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer" },
            example: "6",
          },
        ],
        responses: {
          "200": {
            description: "Lista de páginas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    pages: {
                      type: "array",
                      items: { $ref: "#/components/schemas/PaginaPost" },
                    },
                    total: { type: "integer" },
                    hasMore: { type: "boolean" },
                  },
                },
                example: {
                  pages: examples.pages,
                  total: examples.pages.length,
                  hasMore: false,
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/paginas/{slug}": {
      get: {
        tags: ["Páginas"],
        summary: "Obtiene una página por slug",
        description: "Retorna una página institucional por su slug. Endpoint público.",
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
    },
  };
}
