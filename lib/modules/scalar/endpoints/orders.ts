import type { OpenApiPath } from "../types";

export function getOrdersPaths(examples: {
  orders: unknown[];
}): Record<string, OpenApiPath> {
  return {
    "/api/v1/pedidos": {
      get: {
        tags: ["Orders"],
        summary: "Lista todos los pedidos",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          "200": {
            description: "Lista de pedidos",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Order" },
                },
                example: examples.orders,
              },
            },
            "401": { description: "API key inválida" },
          },
        },
      },
      post: {
        tags: ["Orders"],
        summary: "Crea un pedido (público)",
        description: "Crea un nuevo pedido. Endpoint público.",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["productId", "productName", "price"],
                properties: {
                  productId: { type: "string" },
                  productName: { type: "string" },
                  price: { type: "number" },
                },
              },
              example: {
                productId: "prod_123",
                productName: "Whey Protein",
                price: 29990,
              },
            },
          },
        },
        responses: {
          "200": { description: "Pedido creado" },
          "400": { description: "Datos inválidos" },
        },
      },
      put: {
        tags: ["Orders"],
        summary: "Actualiza todos los pedidos",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          "200": { description: "Pedidos actualizados" },
          "401": { description: "API key inválida" },
        },
      },
      delete: {
        tags: ["Orders"],
        summary: "Elimina todos los pedidos",
        description: "Requiere API key en header x-api-key. Peligroso.",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          "200": { description: "Pedidos eliminados" },
          "401": { description: "API key inválida" },
        },
      },
    },
  };
}
