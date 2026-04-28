import { generateText } from "@/lib/external/ai/stream.service";
import { aiModel } from "@/lib/external/ai/client";
import { SYSTEM_PROMPT } from "./config";
import { getAiTools } from "./tools";
import { getSession, createSession, addToHistory } from "./session-store";
import type { ToolContext, CoreMessage } from "./types";

export class AgentService {
  static async processMessage(
    message: string | CoreMessage,
    context: ToolContext,
  ): Promise<string> {
    let session = await getSession(context.phone);
    if (!session) {
      await createSession(context.phone, context.customerName);
      session = await getSession(context.phone);
    }

    const userMsg: CoreMessage =
      typeof message === "string" ? { role: "user", content: message } : message;
    await addToHistory(context.phone, userMsg);

    const result = await generateText({
      model: aiModel,
      system: `${SYSTEM_PROMPT}

INFORMACIÓN DEL CLIENTE:
- Teléfono: ${context.phone}
- Nombre: ${context.customerName || "No disponible"}

IMPORTANTE: Responde SIEMPRE en español. Sé amable y profesional.`,
      messages: (await getSession(context.phone))?.history as unknown as Array<{ role: string; content: string | Array<{ type: string; text?: string; image?: string }> }> || [],
      tools: getAiTools(context),
    });

    await addToHistory(context.phone, {
      role: "assistant",
      content: result.text,
    });

    return result.text;
  }
}
