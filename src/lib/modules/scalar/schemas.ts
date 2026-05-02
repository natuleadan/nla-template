import type { OpenApiSchema } from "./types";

export const schemas: Record<string, OpenApiSchema> = {
  Product: {
    type: "object",
    properties: {
      id: { type: "string", example: "1" },
      slug: { type: "string", example: "proteina-whey" },
      name: { type: "string", example: "Proteína en Polvo 1kg" },
      description: { type: "string", example: "Proteína en polvo sabor chocolate" },
      longDescription: { type: "string", example: "Proteína en polvo de alta calidad. Ideal para después del entrenamiento." },
      price: { type: "number", example: 1299 },
      originalPrice: { type: "number", example: 1499 },
      category: { type: "string", example: "suplemento" },
      image: { type: "string", example: "/design/fallback.svg" },
      images: { type: "array", items: { type: "string" }, example: ["/design/fallback.svg"] },
      quantity: { type: "string", example: "1" },
      unit: { type: "string", example: "kg" },
      type: { type: "string", enum: ["product", "service"], example: "product" },
      appointment: { type: "boolean", example: false },
      variants: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string", example: "1kg-chocolate" },
            name: { type: "string", example: "1kg Chocolate" },
            price: { type: "number", example: 1299 },
            originalPrice: { type: "number", example: 1499 },
          },
        },
      },
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
      id: { type: "string", example: "ORD20260429001" },
      fullName: { type: "string", example: "Juan Pérez" },
      email: { type: "string", example: "cliente@email.com" },
      idNumber: { type: "string", example: "0999999999" },
      phone: { type: "string", example: "593991234567" },
      deliveryAddress: { type: "string", example: "Av. Siempre Viva 123" },
      items: { type: "string", example: "2 Proteína Whey 1kg" },
      total: { type: "string", example: "2598" },
      status: {
        type: "string",
        enum: ["pending_payment", "paid", "shipping", "delivered", "cancelled", "rejected"],
        example: "pending_payment",
      },
      createdAt: { type: "string", example: "2026-04-29T10:30:00Z" },
      deliveryGpsLat: { type: "string", example: "-0.180653" },
      deliveryGpsLng: { type: "string", example: "-78.467834" },
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
  AgendaSlot: {
    type: "object",
    properties: {
      time: { type: "string", example: "09:00" },
      available: { type: "boolean", example: true },
      type: { type: "string", example: "Consulta general" },
    },
  },
  AgendaDay: {
    type: "object",
    properties: {
      name: { type: "string", example: "Lunes" },
      nameShort: { type: "string", example: "Lun" },
      dayOfWeek: { type: "integer", example: 1 },
      slots: {
        type: "array",
        items: { $ref: "#/components/schemas/AgendaSlot" },
      },
    },
  },
  BlogPost: {
    type: "object",
    properties: {
      id: { type: "string", example: "blog_1" },
      slug: { type: "string", example: "nutricion-para-el-gym" },
      title: { type: "string", example: "Nutrición para el Gym" },
      excerpt: { type: "string", example: "Descubre los mejores alimentos..." },
      content: { type: "string", example: "<p>Contenido del artículo</p>" },
      image: { type: "string", example: "/images/blog/nutricion.jpg" },
      author: { type: "string", example: "María García" },
      category: { type: "string", example: "nutricion" },
      tags: { type: "array", items: { type: "string" }, example: ["nutrición", "proteínas"] },
      publishedAt: { type: "string", example: "2025-12-15" },
      readingTime: { type: "integer", example: 5 },
    },
  },
  PaginaPost: {
    type: "object",
    properties: {
      id: { type: "string", example: "pag_1" },
      slug: { type: "string", example: "terminos" },
      title: { type: "string", example: "Términos y Condiciones" },
      excerpt: { type: "string", example: "Conoce los términos..." },
      content: { type: "string", example: "<p>Contenido</p>" },
      category: { type: "string", example: "legal" },
      publishedAt: { type: "string", example: "2026-01-01" },
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
  { name: "Blog", description: "Gestión del blog" },
  { name: "Agenda", description: "Gestión de agenda y horarios" },
  { name: "Páginas", description: "Gestión de páginas de contenido" },
  { name: "WhatsApp", description: "WhatsApp API — envío y webhooks" },
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
