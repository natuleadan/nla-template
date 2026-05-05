import type { OpenApiPath } from "../types";

export function getAgendaPaths(): Record<string, OpenApiPath> {
  return {
    "/api/v1/agenda": {
      get: {
        tags: ["Agenda"],
        summary: "Obtiene la agenda y horarios disponibles",
        description:
          "Retorna los horarios disponibles por día. Endpoint público.",
        security: [],
        parameters: [
          {
            name: "day",
            in: "query",
            schema: { type: "string" },
            example: "Lunes",
            description: "Nombre del día en español (opcional)",
          },
        ],
        responses: {
          "200": {
            description: "Agenda",
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
              },
            },
          },
        },
      },
    },
  };
}
