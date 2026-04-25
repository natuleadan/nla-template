import type { OpenApiPath } from "./types"

export function getProductsPaths(examples: { products: unknown[] }): Record<string, OpenApiPath> {
  return {
    "/api/v1/products": {
      get: {
        tags: ["Products"],
        summary: "Lista todos los productos",
        description: "Retorna un array con todos los productos disponibles. Endpoint público.",
        security: [],
        responses: {
          "200": {
            description: "Lista de productos",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/Product" } },
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
                properties: { name: { type: "string" }, price: { type: "number" }, category: { type: "string" }, description: { type: "string" }, image: { type: "string" } },
              },
              example: { name: "Nuevo Producto", price: 19990, category: "suplements", description: "Descripción del producto" },
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
        responses: { "200": { description: "Productos actualizados" }, "401": { description: "API key inválida" } },
      },
      delete: {
        tags: ["Products"],
        summary: "Elimina todos los productos",
        description: "Requiere API key en header x-api-key. Peligroso - elimina todos los productos.",
        security: [{ ApiKeyAuth: [] }],
        responses: { "200": { description: "Productos eliminados" }, "401": { description: "API key inválida" } },
      },
    },
    "/api/v1/products/{slug}": {
      get: {
        tags: ["Products"],
        summary: "Obtiene un producto por slug",
        description: "Retorna un producto específico por su slug. Endpoint público.",
        security: [],
        parameters: [
          { name: "slug", in: "path", required: true, schema: { type: "string" }, example: examples.products[0]?.slug || "example-slug", description: "Slug del producto" },
        ],
        responses: {
          "200": { description: "Producto encontrado", content: { "application/json": { schema: { $ref: "#/components/schemas/Product" }, example: examples.products[0] } } },
          "404": { description: "Producto no encontrado" },
        },
      },
      put: {
        tags: ["Products"],
        summary: "Actualiza un producto por slug",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" }, description: "Slug del producto" }],
        responses: { "200": { description: "Producto actualizado" }, "401": { description: "API key inválida" }, "404": { description: "Producto no encontrado" } },
      },
      delete: {
        tags: ["Products"],
        summary: "Elimina un producto por slug",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" }, description: "Slug del producto" }],
        responses: { "200": { description: "Producto eliminado" }, "401": { description: "API key inválida" }, "404": { description: "Producto no encontrado" } },
      },
    },
  }
}

export function getReviewsPaths(examples: { products: unknown[]; reviews: unknown[] }): Record<string, OpenApiPath> {
  return {
    "/api/v1/resenas/{productSlug}": {
      get: {
        tags: ["Reviews"],
        summary: "Obtiene reseñas de un producto",
        description: "Retorna las reseñas de un producto específico. Endpoint público.",
        security: [],
        parameters: [{ name: "productSlug", in: "path", required: true, schema: { type: "string" }, example: examples.products[0]?.slug || "example-slug", description: "Slug del producto" }],
        responses: {
          "200": {
            description: "Lista de reseñas",
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Review" } }, example: examples.reviews } },
          },
        },
      },
      post: {
        tags: ["Reviews"],
        summary: "Crea una reseña (público)",
        description: "Crea una nueva reseña para un producto. Endpoint público.",
        security: [],
        parameters: [{ name: "productSlug", in: "path", required: true, schema: { type: "string" }, description: "Slug del producto" }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/Review" }, example: { name: "Juan Pérez", comment: "Muy buen producto", rating: 5 } } },
        },
        responses: { "201": { description: "Reseña creada" }, "400": { description: "Datos inválidos" } },
      },
      put: {
        tags: ["Reviews"],
        summary: "Actualiza reseñas de un producto",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        parameters: [{ name: "productSlug", in: "path", required: true, schema: { type: "string" }, description: "Slug del producto" }],
        responses: { "200": { description: "Reseñas actualizadas" }, "401": { description: "API key inválida" } },
      },
      delete: {
        tags: ["Reviews"],
        summary: "Elimina reseñas de un producto",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        parameters: [{ name: "productSlug", in: "path", required: true, schema: { type: "string" }, description: "Slug del producto" }],
        responses: { "200": { description: "Reseñas eliminadas" }, "401": { description: "API key inválida" } },
      },
    },
  }
}

export function getInventoryPaths(examples: { products: unknown[]; inventory: unknown }): Record<string, OpenApiPath> {
  return {
    "/api/v1/inventario/{productSlug}": {
      get: {
        tags: ["Inventory"],
        summary: "Obtiene inventario de un producto",
        description: "Retorna el inventario de un producto por ubicación. Endpoint público.",
        security: [],
        parameters: [{ name: "productSlug", in: "path", required: true, schema: { type: "string" }, example: examples.products[0]?.slug || "example-slug", description: "Slug del producto" }],
        responses: {
          "200": {
            description: "Inventario del producto",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Inventory" }, example: examples.inventory } },
          },
        },
      },
      put: {
        tags: ["Inventory"],
        summary: "Actualiza inventario de un producto",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        parameters: [{ name: "productSlug", in: "path", required: true, schema: { type: "string" }, description: "Slug del producto" }],
        requestBody: {
          content: {
            "application/json": {
              schema: { type: "object", properties: { locations: { type: "array", items: { $ref: "#/components/schemas/InventoryLocation" } } } },
              example: { locations: [{ location: "bodega-principal", quantity: 100, reserved: 10, available: 90 }] },
            },
          },
        },
        responses: { "200": { description: "Inventario actualizado" }, "400": { description: "Datos inválidos" }, "401": { description: "API key inválida" } },
      },
      delete: {
        tags: ["Inventory"],
        summary: "Elimina inventario de un producto",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        parameters: [{ name: "productSlug", in: "path", required: true, schema: { type: "string" }, description: "Slug del producto" }],
        responses: { "200": { description: "Inventario eliminado" }, "401": { description: "API key inválida" } },
      },
    },
  }
}

export function getOrdersPaths(examples: { orders: unknown[] }): Record<string, OpenApiPath> {
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
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Order" } }, example: examples.orders } },
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
              schema: { type: "object", required: ["productId", "productName", "price"], properties: { productId: { type: "string" }, productName: { type: "string" }, price: { type: "number" } } },
              example: { productId: "prod_123", productName: "Whey Protein", price: 29990 },
            },
          },
        },
        responses: { "200": { description: "Pedido creado" }, "400": { description: "Datos inválidos" } },
      },
      put: {
        tags: ["Orders"],
        summary: "Actualiza todos los pedidos",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        responses: { "200": { description: "Pedidos actualizados" }, "401": { description: "API key inválida" } },
      },
      delete: {
        tags: ["Orders"],
        summary: "Elimina todos los pedidos",
        description: "Requiere API key en header x-api-key. Peligroso.",
        security: [{ ApiKeyAuth: [] }],
        responses: { "200": { description: "Pedidos eliminados" }, "401": { description: "API key inválida" } },
      },
    },
  }
}

export function getCategoriesPaths(examples: { categories: unknown[] }): Record<string, OpenApiPath> {
  return {
    "/api/v1/categories": {
      get: {
        tags: ["Categories"],
        summary: "Lista categorías",
        description: "Retorna todas las categorías disponibles. Endpoint público.",
        security: [],
        responses: {
          "200": {
            description: "Lista de categorías",
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Category" } }, example: examples.categories } },
          },
        },
      },
      post: {
        tags: ["Categories"],
        summary: "Crea una categoría",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", required: ["name", "slug"], properties: { name: { type: "string" }, slug: { type: "string" }, icon: { type: "string" } } },
              example: { name: "Proteínas", slug: "proteinas", icon: "flask" },
            },
          },
        },
        responses: { "201": { description: "Categoría creada" }, "400": { description: "Datos inválidos" }, "401": { description: "API key inválida" } },
      },
      put: {
        tags: ["Categories"],
        summary: "Actualiza categorías",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        responses: { "200": { description: "Categorías actualizadas" }, "401": { description: "API key inválida" } },
      },
      delete: {
        tags: ["Categories"],
        summary: "Elimina categorías",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        responses: { "200": { description: "Categorías eliminadas" }, "401": { description: "API key inválida" } },
      },
    },
  }
}

export function getPagesPaths(examples: { page: unknown }): Record<string, OpenApiPath> {
  return {
    "/api/v1/pages": {
      get: {
        tags: ["Pages"],
        summary: "Obtiene contenido de página",
        description: "Retorna el contenido de una página estática. Endpoint público.",
        security: [],
        parameters: [{ name: "page", in: "query", required: true, schema: { type: "string" }, example: "inicio", description: "Nombre de la página" }],
        responses: {
          "200": {
            description: "Contenido de página",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Page" }, example: examples.page } },
            "400": { description: "Parámetro 'page' requerido" },
            "404": { description: "Página no encontrada" },
          },
        },
      },
      post: {
        tags: ["Pages"],
        summary: "Crea una página",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", required: ["title", "page"], properties: { title: { type: "string" }, page: { type: "string" }, content: { type: "string" } } },
              example: { title: "Nueva Página", page: "nueva-pagina", content: "Contenido de la página" },
            },
          },
        },
        responses: { "201": { description: "Página creada" }, "400": { description: "Datos inválidos" }, "401": { description: "API key inválida" } },
      },
      put: {
        tags: ["Pages"],
        summary: "Actualiza páginas",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        responses: { "200": { description: "Páginas actualizadas" }, "401": { description: "API key inválida" } },
      },
      delete: {
        tags: ["Pages"],
        summary: "Elimina páginas",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        responses: { "200": { description: "Páginas eliminadas" }, "401": { description: "API key inválida" } },
      },
    },
  }
}

export function getFormularioPaths(examples: { messages: unknown[] }): Record<string, OpenApiPath> {
  return {
    "/api/v1/formulario": {
      get: {
        tags: ["Contact"],
        summary: "Lista mensajes del formulario",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          "200": {
            description: "Lista de mensajes",
            content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/FormMessage" } }, example: examples.messages } },
            "401": { description: "API key inválida" },
          },
        },
      },
      post: {
        tags: ["Contact"],
        summary: "Envía formulario de contacto (público)",
        description: "Envía un mensaje de contacto. Endpoint público.",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { type: "object", required: ["nombre", "email", "mensaje"], properties: { nombre: { type: "string" }, email: { type: "string" }, mensaje: { type: "string" } } },
              example: { nombre: "Juan Pérez", email: "juan@email.com", mensaje: "Quiero información sobre..." },
            },
          },
        },
        responses: { "200": { description: "Mensaje enviado" }, "400": { description: "Datos inválidos o email mal formado" } },
      },
      put: {
        tags: ["Contact"],
        summary: "Actualiza formularios",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        responses: { "200": { description: "Formularios actualizados" }, "401": { description: "API key inválida" } },
      },
      delete: {
        tags: ["Contact"],
        summary: "Elimina formularios",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        responses: { "200": { description: "Formularios eliminados" }, "401": { description: "API key inválida" } },
      },
    },
  }
}