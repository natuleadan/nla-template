import { z } from "zod";

export const MediaItemSchema = z.object({
  type: z.string(),
  url: z.string().optional(),
  caption: z.string().optional(),
});

export const ChatBodySchema = z
  .object({
    message: z.string().optional(),
    phone: z.string().optional(),
    media: z.string().optional(),
    mediaUrl: z.string().optional(),
    mediaCaption: z.string().optional(),
    customerName: z.string().optional(),
    mediaItems: z.array(MediaItemSchema).optional(),
  })
  .refine(
    (d) => d.message || d.media || (d.mediaItems && d.mediaItems.length > 0),
    {
      message: "message o media requerido",
    },
  );

export const WhatsAppSendBodySchema = z.object({
  to: z.string().min(1, "Destinatario requerido"),
  message: z.string().min(1, "Mensaje requerido"),
  productId: z.string().optional(),
  productName: z.string().optional(),
});

const MediaMsgSchema = z
  .object({
    link: z.string().optional(),
    caption: z.string().optional(),
    mime_type: z.string().optional(),
    filename: z.string().optional(),
  })
  .optional();

export const YCloudWebhookPayloadSchema = z.object({
  id: z.string().optional(),
  type: z.string().optional(),
  whatsappInboundMessage: z
    .object({
      id: z.string().optional(),
      wamid: z.string().optional(),
      from: z.string().optional(),
      customerProfile: z.object({ name: z.string().optional() }).optional(),
      type: z.string().optional(),
      text: z.object({ body: z.string().optional() }).optional(),
      image: MediaMsgSchema,
      audio: MediaMsgSchema,
      video: MediaMsgSchema,
      document: MediaMsgSchema,
      voice: MediaMsgSchema,
      sticker: MediaMsgSchema,
      reaction: z
        .object({
          emoji: z.string().optional(),
          message_id: z.string().optional(),
        })
        .optional(),
      order: z
        .object({
          product_id: z.string().optional(),
          quantity: z.number().optional(),
        })
        .optional(),
      system: z.object({ body: z.string().optional() }).optional(),
      button: z
        .object({ payload: z.string().optional(), text: z.string().optional() })
        .optional(),
      interactive: z
        .object({
          type: z.string().optional(),
          button_reply: z
            .object({ id: z.string().optional(), title: z.string().optional() })
            .optional(),
          list_reply: z
            .object({
              id: z.string().optional(),
              title: z.string().optional(),
              description: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
      location: z
        .object({
          latitude: z.number().optional(),
          longitude: z.number().optional(),
          name: z.string().optional(),
          address: z.string().optional(),
        })
        .optional(),
      contacts: z
        .array(
          z.object({
            name: z
              .object({ formatted_name: z.string().optional() })
              .optional(),
            phones: z
              .array(z.object({ phone: z.string().optional() }))
              .optional(),
          }),
        )
        .optional(),
    })
    .optional(),
});

export function apiError(status: number, error: string): Response {
  return Response.json(
    { success: false, error, code: `ERR_${status}` },
    { status },
  );
}
