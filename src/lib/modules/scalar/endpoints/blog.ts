import type { OpenApiPath } from "../types";

export function getBlogPaths(examples: {
  posts: unknown[];
}): Record<string, OpenApiPath> {
  return {
    "/api/v1/blog": {
      get: {
        tags: ["Blog"],
        summary: "Lista los artículos del blog",
        description: "Retorna los artículos del blog. Endpoint público.",
        security: [],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer" },
            example: "1",
          },
          {
            name: "limit",
            in: "query",
            schema: { type: "integer" },
            example: "6",
          },
        ],
        responses: {
          "200": {
            description: "Lista de artículos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    posts: {
                      type: "array",
                      items: { $ref: "#/components/schemas/BlogPost" },
                    },
                    total: { type: "integer" },
                    hasMore: { type: "boolean" },
                  },
                },
                example: {
                  posts: examples.posts,
                  total: examples.posts.length,
                  hasMore: false,
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/blog/{slug}": {
      get: {
        tags: ["Blog"],
        summary: "Obtiene un artículo por slug",
        description: "Retorna un artículo del blog por su slug. Endpoint público.",
        security: [],
        parameters: [
          {
            name: "slug",
            in: "path",
            required: true,
            schema: { type: "string" },
            example: (examples.posts[0] as { slug?: string })?.slug || "example-post",
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
    },
  };
}
