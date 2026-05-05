import type { OpenApiPath } from "../types";

export function getProductsPaths(examples: {
  products: unknown[];
}): Record<string, OpenApiPath> {
  return {
    "/api/v1/products": {
      get: {
        tags: ["Products"],
        summary: "Lista todos los productos",
        description: "Retorna el catálogo de productos. Endpoint público.",
        security: [],
        responses: {
          "200": {
            description: "Lista de productos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    products: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Product" },
                    },
                    total: { type: "integer", example: 16 },
                    hasMore: { type: "boolean", example: false },
                  },
                },
                example: {
                  products: examples.products,
                  total: examples.products.length,
                  hasMore: false,
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/products/{slug}": {
      get: {
        tags: ["Products"],
        summary: "Obtiene un producto por slug",
        description:
          "Retorna un producto específico con sus reseñas. Endpoint público.",
        security: [],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string" },
            example:
              (examples.products[0] as { slug?: string })?.slug ||
              "example-slug",
            description: "Slug del producto",
          },
        ],
        responses: {
          "200": {
            description: "Producto encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Product" },
                example: examples.products[0],
              },
            },
          },
          "404": { description: "Producto no encontrado" },
        },
      },
    },
  };
}
