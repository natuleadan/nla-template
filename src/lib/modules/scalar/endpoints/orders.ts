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
          },
          "401": { description: "API key inválida" },
        },
      },
      post: {
        tags: ["Orders"],
        summary: "Crea un pedido (público o con Redis)",
        description: `Crea un nuevo pedido. Soporta dos formatos:
- Legacy: productId, productName, price (in-memory)
- Redis (nuevo): items, total, email, idNumber, fullName, deliveryAddress, phone (genera ID formato ORD+YYYYMMDD+NNN)`,
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  items: { type: "string", description: "Descripción del pedido (Redis)" },
                  total: { type: "string", description: "Monto total (Redis)" },
                  email: { type: "string", description: "Correo del cliente (Redis)" },
                  idNumber: { type: "string", description: "Cédula/RUC (Redis)" },
                  fullName: { type: "string", description: "Nombre completo (Redis)" },
                  deliveryAddress: { type: "string", description: "Dirección de entrega (Redis)" },
                  phone: { type: "string", description: "Teléfono (Redis)" },
                  productId: { type: "string", description: "ID del producto (legacy)" },
                  productName: { type: "string", description: "Nombre del producto (legacy)" },
                  price: { type: "number", description: "Precio (legacy)" },
                },
              },
              example: {
                items: "2 Proteína Whey 1kg",
                total: "2598",
                email: "cliente@email.com",
                idNumber: "0999999999",
                fullName: "Juan Pérez",
                deliveryAddress: "Av. Siempre Viva 123",
                phone: "593991234567",
              },
            },
          },
        },
        responses: {
          "200": { description: "Pedido creado. Devuelve order.id con formato ORD+YYYYMMDD+NNN" },
          "400": { description: "Datos inválidos" },
          "500": { description: "Redis no disponible" },
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
    "/api/v1/pedidos/{id}": {
      get: {
        tags: ["Orders"],
        summary: "Obtiene detalle de un pedido por ID (Redis)",
        description:
          "Retorna los datos de un pedido creado con el nuevo formato Redis (ORD+YYYYMMDD+NNN). Endpoint público.",
        security: [],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: "ORD20260429001",
            description: "ID del pedido (formato ORD+YYYYMMDD+NNN)",
          },
        ],
        responses: {
          "200": {
            description: "Datos del pedido",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    fullName: { type: "string" },
                    email: { type: "string" },
                    idNumber: { type: "string" },
                    phone: { type: "string" },
                    deliveryAddress: { type: "string" },
                    items: { type: "string" },
                    total: { type: "string" },
                    status: { type: "string" },
                    createdAt: { type: "string" },
                    deliveryGpsLat: { type: "string" },
                    deliveryGpsLng: { type: "string" },
                  },
                },
              },
            },
          },
          "404": { description: "Pedido no encontrado" },
        },
      },
    },
  };
}
