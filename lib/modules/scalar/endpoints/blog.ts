import type { OpenApiPath } from "../types";

export function getBlogPaths(examples: {
  posts: unknown[];
}): Record<string, OpenApiPath> {
  return {
    "/api/v1/blog": {
      get: {
        tags: ["Blog"],
        summary: "Lista todos los artículos del blog",
        description:
          "Retorna un array con todos los artículos del blog. Endpoint público.",
        security: [],
        responses: {
          "200": {
            description: "Lista de artículos",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/BlogPost" },
                },
                example: examples.posts,
              },
            },
          },
        },
      },
      post: {
        tags: ["Blog"],
        summary: "Crea un nuevo artículo",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string" },
                  excerpt: { type: "string" },
                  content: { type: "string" },
                  author: { type: "string" },
                  category: { type: "string" },
                  image: { type: "string" },
                  readingTime: { type: "integer" },
                  tags: { type: "array", items: { type: "string" } },
                },
              },
              example: {
                title: "Nuevo Artículo",
                excerpt: "Resumen del artículo",
                content: "<p>Contenido del artículo</p>",
                author: "Autor",
                category: "nutricion",
                image: "/images/blog/nuevo.jpg",
                readingTime: 5,
                tags: ["nutrición", "salud"],
              },
            },
          },
        },
        responses: {
          "201": { description: "Artículo creado exitosamente" },
          "400": { description: "Datos inválidos" },
          "401": { description: "API key inválida" },
        },
      },
      put: {
        tags: ["Blog"],
        summary: "Actualiza artículos",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          "200": { description: "Artículos actualizados" },
          "401": { description: "API key inválida" },
        },
      },
      delete: {
        tags: ["Blog"],
        summary: "Elimina todos los artículos",
        description:
          "Requiere API key en header x-api-key. Peligroso - elimina todos los artículos.",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          "200": { description: "Artículos eliminados" },
          "401": { description: "API key inválida" },
        },
      },
    },
    "/api/v1/blog/{slug}": {
      get: {
        tags: ["Blog"],
        summary: "Obtiene un artículo por slug",
        description:
          "Retorna un artículo específico por su slug. Endpoint público.",
        security: [],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string" },
            example:
              (examples.posts[0] as { slug?: string })?.slug ||
              "example-slug",
            description: "Slug del artículo",
          },
        ],
        responses: {
          "200": {
            description: "Artículo encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BlogPost" },
                example: examples.posts[0],
              },
            },
          },
          "404": { description: "Artículo no encontrado" },
        },
      },
      post: {
        tags: ["Blog"],
        summary: "Crea un artículo con slug específico",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Slug del artículo",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title"],
                properties: {
                  title: { type: "string" },
                  excerpt: { type: "string" },
                  content: { type: "string" },
                },
              },
              example: {
                title: "Nuevo Artículo",
                excerpt: "Resumen del artículo",
              },
            },
          },
        },
        responses: {
          "201": { description: "Artículo creado" },
          "400": { description: "Datos inválidos" },
          "401": { description: "API key inválida" },
        },
      },
      put: {
        tags: ["Blog"],
        summary: "Actualiza un artículo por slug",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Slug del artículo",
          },
        ],
        responses: {
          "200": { description: "Artículo actualizado" },
          "401": { description: "API key inválida" },
          "404": { description: "Artículo no encontrado" },
        },
      },
      delete: {
        tags: ["Blog"],
        summary: "Elimina un artículo por slug",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "Slug del artículo",
          },
        ],
        responses: {
          "200": { description: "Artículo eliminado" },
          "401": { description: "API key inválida" },
          "404": { description: "Artículo no encontrado" },
        },
      },
    },
  };
}
