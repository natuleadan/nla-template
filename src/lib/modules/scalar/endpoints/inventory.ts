import type { OpenApiPath } from "../types";

export function getInventoryPaths(examples: {
  products: unknown[];
  inventory: unknown;
}): Record<string, OpenApiPath> {
  return {
    "/api/v1/inventario/{productSlug}": {
      get: {
        tags: ["Inventory"],
        summary: "Obtiene inventario de un producto",
        description:
          "Retorna el inventario de un producto por ubicación. Endpoint público.",
        security: [],
        parameters: [
          {
            name: "productSlug",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: examples.products[0]?.slug || "example-slug",
            description: "Slug del producto",
          },
        ],
        responses: {
          "200": {
            description: "Inventario del producto",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Inventory" },
                example: examples.inventory,
              },
            },
          },
        },
      },
      post: {
        tags: ["Inventory"],
        summary: "Crea inventario para un producto",
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
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  locations: {
                    type: "array",
                    items: { $ref: "#/components/schemas/InventoryLocation" },
                  },
                },
              },
              example: {
                locations: [
                  {
                    location: "bodega-principal",
                    quantity: 100,
                    reserved: 10,
                    available: 90,
                  },
                ],
              },
            },
          },
        },
        responses: {
          "201": { description: "Inventario creado" },
          "400": { description: "Datos inválidos" },
          "401": { description: "API key inválida" },
        },
      },
      put: {
        tags: ["Inventory"],
        summary: "Actualiza inventario de un producto",
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
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  locations: {
                    type: "array",
                    items: { $ref: "#/components/schemas/InventoryLocation" },
                  },
                },
              },
              example: {
                locations: [
                  {
                    location: "bodega-principal",
                    quantity: 100,
                    reserved: 10,
                    available: 90,
                  },
                ],
              },
            },
          },
        },
        responses: {
          "200": { description: "Inventario actualizado" },
          "400": { description: "Datos inválidos" },
          "401": { description: "API key inválida" },
        },
      },
      delete: {
        tags: ["Inventory"],
        summary: "Elimina inventario de un producto",
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
          "200": { description: "Inventario eliminado" },
          "401": { description: "API key inválida" },
        },
      },
    },
  };
}
