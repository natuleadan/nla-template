import type { OpenApiPath } from "../types";

export function getReviewsPaths(examples: {
  products: unknown[];
  reviews: unknown[];
}): Record<string, OpenApiPath> {
  return {
    "/api/v1/resenas/{productSlug}": {
      get: {
        tags: ["Reviews"],
        summary: "Obtiene reseñas de un producto",
        description:
          "Retorna las reseñas aprobadas de un producto. Endpoint público.",
        security: [],
        parameters: [
          {
            name: "productSlug",
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
            description: "Lista de reseñas aprobadas",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Review" },
                },
                example: examples.reviews,
              },
            },
          },
        },
      },
    },
  };
}
