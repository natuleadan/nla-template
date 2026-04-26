import type { OpenApiPath } from "../types";

export function getProductsPaths(examples: {
  products: unknown[];
}): Record<string, OpenApiPath> {
  return {
    "/api/v1/products": {
      get: {
        tags: ["Products"],
        summary: "Lista todos los productos",
        description:
          "Retorna un array con todos los productos disponibles. Endpoint público.",
        security: [],
        responses: {
          "200": {
            description: "Lista de productos",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Product" },
                },
                example: examples.products,
              },
            },
          },
        },
      },
      post: {
        tags: ["Products"],
        summary: "Crea un nuevo producto",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "price", "category"],
                properties: {
                  name: { type: "string" },
                  price: { type: "number" },
                  category: { type: "string" },
                  description: { type: "string" },
                  images: { type: "array", items: { type: "string" } },
                },
              },
              example: {
                name: "Nuevo Producto",
                price: 19990,
                category: "suplements",
                description: "Descripción del producto",
                images: ["/images/product.jpg"],
              },
            },
          },
        },
        responses: {
          "201": { description: "Producto creado exitosamente" },
          "400": { description: "Datos inválidos" },
          "401": { description: "API key inválida" },
        },
      },
      put: {
        tags: ["Products"],
        summary: "Actualiza productos",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          "200": { description: "Productos actualizados" },
          "401": { description: "API key inválida" },
        },
      },
      delete: {
        tags: ["Products"],
        summary: "Elimina todos los productos",
        description:
          "Requiere API key en header x-api-key. Peligroso - elimina todos los productos.",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          "200": { description: "Productos eliminados" },
          "401": { description: "API key inválida" },
        },
      },
    },
    "/api/v1/products/{slug}": {
      get: {
        tags: ["Products"],
        summary: "Obtiene un producto por slug",
        description:
          "Retorna un producto específico por su slug. Endpoint público.",
        security: [],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: examples.products[0]?.slug || "example-slug",
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
      post: {
        tags: ["Products"],
        summary: "Crea un producto con slug específico",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "slug",
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
              schema: {
                type: "object",
                required: ["name", "price"],
                properties: {
                  name: { type: "string" },
                  price: { type: "number" },
                  category: { type: "string" },
                  description: { type: "string" },
                  images: { type: "array", items: { type: "string" } },
                },
              },
              example: {
                name: "Nuevo Producto",
                price: 19990,
                category: "suplements",
              },
            },
          },
        },
        responses: {
          "201": { description: "Producto creado" },
          "400": { description: "Datos inválidos" },
          "401": { description: "API key inválida" },
        },
      },
      put: {
        tags: ["Products"],
        summary: "Actualiza un producto por slug",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Slug del producto",
          },
        ],
        responses: {
          "200": { description: "Producto actualizado" },
          "401": { description: "API key inválida" },
          "404": { description: "Producto no encontrado" },
        },
      },
      delete: {
        tags: ["Products"],
        summary: "Elimina un producto por slug",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Slug del producto",
          },
        ],
        responses: {
          "200": { description: "Producto eliminado" },
          "401": { description: "API key inválida" },
          "404": { description: "Producto no encontrado" },
        },
      },
    },
  };
}
