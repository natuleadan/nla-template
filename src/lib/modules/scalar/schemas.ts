import type { OpenApiSchema } from "./types";

export const schemas: Record<string, OpenApiSchema> = {
  Product: {
    type: "object",
    properties: {
      id: { type: "string", example: "1" },
      slug: { type: "string", example: "proteina-whey" },
      name: { type: "string", example: "Proteína en Polvo 1kg" },
      description: {
        type: "string",
        example: "Proteína en polvo sabor chocolate",
      },
      longDescription: {
        type: "string",
        example:
          "Proteína en polvo de alta calidad. Ideal para después del entrenamiento.",
      },
      price: { type: "number", example: 1299 },
      originalPrice: { type: "number", example: 1499 },
      category: { type: "string", example: "suplemento" },
      image: { type: "string", example: "/design/fallback.svg" },
      images: {
        type: "array",
        items: { type: "string" },
        example: ["/design/fallback.svg"],
      },
      quantity: { type: "string", example: "1" },
      unit: { type: "string", example: "kg" },
      type: {
        type: "string",
        enum: ["product", "service"],
        example: "product",
      },
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
      slug: { type: "string", example: "guia-de-nutricion" },
      title: { type: "string", example: "Nutrición para el Gym" },
      excerpt: { type: "string", example: "Descubre los mejores alimentos..." },
      content: { type: "string", example: "<p>Contenido del artículo</p>" },
      image: { type: "string", example: "/images/blog/nutricion.jpg" },
      author: { type: "string", example: "María García" },
      category: { type: "string", example: "nutricion" },
      tags: {
        type: "array",
        items: { type: "string" },
        example: ["nutrición", "proteínas"],
      },
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
  { name: "Products", description: "Catálogo de productos" },
  { name: "Reviews", description: "Reseñas de productos" },
  { name: "Categories", description: "Categorías de productos" },
  { name: "Blog", description: "Artículos del blog" },
  { name: "Agenda", description: "Horarios y disponibilidad" },
  { name: "Páginas", description: "Páginas institucionales" },
  { name: "WhatsApp", description: "WhatsApp API — envío y webhooks" },
];

export const securitySchemes = {
  ApiKeyAuth: {
    type: "apiKey",
    in: "header",
    name: "x-api-key",
    description:
      "API key requerida para el endpoint de chat. Configurar vía variable de entorno API_KEY",
  },
};
