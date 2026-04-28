import type { OpenApiPath } from "../types";

export function getWhatsappPaths(): Record<string, OpenApiPath> {
  return {
    "/api/v1/whatsapp/send": {
      post: {
        tags: ["WhatsApp"],
        summary: "Envía un mensaje de WhatsApp",
        description:
          "Envía un mensaje de WhatsApp al número especificado utilizando la API de YCloud. " +
          "Incluye rate limiting: máx. 1 mensaje cada 30 segundos por IP y por número destino.",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["to", "message"],
                properties: {
                  to: {
                    type: "string",
                    description: "Número de teléfono en formato E.164 (ej: +593991234567)",
                    example: "+593991234567",
                  },
                  message: {
                    type: "string",
                    description: "Texto del mensaje a enviar",
                    example: "Hola, quiero información sobre tus productos",
                  },
                  productId: {
                    type: "string",
                    description: "ID del producto (opcional, se guarda en historial)",
                    example: "prod_001",
                  },
                  productName: {
                    type: "string",
                    description: "Nombre del producto (opcional, se guarda en historial)",
                    example: "Proteína Whey",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Mensaje enviado correctamente",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: { type: "boolean" },
                    data: { type: "object" },
                  },
                },
              },
            },
          },
          "429": {
            description: "Rate limit excedido. Espera 30 segundos.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/api/v1/webhooks/ycloud": {
      get: {
        tags: ["WhatsApp"],
        summary: "Verificación del webhook (yCloud challenge)",
        description:
          "Endpoint de verificación usado por YCloud al configurar el webhook. " +
          "Debe responder con el mismo secret enviado en el query param.",
        security: [],
        parameters: [
          {
            name: "secret",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Token de verificación configurado en YCloud",
            example: "tu_webhook_secret",
          },
        ],
        responses: {
          "200": {
            description: "Verificación exitosa. Responde con el secret.",
            content: { "text/plain": { schema: { type: "string" } } },
          },
          "403": { description: "Secret inválido" },
        },
      },
      post: {
        tags: ["WhatsApp"],
        summary: "Recibe mensajes entrantes de WhatsApp (webhook)",
        description:
          "Recibe notificaciones de YCloud cuando un cliente envía un mensaje al número de negocio. " +
          "Soporta: texto, botones, interactivos, ubicación, imágenes, request_welcome. " +
          "Verifica firma HMAC-SHA256 vía header YCloud-Signature. " +
          "Procesa con IA y responde automáticamente al cliente.",
        security: [],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  type: {
                    type: "string",
                    enum: ["whatsapp.inbound_message.received"],
                  },
                  apiVersion: { type: "string" },
                  createTime: { type: "string" },
                  whatsappInboundMessage: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      wamid: { type: "string" },
                      from: {
                        type: "string",
                        description: "Número del remitente en E.164",
                        example: "+593991234567",
                      },
                      customerProfile: {
                        type: "object",
                        properties: {
                          name: { type: "string" },
                        },
                      },
                      to: { type: "string" },
                      type: {
                        type: "string",
                        enum: ["text", "image", "button", "interactive", "location", "request_welcome"],
                      },
                      text: {
                        type: "object",
                        properties: { body: { type: "string" } },
                      },
                    },
                  },
                },
              },
              example: {
                id: "evt_example_001",
                type: "whatsapp.inbound_message.received",
                apiVersion: "v2",
                createTime: "2026-01-01T00:00:00.000Z",
                whatsappInboundMessage: {
                  id: "msg_example_001",
                  wamid: "wamid.example_001",
                  from: "+593991234567",
                  customerProfile: { name: "Cliente Ejemplo" },
                  to: "+593986347568",
                  type: "text",
                  text: { body: "Hola, quiero información" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Mensaje recibido. Se procesará y responderá al cliente.",
            content: { "text/plain": { schema: { type: "string" }, example: "OK" } },
          },
          "403": { description: "Firma HMAC inválida" },
        },
      },
    },
  };
}
