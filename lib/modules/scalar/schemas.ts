import type { OpenApiSchema } from "./types";

export const schemas: Record<string, OpenApiSchema> = {
  Product: {
    type: "object",
    properties: {
      id: { type: "string", example: "prod_123" },
      slug: { type: "string", example: "whey-protein" },
      name: { type: "string", example: "Whey Protein" },
      description: { type: "string", example: "Proteína de suero de leche" },
      price: { type: "number", example: 29990 },
      category: {
        type: "string",
        enum: ["suplements", "food"],
        example: "suplements",
      },
      image: { type: "string", example: "/images/products/whey.jpg" },
      quantity: { type: "string", example: "2" },
      unit: { type: "string", example: "lb" },
    },
  },
  Category: {
    type: "object",
    properties: {
      id: { type: "string", example: "cat_1" },
      name: { type: "string", example: "Suplementos" },
      slug: { type: "string", example: "suplements" },
      icon: { type: "string", example: "dumbbell" },
    },
  },
  Review: {
    type: "object",
    properties: {
      id: { type: "string", example: "rev_1" },
      name: { type: "string", example: "Juan Pérez" },
      comment: {
        type: "string",
        example: "Excelente producto, muy recomendado",
      },
      rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
      createdAt: { type: "string", example: "2024-01-15T10:30:00Z" },
    },
  },
  InventoryLocation: {
    type: "object",
    properties: {
      location: { type: "string", example: "bodega-principal" },
      quantity: { type: "integer", example: 100 },
      reserved: { type: "integer", example: 10 },
      available: { type: "integer", example: 90 },
    },
  },
  Inventory: {
    type: "object",
    properties: {
      productSlug: { type: "string", example: "whey-protein" },
      total: { type: "integer", example: 100 },
      locations: {
        type: "array",
        items: { $ref: "#/components/schemas/InventoryLocation" },
      },
    },
  },
  Order: {
    type: "object",
    properties: {
      id: { type: "string", example: "ord_123" },
      productId: { type: "string", example: "prod_123" },
      productName: { type: "string", example: "Whey Protein" },
      price: { type: "number", example: 29990 },
      cliente: {
        type: "object",
        properties: {
          nombre: { type: "string" },
          telefono: { type: "string" },
        },
      },
      geo: { $ref: "#/components/schemas/GeoData" },
      fecha: { type: "string", example: "2024-01-15T10:30:00Z" },
      estado: {
        type: "string",
        enum: ["pendiente", "completado", "cancelado"],
        example: "pendiente",
      },
    },
  },
  GeoData: {
    type: "object",
    properties: {
      location: {
        type: "object",
        properties: {
          country: { type: "string", example: "CL" },
          region: { type: "string", example: "RM" },
          city: { type: "string", example: "Santiago" },
          latitude: { type: "string", example: "-33.4489" },
          longitude: { type: "string", example: "-70.6693" },
          timezone: { type: "string", example: "America/Santiago" },
        },
      },
      userAgent: { type: "string", example: "Mozilla/5.0..." },
      anonymousId: { type: "string", example: "anon_abc123" },
      ipAddress: { type: "string", example: "190.162.XXX.XXX" },
      referer: { type: "string", example: "https://ejemplo.com/tienda" },
      language: { type: "string", example: "es" },
      platform: { type: "string", example: "Windows" },
      timestamp: { type: "string", example: "2024-01-15T10:30:00Z" },
    },
  },
  Page: {
    type: "object",
    properties: {
      title: { type: "string", example: "Inicio" },
      page: { type: "string", example: "inicio" },
      content: { type: "string", example: "Contenido de la página..." },
    },
  },
  FormMessage: {
    type: "object",
    properties: {
      id: { type: "string", example: "msg_1" },
      nombre: { type: "string", example: "Juan Pérez" },
      email: { type: "string", example: "juan@email.com" },
      mensaje: { type: "string", example: "Quiero información sobre..." },
      fecha: { type: "string", example: "2024-01-15T10:30:00Z" },
    },
  },
  Error: {
    type: "object",
    properties: {
      error: { type: "string", example: "Mensaje de error" },
      code: { type: "string", example: "BAD_REQUEST" },
    },
  },
};

export const tags = [
  { name: "Products", description: "Gestión de productos" },
  { name: "Reviews", description: "Reseñas de productos" },
  { name: "Inventory", description: "Inventario por ubicación" },
  { name: "Orders", description: "Gestión de pedidos" },
  { name: "Categories", description: "Categorías de productos" },
  { name: "Pages", description: "Contenido de páginas estáticas" },
  { name: "Contact", description: "Formulario de contacto" },
];

export const securitySchemes = {
  ApiKeyAuth: {
    type: "apiKey",
    in: "header",
    name: "x-api-key",
    description:
      "API key requerida para endpoints protegidos (POST, PUT, DELETE). Obtener de variable de entorno API_KEY",
  },
};
