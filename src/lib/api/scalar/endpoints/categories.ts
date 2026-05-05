import type { OpenApiPath } from "../types";

export function getCategoriesPaths(examples: {
  categories: unknown[];
}): Record<string, OpenApiPath> {
  return {
    "/api/v1/categories": {
      get: {
        tags: ["Categories"],
        summary: "Lista todas las categorías",
        description: "Retorna las categorías de productos. Endpoint público.",
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
    },
  };
}
