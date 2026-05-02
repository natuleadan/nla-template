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
          "Retorna las reseñas de un producto específico. Endpoint público.",
        security: [],
        parameters: [
          {
            name: "productSlug",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: (examples.products[0] as { slug?: string })?.slug || "example-slug",
            description: "Slug del producto",
          },
        ],
        responses: {
          "200": {
            description: "Lista de reseñas",
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
      post: {
        tags: ["Reviews"],
        summary: "Crea una reseña (público)",
        description:
          "Crea una nueva reseña para un producto. Endpoint público.",
        security: [],
        parameters: [
          {
            name: "productSlug",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Slug del producto",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Review" },
              example: {
                name: "Juan Pérez",
                comment: "Muy buen producto",
                rating: 5,
              },
            },
          },
        },
        responses: {
          "201": { description: "Reseña creada" },
          "400": { description: "Datos inválidos" },
        },
      },
      put: {
        tags: ["Reviews"],
        summary: "Actualiza reseñas de un producto",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "productSlug",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Slug del producto",
          },
        ],
        responses: {
          "200": { description: "Reseñas actualizadas" },
          "401": { description: "API key inválida" },
        },
      },
      delete: {
        tags: ["Reviews"],
        summary: "Elimina reseñas de un producto",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "productSlug",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Slug del producto",
          },
        ],
        responses: {
          "200": { description: "Reseñas eliminadas" },
          "401": { description: "API key inválida" },
        },
      },
    },
  };
}
