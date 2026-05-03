import { streamText, stepCountIs } from "@/lib/external/ai/stream.service";
import { aiModel } from "@/lib/external/ai/client";
import { getZeroDataRetention } from "@/lib/env";
import { SYSTEM_PROMPT, FIRST_TIME_INTRO } from "./config";
import { getAiTools } from "./tools";
import {
  getSession,
  createSession,
  addToHistory,
  isDerived,
} from "./session-store";
import type { ToolContext, CoreMessage } from "./types";

const FALLBACK = "Disculpa, no pude procesar tu solicitud. ¿Puedes repetirlo?";
const RATE_LIMIT =
  "Estoy recibiendo muchas solicitudes en este momento. Por favor espera unos segundos e inténtalo de nuevo.";

export class AgentService {
  static async processMessage(
    message: string | CoreMessage,
    context: ToolContext,
  ): Promise<string> {
    const derived = await isDerived(context.phone);
    if (derived) return "";

    let session = await getSession(context.phone);
    if (!session) {
      await createSession(context.phone, context.customerName || undefined);
      session = await getSession(context.phone);
    }

    const userMsg: CoreMessage =
      typeof message === "string"
        ? { role: "user", content: message }
        : message;
    await addToHistory(context.phone, userMsg);

    const freshSession = await getSession(context.phone);
    const history = freshSession?.history || [];
    const isFirstTime = history.length <= 1;
    const introBlock = isFirstTime ? `\n\n${FIRST_TIME_INTRO}` : "";

    const tools = getAiTools(context);
    const system = `${SYSTEM_PROMPT}${introBlock}

INFORMACIÓN DEL CLIENTE:
- Teléfono: ${context.phone}
- Nombre: ${context.customerName || "No disponible"}`;

    try {
      const result = streamText({
        model: aiModel,
        system,
        messages: history as Array<{
          role: "user" | "assistant";
          content: string;
        }>,
        tools,
        toolChoice: "auto",
        stopWhen: stepCountIs(15),
        ...(getZeroDataRetention() && {
          providerOptions: {
            gateway: { zeroDataRetention: true },
          },
        }),
      });

      let fullText = "";
      for await (const chunk of result.textStream) {
        fullText += chunk;
      }

      const text = fullText || FALLBACK;
      await addToHistory(context.phone, { role: "assistant", content: text });
      return text;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "";
      const text =
        msg.includes("rate_limit") || msg.includes("429")
          ? RATE_LIMIT
          : FALLBACK;
      await addToHistory(context.phone, { role: "assistant", content: text });
      return text;
    }
  }
}
