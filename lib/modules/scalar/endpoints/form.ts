import type { OpenApiPath } from "../types"

export function getFormPaths(examples: { messages: unknown[] }): Record<string, OpenApiPath> {
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