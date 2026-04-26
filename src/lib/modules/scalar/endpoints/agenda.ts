import type { OpenApiPath } from "../types";

export function getAgendaPaths(examples: {
  days: unknown[];
}): Record<string, OpenApiPath> {
  return {
    "/api/v1/agenda": {
      get: {
        tags: ["Agenda"],
        summary: "Obtiene la agenda semanal",
        description:
          "Retorna los días de la semana con sus horarios disponibles. Endpoint público.",
        security: [],
        responses: {
          "200": {
            description: "Agenda semanal",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    days: {
                      type: "array",
                      items: { $ref: "#/components/schemas/AgendaDay" },
                    },
                  },
                },
                example: { days: examples.days },
              },
            },
          },
        },
      },
      post: {
        tags: ["Agenda"],
        summary: "Crea una nueva semana en la agenda",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          "201": { description: "Semana creada exitosamente" },
          "400": { description: "Datos inválidos" },
          "401": { description: "API key inválida" },
        },
      },
      put: {
        tags: ["Agenda"],
        summary: "Actualiza la agenda semanal",
        description: "Requiere API key en header x-api-key",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          "200": { description: "Agenda actualizada" },
          "401": { description: "API key inválida" },
        },
      },
      delete: {
        tags: ["Agenda"],
        summary: "Elimina todos los datos de la agenda",
        description:
          "Requiere API key en header x-api-key. Peligroso - elimina todos los horarios.",
        security: [{ ApiKeyAuth: [] }],
        responses: {
          "200": { description: "Agenda eliminada" },
          "401": { description: "API key inválida" },
        },
      },
    },
  };
}
